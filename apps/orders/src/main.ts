import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule, {cors: true});
  app.enableCors();
  await app.listen(3000);
  console.log('3000 만큼 사랑해');
}
bootstrap();
