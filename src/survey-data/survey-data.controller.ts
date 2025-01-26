import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  SwaggerBadRequest,
  SwaggerInternalserverError,
} from 'src/utils/api-responses';
import { QuestionService } from './question.service';
import { DiseaseService } from './disease.service';
import {
  FetchDiseasesResponse,
  FetchQuestionsResponse,
} from './dto/fetch-survey.dto';
import { JwtStrateggyGuard } from 'src/auth/utils/auth.strategy';
import {
  CreateDiseaseDto,
  CreateQuestionDto,
  CreateSurveyDiseaseResponse,
  CreateSurveyQuestionResponse,
} from './dto/create-survey-dto';

@UseGuards(JwtStrateggyGuard)
@Controller('survey-data')
@ApiTags('SURVEY DATA')
@ApiBearerAuth('access-token')
export class SurveyDataController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly diseaseService: DiseaseService,
  ) {}

  @Get('diseases')
  @ApiOperation({
    summary: 'Retrieves all diseases',
  })
  @ApiResponse({
    example: FetchDiseasesResponse,
    type: FetchDiseasesResponse,
    status: 201,
  })
  @ApiResponse(SwaggerBadRequest)
  @ApiResponse(SwaggerInternalserverError)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async fetchDiseases(): Promise<any> {
    try {
      const diseases = await this.diseaseService.findAll();

      return new FetchDiseasesResponse({
        statusCode: 200,

        message: 'Disease data retrieved successfully',
        data: diseases.map((d: any) => {
          return {
            id: d.id,
            name: d.name,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
          };
        }),
      });
    } catch (error) {
      console.log('Error fetching diseases: ', error);
      throw error;
    }
  }
  @Post('diseases')
  @ApiOperation({
    summary: 'Creates a disease',
  })
  @ApiResponse({
    example: CreateSurveyDiseaseResponse,
    type: CreateSurveyDiseaseResponse,
    status: 201,
  })
  @ApiResponse(SwaggerBadRequest)
  @ApiResponse(SwaggerInternalserverError)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createDiseases(
    @Body() schema: CreateDiseaseDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const pass = req.headers['x-api-key'];
      if (pass !== 'supersecret') {
        throw new ForbiddenException();
      }
      const diseases = await this.diseaseService.createSurvey(schema);

      return new CreateSurveyDiseaseResponse({
        statusCode: 201,

        message: 'Disease data created successfully',
        data: {
          id: diseases.id,
          name: diseases.name,
          createdAt: diseases.createdAt,
          updatedAt: diseases.updatedAt,
        },
      });
    } catch (error) {
      console.log('Error fetching diseases: ', error);
      throw error;
    }
  }

  @UseGuards(JwtStrateggyGuard)
  @Get('diseases/:diseaseId/questions')
  @ApiOperation({
    summary: 'Retrieves all questions related to a disease',
  })
  @ApiResponse({
    example: FetchQuestionsResponse,
    type: FetchQuestionsResponse,
    status: 201,
  })
  @ApiResponse(SwaggerBadRequest)
  @ApiResponse(SwaggerInternalserverError)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async fetchQuestions(@Param('diseaseId') diseaseId: string): Promise<any> {
    try {
      const question = await this.questionService.findAll(diseaseId);

      return new FetchQuestionsResponse({
        statusCode: 200,

        message: 'Question data retrieved successfully',
        data: question.map((q: any) => {
          return {
            id: q.id,
            diseaseId: q.diseaseId,
            question: q.question,
            type: q.type,
            options: q.options || null,
            placeholder: q.placeholder || null,
            createdAt: q.createdAt,
            updatedAt: q.updatedAt,
          };
        }),
      });
    } catch (error) {
      console.log('Error fetching Question: ', error);
      throw error;
    }
  }

  @UseGuards(JwtStrateggyGuard)
  @Post('diseases/:diseaseId/questions')
  @ApiOperation({
    summary: 'Creates a question for a disease',
  })
  @ApiResponse({
    example: CreateSurveyQuestionResponse,
    type: CreateSurveyQuestionResponse,
    status: 201,
  })
  @ApiResponse(SwaggerBadRequest)
  @ApiResponse(SwaggerInternalserverError)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createQuestion(
    @Param('diseaseId') diseaseId: string,
    @Body() schema: CreateQuestionDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const pass = req.headers['x-api-key'];
      if (pass !== 'supersecret') {
        throw new ForbiddenException();
      }
      const question = await this.questionService.createSurvey(
        diseaseId,
        schema,
      );

      return new CreateSurveyQuestionResponse({
        statusCode: 200,

        message: 'Question data created successfully',
        data: {
          id: question.id,
          diseaseId: question.diseaseId,
          question: question.question,
          type: question.type,
          options: question.options || null,
          placeholder: question.placeholder || null,
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
        },
      });
    } catch (error) {
      console.log('Error fetching Question: ', error);
      throw error;
    }
  }
}
