import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Id } from 'src/types/core.types';
import { CreateUserDto } from './interfaces/dtos/create-user.dto';
import { IUser } from './interfaces/models/user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/')
  public async findAll(): Promise<IUser[]> {
    const users: IUser[] = await this.userService.getAll();
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Param('id', ParseIntPipe) id: Id): Promise<IUser> {
    const user: IUser = await this.userService.findOne(id);
    return user;
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  public async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
  }

  @Delete('/:id')
  public async remove(@Param('id', ParseIntPipe) id: number) {
    await this.userService.remove(id);
  }
}
