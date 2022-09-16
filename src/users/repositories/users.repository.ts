import { Injectable } from '@nestjs/common';
import { Repository } from 'src/core/repository';
import { Id, QueryString } from 'src/types/core.types';

@Injectable()
export class UsersRepository extends Repository {
  public async getById(userId: Id) {
    const getQuery: QueryString = `
      select * from users where id = $1
    `;

    const userDao = await this.database.queryOne(getQuery, [userId]);
    return userDao;
  }
}
