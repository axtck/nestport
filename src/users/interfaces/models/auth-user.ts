import { IUser } from './user';

export interface IAuthUser extends IUser {
  password: string;
}
