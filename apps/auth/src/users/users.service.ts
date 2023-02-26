import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserRequest } from './dto/create-user.request';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  async createUser(request: CreateUserRequest) {
    const { nickname, password } = request;
    const exists = await this.users.findOne({
      where: { nickname },
    });
    if (exists) return { ok: false, msg: '이미 가입된 아이디 입니다.' };

    await this.users.save(this.users.create({ nickname, password }));
    return { ok: true, msg: '가입완료' };
  }
}
