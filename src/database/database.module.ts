import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DatabaseConstants } from './database.constants';
import { Database } from './database';

const dbProvider: Provider = {
  provide: DatabaseConstants.TYPES.Connection,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Pool => {
    return new Pool({
      host: configService.get<string>('database.host'),
      port: configService.get<number>('database.port'),
      user: configService.get<string>('database.user'),
      database: configService.get<string>('database.database'),
      password: configService.get<string>('database.password'),
    });
  },
};

@Module({
  providers: [dbProvider, Database],
  exports: [dbProvider, Database],
  imports: [ConfigModule],
})
export class DatabaseModule {}
