import { IUserDao } from '../interfaces/dao/user.dao';
import { IUser } from '../interfaces/models/user';

export class UserDaoMapper {
  public static toModel(dao: IUserDao): IUser {
    return {
      username: dao.username,
      email: dao.email,
    };
  }
}
