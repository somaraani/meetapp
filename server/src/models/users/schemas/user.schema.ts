import { User } from '@types';
import {Schema, Document} from 'mongoose';
import { CreateSchema } from 'src/database/util';

export const UserSchema = CreateSchema({
  email: String,
  expoPushToken: String,
  publicData: {
    username: String,
    displayName: String,
    displayPicture: String,
  },
  privateData: {
    password: String
  }
});

export type UserDocument = User & Document