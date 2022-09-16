import { Module } from '@nestjs/common';
import { Pool } from 'pg';

export const PG_CONNECTION = 'PG_CONNECTION';
const dbProvider = {
  provide: PG_CONNECTION,
  useValue: new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'developmentdb',
    password: 'admin',
    port: 5433,
  }),
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
