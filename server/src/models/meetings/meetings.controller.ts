import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, Post, Put, Query, UnauthorizedException } from '@nestjs/common';
import { Meeting, MeetingDetail } from '@types';
import { Auth } from 'src/common/decorators/requests/auth.decorator';
import { CreateMeetingDTO } from './dto/CreateMeetingDto';
import { MeetingsService } from './meetings.service'

@Controller('meetings')
export class MeetingsController {

    constructor(private meetingsService: MeetingsService) {}

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

        return this.meetingsService.update(meetingId, auth.userId, data);
    }
   
}