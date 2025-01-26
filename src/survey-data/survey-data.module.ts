import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Question,
  QuestionSchema,
  Disease,
  DiseaseSchema,
} from './survey.model';
import { SurveyDataController } from './survey-data.controller';
import { DiseaseService } from './disease.service';
import { QuestionService } from './question.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/utils/auth.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Disease.name, schema: DiseaseSchema },
    ]),
    JwtModule,
  ],
  controllers: [SurveyDataController],
  providers: [DiseaseService, QuestionService, JwtStrategy],
  exports: [DiseaseService, QuestionService],
})
export class DiseaseModule {}
