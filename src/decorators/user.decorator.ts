import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from 'src/users/interfaces/models/user';

export const User = createParamDecorator((key: 'id' | 'username', ctx: ExecutionContext) => {
  const request: { user: IUser } = ctx.switchToHttp().getRequest();
  const user: IUser = request.user;
  return key ? user[key] : user;
});
