export interface IUserDao {
  username: string;
  email: string;
}

export interface IAuthUserDao extends IUserDao {
  password: string;
}

export interface ICreateUserDao extends IUserDao {
  password: string;
}
