import { Controller, Get, Patch, Post } from '@nestjs/common';
import { DummyService } from './dummy.service';

@Controller('dummy')
export class DummyController {
  constructor(private readonly dummyService: DummyService) {}

  @Post('products/million')
  createProdcuts() {
    return this.dummyService.createTwoMillion();
  }

  @Post('products/100000')
  createThosandProducts(){
    return this.dummyService.createHundredThousands();
  }

  @Post('users')
  createUsers() {
    return this.dummyService.createThousandUsers();
  }
}
