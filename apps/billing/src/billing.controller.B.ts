import { Controller, OnModuleInit } from '@nestjs/common';
import { BillingService } from './billing.service';
import { RabbitmqChannelProvider } from '@app/common/rmq/rmq.connection';
import { Channel, connect, ConsumeMessage, MessageProperties } from 'amqplib';

@Controller()
export class BillingControllerB implements OnModuleInit {
  private channel: Channel;
  constructor(
    private readonly billingService: BillingService,
    private readonly rabbitmqChannelProvider: RabbitmqChannelProvider,

  ) {}

  async onModuleInit(): Promise<void> {
    //const channel = await this.rabbitmqChannelProvider.createChannel();
    this.channel = await this.rabbitmqChannelProvider.createChannel();

    await this.channel.consume(
      'billing1',
      async (msg) => {
        try {
          if (!msg.content.toString()) {
            throw new Error('빈 메시지를 보냈는데?');
          }
          if (!msg.fields) {
            throw new Error('fields가 없는데?');
          }

          this.billingService.createOrder(JSON.parse(msg.content.toString()));
          this.channel.ack(msg, true);
          console.log(
            'Received billing1 message:',
            JSON.parse(msg.content.toString()),
          );
        } catch (error) {
          if (!msg.fields) throw new Error(`fields가 없는데? : ${msg}`);
          if (msg.properties.headers['x-redelivered-count']) {
            const retryCount = msg.properties.headers['x-redelivered-count'];

            if (retryCount >= 3) {
              // 재시도 횟수가 3회 이상이면 메시지를 버림
              this.channel.reject(msg, false);
              console.error(`retryCount: ${retryCount}, ${msg}를 버립니다.`);
            } else {
              msg.properties.headers['x-redelivered-count'] += 1;
              // 재시도 횟수가 3회 미만이면 메시지를 재시도
              const delay = 1000 * Math.pow(2, retryCount);
              await new Promise((resolve) => setTimeout(resolve, delay));

              this.channel.nack(msg, false, true);
              console.log(
                `Retrying in ${delay} ms. Retry count: ${retryCount}`,
              );
            }
          } else {
            // 메시지를 처음 받았을 때
            msg.properties.headers['x-redelivered-count'] = 1;
            this.channel.nack(msg, false, true);
          }
        }
      },
      { noAck: false },
    );
    // await channel.close();

    await this.channel.consume(
      'payment1',
      async (msg) => {
        try {
          if (!msg.content.toString()) {
            throw new Error('빈 메시지를 보냈는데?');
          }
          if (!msg.fields) {
            throw new Error('fields가 없는데?');
          }

          const orderData = JSON.parse(msg.content.toString())
          this.billingService.payment(orderData);
          this.channel.ack(msg, true);
          console.log(
            'Received payment1 message:',
            JSON.parse(msg.content.toString()),
          );
        } catch (error) {
          if (!msg.fields) throw new Error(`fields가 없는데? : ${msg}`);
          if (msg.properties.headers['x-redelivered-count']) {
            const retryCount = msg.properties.headers['x-redelivered-count'];

            if (retryCount >= 3) {
              // 재시도 횟수가 3회 이상이면 메시지를 버림
              this.channel.reject(msg, false);
              console.error(`retryCount: ${retryCount}, ${msg}를 버립니다.`);
            } else {
              msg.properties.headers['x-redelivered-count'] += 1;
              // 재시도 횟수가 3회 미만이면 메시지를 재시도
              const delay = 1000 * Math.pow(2, retryCount);
              await new Promise((resolve) => setTimeout(resolve, delay));
              this.channel.nack(msg, false, true);
              console.log(
                `Retrying in ${delay} ms. Retry count: ${retryCount}`,
              );
            }
          } else {
            // 메시지를 처음 받았을 때
            msg.properties.headers['x-redelivered-count'] = 1;
            this.channel.nack(msg, false, true);
          }
        }
      },
      { noAck: false },
    );
    // await channel.close();

    await this.channel.consume(
      'billing2',
      async (msg) => {
        try {
          if (!msg.content.toString()) {
            throw new Error('빈 메시지를 보냈는데?');
          }
          if (!msg.fields) {
            throw new Error('fields가 없는데?');
          }

          this.billingService.createOrder(JSON.parse(msg.content.toString()));
          this.channel.ack(msg, true);
          console.log(
            'Received billing2 message:',
            JSON.parse(msg.content.toString()),
          );
          console.log(msg.fields);
        } catch (error) {
          if (!msg.fields) throw new Error(`fields가 없는데? : ${msg}`);
          if (msg.properties.headers['x-redelivered-count']) {
            const retryCount = msg.properties.headers['x-redelivered-count'];

            if (retryCount >= 3) {
              // 재시도 횟수가 3회 이상이면 메시지를 버림
              this.channel.reject(msg, false);
              console.error(`retryCount: ${retryCount}, ${msg}를 버립니다.`);
            } else {
              msg.properties.headers['x-redelivered-count'] += 1;
              // 재시도 횟수가 3회 미만이면 메시지를 재시도
              const delay = 1000 * Math.pow(2, retryCount);
              await new Promise((resolve) => setTimeout(resolve, delay));
              this.channel.nack(msg, false, true);
              console.log(
                `Retrying in ${delay} ms. Retry count: ${retryCount}`,
              );
            }
          } else {
            // 메시지를 처음 받았을 때
            msg.properties.headers['x-redelivered-count'] = 1;
            this.channel.nack(msg, false, true);
          }
        }
      },
      { noAck: false },
    );
    // await channel.close();

    await this.channel.consume(
      'payment2',
      async (msg) => {
        try {
          if (!msg.content.toString()) {
            throw new Error('빈 메시지를 보냈는데?');
          }
          if (!msg.fields) {
            throw new Error('fields가 없는데?');
          }

          const orderData = JSON.parse(msg.content.toString())
          this.billingService.payment(orderData);
          this.channel.ack(msg, true);
          console.log(
            'Received payment2 message:',
            JSON.parse(msg.content.toString()),
          );
        } catch (error) {
          if (!msg.fields) throw new Error(`fields가 없는데? : ${msg}`);
          if (msg.properties.headers['x-redelivered-count']) {
            const retryCount = msg.properties.headers['x-redelivered-count'];

            if (retryCount >= 3) {
              // 재시도 횟수가 3회 이상이면 메시지를 버림
              this.channel.reject(msg, false);
              console.error(`retryCount: ${retryCount}, ${msg}를 버립니다.`);
            } else {
              msg.properties.headers['x-redelivered-count'] += 1;
              // 재시도 횟수가 3회 미만이면 메시지를 재시도
              const delay = 1000 * Math.pow(2, retryCount);
              await new Promise((resolve) => setTimeout(resolve, delay));
              this.channel.nack(msg, false, true);
              console.log(
                `Retrying in ${delay} ms. Retry count: ${retryCount}`,
              );
            }
          } else {
            // 메시지를 처음 받았을 때
            msg.properties.headers['x-redelivered-count'] = 1;
            this.channel.nack(msg, false, true);
          }
        }
      },
      { noAck: false },
    );
    // await channel.close();
  }
}
