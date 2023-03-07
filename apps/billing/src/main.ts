import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';

async function bootstrap() {
  await NestFactory.create(BillingModule);
  // const rmqService = app.get<RmqService>(RmqService)
  // app.connectMicroservice(rmqService.getOptions('BILLING'))
  // app.connectMicroservice(rmqService.getOptions('PAYMENT'))
  // await app.startAllMicroservices()

}
bootstrap();
