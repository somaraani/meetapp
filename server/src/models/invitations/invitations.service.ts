
import {  BadRequestException, Injectable } from '@nestjs/common';
import { Invitation } from '@types'
import { InjectModel } from '@nestjs/mongoose';
import { InvitationDocument } from './schemas/invitation.schema';
import { Model } from 'mongoose';

@Injectable()
export class InvitationsService {

    constructor(
        @InjectModel("invitation")
        private invitiationModel: Model<InvitationDocument>
    ) { }

    async update(inviteId: string, accepted: boolean) : Promise<Invitation | null> {
        const invite = await this.invitiationModel.findById(inviteId);

        if(!invite) {
            return null;
        } 

        if(accepted) {
            invite.status = "accepted";
        } else {
            invite.status = "declined";
        }

        invite.save();

        //TODO create journey and add it to meeting

        return invite;
    }

    //id of user creating meeting
    async create(userId: string, meetingId: string) : Promise<Invitation> {

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

        var meetings: InvitationDocument[] = await this.invitiationModel.find({...filters});
        return meetings;
    }


}
