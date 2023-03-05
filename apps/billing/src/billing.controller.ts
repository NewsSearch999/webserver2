// import { RmqService } from '@app/common/rmq/rmq.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import {
  MessageHandlerErrorBehavior,
  RabbitPayload,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { ReplyErrorCallback } from '@app/common/rmq/exceptions/reply.error.callback';
import { DenyGuard } from '@app/common/rmq/deny.guard';

@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    // private readonly rmqService: RmqService,
  ) {}

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'BILLING',
    queue: 'BILLING',
    errorHandler: ReplyErrorCallback,
  })
  @UseGuards(DenyGuard)
  async subscribeBiling(@RabbitPayload() data: any) {
    this.billingService.message(data);
  }

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'PAYMENT',
    queue: 'PAYMENT',
    errorHandler: ReplyErrorCallback,
  })
  @UseGuards(DenyGuard)
  async subscribePayment(@RabbitPayload() orderData: any) {
    await this.billingService.payment(orderData);
    this.billingService.message(orderData);
  }

  // @EventPattern('order_created')
  // async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
  //   this.billingService.message(data);
  //   this.rmqService.ack(context);
  // }

  // @EventPattern('order_payment')
  // async handleOrderPayment(
  //   @Payload() orderData: any,
  //   @Ctx() context: RmqContext,
  // ) {
  //   await this.billingService.payment(orderData);
  //   this.rmqService.ack(context);
  // }
}
