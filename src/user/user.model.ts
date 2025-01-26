import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true, maxlength: 60 })
  email: string;

  @Prop({ required: true, maxlength: 150 })
  password: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ unique: true, default: () => new mongoose.Types.ObjectId() })
  id?: string;

  static async setPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(
        parseInt(process.env.BCRYPT_SALT, 10) || 10,
      );
      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.error('Error hashing password: ', error);
      throw error;
    }
  }

  static async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Error verifying password: ', error);
      throw error;
    }
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
