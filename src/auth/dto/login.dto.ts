import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { uuidv7 } from 'uuidv7';

export class LoginUserDto {
  @ApiProperty({
    example: 'johnson@email.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Johnson1234#',
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  constructor(partial: Partial<LoginUserDto>) {
    Object.assign(this, partial);
  }
}
export class LoginUserResponse {
  constructor(partial: Partial<LoginUserResponse>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Login successful',
  })
  message: string;

  @ApiProperty({
    example: {
      user: {
        id: uuidv7(),
        email: 'johnson@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      accessToken: {
        token: 'e2332e2r43d4d34d23dx2d.xddxwx2...',
        expiresAt: Math.floor((Date.now() + 10 * 60 * 1000) / 1000),
        type: 'bearer',
      },
      refreshToken: {
        token: 'e2332e2r43d4d34d23dx2d.xddxwx2...',
        type: 'x-refresh-token',
      },
    },
  })
  data: Record<string, any>;
}
