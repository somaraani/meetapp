
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Journey, JourneySetting, Meeting, MeetingDetail } from '@types'
import { InjectModel } from '@nestjs/mongoose';
import { JourneyDocument } from './schemas/journey.schema';
import { Model } from 'mongoose';

@Injectable()
export class JourneysService {

    constructor(
        @InjectModel("journey")
        private journeyModel: Model<JourneyDocument>
    ) { }
    

    async update(journeyId: string, userId: string, settings: JourneySetting) : Promise<Journey | null> {
        const currJourney = await this.journeyModel.findById(journeyId);

        if(!currJourney) {
            throw new NotFoundException("A journey with that Id was not found.");
        }

        if(currJourney.userId != userId) {
            throw new UnauthorizedException("User is not owner of this journey.");
        }

        currJourney.settings = settings;
        currJourney.save();

        //TODO after journey is updated, its possible meeting 'active' date is different, therefore we 
        //need to modify the future task 

        //need to use google maps API to set new time to leave for journey
        await this.calculateETA(journeyId);

        return currJourney;
    }

    async create(userId: string, meetingId: string) : Promise<Journey> {

        const journey = new this.journeyModel(<Journey>{
           userId: userId,
           meetingId: meetingId,
           lastUpdated: new Date().toISOString()
        });

        journey.save();
        return journey;
    }

    async findById(id: string): Promise<Journey | null> {
        return await this.journeyModel.findById(id);
    }

    //updates this journeys ETA and time to leave using google maps API
    async calculateETA(journeyId: string) {

    }

}
