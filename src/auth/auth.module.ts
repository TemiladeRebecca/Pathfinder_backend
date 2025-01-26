import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/user.model';
import { AuthService } from './auth.service';
import { UserSessionService } from 'src/user/user.session.service';
import { UserSession, UserSessionSchema } from 'src/user/user-session.model';
import { JwtStrategy } from './utils/auth.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    MongooseModule.forFeature([
      { name: UserSession.name, schema: UserSessionSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        const jwtExpiry = {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        };
        if (!jwtExpiry || !jwtSecret) {
          throw new Error(
            `Error retrieving env variables jwtSecret and jwtExpiry`,
          );
        }

        return {
          secret: jwtSecret,
          signOptions: jwtExpiry,
          secretOrPublicKey: jwtSecret,
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],

  providers: [JwtStrategy, UserService, AuthService, UserSessionService],
  exports: [PassportModule, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
