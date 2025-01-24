import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { JwtPayload } from './interfaces/auth.jwt';

@Injectable()
export class AUthService {
  constructor(private readonly jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = process.env.BCRYPT_SALT_ROUNDS ?? 10;
    return bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(
    plainPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashPassword);
  }

  async generateToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION || '1h',
    });
  }
}
