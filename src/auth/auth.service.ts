import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Null } from 'src/types/core.types';
import { ILoginUser } from 'src/users/interfaces/models/auth-user';
import { UsersService } from '../users/users.service';
import { IJwtTokenSignature } from './interfaces/jwt-token-signature.interface';
import { IUserIdentifier } from './interfaces/user-identifier.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtTokenService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async validateUser(username: string, password: string): Promise<Null<IUserIdentifier>> {
    const user: Null<ILoginUser> = await this.usersService.findOneByUsername(username);
    if (user && user.password === password) {
      return {
        id: user.id,
        username: user.username,
      };
    }
    return null;
  }

  public async getAccessToken(user: IUserIdentifier): Promise<string> {
    const token: IJwtTokenSignature = {
      sub: user.id,
      username: user.username,
    };

    const options: JwtSignOptions = {
      expiresIn: this.configService.get<number>('auth.jwtExpiry'),
    };

    return this.jwtTokenService.sign(token, options);
  }
}
