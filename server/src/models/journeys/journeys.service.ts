
import { BadRequestException, ForbiddenException, HttpException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Coordinate, Journey, JourneySetting, JourneyStatus, Meeting, MeetingDetail, MeetingStatus, SocketEvents } from '@types'
import { InjectModel } from '@nestjs/mongoose';
import { JourneyDocument } from './schemas/journey.schema';
import { Model } from 'mongoose';
import { MeetingDocument } from '../meetings/schemas/meeting.schema';
import { NavigationService } from '../navigation/navigation.service';
import { TasksService } from 'src/tasks/tasks.service';
import { NotificationsService } from '../notifications/notifications.service';
import { computeDistanceBetween } from 'spherical-geometry-js';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class JourneysService {

    constructor(
        @InjectModel("journey")
        private journeyModel: Model<JourneyDocument>,
        @InjectModel("meeting")
        private meetingModel: Model<MeetingDocument>,
        private navigationService: NavigationService,
        private tasksService: TasksService,
        private notificationService: NotificationsService,
        private socketService: SocketService
    ) { }

    private readonly LATE_TOL = 2 * 60 * 1000; //tolerence to whats considered "late"
    private readonly LEFT_TOL = 75; //radius considered "left" in metres
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
        currJourney.locations = [currJourney.settings.startLocation];
        await currJourney.save();
        await this.journeyJob(currJourney.id);
        this.socketService.broadcastToRoom(userId, meeting.id, SocketEvents.MEMBERJOURNEYUPDATE);
        return this.journeyModel.findById(currJourney.id);
    }

    async create(userId: string, meetingId: string) : Promise<Journey> {

        const journey = new this.journeyModel(<Journey>{
           userId: userId,
           status: JourneyStatus.PENDING,
           meetingId: meetingId,
           lastUpdated: new Date().toISOString()
        });

        await journey.save();
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
            journey = await this.calculateETA(journeyId, true);
        } catch(err) {
            this.logger.error(err);
            this.logger.debug(`Couldn't calculate ETA for journey ${journeyId}, will not create event.`);
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
            const jour = await this.calculateETA(journeyId, true);
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
    async calculateETA(journeyId: string, updatePath: boolean) : Promise<Journey> {
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

        const directionsResponse = await this.navigationService.getDirections(journey, meeting?.details.location)
        if (!directionsResponse) {
            throw new BadRequestException("Could not caluclate directions"); 
        }

        const etaSeconds = directionsResponse.routes[0].legs[0].duration.value;
        journey.travelTime = etaSeconds;
        if (updatePath){
            journey.path = directionsResponse.routes[0].overview_polyline.points;
        }

        //find out if they can make it on time
        if(new Date(meeting.eta).getTime() - new Date(journey.travelTime).getTime() > new Date().getTime()) {
            //if yes eta is meeting eta
            journey.eta = meeting.eta;
        } else {
            //otherwise set to their actual eta if they leave now
            journey.eta = new Date(new Date().getTime() + journey.travelTime * 1000).toISOString();
        }

        await journey.save();
        return journey;
    }

    async updateLocation(journeyId: string, location: Coordinate) : Promise<Journey> {
        await this.calculateETA(journeyId, false);
        const journey = await this.journeyModel.findById(journeyId);

        if(!journey) {
            throw new NotFoundException('Journey not found');
        }

        const meeting = await this.meetingModel.findById(journey.meetingId);
        if(!meeting) {
            throw new NotFoundException('Meeting not found');
        }

        journey.locations.push(location);
        journey.lastUpdated = new Date().toISOString();
        await journey.save();

        if(journey.settings.startLocation == null) {
            throw new BadRequestException(`Journey ${journeyId} does not have a start location, not calculating ETA.`);
        }

         //Figure out if they have left based on distance between current and start location
         var distance = computeDistanceBetween(location, journey.settings.startLocation);
         var left = distance > this.LEFT_TOL;

        const meetingTime  = new Date(meeting.eta).getTime();
        const arrivalTime = meetingTime + journey.travelTime * 1000;

        if(arrivalTime - meetingTime > this.LATE_TOL) {
            this.logger.debug(`user ${journey.userId} will be late to meeting ${meeting.details.name}`);

            var lateMins = Math.ceil((arrivalTime - meetingTime)/(1000*60));

            //if meeting isnt active and tolerence allows it, move ETA
            if(meeting.status != MeetingStatus.ACTIVE && lateMins <= meeting.details.tolerance) {
                //if user hasnt left, status is waiting for them
                if(!left) {
                    meeting.eta = new Date(meeting.eta + meeting.details.tolerance * 60 * 1000).toISOString();
                    meeting.status = MeetingStatus.WAITING;

                    //TODO send late notice here

                    //cancel all future events until a new ETA is calculated (Unsure about this ??)
                    meeting.participants.forEach((participant) => {
                        this.tasksService.deleteCronJob(this.journeyJobName(journeyId));
                    });

                } else {
                    //if they have left, and meeting isnt active, we make it active
                    meeting.eta = journey.eta;
                    meeting.status = MeetingStatus.ACTIVE;

                    //recreate future events given new ETA
                    meeting.participants.forEach((participant) => {
                        if(participant.journeyId == journeyId) {
                            return;
                        }

                        this.journeyJob(participant.journeyId);
                    })
                }

                await meeting.save();
            }
        }

        var jourDoc = await this.journeyModel.findById(journeyId) as JourneyDocument;
        if(left && jourDoc.status == JourneyStatus.PENDING) {
            jourDoc.status = JourneyStatus.ACTIVE;
            await jourDoc.save();
        }
        else if (jourDoc.status == JourneyStatus.ACTIVE){
            var distance = computeDistanceBetween(location, meeting.details.location);
            if (distance < this.LEFT_TOL){
                jourDoc.status = JourneyStatus.COMPLETE;
                await jourDoc.save();
            }
            let meetingComplete = true;
            meeting.participants.forEach( async (participant) => {
                if (!meetingComplete) return;
                const journey = await this.findById(journeyId);
                if (journey?.status !== JourneyStatus.COMPLETE){
                    meetingComplete = false;
                }
            })
            if (meetingComplete){
                meeting.status = MeetingStatus.COMPLETE;
                await meeting.save();
            }
        }
        return jourDoc;
    }
}
