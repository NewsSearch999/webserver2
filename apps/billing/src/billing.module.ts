import { Module } from '@nestjs/common';
import { RmqModule, RmqService } from '@app/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'apps/orders/src/auth/auth.module';
import {
  RabbitMQClient,
  RabbitMQServer,
  ExchangeType,
} from '@lukadriel/nestjs-rabbitmq-transporter';
import { ConnectionService } from './connection/connection.service';

@Module({
  imports: [ AuthModule],
  controllers: [BillingController],
  providers: [
    BillingService,
    ConnectionService,
    RmqService,
    // {
    //   provide: 'BILLING',
    //   useFactory: (configService: ConfigService) => {
    //     return new RabbitMQClient({
    //       urls: [configService.get('RABBIT_MQ_URI')],
    //       exchange: 'exchange1',
    //       exchangeType: ExchangeType.DIRECT,
    //       queue: 'billing',
    //       replyQueue: 'billingReply',
    //       replyQueueOptions: {
    //         exclusive: true,
    //       },
    //       noAck: false,
    //     });
    //   },inject: [ConfigService],
    // },
    // {
    //   provide: 'BILLING',
    //   useFactory: (configService: ConfigService) => {
    //     return new RabbitMQClient({
    //       urls: [configService.get('RABBIT_MQ_URI')],
    //       exchange: 'exchange2',
    //       exchangeType: ExchangeType.DIRECT,
    //       queue: 'billing',
    //       replyQueue: 'billingReply',
    //       replyQueueOptions: {
    //         exclusive: true,
    //       },
    //       noAck: false,
    //     });
    //   },inject: [ConfigService],
    // },
    // {
    //   provide: 'PAYMENT',
    //   useFactory: (configService: ConfigService) => {
    //     return new RabbitMQClient({
    //       urls: [configService.get('RABBIT_MQ_URI')],
    //       exchange: 'exchange1',
    //       exchangeType: ExchangeType.DIRECT,
    //       queue: 'payment',
    //       replyQueue: 'paymentReply',
    //       replyQueueOptions: {
    //         exclusive: true,
    //       },
    //       noAck: false,
    //     });
    //   },inject: [ConfigService],
    // },
    // {
    //   provide: 'PAYMENT',
    //   useFactory: (configService: ConfigService) => {
    //     return new RabbitMQClient({
    //       urls: [configService.get('RABBIT_MQ_URI')],
    //       exchange: 'exchange2',
    //       exchangeType: ExchangeType.DIRECT,
    //       queue: 'payment',
    //       replyQueue: 'paymentReply',
    //       replyQueueOptions: {
    //         exclusive: true,
    //       },
    //       noAck: false,
    //     });
    //   },inject: [ConfigService],
    // },
    
  ],
})
export class BillingModule {}
