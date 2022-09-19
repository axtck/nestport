import { IUserDao } from '../daos/user.dao';
import { IUser } from '../models/user';

export class UserDaoMapper {
  public static toModel(dao: IUserDao): IUser {
    return {
      username: dao.username,
      email: dao.email,
    };
  }
}
