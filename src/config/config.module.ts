import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { getEnvPath } from 'src/common/helpers/env.helper';
import { appConfig } from './app.config';
import * as path from 'path';

const envFilePath: string = getEnvPath(path.join('src', 'common', 'environments'));

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: envFilePath,
      isGlobal: true,
      load: [appConfig],
    }),
  ],
})
export class ConfigModule {}
