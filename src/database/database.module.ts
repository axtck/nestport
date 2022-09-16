import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const PG_CONNECTION = Symbol.for('PG_CONNECTION');

const dbProvider: Provider = {
  provide: PG_CONNECTION,
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
  providers: [dbProvider],
  exports: [dbProvider],
  imports: [ConfigModule],
})
export class DatabaseModule {}
