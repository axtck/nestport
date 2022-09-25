import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Id, Null } from 'src/types/core.types';
import { CreateUserDto } from './interfaces/dtos/create-user.dto';
import { ILoginUser } from './interfaces/models/auth-user';
import { IUser } from './interfaces/models/user';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository, private readonly configService: ConfigService) {}

  public async findAll(): Promise<IUser[]> {
    const data: IUser[] = await this.usersRepository.findAll();
    return data;
  }

  public async findOne(userId: Id): Promise<IUser> {
    const data: IUser = await this.usersRepository.findOne(userId);
    return data;
  }

  public async findOneByUsername(username: string): Promise<Null<ILoginUser>> {
    const data: Null<ILoginUser> = await this.usersRepository.findOneByKey('username', username);
    return data;
  }

  public async create(createUserDto: CreateUserDto): Promise<void> {
    await this.checkUnique(createUserDto.email, createUserDto.username);

    const saltRounds: number = this.configService.get<number>('auth.saltRounds') as number;
    const hashedPassword: string = await bcrypt.hash(createUserDto.password, saltRounds);

    const userWithHashedPassword: CreateUserDto = {
      ...createUserDto,
      password: hashedPassword,
    };

    await this.usersRepository.create(userWithHashedPassword);
  }

  public async remove(userId: Id): Promise<void> {
    await this.usersRepository.remove(userId);
  }

  private async checkUnique(email: string, username: string): Promise<void> {
    if (await this.usersRepository.findOneByKey('email', email)) {
      throw new HttpException('email already in use', HttpStatus.CONFLICT);
    }

    if (await this.usersRepository.findOneByKey('username', username)) {
      throw new HttpException('username already in use', HttpStatus.CONFLICT);
    }
  }
}
