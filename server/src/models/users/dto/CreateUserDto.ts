import { PublicUserData } from "@types";
import { IsEmail, IsNotEmpty, MaxLength, maxLength, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string

    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(16)
    username: string;

    @IsNotEmpty()
    details: PublicUserData
}