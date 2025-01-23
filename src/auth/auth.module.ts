import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule,
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
  providers: [],
  exports: [],
  controllers: [AuthController],
})
export class AuthModule {}
