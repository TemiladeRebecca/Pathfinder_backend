import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.model';
import { Model } from 'mongoose';
import { FindUserT } from './interfaces/find-user-interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(criteria: Partial<User>): Promise<User | any> {
    try {
      criteria.createdAt = new Date();
      criteria.updatedAt = new Date();
      criteria.password = await User.setPassword(criteria.password);
      const result = new this.userModel(criteria);
      const newUser = await result.save();
      // newUser.id = newUser._id;
      return newUser;
    } catch (error) {
      console.error('Error creating User: ', error);
      if (error.code === 11000) {
        throw new ConflictException('Email already in use');
      }

      throw error;
    }
  }
  async findUser(criteria: FindUserT): Promise<User | any> {
    try {
      const where = {
        ...(criteria.id && { id: criteria.id }),
        ...(criteria.email && { email: criteria.email }),
      };
      const foundUser = this.userModel.findOne(where).exec();
      return foundUser;
    } catch (error) {
      console.error('Error fetching User: ', error);
      throw error;
    }
  }
}
