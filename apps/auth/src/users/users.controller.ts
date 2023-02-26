import { Body, Controller, Post } from '@nestjs/common';
import { UserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() request: UserRequest) {
    return this.usersService.createUser(request);
  }

  @Post('/login')
  async login(@Body() request: UserRequest) {
    return this.usersService.login(request);
  }
}
