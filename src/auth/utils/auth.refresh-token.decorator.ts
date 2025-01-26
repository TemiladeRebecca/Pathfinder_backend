import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

/**
 * Custom Decorator to retrieve x-refresh-token from header
 * and populate it to refresh-token router
 */
export const RefreshTokenDecorator = createParamDecorator(
  (_: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const refreshToken = request.headers['x-refresh-token'];
    const userAgent = request.headers['user-agent'];
    if (!refreshToken) {
      throw new ForbiddenException('Missing x-refresh-token header');
    }
    if (!userAgent) {
      throw new BadRequestException('Missing user-agent');
    }

    return refreshToken;
  },
);
