import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Validate,
} from 'class-validator';
import { uuidv7 } from 'uuidv7';
import { ValidateRegisterUser } from './utils/utils.dto';

export class RegisterUserDto {
  @Validate(ValidateRegisterUser)
  validateAllFields: boolean;

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

  @ApiProperty({
    example: 'Johnson1234#',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  constructor(partial: Partial<RegisterUserDto>) {
    Object.assign(this, partial);
  }
}
export class RegisterUserResponse {
  constructor(partial: Partial<RegisterUserResponse>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: 201,
  })
  statusCode: number;

  @ApiProperty({
    example: 'User registered successfully',
  })
  message: string;

  @ApiProperty({
    example: {
      id: uuidv7(),
      email: 'johnson@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  data: Record<string, any>;
}
