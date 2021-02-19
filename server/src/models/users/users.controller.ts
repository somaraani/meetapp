import { Body, ConflictException, Controller, Get, Logger, NotFoundException, Param, Post, Put, Query, Req, UnauthorizedException } from '@nestjs/common';
import { User } from '@types';
import { authenticate, use } from 'passport';
import { Public } from 'src/common/decorators/metadata/public';
import { Auth } from 'src/common/decorators/requests/auth.decorator';
import { CreateUserDto } from './dto/CreateUserDto';
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    private readonly logger = new Logger(UsersController.name);

    @Get()
    findAll(@Query('query') q) {
        this.logger.debug(`Requesting all users with query ${q}`);
        return this.usersService.findAll(q);
    }

    @Get('self')
    async findUserSelf(@Auth() auth)  {
        //gets the user's id based on their JWT
        var user = await this.usersService.findById(auth.userId);
        return user;
    }

    @Get(':id/public')
    async findOnePublic(@Param('id') id: string)  {
        var user = await this.usersService.findById(id);
        if(!user) {
            throw new NotFoundException("A user with that id does not exist.");
        }
        return user?.publicData;
    }

    @Put(':id')
    update(@Param('id') id: string, @Auth() auth, @Body() data: User) {
        this.logger.debug(`Request to update user with id: ${id}`);

        if(auth.userId !== id) {
            throw new UnauthorizedException("You do not have permission to update this user.");
        }

        return this.usersService.update(id, data);
    }

    @Post()
    @Public()
    create(@Body() data: CreateUserDto) {
        this.logger.debug(`Request to create user with email ${data.email}`);
        const id = this.usersService.create(data);
        return { id };
    }

    @Get(':id')
    findOne(@Auth() auth, @Param('id') id: string)  {
        this.logger.debug(`Requesting user with id: ${id}`);
        
        //if we want to allow 'admin' users we can 
        //give them permission to different users here
        if(auth.userId !== id) {
            throw new UnauthorizedException("You do not have permission to update this user.");
        }

        return this.usersService.findById(id);
    }
}