import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserLocationService } from './userLocation.service';

@Controller('locations')
@ApiTags('LOACTIONS')
export class UserLocationControler {
  constructor(private userLocationService: UserLocationService) {}
}
