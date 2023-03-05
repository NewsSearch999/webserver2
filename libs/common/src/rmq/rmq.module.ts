import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { CONNECTION_NAME } from './constants/service';
import { RmqService } from './rmq.service';

// interface RmqModuleOptions {
//   name: string;
// }

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: (configService:ConfigService) => ({
        name: CONNECTION_NAME,
        exchanges: [
          {
            name: 'exchange1',
            type: 'direct',
          },
        ],
        uri: configService.get('RABBIT_MQ_URI'),
        connectionInitOptions: { wait: true },
        channels: {
          'channel-1': {
            prefetchCount: 15,
            default: true,
          },
          'channel-2': {
            prefetchCount: 2,
          },
        },
      }),
     
      inject: [ConfigService],
    }),
    RmqModule,
  ],
  providers: [],
  exports: [RabbitMQModule],
})
export class RmqModule {}
// export class RmqModule {
//   static register({ name }: RmqModuleOptions): DynamicModule {
//     return {
//       module: RmqModule,
//       imports: [
//         ClientsModule.registerAsync([
//           {
//             //동적모듈로 OdersModule에 들어갈 때 이름을 배당받음
//             name,
//             useFactory: (configService: ConfigService) => ({
//               transport: Transport.RMQ,
//               options: {
//                 urls: [configService.get<string>('RABBIT_MQ_URI')],
//                 queue: configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
//                 queueOptions: {
//                   durable: true
//                 },
//               },
//             }),
//             inject: [ConfigService],
//           },
//         ]),
//       ],
//       exports: [ClientsModule],
//     };
//   }
// }
