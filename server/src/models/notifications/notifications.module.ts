import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketModule } from 'src/socket/socket.module';
import { SocketService } from 'src/socket/socket.service';
import { UserSchema } from '../users/schemas/user.schema';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationSchema } from './schemas/notification.schema';

@Module({
  imports: [SocketModule, MongooseModule.forFeature([{name: 'notification', schema: NotificationSchema}]), MongooseModule.forFeature([{name: 'user', schema: UserSchema}])],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule {}
