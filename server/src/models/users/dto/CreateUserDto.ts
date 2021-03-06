import { PublicUserData } from "@types";
import { IsEmail, IsNotEmpty, MaxLength, maxLength, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string

    @IsNotEmpty()
    details: PublicUserData
}