import {  IsBoolean, IsNotEmpty } from 'class-validator';

export class PatchInviteDTO {

    @IsNotEmpty()
    @IsBoolean()
    accepted: boolean

}