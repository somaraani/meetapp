import { Journey } from '@types';
import { Document} from 'mongoose';
import { CreateSchema } from 'src/database/util';

export const JourneySchema = CreateSchema({
  userId: String,
  meetingId: String, 
  eta: String, 
  lastUpdated: String,
  locations: [{
    lng: Number,
    lat: Number
  }],
  path: [{
    lng: Number,
    lat: Number
  }],
  settings: {
    startLocation: {
      lng: Number,
      lat: Number
    }, 
    transitType: String,
    tolls: Boolean
  }
});

export type JourneyDocument = Journey & Document