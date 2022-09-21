import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtTokenSignature } from '../interfaces/jwt-token-signature.interface';
import { IUserIdentifier } from '../interfaces/user-identifier.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('auth.jwtSecret'),
      ignoreExpiration: false,
    });
  }

  public validate(payload: IJwtTokenSignature): IUserIdentifier {
    return {
      id: payload.sub,
      username: payload.username,
    };
  }
}
