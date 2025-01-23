import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api/v1', { exclude: ['/', 'docs'] });

  app.enable('trust proxy');
  app.enableCors();

  const logger = new Logger();

  const options = new DocumentBuilder()
    .setTitle('Path Finder API')
    .setDescription('API DOcs for Path Finder')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const docs = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, docs);

  const port = app.get<ConfigService>(ConfigService).get<number>('PORT');

  await app.listen(port ?? 7003);

  logger.log({
    message: 'server started ✔',
    port,
    url: `http://localhost:${port}/docs`,
  });
}
bootstrap().catch((err) => {
  console.log('Error during boostrap: ', err);
  process.exit(1);
});
