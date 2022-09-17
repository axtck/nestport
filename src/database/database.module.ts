import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Database } from './database';

@Module({
  providers: [Database],
  exports: [Database],
  imports: [ConfigModule],
})
export class DatabaseModule {}
