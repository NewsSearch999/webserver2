import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRequest } from './dto/create-user.request';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  async createUser(request: UserRequest) {
    const { email, password } = request;
    const exist = await this.users.findOne({
      where: { email },
    });
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);

    if (exist) return { ok: false, msg: '이미 가입된 이메일 입니다.' };

    const user = this.users.create({ email, password: hashed });
    await this.users.save(user);

    return { ok: true, msg: '가입완료' };
  }

  async login(request: UserRequest) {
    const { email, password } = request;
    const exist = await this.users.findOne({
      where: { email },
    });
    if (!exist) return { ok: false, msg: '가입되지 않은 이메일 입니다' };
    
    if(await bcrypt.compare(password,exist.password))
  }
}
