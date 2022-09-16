import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  public async get() {
    const data = await this.repo.getById(1);
    console.log(data);
  }
}
