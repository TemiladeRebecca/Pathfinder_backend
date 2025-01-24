import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserSessionDocument = UserSession & Document;

@Schema()
export class UserSession {
  @Prop({ required: true, unique: true, maxlength: 60 })
  userId: string;

  @Prop({ required: false, maxlength: 150 })
  token: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ unique: true, default: () => new mongoose.Types.ObjectId() })
  id?: string;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
