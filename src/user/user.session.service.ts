import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSession, UserSessionDocument } from './user-session.model';
import { Model } from 'mongoose';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectModel(UserSession.name)
    private userSessionModel: Model<UserSessionDocument>,
  ) {}

  async createUserSession(
    criteria: Partial<UserSession>,
  ): Promise<UserSession | any> {
    try {
      criteria.createdAt = new Date();
      criteria.updatedAt = new Date();
      const result = new this.userSessionModel(criteria);
      const newUser = await result.save();
      return newUser;
    } catch (error) {
      console.error('Error creating UserSession: ', error);

      throw error;
    }
  }
  async findUser(userId: string): Promise<UserSession | any> {
    try {
      const foundUser = this.userSessionModel.findOne({ userId }).exec();
      return foundUser;
    } catch (error) {
      console.error('Error fetching UserSession: ', error);
      throw error;
    }
  }

  async updateUserSession(userId: string, token: string): Promise<any> {
    try {
      const result = await this.userSessionModel
        .updateOne({ userId }, { $set: { token, updatedAt: new Date() } })
        .exec();
      if (result.modifiedCount === 0) {
        console.warn(`No UserSession found for userId: ${userId}`);
      }

      return result;
    } catch (error) {
      console.error('Error updating UserSession: ', error);
      throw error;
    }
  }
}
