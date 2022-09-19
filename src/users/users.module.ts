import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UsersRepository],
  imports: [DatabaseModule],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
