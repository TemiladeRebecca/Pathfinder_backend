import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    example: 'What is the main source of water in this area?',
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  question: string;

  @ApiProperty({
    example: 'radio',
  })
  @IsEnum(['radio', 'number'], {
    message: `type must be one of ${['radio', 'number']}`,
  })
  type: string;

  @ApiProperty({
    example: ['Borehole', 'River'],
  })
  @IsOptional()
  @IsArray()
  options?: string[];

  @ApiProperty({
    example: 'Enter a number',
  })
  @IsOptional()
  @IsString()
  placeholder?: string;
}

export class CreateDiseaseDto {
  @ApiProperty({
    example: 'Cholera',
  })
  @IsString()
  @Length(3, 40)
  name: string;
}

export class CreateSurveyDiseaseResponse {
  constructor(partial: Partial<CreateSurveyDiseaseResponse>) {
    Object.assign(this, partial);
  }
  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Disease data created successful',
  })
  message: string;

  @ApiProperty({
    example: {
      id: '23442342534544fwedw',
      name: 'cholera',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  data: Record<string, any>;
}

export class CreateSurveyQuestionResponse {
  constructor(partial: Partial<CreateSurveyQuestionResponse>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Question data created successful',
  })
  message: string;

  @ApiProperty({
    example: {
      id: '9989ko',
      question: 'What is the main source of water in this area?',
      type: 'radio',
      options: ['Borehole', 'River'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  data: Record<string, any>;
}
