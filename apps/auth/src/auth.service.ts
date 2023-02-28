import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '@app/common/entity/user.entity';
import { Repository } from 'typeorm';
import { UserRequest } from './users/dto/create-user.request';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

export interface TokenPayload {
  userId: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // async login(user: User, response: Response) {
  //   const tokenPayload: TokenPayload = {
  //     userId: user.userId,
  //   };

  //   const expires = new Date();
  //   expires.setSeconds(
  //     expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
  //   );

  //   const token = this.jwtService.sign(tokenPayload);

  //   response.cookie('Authentication', token, {
  //     httpOnly: true,
  //     expires,
  //   });
  // }

  /**
   * 로그인 
   * @param request email, password
   * @returns 
   */
  async login(request: UserRequest): Promise<{ accessToken: string }> {
    const { email, password } = request;
    const exist = await this.users.findOne({
      where: { email },
    });
    if (!exist) throw new UnauthorizedException('가입되지 않은 이메일 입니다.');

    if (await bcrypt.compare(password, exist.password)) {
      const payload = { userId: exist.userId };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    }
  }

  logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }
}
