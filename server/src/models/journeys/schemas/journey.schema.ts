import { Journey } from '@types';
import { Document} from 'mongoose';
import { CreateSchema } from 'src/database/util';

export const JourneySchema = CreateSchema({
  userId: String,
  meetingId: String, 
  travelMode: String, 
  lastUpdated: String,
  travelTime: Number,
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
    travelMode: String,
    avoid: [String]
  }
});

export type JourneyDocument = Journey & Document