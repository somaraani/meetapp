
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Journey, Meeting, MeetingDetail, MeetingParticipant } from '@types'
import { CreateMeetingDTO } from './dto/CreateMeetingDto';
import { InjectModel } from '@nestjs/mongoose';
import { MeetingDocument } from './schemas/meeting.schema';
import { Model } from 'mongoose';
import { JourneysService } from '../journeys/journeys.service';
import { TasksService } from 'src/tasks/tasks.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MeetingsService {

    constructor(
        @InjectModel("meeting")
        private meetingModel: Model<MeetingDocument>, 
        private journeyService: JourneysService,
        private taskService: TasksService,
        private notificationService: NotificationsService
    ) { }

    async update(meetingId: string, userId: string, data: MeetingDetail) : Promise<Meeting | null> {
        const currMeeting = await this.meetingModel.findById(meetingId);

        if(!currMeeting) {
            return null;
        }

        if(currMeeting.ownerId != userId) {
            throw new UnauthorizedException("User is not owner of this meeting.");
        }

        if(currMeeting.status != "pending") {
            throw new BadRequestException("This meeting is not pending anymore, so state cannot be updated.");
        }

        currMeeting.details = data;
        await currMeeting.save();

        //update task time in case of changed ETA
        this.updateTasks(meetingId);

        return currMeeting;
    }

    //id of user creating meeting
    async create(userId: string, data: CreateMeetingDTO) : Promise<Meeting> {

        const meeting = new this.meetingModel(<Meeting>{
            ownerId: userId,
            eta: data.time,
            details: {
                name: data.name,
                description: data.description,
                time: data.time,
                location: data.location
            }
        });
        await meeting.save();
        this.createTasks(meeting.id);
        return this.addUser(userId, meeting.id);
    }

    async delete(id: string) {
        this.meetingModel.deleteOne({_id: id}, undefined, (err) => {
            if(err) {
                throw err;
            } else {
                this.taskService.deleteCronJob(this.meetingJob(id));
                this.taskService.deleteCronJob(this.reminderJob(id));
            }
        });
    }

    async findAll(userId: string): Promise<Meeting[]> {
        var meetings: MeetingDocument[] = await this.meetingModel.find({ 'participants.userId': userId });
        return meetings;
    }

    async findById(id: string): Promise<Meeting | null> {
        return await this.meetingModel.findById(id);
    }

    //adds a user to the current meeting and creates a journey for them
    async addUser(userId: string, meetingId: string): Promise<Meeting> {
        var meeting = await this.meetingModel.findById(meetingId);

        if(!meeting) {
            throw new NotFoundException("A meeting with this id does not exist");
        }

        var journey = await this.journeyService.create(userId, meetingId);

        meeting.participants.push(<MeetingParticipant> {
            userId: userId,
            journeyId: journey.id
        });

        await meeting.save();
        return meeting;
    }

    async updateTasks(meetingId: string) {
        var meeting = await this.meetingModel.findById(meetingId);

        if(!meeting) {
            return;
        }

        if(!this.taskService.hasCronJob(this.meetingJob(meetingId))) {
            return;
        }

        var dayBefore: Date = new Date(new Date(meeting.eta).getTime() - (24 * 60 * 60 * 1000)); 
        var twoDaysBefore: Date = new Date(new Date(meeting.eta).getTime() - (48 * 60 * 60 * 1000)); 

        this.taskService.updateCronTime(this.meetingJob(meetingId), dayBefore);
        this.taskService.updateCronTime(this.reminderJob(meetingId), twoDaysBefore);
    }

    //creates/updates future tasks for this meeting
    async createTasks(meetingId: string) {
        var meeting = await this.meetingModel.findById(meetingId);

        if(!meeting) {
            return;
        }

        var dayBefore: Date = new Date(new Date(meeting.eta).getTime() - (24 * 60 * 60 * 1000)); 
        var twoDaysBefore: Date = new Date(new Date(meeting.eta).getTime() - (48 * 60 * 60 * 1000)); 

        //this will run 48hours before start of meeting
        this.taskService.addCronJob(this.reminderJob(meetingId), twoDaysBefore, async() => {
             //get updated meeting object (in future)
             const meet = await this.meetingModel.findById(meeting?.id);

             if(!meet) {
                 return;
             }

            // send notif to everyone reminding them to finalize meeting information 
            //this.notificationService.pushNotification();

        });

        //this will always run 24H before start of meeting
        this.taskService.addCronJob(this.meetingJob(meetingId), dayBefore, async () => {

            //get updated meeting object (in future)
            const meet = await this.meetingModel.findById(meeting?.id);

            if(!meet) {
                return;
            }

            //at this point, the meeting cannot be changed and state becomes "finalized"

            if(meet.status == "pending") {
                meet.status = "finalized";
                await meet.save();
            }

            //recalculate ALL etas
            await this.updateETAs(meet.id);

            //send notification for all user's in meeting reminding them its in 24 hour
            //this.notificationService.pushNotification();

            //create future events for reminding each user 1 hour before THEY have to leave
            meet.participants.forEach(async participant => {
                const journey: Journey | null = await this.journeyService.findById(participant.journeyId);

                if(!journey) {
                    return;
                }
               
                var hourBefore : Date = new Date((new Date(meet.details.time).getTime() - journey.travelTime * 1000 - (1 * 60 * 60 * 1000)));
                
                this.taskService.addCronJob(this.journeyJob(journey.id), hourBefore, async () => {
                    //this runs 1 hour before each user has to leave (individually)

                    //calculate time they have to leave 1 last time
                    const jour = await this.journeyService.calculateETA(journey.id);

                    const meetingTime  = new Date(meet.details.time).getTime();
                    const leavingTime  = new Date(meetingTime - jour.travelTime * 1000).getTime();

                    //how long till they have to leave
                    const time = Math.ceil((leavingTime - new Date().getTime()) / (1000 * 60));

                    // send notif
                    // this should only take userId, title, message
                    this.notificationService.addNotification({
                        id: "",
                        userId: participant.userId,
                        title: "You must leave soon!",
                        message: `You must leave in ${time} minutes to make it to ${meet.details.name}`, 
                        read: false
                    });

                    //this runs when they have to leave 
                    this.taskService.addCronJob(this.leaveJob(journey.id), new Date(leavingTime) , async () => { 

                        //anything that needs to happen when meeting becomes active can happen here

                        //when the first person has to leave, meeting becomes active
                        var meeting = await this.meetingModel.findById(meetingId);

                        if(!meeting) {
                            return;
                        }

                        if(meeting.status != "active") {
                            meeting.status = "active";
                            await meeting.save();
                        }
                        
                        //send notification telling them to leave
                        this.notificationService.addNotification({
                            id: "",
                            userId: participant.userId,
                            title: "Leave Now!",
                            message: `You must leave now to make it to ${meet.details.name} on time.`, 
                            read: false
                        });
                    });
                })

            });

        });
    }

    //updates ETA's for all journeys in this meeting
    async updateETAs(meetingId: string) {
        var meeting = await this.meetingModel.findById(meetingId);
        
        meeting?.participants.forEach(async participant => {
            await this.journeyService.calculateETA(participant.journeyId);
        });
    } 

    private reminderJob(meetingId: string) {
        return "M_" + meetingId + "_48H";
    }

    private meetingJob(meetingId: string) {
        return "M_" + meetingId + "_24H";
    }

    private journeyJob(journeyId: string) {
        return "J_" + journeyId + "_1H";
    }

    private leaveJob(journeyId: string) {
        return "J_" + journeyId + "_L";
    }

}
