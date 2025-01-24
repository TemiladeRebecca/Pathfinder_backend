import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const connectionString: string =
          configService.get<string>('DATABASE_URI');
        return {
          uri: connectionString,
          maxPoolSize: 5,
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
