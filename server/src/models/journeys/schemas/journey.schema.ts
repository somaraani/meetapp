import { Journey } from '@types';
import { Document} from 'mongoose';
import { CreateSchema } from 'src/database/util';

export const JourneySchema = CreateSchema({
  userId: String,
  meetingId: String, 
  lastUpdated: String,
  status: String,
  travelTime: Number,
  eta: String,
  locations: [{
    lng: Number,
    lat: Number
  }],
  path: String,
  settings: {
    startLocation: {
      _id: false,
      lng: Number,
      lat: Number
    }, 
    travelMode: String,
    avoid: [String]
  }
});

export type JourneyDocument = Journey & Document