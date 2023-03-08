import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqService } from './rmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
interface RmqModuleOptions {
  name: string;
  exchange: string;
}

// export class RmqModule {
//   static register({ name }: RmqModuleOptions): DynamicModule {
//     return {
//       module: RmqModule,
//       imports: [
//         RabbitMQModule.forRootAsync(RabbitMQModule, {
//           useFactory: (configService: ConfigService) => ({
//             //connection name이 들어간다
//             name: name,
//             exchanges: [
//               {
//                 name: name,
//                 type: 'direct',
//               },
//             ],
//             uri: configService.get(`RABBIT_MQ_URI`),
//             connectionInitOptions: { wait: false },
//             connectionOptions: {
//               heartbeatIntervalInSeconds: 10, // heartbeat 주기
//             },
//             channels: {
//               'channel-1': {
//                 prefetchCount: 100,
//                 default: true,
//               },
//               'channel-2': {
//                 prefetchCount: 100,
//               },
//             },
//           }),
//           inject: [ConfigService],
//         }),
//         RmqModule,
//       ],
//       providers: [],
//       exports: [RabbitMQModule],
//     };
//   }
// }

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ name, exchange }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>(`RABBIT_MQ_URI`)],
                queue: configService.get<string>(
                  `RABBIT_MQ_${exchange}_${name}_QUEUE`,
                ),
                noAck: false,
                prefetchCount: 1, // 소비자가 RabbitMQ로부터 수신할 수 있는 메시지 수. 위의 channel prefetchCount와 다르다.
                exchange: exchange,
                persistent: true,
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
