
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

        currMeeting.details = data;
        currMeeting.save();

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
        this.taskService.updateCronTime(this.meetingJob(meetingId), dayBefore);
    }

    //creates/updates future tasks for this meeting
    async createTasks(meetingId: string) {
        var meeting = await this.meetingModel.findById(meetingId);

        if(!meeting) {
            return;
        }

        var dayBefore: Date = new Date(new Date(meeting.eta).getTime() - (24 * 60 * 60 * 1000)); 

        //this will always run 24H before start of meeting
        this.taskService.addCronJob(this.meetingJob(meetingId), dayBefore, async () => {

            //get updated meeting object (in future)
            const meet = await this.meetingModel.findById(meeting?.id);

            if(!meet) {
                return;
            }

            //recalculate ALL etas
            await this.updateETAs(meet.id);

            //send notification for all user's in meeting reminding them its in 24 hour
            //this.notificationService.addNotification() -> should send to everyone in meeting (how?)

            //create future events for reminding each user 1 hour before THEY have to leave
            meet.participants.forEach(async participant => {
                const journey: Journey | null = await this.journeyService.findById(participant.journeyId);

                if(!journey) {
                    return;
                }
               
                var hourBefore : Date = new Date(); // this should be 1 hour before they have to leave
                
                this.taskService.addCronJob(this.journeyJob(journey.id), hourBefore, async () => {
                    //this runs 1 hour before each user has to leave (individually)

                    //calculate time they have to leave 1 last time
                    await this.journeyService.calculateETA(journey.id);

                    // send notif
                    // this should only take userId, title, message
                    this.notificationService.addNotification({
                        id: "",
                        userId: participant.userId,
                        title: "You must leave soon!",
                        message: `You must leave in 1 hour to make it to ${meet.details.name}`, //this should tell them when exacty they should leave (if different than 1 hour)
                        read: false
                    });
                })

                //TODO find which the earliest time to leave is, and make the meeting ACTIVE at that time

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

    private meetingJob(meetingId: string) {
        return "M_" + meetingId + "_24H";
    }

    private journeyJob(journeyId: string) {
        return "J_" + journeyId + "_1H";
    }

}
