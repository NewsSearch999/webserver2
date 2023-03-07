import { Controller, Get, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
// import { ReplyErrorCallback } from '@app/common/rmq/exceptions/reply.error.callback';
// import { DenyGuard } from '@app/common/rmq/deny.guard';
// import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common/rmq/rmq.service';


@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly configService: ConfigService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('exchange1_order')
  async subscribeBiling1(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('exchange1 queue 메시지 :', data);
    await this.billingService.createOrder(data);
    this.rmqService.ack(context);
  }

  // @RabbitSubscribe({
  //   exchange: 'exchange2',
  //   routingKey: 'billing',
  //   queue: 'billing',
  //   errorHandler: ReplyErrorCallback,
  // })
  // @UseGuards(DenyGuard)
  @EventPattern('exchange2_order')
  async subscribeBiling2(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('exchange2 queue 메시지 :', data);
    await this.billingService.createOrder(data)
    this.rmqService.ack(context);
  }

  // @RabbitSubscribe({
  //   exchange: 'exchange1',
  //   routingKey: 'payment',
  //   queue: 'payment',
  //   errorHandler: ReplyErrorCallback,
  // })
  // @UseGuards(DenyGuard)
  @EventPattern('exchange1_payment')
  async subscribePayment1(@Payload() orderData: any, @Ctx() context: RmqContext) {
    console.log('exchange1 payment 메시지 :', orderData);
    await this.billingService.payment(orderData);
    this.rmqService.ack(context);

  }

  // @RabbitSubscribe({
  //   exchange: 'exchange2',
  //   routingKey: 'PAYMENT',
  //   queue: 'PAYMENT',
  //   errorHandler: ReplyErrorCallback,
  // })
  // @UseGuards(DenyGuard)
  @EventPattern('exchange2_payment')
  async subscribePayment2(@Payload() orderData: any, @Ctx() context: RmqContext) {
    console.log('exchange2 payment 메시지 :', orderData)
    await this.billingService.payment(orderData);
    this.rmqService.ack(context);

  }
}


