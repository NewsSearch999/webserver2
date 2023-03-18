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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 201, description: '로그인 성공 token 발행' })
  async login(@Body() request: UserRequest): Promise<{ accessToken: string }> {
    return this.authService.login(request);
  }

  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
  })
  async createUser(@Body() request: UserRequest) {
    return this.authService.createUser(request);
  }

  @Post('/test')
  @ApiOperation({ summary: 'AuthGuard테스트' })
  @UseGuards(AuthGuard())
  async test(@Req() req) {
    console.log(this);
    console.log(req);
    return '통과';
  }
}
