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

export type UserDocument = User & Document