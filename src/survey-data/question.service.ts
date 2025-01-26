import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionDocument } from './survey.model';
import { Model } from 'mongoose';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name)
    private questionModel: Model<QuestionDocument>,
  ) {}
  async createSurvey(diseaseId: string, question: Question): Promise<Question> {
    try {
      const createdSurvey = new this.questionModel({
        diseaseId,
        type: question.type,
        question: question.question,
        placeholder: question.placeholder,
        options: question.options,
      });
      return await createdSurvey.save();
    } catch (error) {
      console.log('Error creating survey data: ', error);
      throw error;
    }
  }

  async findAll(diseaseId: string): Promise<Question[]> {
    try {
      return await this.questionModel.find({ diseaseId }).exec();
    } catch (error) {
      console.log('Error fetching all survey data: ', error);
      throw error;
    }
  }
  async findByQuestion(
    field: keyof Question,
    value: any,
  ): Promise<Question | null> {
    try {
      const query = { [field]: value };
      return await this.questionModel.findOne(query).exec();
    } catch (error) {
      console.log('Error fetching survey data by Question: ', error);
      throw error;
    }
  }
  async update(id: string, Question: Partial<Question>): Promise<Question> {
    try {
      return await this.questionModel
        .findByIdAndUpdate(id, Question, {
          new: true,
        })
        .exec();
    } catch (error) {
      console.log('Error updating all survey data: ', error);
      throw error;
    }
  }
  async delete(id: string): Promise<Question> {
    try {
      return await this.questionModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.log('Error fetching all survey data: ', error);
      throw error;
    }
  }
}
