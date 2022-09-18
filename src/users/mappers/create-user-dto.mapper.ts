import { ICreateUserDao } from '../interfaces/dao/user.dao';
import { CreateUserDto } from '../interfaces/dto/create-user.dto';

export class CreateUserDtoMapper {
  public static toCreateUserDao(dto: CreateUserDto): ICreateUserDao {
    return {
      username: dto.username,
      email: dto.email,
      password: dto.password,
    };
  }
}
