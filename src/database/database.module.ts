import { Logger, Module } from '@nestjs/common';
import { Database } from './database';
import { DatabaseAdmin } from './admin/database-admin';
import { ConfigHelper } from 'src/config/config.helper';

@Module({
  providers: [Database, DatabaseAdmin, Logger, ConfigHelper],
  exports: [Database, DatabaseAdmin],
})
export class DatabaseModule {}
