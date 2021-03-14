import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketModule } from 'src/socket/socket.module';
import { SocketService } from 'src/socket/socket.service';
import { UsersModule } from '../users/users.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationSchema } from './schemas/notification.schema';

@Module({
  imports: [UsersModule, SocketModule, MongooseModule.forFeature([{name: 'notification', schema: NotificationSchema}])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}
