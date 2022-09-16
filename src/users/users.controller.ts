import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  public async getAll(): Promise<any> {
    const users = await this.userService.get();
    return users;
  }
}
