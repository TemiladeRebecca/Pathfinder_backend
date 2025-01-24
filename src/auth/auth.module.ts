import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.model';
import { AuthService } from './auth.service';
import { UserSessionService } from 'src/user/user.session.service';
import { UserSession, UserSessionSchema } from 'src/user/user-session.model';
import { JwtStrategy } from './utils/auth.strategy';

@Module({
  imports: [
    ConfigModule,
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
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  providers: [UserService, AuthService, UserSessionService, JwtStrategy],
  exports: [PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
