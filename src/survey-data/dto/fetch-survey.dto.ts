import { ApiProperty } from '@nestjs/swagger';

export class FetchQuestionsResponse {
  constructor(partial: Partial<FetchQuestionsResponse>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Question data retrieved successful',
  })
  message: string;

  @ApiProperty({
    example: [
      {
        id: '9989ko',
        question: 'What is the main source of water in this area?',
        type: 'radio',
        options: ['Borehole', 'River'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  })
  data: Record<string, any>;
}
export class FetchDiseasesResponse {
  constructor(partial: Partial<FetchDiseasesResponse>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Disease data retrieved successfully',
  })
  message: string;

  @ApiProperty({
    example: [
      {
        id: '9989ko',
        name: 'cholera',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  })
  data: Record<string, any>;
}
