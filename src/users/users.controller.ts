import { Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Id } from 'src/types/core.types';
import { CreateUserDto } from './interfaces/dto/create-user.dto';
import { IUser } from './interfaces/models/user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/')
  public async getAll(): Promise<IUser[]> {
    const users: IUser[] = await this.userService.getAll();
    return users;
  }

  @Get('/:id')
  public async getById(@Param('id', ParseIntPipe) id: Id): Promise<IUser> {
    const user: IUser = await this.userService.getById(id);
    return user;
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  public async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
  }
}
