import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { BillingModule } from './billing.module';
import {
RabbitMQServer,
ExchangeType,
} from '@lukadriel/nestjs-rabbitmq-transporter';
import { ConfigService } from '@nestjs/config';
const configService = new ConfigService()
async function bootstrap() {
    await NestFactory.create(BillingModule)
    // app.connectMicroservice<MicroserviceOptions>({
    //   strategy: new RabbitMQServer({
    //     queue: 'billing1',
    //     exchange: 'exchange1',
    //     exchangeType: ExchangeType.DIRECT,
    //     urls: [configService.get('RABBIT_MQ_URI')],
    //     noAck: false,  
    //   })
    // })
    // app.connectMicroservice<MicroserviceOptions>({
    //   strategy: new RabbitMQServer({
    //     queue: 'payment1',
    //     exchange: 'exchange1',
    //     exchangeType: ExchangeType.DIRECT,
    //     urls: [configService.get('RABBIT_MQ_URI')],
    //     noAck: false,  
    //   })
    // })
    // app.connectMicroservice<MicroserviceOptions>({
    //   strategy: new RabbitMQServer({
    //     queue: 'billing2',
    //     exchange: 'exchange2',
    //     exchangeType: ExchangeType.DIRECT,
    //     urls: [configService.get('RABBIT_MQ_URI')],
    //     noAck: false,  
    //   })
    // })
    // app.connectMicroservice<MicroserviceOptions>({
    //   strategy: new RabbitMQServer({
    //     queue: 'payment2',
    //     exchange: 'exchange2',
    //     exchangeType: ExchangeType.DIRECT,
    //     urls: [configService.get('RABBIT_MQ_URI')],
    //     noAck: false,
    //   })
    // })
    // await app.startAllMicroservices();

}
bootstrap();