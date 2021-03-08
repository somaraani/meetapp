import { Injectable } from '@nestjs/common';
import { Client, Status } from "@googlemaps/google-maps-services-js";
import { Coordinate, JourneySetting } from '@types';
import { DirectionsResponseData } from '@googlemaps/google-maps-services-js/dist/directions';
import { settings } from 'cluster';

@Injectable()
export class NavigationService {

    private client : Client;
    constructor() {
        this.client = new Client()
    }

    async getDirections(setting: JourneySetting, end: Coordinate) : Promise<DirectionsResponseData | null> {
        const response = await this.client.directions({
            params: {
                origin: setting.startLocation,
                destination:end,
                avoid: setting.avoid,
                transit_mode: setting.transitMode,
                key:<string>process.env.GOOGLE_MAPS_API_KEY
            }
        });

        if (response.data.status !== Status.OK){
            return null;
        }
        return response.data;
    }
}
