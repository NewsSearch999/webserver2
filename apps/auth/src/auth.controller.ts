import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from './users/dto/create-user.request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() request: UserRequest): Promise<{ accessToken: string }> {
    return this.authService.login(request);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  async test(@Req() req) {
    console.log(req);
  }
}
