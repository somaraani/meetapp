import { User } from '@types';
import {Schema, Document} from 'mongoose';

export const UserSchema = new Schema({
  email: String,
  publicData: {
    displayName: String,
    displayPicture: String,
  },
  privateData: {
    password: String
  }
});
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
});

export type UserDocument = User & Document