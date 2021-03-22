import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, Post, Put, Query, UnauthorizedException } from '@nestjs/common';
import { Coordinate, Meeting, MeetingDetail, MeetingDirectionResponse } from '@types';
import { isLatitude } from 'class-validator';
import { Auth } from 'src/common/decorators/requests/auth.decorator';
import { UsersService } from '../users/users.service';
import { CreateMeetingDTO } from './dto/CreateMeetingDto';
import { MeetingsService } from './meetings.service'

@Controller('meetings')
export class MeetingsController {

    constructor(private meetingsService: MeetingsService, private userService: UsersService) {}

    private readonly logger = new Logger(MeetingsController.name);

    @Post()
    create(@Auth() auth, @Body() data: CreateMeetingDTO) {
        this.logger.debug(`User with ID ${auth.userId} creating new meeting`);
        return this.meetingsService.create(auth.userId, data);
    }

    @Get()
    findAll(@Query('userId') userId) {
        this.logger.debug(`Requesting all meetings for userId ${userId}`);
        return this.meetingsService.findAll(userId);
    }


    @Get(':id/users')
    async getUsers(@Param('id') meetingId: string, @Auth() auth) {
        const meeting = await this.meetingsService.findById(meetingId);
        if(meeting === null) {
            throw new NotFoundException("Meeting with that ID was not found.");
        }
        const participantIds = meeting.participants.map(x => x.userId);

        if (!participantIds.includes(auth.userId)){
            throw new UnauthorizedException('You are not a member this meeting');
        }

        if (!participantIds || participantIds.length === 0){
            return [];
        }
        return await this.userService.findByIds(participantIds);
    }

    @Get(':id/directions')
    async getDirections(@Auth() auth, @Param('id') meetingId: string, @Query('lat') lat: string, @Query('lng') lng: string) : Promise<MeetingDirectionResponse> {
        const start:Coordinate = { lat: Number(lat), lng:Number(lng) };
        return await this.meetingsService.getDirections(auth.userId, meetingId, start)
    }

    @Get(':id')
    async findOne(@Auth() auth, @Param('id') id: string)  {
        this.logger.debug(`User ${auth.userId} is requesting meeting ${id}`);
        const meeting: Meeting | null = await this.meetingsService.findById(id);
        
        if(!meeting) {
            throw new NotFoundException("Meeting with that ID was not found.");
        }

        if(meeting.participants.find(item => item.userId === auth.userId) == undefined) {
            throw new UnauthorizedException("You do not have permission to view this meeting.");
        }

        return meeting;
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') meetingId: string, @Auth() auth) {
        this.logger.debug(`User ${auth.userId} deleting meeting ${meetingId}`);

        const meeting: Meeting | null = await this.meetingsService.findById(meetingId);

        if(!meeting) {
            throw new NotFoundException("Meeting with that ID was not found.");
        }
        if(meeting.ownerId !== auth.userId) {
            throw new UnauthorizedException("You do not have permission to delete this meeting.");
        }

        this.meetingsService.delete(meetingId);
    }

    @Put(':id/details')
    async update(@Param('id') meetingId: string, @Auth() auth, @Body() data: MeetingDetail) {
        this.logger.debug(`Request to update meeting with id: ${meetingId}`);
        const meeting: Meeting | null = await this.meetingsService.update(meetingId, auth.userId, data);

        if(!meeting) {
            throw new NotFoundException("Meeting with that ID was not found.");
        }

        return meeting;
    }
}