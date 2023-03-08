import { Controller, OnModuleInit } from '@nestjs/common';
import { BillingService } from './billing.service';
import {
  MessagePattern,
  Ctx,
  Payload,
  RmqContext,
  EventPattern,
} from '@nestjs/microservices';
import { RabbitmqChannelProvider } from '@app/common/rmq/rmq.connection';
import { Channel, connect } from 'amqplib/callback_api';
// import { Channel, connect } from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Controller()
export class BillingController implements OnModuleInit {
  constructor(
    private readonly billingService: BillingService,
    private readonly rabbitmqChannelProvider: RabbitmqChannelProvider,
    private configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const channel = await this.rabbitmqChannelProvider.createChannel();
    await channel.consume(
      'billing1',
      (msg) => {
        this.billingService.createOrder(JSON.parse(msg.content.toString()));
        //channel.ack(msg)
        console.log(
          'Received billing1 message:',
          JSON.parse(msg.content.toString()),
        );
      },
      { noAck: true },
    );
    // await channel.close();

    await channel.consume(
      'payment1',
      (msg) => {
        this.billingService.payment(JSON.parse(msg.content.toString()));
        //channel.ack(msg)
        console.log(
          'Received payment1 message:',
          JSON.parse(msg.content.toString()),
        );
      },
      { noAck: true },
    );
    // await channel.close();

    await channel.consume(
      'billing2',
      (msg) => {
        this.billingService.createOrder(JSON.parse(msg.content.toString()));
        //channel.ack(msg)
        console.log(
          'Received billing2 message:',
          JSON.parse(msg.content.toString()),
        );
      },
      { noAck: true },
    );
    // await channel.close();

    await channel.consume(
      'payment2',
      (msg) => {
        this.billingService.payment(JSON.parse(msg.content.toString()));
        //channel.ack(msg)
        console.log(
          'Received payment2 message:',
          JSON.parse(msg.content.toString()),
        );
      },
      { noAck: true },
    );
    // await channel.close();
  }
}
