import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
