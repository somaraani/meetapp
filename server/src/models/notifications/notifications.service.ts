import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from '@types';
import { NOTIFICATION } from '@events';
import { Model } from 'mongoose';
import { SocketService } from 'src/socket/socket.service';
import { NotificationDocument } from './schemas/notification.schema';
import { UserDocument } from '../users/schemas/user.schema';
import axios from 'axios';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectModel("notification")
        private notificationModel: Model<NotificationDocument>,
        @InjectModel("user")
        private userModel: Model<UserDocument>,
        private socketService: SocketService,
    ) { }

    async findByUser(userId: string): Promise<Notification[]> {
        return await this.notificationModel.find({ userId: userId });
    }

    async findById(id: string): Promise<Notification | null> {
        return await this.notificationModel.findById(id);
    }


    async addNotification(notification: Notification): Promise<Notification> {
        let user = await this.userModel.findById(notification.userId);
        if (!user) {
            throw new ConflictException('User not found');
        }
        notification.read = false;
        const notificationModel = new this.notificationModel(<Notification>notification);
        await notificationModel.save();
        return notificationModel;
    }

    async pushNotification(notification: Notification): Promise<void> {
        //TODO: push using exp token
        const user = await this.userModel.findById(notification.userId);
        if (user === null) {
            throw new ConflictException('User not found');
        }
        if (this.socketService.isConnected(notification.userId)) {
            this.socketService.emitToUser(notification.userId, NOTIFICATION, notification);
        }
        else if (user.expoPushToken) {
            const request = {
                to: user.expoPushToken,
                title: notification.title,
                body: notification.body,
            };
            this.sendPushNotification(request)
        }

    }

    private async sendPushNotification(request: { to: string, title: string, body: string, data?: any, sound?: string }) {
        request.sound = request.sound || 'default';
        const headers = {
            'Accept': 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        };
        await axios.post('https://exp.host/--/api/v2/push/send', request, { headers: headers });
    }
}
