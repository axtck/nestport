import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { AppModule } from './app.module';
import { DatabaseAdmin } from './database/admin/database-admin';

const bootstrap = async (): Promise<void> => {
  const app: INestApplication = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const databaseAdmin: DatabaseAdmin = app.get(DatabaseAdmin);

  await databaseAdmin.setSchema();

  // at runtime, this will point to dist/migrations
  const migrationsFolderPath: string = path.join(__dirname, 'database', 'migrations');
  await databaseAdmin.runMigrations(migrationsFolderPath);

  const port: number = configService.get<number>('app.port') as number;
  const environment: number = configService.get<number>('app.environment') as number;

  await app.listen(port);

  Logger.log(`Listening on port ${port}, evironment: ${environment}`, bootstrap.name);
};

void bootstrap();
