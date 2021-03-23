import { Coordinate } from "@types";
import {  IsISO8601, IsNotEmpty } from 'class-validator';

export class CreateMeetingDTO {

    name: string;
    
    description: string;

    @IsISO8601()
    @IsNotEmpty()
    time: string

    @IsNotEmpty()
    location: Coordinate

    tolerance: number;
}