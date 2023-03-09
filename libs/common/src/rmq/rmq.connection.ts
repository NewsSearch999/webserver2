import { Injectable, OnModuleInit, OnApplicationBootstrap } from '@nestjs/common';
import { Channel, connect } from 'amqplib';
import { ConfigService } from '@nestjs/config';
import rabbitmqConfig from './rmq.conf';

@Injectable()
export class RabbitmqChannelProvider {
  constructor(private readonly configService: ConfigService) {}

  async createChannel(): Promise<Channel> {
    try {
      const rabbitmqUrl = this.configService.get<string>('RABBIT_MQ_URI');
      const connection = await connect(rabbitmqUrl);
      const channel = await connection.createChannel();
      await channel.prefetch(50, true);

      // Declare exchanges
      for (const exchange of rabbitmqConfig.exchanges) {
        await channel.assertExchange(exchange.name, exchange.type, exchange.options);
      }

      // Declare queues and bind them to exchanges
      for (const queue of rabbitmqConfig.queues) {
        await channel.assertQueue(queue.name, queue.options);
        for (const binding of queue.bindings) {
          await channel.bindQueue(queue.name, binding.exchange, binding.routingKey);
        }
      }

      return channel;
    } catch (e) {
      console.log(e);
      throw new Error(e.response);
    }
  }

}

