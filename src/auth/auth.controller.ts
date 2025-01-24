import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto, RegisterUserResponse } from './dto/register.dto';
import {
  SwaggerBadRequest,
  SwaggerInternalserverError,
} from 'src/utils/api-responses';

@Controller('auth')
@ApiTags('AUTH')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new User',
  })
  @ApiResponse({
    example: RegisterUserResponse,
    type: RegisterUserResponse,
    status: 201,
  })
  @ApiResponse(SwaggerBadRequest)
  @ApiResponse(SwaggerInternalserverError)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async registerUser(
    @Body() schema: RegisterUserDto,
  ): Promise<RegisterUserResponse> {
    try {
      const newUser = this.userService.createUser(schema);
      return new RegisterUserResponse({
        statusCode: 201,
        message: 'User Registered successfully',
        data: {
          email: (await newUser).email,
          createdAt: (await newUser).createdAt,
          updatedAt: (await newUser).updatedAt,
          id: (await newUser)._id,
        },
      });
    } catch (error) {
      console.error('Error registering user: ', error);
      throw error;
    }
  }
}
