import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  public username!: string;

  @IsNotEmpty()
  public email!: string;

  @IsNotEmpty()
  public password!: string;
}
