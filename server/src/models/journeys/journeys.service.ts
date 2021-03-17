
import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Journey, JourneySetting, Meeting, MeetingDetail } from '@types'
import { InjectModel } from '@nestjs/mongoose';
import { JourneyDocument } from './schemas/journey.schema';
import { Model } from 'mongoose';
import { MeetingDocument } from '../meetings/schemas/meeting.schema';
import { NavigationService } from '../navigation/navigation.service';
import { TasksService } from 'src/tasks/tasks.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class JourneysService {

    constructor(
        @InjectModel("journey")
        private journeyModel: Model<JourneyDocument>,
        @InjectModel("meeting")
        private meetingModel: Model<MeetingDocument>,
        private navigationService: NavigationService,
        private tasksService: TasksService,
        private notificationService: NotificationsService
    ) { }

    private readonly logger = new Logger(JourneysService.name);

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

        // if(meeting.status != "pending") {
        //     throw new BadRequestException("This meeting is not pending anymore, cannot change journey settings.");
        // }

        currJourney.settings = settings;

        await currJourney.save();
        await this.journeyJob(currJourney.id);

        return this.journeyModel.findById(currJourney.id);
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

    private journeyJobName(journeyId: string) {
        return "J_" + journeyId + "_1H";
    }
    
    private leaveJobName(journeyId: string) {
        return "J_" + journeyId + "_L";
    }

    async journeyJob(journeyId: string) {
        var journey: Journey | null = await this.journeyModel.findById(journeyId);

        if(!journey) {
            return;
        }

        const meeting = await this.meetingModel.findById(journey.meetingId);

        if(!meeting) {
            return;
        }
  
        try {
            journey = await this.calculateETA(journeyId);
        } catch(err) {
            this.logger.debug(`Couldn't calculate ETA for journey ${journeyId}, will not create event.`);
            
            this.notificationService.addNotification({
                userId: journey.userId,
                title: `Add Starting location to ${meeting.details.name}`,
                body: `You haven't added a start location to the meeting yet. This is required to give you reminders to leave.`, 
            });

            this.logger.debug(`Sending notification to user ${journey.userId} to update journey settings`)
            return;
        }

        var hourBefore: Date;
        try {
            hourBefore = new Date((new Date(meeting.eta).getTime() - journey.travelTime * 1000 - (1 * 60 * 60 * 1000)));
        } catch(err) {
            //if it's already less than 1 hour
            hourBefore = new Date();
        }
        
        //this runs 1 hour before each user has to leave 
        this.tasksService.addCronJob(this.journeyJobName(journeyId), hourBefore, async () => {

            //calculate time they have to leave 1 last time
            const jour = await this.calculateETA(journeyId);
            const meet = await this.meetingModel.findById(meeting.id);

            if(jour == null || meet == null) {
                return;
            }

            const meetingTime  = new Date(meet.eta).getTime();
            const leavingTime  = new Date(meetingTime - jour.travelTime * 1000).getTime();

            //how long till they have to leave (in minutes)
            const time = Math.ceil((leavingTime - new Date().getTime()) / (1000 * 60));

            this.logger.debug(`Reminding user ${jour.userId} to leave in ${time} minutes`);

            // send notif
            // this should only take userId, title, message
            this.notificationService.addNotification({
                userId: jour.userId,
                title: "You must leave soon!",
                body: `You must leave in ${time} minutes to make it to ${meet.details.name}`, 
                read: false
            });

            //create job that fires when they have to leave
            this.tasksService.addCronJob(this.leaveJobName(journeyId), new Date(leavingTime) , async () => { 

                //anything that needs to happen when meeting becomes active can happen here

                //when the first person has to leave, meeting becomes active
                const meet = await this.meetingModel.findById(meeting.id);

                if(!meet) {
                    return;
                }

                if(meet.status != "active") {
                    meet.status = "active";
                    await meet.save();
                }

                this.logger.debug(`Reminding user ${jour.userId} to leave now`);
                
                //send notification telling them to leave
                this.notificationService.addNotification({
                    userId: jour.userId,
                    title: "Leave Now!",
                    body: `You must leave now to make it to ${meet.details.name} on time.`, 
                });
            });
        });
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

        if(journey.settings == null) {
            throw new BadRequestException("Journey settings are required to calculate ETA");
        } else {
            if(journey.settings.startLocation == null || journey.settings.travelMode == null) {
                throw new BadRequestException("Start location and travel mode are required to calculate ETA.");
            }
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
