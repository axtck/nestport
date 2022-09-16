import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/database';

@Injectable()
export class Repository {
  constructor(public database: Database) {}
}
