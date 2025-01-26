import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLocationSchema } from './location.model';
import { UserLocationService } from './userLocation.service';
import { UserLocationControler } from './userLocation.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserLocation.name, schema: UserLocationSchema },
    ]),
  ],
  controllers: [UserLocationControler],
  providers: [UserLocationService],
  exports: [UserLocationService],
})
export class UserLocation {}
