import { Inject, Injectable } from '@nestjs/common';
import { Database } from 'src/database/database';
import { DatabaseConstants } from 'src/database/database.constants';

@Injectable()
export class UsersService {
  constructor(private readonly database: Database) {}

  public async get() {
    const data = await this.database.query<{ name: string }>('select * from users');
    console.log(data);
  }
}
