import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}
