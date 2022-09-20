import { Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/interfaces/models/user';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@User() user: IUser): Promise<string> {
    const accessToken: string = await this.authService.getAccessToken(user);
    return accessToken;
  }
}
