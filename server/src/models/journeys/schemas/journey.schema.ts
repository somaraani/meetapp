import { Journey } from '@types';
import { Document} from 'mongoose';
import { CreateSchema } from 'src/database/util';

export const JourneySchema = CreateSchema({
  id: String, 
  userId: String,
  meetingId: String, 
  eta: String, 
  lastUpdated: String,
  locations: [{
    long: String,
    lat: String
  }],
  path: [{
    long: String,
    lat: String
  }],
  settings: {
    startLocation: {
      long: String,
      lat: String
    }, 
    transitType: String,
    tolls: Boolean
  }
});

export type JourneyDocument = Journey & Document