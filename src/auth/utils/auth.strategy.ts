import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { Observable } from 'rxjs';

dotenv.config();

/**
 * AuthGuard class that is used for protecting every route
 * Checks for access toke, decodes it, attaches it to request as request.user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log(process.env.JWT_EXPIRATION);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_EXPIRATION,
      passReqToCallback: true,
    });
  }
  async validate(
    req: Request,
    payload: Record<string, string>,
  ): Promise<Record<string, string>> {
    try {
      console.log('payload: ', payload);
      const userAgent = req.headers['user-agent'];
      const forwarded = req.ips;
      let clientIp: string | null;
      if (forwarded) {
        clientIp = forwarded[0];
      } else if (req.socket.remoteAddress) {
        clientIp = req.socket.remoteAddress;
        if (clientIp.startsWith('::ffff:'))
          clientIp = clientIp.split('::ffff:')[1];
      } else {
        clientIp = req.ip;
      }
      if (!userAgent) {
        throw new ForbiddenException('Missing User-Agent');
      }
      if (clientIp !== payload['clientIp']) {
        throw new UnauthorizedException('access token malformed');
      }
      if (userAgent !== payload['userAgent']) {
        throw new UnauthorizedException('access token malformed');
      }
      if (payload['type'] !== 'access') {
        throw new UnauthorizedException('only access token allowed');
      }
      return payload;
    } catch (error) {
      console.error('Error decoding verifying token: ', error);
      throw error;
    }
  }
}

@Injectable()
export class JwtStrateggyGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.headers);
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    console.log(err, info, context, status);
    return user;
  }
}
