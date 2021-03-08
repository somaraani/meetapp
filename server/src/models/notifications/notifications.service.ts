import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from '@types';
import { NOTIFICATION } from '@events';
import { Model } from 'mongoose';
import { SocketService } from 'src/socket/socket.service';
import { UsersService } from '../users/users.service';
import { NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectModel("notification")
        private notificationModel: Model<NotificationDocument>,
        private userService: UsersService,
        private socketService: SocketService,
    ) { }

    async findByUser(userId: string): Promise<Notification[]> {
        return await this.notificationModel.find({userId: userId});
    }

    async findById(id: string): Promise<Notification | null> {
        return await this.notificationModel.findById(id);
    }

   
    async addNotification(userId: string, title: string, message: string): Promise<Notification> {
        let user = await this.userService.findById(userId);
        if (!user){
            throw new ConflictException('User not found');
        }
        const notification = {
            userId,
            title,
            message,
            read: false
        };
        const notificationModel = new this.notificationModel(<Notification> notification);
        await notificationModel.save();
        return notificationModel;
    }

    pushNotification(notification: Notification): void {
        //TODO: push using exp token
        if (this.socketService.isConnected(notification.userId)){
            this.socketService.emitToUser(notification.userId, NOTIFICATION, notification);
        }
    }
}
