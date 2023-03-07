import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

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