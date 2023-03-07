import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { BillingModule } from './billing.module';
import {
RabbitMQServer,
ExchangeType,
} from '@lukadriel/nestjs-rabbitmq-transporter';
import { ConfigService } from '@nestjs/config';
import { RmqService } from '@app/common';
const configService = new ConfigService()
async function bootstrap() {
    const app = await NestFactory.create(BillingModule)
    // const rmqService = app.get<RmqService>(RmqService);
    app.connectMicroservice<MicroserviceOptions>({
      strategy: new RabbitMQServer({
        queue: 'billing',
        exchange: 'exchange1',
        exchangeType: ExchangeType.TOPIC,
        urls: [configService.get('RABBIT_MQ_exchange1_URI')],
        noAck: false,  
      })
    })
    app.connectMicroservice<MicroserviceOptions>({
      strategy: new RabbitMQServer({
        queue: 'payment',
        exchange: 'exchange1',
        exchangeType: ExchangeType.TOPIC,
        urls: [configService.get('RABBIT_MQ_exchange1_URI')],
        noAck: false,  
      })
    })
    app.connectMicroservice<MicroserviceOptions>({
      strategy: new RabbitMQServer({
        queue: 'billing',
        exchange: 'exchange2',
        exchangeType: ExchangeType.TOPIC,
        urls: [configService.get('RABBIT_MQ_exchange2_URI')],
        noAck: false,  
      })
    })
    app.connectMicroservice<MicroserviceOptions>({
      strategy: new RabbitMQServer({
        queue: 'payment',
        exchange: 'exchange2',
        exchangeType: ExchangeType.TOPIC,
        urls: [configService.get('RABBIT_MQ_exchange2_URI')],
        noAck: false,
      })
    })
    await app.startAllMicroservices();

}
bootstrap();