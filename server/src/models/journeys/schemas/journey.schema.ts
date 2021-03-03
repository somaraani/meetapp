import { Journey } from '@types';
import { Document} from 'mongoose';
import { CreateSchema } from 'src/database/util';

export const JourneySchema = CreateSchema({
  userId: String,
  meetingId: String, 
  eta: String, 
  lastUpdated: String,
  locations: [{
    lng: String,
    lat: String
  }],
  path: [{
    lng: String,
    lat: String
  }],
  settings: {
    startLocation: {
      lng: String,
      lat: String
    }, 
    transitType: String,
    tolls: Boolean
  }
});

JourneySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

export type JourneyDocument = Journey & Document