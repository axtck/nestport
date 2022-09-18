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
  public async findAll(): Promise<IUser[]> {
    const findQuery: QueryString = 'SELECT username, email FROM users';
    const userDaos: IUserDao[] = await this.database.query<IUserDao>(findQuery);
    return userDaos.map(UserDaoMapper.toModel);
  }

  public async findOne(userId: Id): Promise<IUser> {
    const findQuery: QueryString = 'SELECT username, email FROM users WHERE id = $1';
    const userDao: IUserDao = await this.database.queryOne<IUserDao>(findQuery, [userId]);
    return UserDaoMapper.toModel(userDao);
  }

  public async create(createUser: CreateUserDto): Promise<void> {
    const createUserDao: ICreateUserDao = CreateUserDtoMapper.toCreateUserDao(createUser);
    const createQuery: QueryString = 'INSERT INTO "users" ("username", "email", "password") VALUES ($1, $2, $3)';
    await this.database.query(createQuery, [createUserDao.username, createUserDao.email, createUserDao.password]);
  }

  public async remove(userId: Id): Promise<void> {
    const removeQuery: QueryString = 'DELETE FROM "users" WHERE "id" = $1';
    await this.database.query(removeQuery, [userId]);
  }
}
