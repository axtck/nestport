import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from './database/database.module';

@Injectable()
export class AppService {
  constructor(@Inject(PG_CONNECTION) private readonly connection: Pool) {}
  async getHello(): Promise<string> {
    const res = await this.connection.query('select * from users');
    console.log(res);
    return '';
  }
}
