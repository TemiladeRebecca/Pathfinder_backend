import { Module } from '@nestjs/common';

import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UsersController } from './user.controller';

@Module({
  imports: [UserModule],
  providers: [UserService],
  controllers: [UsersController],
})
export class UserHttpModule {}
