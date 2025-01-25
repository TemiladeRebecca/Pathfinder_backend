import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SurveyDataDocument = SurveyData & Document;
export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop({ required: true, default: new mongoose.Types.ObjectId() })
  id: string;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true, enum: ['radio', 'number'] })
  type: string;

  @Prop({ type: [String], required: false })
  options?: string[];

  @Prop({ required: false })
  placeholder?: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema()
export class SurveyData {
  @Prop({ required: true })
  disease: string;

  @Prop({ type: [QuestionSchema], required: true })
  questions: Question[]; // Array of questions
}

export const SurveyDataSchema = SchemaFactory.createForClass(SurveyData);
