
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingSchema } from './schemas/meeting.schema';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';


@Module({
  imports: [MongooseModule.forFeature([{name: 'meeting', schema: MeetingSchema}])],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService]
})
export class MeetingsModule {}
