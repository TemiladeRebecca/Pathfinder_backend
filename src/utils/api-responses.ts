import { ApiProperty } from '@nestjs/swagger';

export class InternalServerError {
  @ApiProperty({ description: 'The status code of the error', example: 500 })
  statusCode: number;

  @ApiProperty({
    description: 'A message describing the error',
    example: 'Internal Server Error',
  })
  message: string;

  @ApiProperty({
    description: 'Data from the error if any',
    example: {},
  })
  data?: object;
}
export class BadRequestServerError {
  @ApiProperty({ description: 'The status code of the error', example: 400 })
  statusCode: number;

  @ApiProperty({
    description: 'A message describing the error',
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    description: 'Data from the error if any',
    example: {},
  })
  data?: object;
}
export class UnauthorizedError {
  @ApiProperty({ description: 'The status code of the error', example: 401 })
  statusCode: number;

  @ApiProperty({
    description: 'A message describing the error',
    example: 'Unauthorized',
  })
  message: string;

  @ApiProperty({
    description: 'Data from the error if any',
    example: {},
  })
  data?: object;
}
export class ForbiddenError {
  @ApiProperty({ description: 'The status code of the error', example: 403 })
  statusCode: number;

  @ApiProperty({
    description: 'A message describing the error',
    example: 'Forbidden',
  })
  message: string;

  @ApiProperty({
    description: 'Data from the error if any',
    example: {},
  })
  data?: object;
}

export const SwaggerBadRequest = {
  status: 400,
  example: BadRequestServerError,
  description: 'Bad Request',
  type: BadRequestServerError,
};

export const SwaggerInternalserverError = {
  status: 500,
  example: InternalServerError,
  description: 'Internal Server Error',
  type: InternalServerError,
};

export const SwaggerForbidden = {
  status: 403,
  example: ForbiddenError,
  description: 'Forbidden',
  type: ForbiddenError,
};

export const SwaggerUnauthorized = {
  status: 401,
  example: UnauthorizedError,
  description: 'Unauthorized',
  type: UnauthorizedError,
};
