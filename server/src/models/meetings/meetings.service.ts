
import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Coordinate, Journey, Meeting, MeetingDetail, MeetingParticipant } from '@types'
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

    private readonly logger = new Logger(MeetingsService.name);

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
        
        //TODO - send notification to participants when meeting changes 

        currMeeting.details = data;
        currMeeting.eta = data.time;

        await currMeeting.save();

        //update task time in case of changed ETA
        this.updateJobs(meetingId);

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
                location: data.location,
                tolerance: data.tolerance
            }
        });

        await meeting.save();
        const meet = await this.addUser(userId, meeting.id);
        
        this.updateJobs(meeting.id);
        return meet;
    }

    private updateJobs(meetingId: string) {
        //creates reminder job (48H)
        this.reminderJob(meetingId);
        //creates meeting job - calculates ETAs (24H)
        this.meetingJob(meetingId);
    }

    async delete(id: string) {
        this.meetingModel.deleteOne({_id: id}, undefined, (err) => {
            if(err) {
                throw err;
            } else {
                this.taskService.deleteCronJob(this.meetingJobName(id));
                this.taskService.deleteCronJob(this.reminderJobName(id));
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

    private reminderJobName(meetingId: string) {
        return "M_" + meetingId + "_48H";
    }

    //create job that runs 48 hours before meeting
    private async reminderJob(meetingId: string) {
        const meeting : Meeting | null = await this.meetingModel.findById(meetingId);

        if(!meeting) {
            return;
        }

        var twoDaysBefore: Date = new Date(new Date(meeting.eta).getTime() - (48 * 60 * 60 * 1000)); 

        this.taskService.addCronJob(this.reminderJobName(meetingId), twoDaysBefore, async() => {
            //get updated meeting object (in future)
            const meet = await this.meetingModel.findById(meeting?.id);

            if(!meet) {
                return;
            }

            this.logger.debug(`Reminding owner of meeting ${meetingId} to finalize info.`);

            // remind meeting owner to finalize info
            this.notificationService.addNotification({
                userId: meeting.ownerId,
                title: `You have 24H to finalize meeting!`,
                body: `Your meeting ${meeting.details.name} will become finalized in 24 hours. Make sure to make any changes to location or time now!`, 
            });
       });
    }

    private meetingJobName(meetingId: string) {
        return "M_" + meetingId + "_24H";
    }

    //creates job that runs 24H before start of meeting
    private async meetingJob(meetingId: string) {
        const meeting = await this.meetingModel.findById(meetingId);

        if(!meeting) {
            return;
        }

        var dayBefore: Date = new Date(new Date(meeting.eta).getTime() - (24 * 60 * 60 * 1000)); 

        this.taskService.addCronJob(this.meetingJobName(meetingId), dayBefore, async () => {
            //get updated meeting object (in future)
            const meet = await this.meetingModel.findById(meeting?.id);

            if(!meet) {
                return;
            }

            this.logger.debug(`Reminding all user's for meeting ${meetingId} to set start location`);

            meet.participants.forEach(async participant => {
                
                const journey: Journey | null = await this.journeyService.findById(participant.journeyId);
                if(journey == null) {
                    return;
                }

                if(journey.settings.startLocation == null) {
                    this.notificationService.addNotification({
                        userId: participant.userId,
                        title: `You haven't set a start location for ${meet.details.name}`,
                        body: `Don't forget to set your starting location or you won't get reminders to leave.`, 
                    });
                }

                //create future events for reminding each user 1 hour before THEY have to leave
                this.journeyService.journeyJob(participant.journeyId);
            });

        });

    }

    async updateLocation(userId: string, meetingId: string, location: Coordinate) {
        const meeting: Meeting | null = await this.findById(meetingId);
        if(!meeting) {
            this.logger.error("Couldn't find meeting, can't update location of user " + userId);
            return;
        }

        const journeyId = meeting.participants.find(item => item.userId == userId)?.journeyId;
        if(!journeyId) {
            this.logger.error("Couldn't find journeyId, can't update location of user " + userId);
            return;
        }

        this.journeyService.updateLocation(journeyId, location);
    }

}
