import { Injectable } from '@nestjs/common';
import { Repository } from 'src/core/repository';

@Injectable()
export class DatabaseAdminRepository extends Repository {
  // TODO: move queries to repo
}
