import {  IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateInviteDTO {

    @IsNotEmpty()
    @IsMongoId()
    userId: string

    @IsNotEmpty()
    @IsMongoId()
    meetingId: string

}