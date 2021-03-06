
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Meeting, MeetingDetail } from '@types'
import { CreateMeetingDTO } from './dto/CreateMeetingDto';
import { InjectModel } from '@nestjs/mongoose';
import { MeetingDocument } from './schemas/meeting.schema';
import { Model } from 'mongoose';

@Injectable()
export class MeetingsService {

    constructor(
        @InjectModel("meeting")
        private meetingModel: Model<MeetingDocument>
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
                name: data.name,
                description: data.description,
                time: data.time,
                location: data.location
            }, 
            participants: [
                {
                    userId: userId,
                    journeyId: "123" //TODO create a journey for user 
                }
            ]
        });

        meeting.save();
        return meeting;
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

}
