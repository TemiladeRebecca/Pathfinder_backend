import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Disease, DiseaseDocument } from './survey.model';
import { Model } from 'mongoose';

@Injectable()
export class DiseaseService {
  constructor(
    @InjectModel(Disease.name)
    private diseaseModel: Model<DiseaseDocument>,
  ) {}
  async createSurvey(Disease: Disease): Promise<Disease | any> {
    try {
      const createdSurvey = new this.diseaseModel(Disease);
      return await createdSurvey.save();
    } catch (error) {
      console.log('Error creating survey data: ', error);
      throw error;
    }
  }

  async findAll(): Promise<Disease[]> {
    try {
      return await this.diseaseModel.find().exec();
    } catch (error) {
      console.log('Error fetching all survey data: ', error);
      throw error;
    }
  }
  async findByDisease(
    field: keyof Disease,
    value: any,
  ): Promise<Disease | null> {
    try {
      const query = { [field]: value };
      return await this.diseaseModel.findOne(query).exec();
    } catch (error) {
      console.log('Error fetching survey data by disease: ', error);
      throw error;
    }
  }
  async update(id: string, Disease: Partial<Disease>): Promise<Disease> {
    try {
      return await this.diseaseModel
        .findByIdAndUpdate(id, Disease, {
          new: true,
        })
        .exec();
    } catch (error) {
      console.log('Error updating all survey data: ', error);
      throw error;
    }
  }
  async delete(id: string): Promise<Disease> {
    try {
      return await this.diseaseModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.log('Error fetching all survey data: ', error);
      throw error;
    }
  }
}
