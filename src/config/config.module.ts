import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { EnvironmentConstants } from 'src/common/environment.constants';
import { Environment } from 'src/common/environment.types';
import { getEnvPath } from 'src/common/helpers/environment.helper';
import { isEnumValue } from 'src/types/guards/enums';
import { appConfig } from './app.config';
import * as Joi from 'joi';
import * as path from 'path';

const environment: string | undefined = process.env.NODE_ENV;
if (!environment || !isEnumValue<Environment>(environment, EnvironmentConstants.environmentValues)) {
  throw new Error(
    `Environment '${environment}' not valid, run ${EnvironmentConstants.environmentValues
      .map((e) => `'export NODE_ENV=${e}'`)
      .join(' OR ')} on host machine`,
  );
}

const envFilePath: string = getEnvPath(path.join('src', 'common', 'environments'), Environment.Development);
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
