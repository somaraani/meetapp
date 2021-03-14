
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Journey, JourneySetting, Meeting, MeetingDetail } from '@types'
import { InjectModel } from '@nestjs/mongoose';
import { JourneyDocument } from './schemas/journey.schema';
import { Model } from 'mongoose';
import { MeetingDocument } from '../meetings/schemas/meeting.schema';
import { NavigationService } from '../navigation/navigation.service';

@Injectable()
export class JourneysService {

    constructor(
        @InjectModel("journey")
        private journeyModel: Model<JourneyDocument>,
        @InjectModel("meeting")
        private meetingModel: Model<MeetingDocument>,
        private navigationService: NavigationService
    ) { }
    

    async update(journeyId: string, userId: string, settings: JourneySetting) : Promise<Journey | null> {
        const currJourney = await this.journeyModel.findById(journeyId);

        if(!currJourney) {
            throw new NotFoundException("A journey with that Id was not found.");
        }

        if(currJourney.userId != userId) {
            throw new UnauthorizedException("User is not owner of this journey.");
        }

        const meeting = await this.meetingModel.findById(currJourney.meetingId);
        if(!meeting) {
            throw new BadRequestException("Meeting this journey belongs to does not exist anymore.");
        }

        if(meeting.status != "pending") {
            throw new BadRequestException("This meeting is not pending anymore, cannot change journey settings.");
        }

        currJourney.settings = settings;
        await currJourney.save();

        //TODO after journey is updated, its possible meeting 'active' date is different, therefore we 
        //need to modify the future task 

        //need to use google maps API to set new time to leave for journey
        return await this.calculateETA(journeyId);
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
    async calculateETA(journeyId: string) : Promise<Journey> {
        const journey = await this.journeyModel.findById(journeyId);
        if (journey == null){
            throw new NotFoundException('Journey not found');
        }
        const meeting = await this.meetingModel.findById(journey.meetingId);
        if (!meeting) { 
            throw new NotFoundException("A meeting with that Id was not found.");
        }
        const directionsResponse = await this.navigationService.getDirections(journey.settings, meeting?.details.location)
        if (!directionsResponse) {
            throw new BadRequestException("Could not caluclate directions"); 
        }

        const etaSeconds = directionsResponse.routes[0].legs[0].duration.value;
        journey.travelTime = etaSeconds;
        return await journey.save();
    }

}
