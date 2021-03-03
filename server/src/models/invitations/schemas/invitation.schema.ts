import { Invitation } from '@types';
import {Schema, Document} from 'mongoose';

export const InvitationSchema = new Schema({
  meetingId: String,
  userId: String,
  status: {type: String, default: "pending"}
});

InvitationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

export type InvitationDocument = Invitation & Document