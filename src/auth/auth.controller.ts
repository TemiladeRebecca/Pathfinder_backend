import { Controller, Post, Get, HttpCode, Header, Body } from '@nestjs/common';
import { Request } from 'express';

import { RegisterUserSchema } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  @Get()
  async findAll(request: Request): Promise<string> {
    return request.url;
  }

  @Post()
  @HttpCode(201)
  @Header('Content-Type', 'application/json')
  async registeration(
    @Body() registerUser: RegisterUserSchema,
  ): Promise<object> {
    return await register(registerUser);
  }
}
