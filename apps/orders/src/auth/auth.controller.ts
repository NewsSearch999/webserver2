import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from './dto/create-user.request';
import { ApiTags } from '@nestjs/swagger/dist';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 로그인
   * @param request
   * @returns
   */
  @Post('/login')
  async login(@Body() request: UserRequest): Promise<{ accessToken: string }> {
    return this.authService.login(request);
  }

  @Post('/signup')
  async createUser(@Body() request: UserRequest) {
    return this.authService.createUser(request);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  async test(@Req() req) {
    console.log(req);
  }
}
