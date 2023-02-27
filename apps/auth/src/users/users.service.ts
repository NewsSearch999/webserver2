import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRequest } from './dto/create-user.request';
import { User } from 'libs/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
    private jwtService: JwtService,
  ) {}

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
