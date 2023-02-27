import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import JwtAuthGuard from '../guards/jwt-auth.guard';
import { UserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() request: UserRequest) {
    return this.usersService.createUser(request);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  async test(@Req() req) {
    console.log('///////////////////');
    console.log(req);
  }
}
