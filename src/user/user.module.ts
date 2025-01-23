import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';

@Module({
  providers: [],
  controllers: [UsersController],
})
export class UserModule {}
