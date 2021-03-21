
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingSchema } from './schemas/meeting.schema';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { JourneysModule } from '../journeys/journeys.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [MongooseModule.forFeature([{name: 'meeting', schema: MeetingSchema}]), JourneysModule, TasksModule, NotificationsModule, UsersModule],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService]
})
export class MeetingsModule {}
