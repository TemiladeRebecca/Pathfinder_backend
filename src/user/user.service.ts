import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { User } from './user.model';
import { Where, UserPagination } from './interfaces/userService';

@Injectable()
export class UserService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findOne(where: Where): Promise<User> {
    return this.userModel.findOne({
      where: where,
    });
  }

  async findAll(pagination: UserPagination): Promise<User[]> {
    return this.userModel.findAll();
  }

  async remove(where: Where): Promise<void> {
    const user = await this.findOne(where);
    await user.destroy();
  }
}
