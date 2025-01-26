import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserLocationDocument = UserLocation & Document;

@Schema()
export class UserLocation {
  @Prop({ required: true, unique: true, maxlength: 60 })
  userId: string;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ unique: true, default: () => new mongoose.Types.ObjectId() })
  id?: string;
}

export const UserLocationSchema = SchemaFactory.createForClass(UserLocation);
