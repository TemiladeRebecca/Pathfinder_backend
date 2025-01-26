import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type DiseaseDocument = Disease & Document;
export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop({ required: true, default: new mongoose.Types.ObjectId() })
  id?: string;

  @Prop({ required: true, maxlength: 60 })
  diseaseId?: string;

  @Prop({ required: true, maxlength: 200 })
  question: string;

  @Prop({ required: true, enum: ['radio', 'number'] })
  type: string;

  @Prop({ type: [String], required: false })
  options?: string[];

  @Prop({ required: false })
  placeholder?: string;

  @Prop({ required: true, default: Date.now })
  createdAt?: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt?: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema()
export class Disease {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: Date.now })
  createdAt?: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt?: Date;
}

export const DiseaseSchema = SchemaFactory.createForClass(Disease);
