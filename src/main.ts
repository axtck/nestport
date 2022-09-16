import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

const bootstrap = async () => {
  const app: INestApplication = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  const port: number | undefined = configService.get<number>('app.port');
  const environment: number | undefined = configService.get<number>('app.environment');

  if (!port) throw new Error('NODE_PORT not configured');
  await app.listen(port);

  Logger.log(`Listening on port ${port}, evironment: ${environment}`, bootstrap.name);
};

bootstrap();
