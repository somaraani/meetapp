
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Meeting, MeetingDetail, MeetingParticipant } from '@types'
import { CreateMeetingDTO } from './dto/CreateMeetingDto';
import { InjectModel } from '@nestjs/mongoose';
import { MeetingDocument } from './schemas/meeting.schema';
import { Model } from 'mongoose';
import { JourneysService } from '../journeys/journeys.service';

@Injectable()
export class MeetingsService {

    constructor(
        @InjectModel("meeting")
        private meetingModel: Model<MeetingDocument>, 
        private journeyService: JourneysService
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
        return currMeeting;
    }

    //id of user creating meeting
    async create(userId: string, data: CreateMeetingDTO) : Promise<Meeting> {

        const meeting = new this.meetingModel(<Meeting>{
            ownerId: userId,
            eta: data.time,
            details: {
                description: data.description,
                time: data.time,
                location: data.location
            }
        });

        await meeting.save();

        //add owner to participants 
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

}
