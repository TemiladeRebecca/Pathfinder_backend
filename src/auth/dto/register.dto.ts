import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterUserSchema {
  @ApiProperty({
    example: 'johnson@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'johnson@email.com',
  })
  @IsOptional()
  @IsString()
  first_name: string;

  @ApiProperty({
    example: 'johnson@email.com',
  })
  @IsOptional()
  @IsString()
  last_name: string;

  @ApiProperty({
    example: 'johnson@email.com',
  })
  @IsOptional()
  @IsString()
  password: string;
  confirm_password: string;
}
export class LoginUserSchema {
  email: string;
  password: string;
}
