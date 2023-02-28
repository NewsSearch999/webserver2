import { NestFactory } from '@nestjs/core';
import { DummyModule } from './dummy.module';

async function bootstrap() {
  const app = await NestFactory.create(DummyModule);
  await app.listen(3003);
}
bootstrap();
