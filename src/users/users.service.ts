import { Injectable } from '@nestjs/common';
import { Id } from 'src/types/core.types';
import { CreateUserDto } from './interfaces/dto/create-user.dto';
import { IUser } from './interfaces/models/user';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async getAll(): Promise<IUser[]> {
    const data: IUser[] = await this.usersRepository.getAll();
    return data;
  }

  public async getById(userId: Id): Promise<IUser> {
    const data: IUser = await this.usersRepository.getById(userId);
    return data;
  }

  public async create(createUserDto: CreateUserDto): Promise<void> {
    await this.usersRepository.create(createUserDto);
  }
}
