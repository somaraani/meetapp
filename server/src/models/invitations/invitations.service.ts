
import {  BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Invitation } from '@types'
import { InjectModel } from '@nestjs/mongoose';
import { InvitationDocument } from './schemas/invitation.schema';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { MeetingsService } from '../meetings/meetings.service';

@Injectable()
export class InvitationsService {

    constructor(
        @InjectModel("invitation")
        private invitiationModel: Model<InvitationDocument>,
        private userService: UsersService,
        private meetingService: MeetingsService
    ) { }

    async update(inviteId: string, userId: string, accepted: boolean) : Promise<Invitation | null> {
        const invite = await this.invitiationModel.findById(inviteId);

        if(!invite) {
            return null;
        } 

        if(invite.status != "pending") {
            throw new ConflictException("This meeting was already processed");
        }

        if(userId != invite.userId) {
            throw new UnauthorizedException("Only user that was invited can accept this meeting.");
        }

        if(accepted) {
            invite.status = "accepted";
            this.meetingService.addUser(invite.userId, invite.meetingId);
        } else {
            invite.status = "declined";
        }

        invite.save();

        return invite;
    }

    async create(userId: string, meetingId: string) : Promise<Invitation> {

        if(await this.userService.findById(userId) == null) {
            throw new BadRequestException("A user with that ID does not exist.");
        }

        const meeting = await this.meetingService.findById(meetingId);
        if(meeting == null) {
            throw new BadRequestException("A meeting with that ID does not exist.");
        }

        if(meeting.participants.find(x => x.userId == userId)) {
            throw new ConflictException("User is already part of meeting.");
        }

        var currentInvites = await this.findAll(userId, meetingId, "pending");
        if(currentInvites?.length > 0) {
            throw new ConflictException("There is already a pending invitation for this meeting and user");
        }

        const invite = new this.invitiationModel(<Invitation>{
           userId: userId,
           meetingId: meetingId
        });

        invite.save();

        //TODO send a notificaiton here?

        return invite;
    }

    async findAll(userId?: string, meetingId? : string, status?: string): Promise<Invitation[]> {
        if(userId == null && meetingId == null) {
            throw new BadRequestException("You must specify userId, meetingId, or both");
        }

        let filters = {
            userId: userId,
            meetingId: meetingId, 
            status: status
        };

        //remove filters with no value 
        Object.keys(filters).forEach(key => (filters[key] === undefined || (filters[key]).toString().length == 0) ? delete filters[key] : {});

        var meetings: InvitationDocument[] = await this.invitiationModel.find(filters);
        return meetings;
    }


}
