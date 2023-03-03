import { Controller, Get, Patch, Post } from '@nestjs/common';
import { DummyService } from './dummy.service';

@Controller('dummy')
export class DummyController {
  constructor(private readonly dummyService: DummyService) {}

  @Post('products')
  createProdcuts() {
    return this.dummyService.createTwoMillion();
  }

  @Post('users')
  createUsers() {
    return this.dummyService.createThousandUsers();
  }
}
