
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JourneySchema } from './schemas/journey.schema';
import { JourneysService } from './journeys.service';
import { JourneysController } from './journeys.controller';
import { MeetingSchema } from '../meetings/schemas/meeting.schema';
import { NavigationModule } from '../navigation/navigation.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [MongooseModule.forFeature([{name: 'journey', schema: JourneySchema}]), MongooseModule.forFeature([{name: 'meeting', schema: MeetingSchema}]), NavigationModule, TasksModule, NotificationsModule, SocketModule],
  controllers: [JourneysController],
  providers: [JourneysService],
  exports: [JourneysService]
})
export class JourneysModule {}
