
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JourneySchema } from './schemas/journey.schema';
import { JourneysService } from './journeys.service';
import { JourneysController } from './journeys.controller';


@Module({
  imports: [MongooseModule.forFeature([{name: 'journey', schema: JourneySchema}])],
  controllers: [JourneysController],
  providers: [JourneysService],
  exports: [JourneysService]
})
export class JourneysModule {}
