// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
// import { Channel } from 'amqplib';

// @Injectable()
// export class RmqService {
//   private channel: Channel;
//   constructor(private readonly configService: ConfigService) {}

//   //   getOptions(queue: string, noAck = false): RmqOptions {
//   //     return {
//   //       transport: Transport.RMQ,
//   //       options: {
//   //         urls: [this.configService.get<string>(`RABBIT_MQ_URI`)],
//   //         queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
//   //         noAck,
//   //         persistent: true,
//   //       },
//   //     };
//   //   }
//   setChannel(channel: Channel): void {
//     this.channel = channel;
//   }

//   async ack(msg: any): Promise<void> {
//     try {
//       await this.channel.ack(msg);
//     } catch (e) {
//       console.log('Error acknowledging message:', e);
//       // Handle error here
//     }

//     //   ack(context: RmqContext) {
//     //     const channel = context.getChannelRef();
//     //     const originalMessage = context.getMessage();
//     //     channel.ack(originalMessage);
//     //   }
//   }
// }
