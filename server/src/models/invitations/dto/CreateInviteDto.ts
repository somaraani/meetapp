import {  IsNotEmpty } from 'class-validator';

export class CreateInviteDTO {

    @IsNotEmpty()
    userId: string

    @IsNotEmpty()
    meetingId: string

}