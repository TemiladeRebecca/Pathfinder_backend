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
    criteria.createdAt = new Date();
    criteria.updatedAt = new Date();
    try {
      const userSessionExists = await this.findUserSession(
        'userId',
        criteria.userId,
      );
      if (userSessionExists) {
        const result = await this.updateUserSession(
          criteria.userId,
          criteria.token,
        );
        return await result;
      }
      const result = new this.userSessionModel(criteria);
      const newUser = await result.save();
      return newUser;
    } catch (error) {
      console.error('Error creating UserSession: ', error);

      throw error;
    }
  }
  async findUserSession(
    field: keyof UserSession,
    value: any,
  ): Promise<UserSession> {
    try {
      const query = { [field]: value };
      const foundUser = await this.userSessionModel.findOne(query).exec();
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

  async deleteUserSession(userId: string): Promise<boolean> {
    try {
      const isDeleted = await this.userSessionModel.deleteOne({ userId });
      return isDeleted.deletedCount === 1;
    } catch (error) {
      console.error('Error deleting UserSession: ', error);
      throw error;
    }
  }
}
