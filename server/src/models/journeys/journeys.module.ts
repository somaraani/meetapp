
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JourneySchema } from './schemas/journey.schema';
import { JourneysService } from './journeys.service';
import { JourneysController } from './journeys.controller';
import { MeetingSchema } from '../meetings/schemas/meeting.schema';
import { NavigationModule } from '../navigation/navigation.module';

@Module({
  imports: [MongooseModule.forFeature([{name: 'journey', schema: JourneySchema}]), MongooseModule.forFeature([{name: 'meeting', schema: MeetingSchema}]), NavigationModule],
  controllers: [JourneysController],
  providers: [JourneysService],
  exports: [JourneysService]
})
export class JourneysModule {}
