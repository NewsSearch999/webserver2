import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
// import { RmqService } from './rmq.service';

interface RmqModuleOptions {
  name: string;
}

export class RmqModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
          useFactory: (configService: ConfigService) => ({
            //connection name이 들어간다
            name: name,
            exchanges: [
              {
                name: name,
                type: 'direct',
              },
            ],
            uri: configService.get('RABBIT_MQ_URI'),
            connectionInitOptions: { wait: false },
            connectionOptions: {
              heartbeatIntervalInSeconds: 10, // heartbeat 주기
            },
            channels: {
              'channel-1': {
                prefetchCount: 100,
                default: true,
              },
              'channel-2': {
                prefetchCount: 100,
              },
            },
          }),
          inject: [ConfigService],
        }),
        RmqModule,
      ],
      providers: [],
      exports: [RabbitMQModule],
    };
  }
}
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
