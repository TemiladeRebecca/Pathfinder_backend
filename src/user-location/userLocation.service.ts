import { Injectable } from '@nestjs/common';
import { UserLocation, UserLocationDocument } from './location.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserLocationService {
  constructor(
    @InjectModel(UserLocation.name)
    private userLocationModel: Model<UserLocationDocument>,
  ) {}

  async createSurvey(Question: UserLocation): Promise<UserLocation> {
    try {
      const createdSurvey = new this.userLocationModel(Question);
      return await createdSurvey.save();
    } catch (error) {
      console.log('Error creating survey data: ', error);
      throw error;
    }
  }

  async findAll(diseaseId: string): Promise<UserLocation[]> {
    try {
      return await this.userLocationModel.find({ diseaseId }).exec();
    } catch (error) {
      console.log('Error fetching all survey data: ', error);
      throw error;
    }
  }

  async findByQuestion(
    field: keyof UserLocation,
    value: any,
  ): Promise<UserLocation | null> {
    try {
      const query = { [field]: value };
      return await this.userLocationModel.findOne(query).exec();
    } catch (error) {
      console.log('Error fetching survey data by Question: ', error);
      throw error;
    }
  }

  async update(
    id: string,
    Question: Partial<UserLocation>,
  ): Promise<UserLocation> {
    try {
      return await this.userLocationModel
        .findByIdAndUpdate(id, Question, {
          new: true,
        })
        .exec();
    } catch (error) {
      console.log('Error updating all survey data: ', error);
      throw error;
    }
  }

  async delete(id: string): Promise<UserLocation> {
    try {
      return await this.userLocationModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.log('Error fetching all survey data: ', error);
      throw error;
    }
  }
}
