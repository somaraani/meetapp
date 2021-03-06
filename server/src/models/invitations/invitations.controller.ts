import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, Patch, Post, Put, Query, UnauthorizedException } from '@nestjs/common';
import { Auth } from 'src/common/decorators/requests/auth.decorator';
import { CreateInviteDTO } from './dto/CreateInviteDto';
import { PatchInviteDTO } from './dto/PatchInviteDTO';
import { InvitationsService } from './invitations.service'

@Controller('invitations')
export class InvitationsController {

    constructor(private invitationsService: InvitationsService) {}

    private readonly logger = new Logger(InvitationsController.name);

    @Post()
    create(@Auth() auth, @Body() data: CreateInviteDTO) {
        this.logger.debug(`User with ID ${auth.userId} inviting user ${data.userId} to meeting ${data.meetingId}`);
        return this.invitationsService.create(data.userId, data.meetingId);
    }

    @Get()
    findAll(@Query('userId') userId, @Query('meetingId') meetingId, @Query('status') status) {
        this.logger.debug(`Requesting all invitations for user: ${userId}, meeting: ${meetingId}, status: ${status}`);
        return this.invitationsService.findAll(userId, meetingId, status);
    }

    @Patch(':id')
    update(@Param('id') inviteId: string, @Body() data: PatchInviteDTO) {
        this.logger.debug(`Request to reply: ${data.accepted} to invite ${inviteId}`);
        return this.invitationsService.update(inviteId, data.accepted);
    }
   
}