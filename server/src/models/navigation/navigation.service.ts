import { BadRequestException, Injectable } from '@nestjs/common';
import { Client, Status, TransitMode, TravelMode } from "@googlemaps/google-maps-services-js";
import { Coordinate, JourneySetting, MeetingDirectionResponse  } from '@types';
import { DirectionsResponseData } from '@googlemaps/google-maps-services-js/dist/directions';

@Injectable()
export class NavigationService {

    private client : Client;
    constructor() {
        this.client = new Client()
    }

    async getDirections(setting: JourneySetting, start: Coordinate, end: Coordinate) : Promise<MeetingDirectionResponse | null> {
        setting.travelMode = setting.travelMode || TravelMode.driving;
        if(setting.travelMode == null) {
            throw new BadRequestException("Travel mode cannot be null.");
        }

        var transitMode;
        var travelMode;

        if(setting.travelMode == "transit") {
            travelMode = [TravelMode.transit]
            //we can make this dynamic if we add the option to the UI
            transitMode = [TransitMode.bus, TransitMode.rail, TransitMode.train, TransitMode.tram, TransitMode.subway];
        } else {
            travelMode = [TravelMode[setting.travelMode]];
            transitMode = [];
        }

        const response = await this.client.directions({
            params: {
                origin: start,
                destination: end,
                avoid: setting.avoid,
                mode: travelMode,
                transit_mode: transitMode,
                key:<string>process.env.GOOGLE_MAPS_API_KEY
            }
        });
        if (response.data.status !== Status.OK){
            return null;
        }
        const route = response.data.routes[0];
        return {
            eta: route.legs[0].duration.value,
            distance: route.legs[0].distance.value,
            polyline:route.overview_polyline.points,
        }
    }
}
