import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.model';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        const jwtExpiry = {
          expiresIn: configService.get<string>('JWT_EXPIRE'),
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
  providers: [UserService],
  exports: [],
  controllers: [AuthController],
})
export class AuthModule {}
