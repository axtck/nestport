import { Injectable } from '@nestjs/common';
import { Repository } from 'src/core/repository';
import { Id, QueryString } from 'src/types/core.types';
import { ICreateUserDao, IUserDao } from '../interfaces/dao/user.dao';
import { CreateUserDto } from '../interfaces/dto/create-user.dto';
import { IUser } from '../interfaces/models/user';
import { CreateUserDtoMapper } from '../mappers/create-user-dto.mapper';
import { UserDaoMapper } from '../mappers/user-dao.mapper';

@Injectable()
export class UsersRepository extends Repository {
  public async getAll(): Promise<IUser[]> {
    const getQuery: QueryString = 'SELECT username, email FROM users';
    const userDaos: IUserDao[] = await this.database.query<IUserDao>(getQuery);
    return userDaos.map(UserDaoMapper.toModel);
  }

  public async getById(userId: Id): Promise<IUser> {
    const getQuery: QueryString = 'SELECT username, email FROM users WHERE id = $1';
    const userDao: IUserDao = await this.database.queryOne<IUserDao>(getQuery, [userId]);
    return UserDaoMapper.toModel(userDao);
  }

  public async create(insertUser: CreateUserDto): Promise<void> {
    const insertUserDao: ICreateUserDao = CreateUserDtoMapper.toCreateUserDao(insertUser);
    const createQuery: QueryString = 'INSERT INTO "users" ("username", "email", "password") VALUES ($1, $2, $3)';
    await this.database.query(createQuery, [insertUserDao.username, insertUser.email, insertUser.password]);
  }
}
