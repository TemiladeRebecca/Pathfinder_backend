import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResponse {
  constructor(partial: Partial<RefreshTokenResponse>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Token refreshed successfully',
  })
  message: string;

  @ApiProperty({
    example: {
      accessToken: 'e2332e2r43d4d34d23dx2d.xddxwx2...',
      expiresAt: Math.floor((Date.now() + 10 * 60 * 1000) / 1000),
      type: 'bearer',
    },
  })
  data: Record<string, any>;
}
