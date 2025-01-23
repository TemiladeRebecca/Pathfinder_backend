import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'postgres',
        uri: process.env.DATABASE_URL,
        autoLoadModels: true,
        synchronize: false,
        models: [],
      }),
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
