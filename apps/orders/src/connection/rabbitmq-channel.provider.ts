import { Injectable } from '@nestjs/common';
import { Channel, connect } from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitmqChannelProvider {
  constructor(private readonly configService: ConfigService) {}

  async createChannel(): Promise<Channel> {
    try {
      const rabbitmqUrl = this.configService.get<string>('RABBIT_MQ_URI');
      const connection = await connect(rabbitmqUrl);
      const channel = await connection.createChannel();

      return channel;
    } catch (e) {
      console.log(e);
      throw new Error(e.response);
    }
  }
}
