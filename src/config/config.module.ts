import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { appConfig } from './app.config';
import { Environment } from 'src/common/environment.types';
import { getEnvPath, logExportCommands } from 'src/common/helpers/environment.helper';
import { EnvironmentConstants } from 'src/common/environment.constants';
import { isEnumValue } from 'src/types/guards/enums';
import * as path from 'path';
import * as Joi from 'joi';

const environment: string | undefined = process.env.NODE_ENV;

if (!environment) {
  throw new Error(`Environment not set (${logExportCommands(EnvironmentConstants.environmentValues)})`);
}

if (!isEnumValue<Environment>(environment, EnvironmentConstants.environmentValues)) {
  throw new Error(`Invalid environment ${environment}, ${logExportCommands(EnvironmentConstants.environmentValues)}`);
}

const envFilePath: string = getEnvPath(path.join('src', 'common', 'environments'), environment);
const validationSchema = Joi.object({
  // app
  NODE_ENV: Joi.valid(...EnvironmentConstants.environmentValues).required(),
  NODE_PORT: Joi.number().required(),
});

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: envFilePath,
      isGlobal: true,
      load: [appConfig],
      validationSchema: validationSchema,
    }),
  ],
})
export class ConfigModule {}
