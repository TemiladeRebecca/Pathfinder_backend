import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto, RegisterUserResponse } from './dto/register.dto';
import {
  SwaggerBadRequest,
  SwaggerInternalserverError,
} from 'src/utils/api-responses';
import { LoginUserDto, LoginUserResponse } from './dto/login.dto';
import { User } from 'src/user/user.model';
import { AuthService } from './auth.service';
import { RefreshTokenDecorator } from './utils/auth.refresh-token.decorator';
import { RefreshTokenResponse } from './dto/refresh-token-dto';
import { UserSessionService } from 'src/user/user.session.service';
import { Response } from 'express';

@Controller('auth')
@ApiTags('AUTH')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private userSessionService: UserSessionService,
  ) {}

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

  @Post('login')
  @ApiOperation({
    summary: 'Logs in a User',
  })
  @ApiResponse({
    example: LoginUserResponse,
    type: LoginUserResponse,
    status: 201,
  })
  @ApiResponse(SwaggerBadRequest)
  @ApiResponse(SwaggerInternalserverError)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async LoginUser(
    @Body() schema: LoginUserDto,
    @Request() request: any,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const foundUser = await this.userService.findUser({
        email: schema.email,
      });
      if (!foundUser) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isValidPassword = await User.verifyPassword(
        schema.password,
        (await foundUser).password,
      );
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }
      let clientIp = request.headers['x-forwarded-for'];
      if (clientIp) {
        clientIp = clientIp.split(',')[0].trim();
      } else {
        clientIp = request.socket.remoteAddress;
        if (clientIp.startsWith('::ffff:'))
          clientIp = clientIp.split('::ffff:')[1];
      }
      const payload = {
        userId: foundUser._id,
        userAgent: request.headers['user-agent'],
        clientIp,
        type: 'access',
      };
      const accessToken = await this.authService.generateToken(payload);
      payload.type = 'refresh';
      const refreshToken = await this.authService.generateToken(
        payload,
        'refresh',
      );
      const hashedToken = await this.authService.hashToken(refreshToken);
      await this.userSessionService.createUserSession({
        userId: foundUser._id,
        token: hashedToken,
      });
      response.setHeader('X-Refresh-Token', refreshToken);
      return response.status(200).json(
        new LoginUserResponse({
          statusCode: 200,
          message: 'Login successful',
          data: {
            user: {
              email: foundUser.email,
              createdAt: foundUser.createdAt,
              updatedAt: foundUser.updatedAt,
              id: foundUser._id,
            },
            accessToken: {
              token: accessToken,
              expiresAt: Math.floor((Date.now() + 10 * 60 * 1000) / 1000),
              expiresIn: '10m',
              expiration: new Date(Date.now() + 10 * 60 * 1000),
              type: 'bearer',
            },
          },
        }),
      );
    } catch (error) {
      console.error('Error registering user: ', error);
      throw error;
    }
  }

  @Post('refresh-token')
  @ApiHeader({
    name: 'X-Refresh-Token',
    description: 'A custom header for this endpoint',
    required: true, // Indicates that this header is mandatory
  })
  @ApiOperation({
    summary: 'Refreshes Tokens',
  })
  @ApiResponse({
    example: RefreshTokenResponse,
    type: RefreshTokenResponse,
    status: 200,
  })
  @ApiResponse(SwaggerBadRequest)
  @ApiResponse(SwaggerInternalserverError)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async refreshToken(
    @Request() request: any,
    @RefreshTokenDecorator() refreshToken: string,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const payload: Record<string, any> = await this.authService.verifyToken(
        refreshToken,
        request,
      );
      const userSession = await this.userSessionService.findUserSession(
        'userId',
        payload['userId'],
      );
      if (userSession === undefined || userSession === null) {
        throw new BadRequestException('Invalid Session. Please Login again');
      }
      const isValidToken = await this.authService.verifyHashedToken(
        refreshToken,
        userSession.token,
      );
      if (!isValidToken) {
        throw new ForbiddenException('Invalid refresh-Token');
      }
      const accessToken = await this.authService.generateToken({
        userId: payload.userId,
        userAgent: payload.userAgent,
        clientIp: payload.clientIp,
        type: 'access',
      });
      payload.type = 'refresh';
      const newRefreshToken = await this.authService.generateToken({
        userId: payload.userId,
        userAgent: payload.userAgent,
        clientIp: payload.clientIp,
        type: 'refresh',
      });
      const hashedToken = await this.authService.hashToken(newRefreshToken);
      await this.userSessionService.updateUserSession(
        payload['userId'],
        hashedToken,
      );
      response.setHeader('X-Refresh-Token', newRefreshToken);
      return response.status(200).json(
        new RefreshTokenResponse({
          statusCode: 200,
          message: 'Tokens refreshed successfully',
          data: {
            accessToken,
            expiresAt: Math.floor((Date.now() + 10 * 60 * 1000) / 1000),
            type: 'bearer',
          },
        }),
      );
    } catch (error) {
      console.error('Error registering user: ', error);
      throw error;
    }
  }
}
