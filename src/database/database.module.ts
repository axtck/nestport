import { Module } from '@nestjs/common';

// const dbProvider = {
//   provide: PG_CONNECTION,
//   useValue: new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'somedb',
//     password: 'meh',
//     port: 5432,
//   }),
// };
@Module({
  exports: [],
})
export class DatabaseModule {}
