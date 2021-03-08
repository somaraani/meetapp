import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Notification } from '@types';
import { Auth } from 'src/common/decorators/requests/auth.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
    constructor(
        private notificationService: NotificationsService
    ) { }

    @Get()
    findAll(@Auth() auth, @Query('userId') userId) : Promise<Notification[]> {
        //TODO: use userId from query string. Currently retreiving userId for self
        return this.notificationService.findByUser(auth.userId);
    }
}