import { Injectable } from '@nestjs/common';
import { Id, Null } from 'src/types/core.types';
import { CreateUserDto } from './interfaces/dtos/create-user.dto';
import { ILoginUser } from './interfaces/models/auth-user';
import { IUser } from './interfaces/models/user';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async findAll(): Promise<IUser[]> {
    const data: IUser[] = await this.usersRepository.findAll();
    return data;
  }

  public async findOne(userId: Id): Promise<IUser> {
    const data: IUser = await this.usersRepository.findOne(userId);
    return data;
  }

  public async findOneByUsername(username: string): Promise<Null<ILoginUser>> {
    const data: Null<ILoginUser> = await this.usersRepository.findOneByUsername(username);
    return data;
  }

  public async create(createUserDto: CreateUserDto): Promise<void> {
    await this.usersRepository.create(createUserDto);
  }

  public async remove(userId: Id): Promise<void> {
    await this.usersRepository.remove(userId);
  }
}
