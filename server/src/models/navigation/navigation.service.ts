import { Injectable } from '@nestjs/common';
import { Client } from "@googlemaps/google-maps-services-js";
import { Coordinate, JourneySetting } from '@types';
import { DirectionsResponseData } from '@googlemaps/google-maps-services-js/dist/directions';

@Injectable()
export class NavigationService {

    private client : Client;
    constructor() {
        this.client = new Client()
    }

    async getDirections(start: Coordinate, end: Coordinate, setting: JourneySetting) : Promise<DirectionsResponseData>{
        
        const response = await this.client.directions({
            params: {
                origin: start,
                destination:end,
                avoid: setting.avoid,
                transit_mode: setting.transitMode,
                key:<string>process.env.GOOGLE_MAPS_API_KEY
            }
        });
        return response.data;
    }
}
