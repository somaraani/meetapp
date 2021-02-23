import { Meeting } from '@types';
import {Schema, Document} from 'mongoose';

export const MeetingSchema = new Schema({
  status: {type: String, default: "pending"},
  ownerId: String, 
  eta: String,
  details: {
    description: String,
    time: String, 
    location: {
      long: String,
      lat: String
    }
  },
  participants: 
    [
      {
        userId: String,
        journeyId: String
      }
    ]
});

MeetingSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

export type MeetingDocument = Meeting & Document