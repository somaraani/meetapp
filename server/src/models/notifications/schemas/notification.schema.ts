import { Notification } from '@types';
import {Schema, Document} from 'mongoose';
import { CreateSchema } from 'src/database/util';

export const NotificationSchema = CreateSchema({
  userId: String, 
  title: String,
  read: Boolean,
  message: String
});

export type NotificationDocument = Notification & Document