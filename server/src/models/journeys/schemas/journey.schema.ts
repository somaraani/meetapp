import { Journey } from '@types';
import { Document} from 'mongoose';
import { CreateSchema } from 'src/database/util';

export const JourneySchema = CreateSchema({
  userId: String,
  meetingId: String, 
  lastUpdated: String,
  travelTime: Number,
  locations: [{
    lng: Number,
    lat: Number
  }],
  path: String,
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