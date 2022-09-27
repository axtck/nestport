import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Database } from './database';
import { DatabaseAdmin } from './admin/database-admin';

@Module({
  providers: [Database, DatabaseAdmin, Logger],
  exports: [Database, DatabaseAdmin],
  imports: [ConfigModule],
})
export class DatabaseModule {}
