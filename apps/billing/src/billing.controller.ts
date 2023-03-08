import { Controller, OnModuleInit} from '@nestjs/common';
import { BillingService } from './billing.service';
import { MessagePattern, Ctx, Payload, RmqContext, EventPattern } from '@nestjs/microservices';
import { RmqService } from '@app/common/rmq/rmq.service';
import { RabbitmqChannelProvider } from './connection/rabbitmq-channel.provider';
 

@Controller()
export class BillingController implements OnModuleInit {
  private channel: any;
  constructor(
    private readonly billingService: BillingService,
    private readonly rmqService: RmqService,
    private readonly rabbitmqChannelProvider: RabbitmqChannelProvider,
  ) {
    this.rabbitmqChannelProvider.createChannel().then((channel) => {
      channel.assertQueue('billing1');
      channel.assertQueue('billing2');
      channel.assertQueue('payment1');
      channel.assertQueue('payment2');
      channel.bindQueue('billing1', 'exchange1', 'exchange1.billing1');
      channel.bindQueue('billing2', 'exchange2', 'exchange2.billing2');
      channel.bindQueue('payment1', 'exchange1', 'exchange1.payment1');
      channel.bindQueue('payment2', 'exchange2', 'exchange2.payment2');
    });

  }

  async onModuleInit(): Promise<void> {
    this.channel = await this.rabbitmqChannelProvider.createChannel();
    await this.channel.assertQueue('billing1');
    await this.channel.assertQueue('payment1');
    await this.channel.assertQueue('billing2');
    await this.channel.assertQueue('payment2');
    await this.channel.bindQueue('billing1', 'exchange1', 'exchange1.billing1');
    await this.channel.bindQueue('billing2', 'exchange2', 'exchange2.billing2');
    await this.channel.bindQueue('payment1', 'exchange1', 'exchange1.payment1');
    await this.channel.bindQueue('payment2', 'exchange2', 'exchange2.payment2');

    await this.channel.consume('billing1', (msg) => this.subscribeBilling(msg));
    await this.channel.consume('payment1', (msg) => this.subscribePayment(msg));
    await this.channel.consume('billing2', (msg) => this.subscribeBilling(msg));
    await this.channel.consume('payment2', (msg) => this.subscribePayment(msg));
  }

  @EventPattern('exchange1.billing1')
  async subscribeBilling(msg: any): Promise<void> {
    const data = JSON.parse(msg.content.toString());
    console.log('Received billing message:', data);
    await this.billingService.createOrder(msg)
    this.rmqService.ack(msg);
  }

  // @MessagePattern('exchange2.billing2')
  // async subscribeBilling2(msg: any): Promise<void> {
  //   const data = JSON.parse(msg.content.toString());
  //   console.log('Received billing message:', data);
  //   await this.billingService.createOrder(msg)
  //   this.rmqService.ack(msg);
  // }

  @EventPattern('exchange1.payment1')
  async subscribePayment(msg: any): Promise<void> {  
    const data = JSON.parse(msg.content.toString());
    console.log('Received payment message:', data);
    await this.billingService.payment(msg)
    this.rmqService.ack(msg);

  }

  // @MessagePattern('exchange2.payment2')
  // async subscribePayment2(msg: any) {
  //   const data = JSON.parse(msg.content.toString());
  //   console.log('Received payment message:', data);
  //   await this.billingService.payment(msg)
  //   this.rmqService.ack(msg);

  }



