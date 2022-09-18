export interface IUserDao {
  username: string;
  email: string;
}

export interface ICreateUserDao extends IUserDao {
  password: string;
}
