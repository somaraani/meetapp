import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Get(':email')
    findOne(@Param('email') email: string)  {
        return this.usersService.findOne(email);
    }
}