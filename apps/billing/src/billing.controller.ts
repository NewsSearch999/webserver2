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

@Controller()
export class BillingController implements OnModuleInit {
  constructor(
    private readonly billingService: BillingService,
    private readonly rabbitmqChannelProvider: RabbitmqChannelProvider,
  ) {
    // this.rabbitmqChannelProvider.createChannel().then((channel) => {
    //   channel.assertQueue('billing1');
    //   channel.assertQueue('billing2');
    //   channel.assertQueue('payment1');
    //   channel.assertQueue('payment2');
    //   channel.bindQueue('billing1', 'exchange1', 'exchange1.billing1');
    //   channel.bindQueue('billing2', 'exchange2', 'exchange2.billing2');
    //   channel.bindQueue('payment1', 'exchange1', 'exchange1.payment1');
    //   channel.bindQueue('payment2', 'exchange2', 'exchange2.payment2');
    // });
  }

  async onModuleInit(): Promise<void> {
    const channel = await this.rabbitmqChannelProvider.createChannel();
  // await channel.assertQueue('billing1');
  // await channel.assertQueue('payment1');
  // await channel.assertQueue('billing2');
  // await channel.assertQueue('payment2');
  // await channel.bindQueue('billing1', 'exchange1', 'exchange1.billing1');
  // await channel.bindQueue('billing2', 'exchange2', 'exchange2.billing2');
  // await channel.bindQueue('payment1', 'exchange1', 'exchange1.payment1');
  // await channel.bindQueue('payment2', 'exchange2', 'exchange2.payment2');

  await channel.consume('billing1', (msg) => {
    this.billingService.createOrder(JSON.parse(msg.content.toString())); 
    channel.ack(msg)
    console.log('Received billing message:', JSON.parse(msg.content.toString()));
  }, { noAck : false});
  await channel.close();

  await channel.consume('payment1', (msg) => {
    this.billingService.payment(JSON.parse(msg.content.toString())); 
    channel.ack(msg)
    console.log('Received payment message:', JSON.parse(msg.content.toString()));
  }, { noAck : false});
  await channel.close();

  await channel.consume('billing2', (msg) => {
    this.billingService.createOrder(JSON.parse(msg.content.toString())); 
    channel.ack(msg)
    console.log('Received billing message:', JSON.parse(msg.content.toString()));
  }, { noAck : false});
  await channel.close();

  await channel.consume('payment2', (msg) => {
    this.billingService.payment(JSON.parse(msg.content.toString())); 
    channel.ack(msg)
    console.log('Received payment message:', JSON.parse(msg.content.toString()));
  }, { noAck : false});
  await channel.close();
  }

  @MessagePattern('exchange1.billing1')
  async subscribeBilling1(message: any): Promise<void> {
    const channel = await this.rabbitmqChannelProvider.createChannel();
    try {
      const data = JSON.parse(message.content.toString());
      await channel.consume(
        'billing1',
        (message) => {
          this.billingService.createOrder(
            JSON.parse(message.content.toString()),
          );
          channel.ack(message);
        },
        { noAck: false },
      );
      console.log('Received billing message:', data);
    } catch (e) {
      console.error(e);
    } finally {
      await channel.close();
    }
  }

  @MessagePattern('exchange2.billing2')
  async subscribeBilling2(message: any): Promise<void> {
    const channel = await this.rabbitmqChannelProvider.createChannel();
    try {
      const data = JSON.parse(message.content.toString());
      await channel.consume(
        'billing2',
        (message) => {
          this.billingService.createOrder(
            JSON.parse(message.content.toString()),
          );
          channel.ack(message);
        },
        { noAck: false },
      );
      console.log('Received billing message:', data);
    } catch (e) {
      console.error(e);
    } finally {
      await channel.close();
    }
  }

  @MessagePattern('exchange1.payment1')
  async subscribePayment1(message: any): Promise<void> {
    const channel = await this.rabbitmqChannelProvider.createChannel();
    try {
      const data = JSON.parse(message.content.toString());
      await channel.consume(
        'payment1',
        (message) => {
          this.billingService.payment(
            JSON.parse(message.content.toString()),
          );
          channel.ack(message);
        },
        { noAck: false },
      );
      console.log('Received payment message:', data);
    } catch (e) {
      console.error(e);
    } finally {
      await channel.close();
    }
  }

  @MessagePattern('exchange2.payment2')
  async subscribePayment2(message: any): Promise<void> {
    const channel = await this.rabbitmqChannelProvider.createChannel();
    try {
      const data = JSON.parse(message.content.toString());
      await channel.consume(
        'payment2',
        (message) => {
          this.billingService.payment(
            JSON.parse(message.content.toString()),
          );
          channel.ack(message);
        },
        { noAck: false },
      );
      console.log('Received payment message:', data);
    } catch (e) {
      console.error(e);
    } finally {
      await channel.close();
    }
  }
}
