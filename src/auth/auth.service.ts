import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private secretKey = process.env.TOKEN_HASH_SECRET;

  async generateToken(
    payload: {
      userId: string;
      userAgent: string;
      clientIp: string;
      type: string;
    },
    tokenType: string = 'access',
  ): Promise<string> {
    try {
      let token: string;
      if (tokenType === 'refresh') {
        token = this.jwtService.sign(payload, {
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
        });
      }
      if (tokenType === 'access') {
        token = this.jwtService.sign(payload);
      }
      return token;
    } catch (error) {
      console.error('Error generating token: ', error);
      throw error;
    }
  }

  async hashToken(token: string): Promise<string> {
    try {
      return createHmac('sha256', this.secretKey).update(token).digest('hex');
    } catch (error) {
      console.error('Error hashing token: ', error);
      throw error;
    }
  }

  async verifyHashedToken(token: string, tokenHash: string): Promise<boolean> {
    try {
      return (await this.hashToken(token)) === tokenHash;
    } catch (error) {
      console.error('Error verifying token hash: ', error);
      throw error;
    }
  }

  async verifyToken(token: string, request: any): Promise<any> {
    try {
      let clientIp = request.headers['x-forwarded-for'];
      if (clientIp) {
        clientIp = clientIp.split(',')[0].trim();
      } else {
        clientIp = request.socket.remoteAddress;
        if (clientIp.startsWith('::ffff:'))
          clientIp = clientIp.split('::ffff:')[1];
      }
      const userAgent = request.headers['user-agent'];
      const payload = this.jwtService.verify(token);
      if (userAgent !== payload['userAgent']) {
        throw new ForbiddenException('Token malformed');
      }
      if (clientIp !== payload['clientIp']) {
        throw new ForbiddenException('Token malformed');
      }
      return payload;
    } catch (error) {
      console.error('Error verifying access token: ', error);
      throw error;
    }
  }
}
