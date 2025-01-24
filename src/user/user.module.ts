import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UserModule {}
