import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { appConfig } from './app.config';
import { Environment } from 'src/common/environment.types';
import * as path from 'path';
import * as Joi from 'joi';
import { getEnvPath } from 'src/common/helpers/environment.helper';

const envFilePath: string = getEnvPath(path.join('src', 'common', 'environments'));
const validationSchema = Joi.object({
  // app
  NODE_ENV: Joi.valid(...Object.values(Environment)).required(),
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
