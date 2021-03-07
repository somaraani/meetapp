import { Meeting } from '@types';
import { Document} from 'mongoose';
import { CreateSchema } from 'src/database/util';

export const MeetingSchema = CreateSchema({
  status: {type: String, default: "pending"},
  ownerId: String, 
  eta: String,
  details: {
    name: String, 
    description: String,
    time: String, 
    location: {
      lng: Number,
      lat: Number
    }
  },
  participants: 
    [
      {
        _id: false,
        userId: String,
        journeyId: String
      }
    ]
});

export type MeetingDocument = Meeting & Document