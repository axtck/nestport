import { IAuthUserDao } from '../daos/user.dao';
import { IAuthUser } from '../models/auth-user';

export class AuthUserDaoMapper {
  public static toModel(dao: IAuthUserDao): IAuthUser {
    return {
      username: dao.username,
      email: dao.email,
      password: dao.password,
    };
  }
}
