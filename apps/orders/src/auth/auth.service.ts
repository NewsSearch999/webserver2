import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '@app/common/entity/user.entity';
import { Repository } from 'typeorm';
import { UserRequest } from './dto/create-user.request';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

export interface TokenPayload {
  userId: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

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
    } else {
      throw new HttpException('잘못된 비밀번호 입니다', 403);
    }
  }

  logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }

  async createUser(request: UserRequest) {
    const { email, password } = request;
    const exist = await this.users.findOne({
      where: { email },
    });
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);

    if (exist) throw new HttpException('이미 가입된 이메일 입니다', 401);

    const user = this.users.create({ email, password: hashed });
    await this.users.save(user);

    return { ok: true, msg: '가입완료' };
  }

  async getUser(userId: number) {
    const user = await this.users.findOne({ where: { userId } });
    if (!user) throw new UnauthorizedException('잘못된 접근입니다.');
    return user;
  }
}
