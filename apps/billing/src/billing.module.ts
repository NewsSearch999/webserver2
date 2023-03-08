import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import {
  RabbitMQClient,
  RabbitMQServer,
  ExchangeType,
} from '@lukadriel/nestjs-rabbitmq-transporter';
import { ConnectionService } from './connection/connection.service';
import { RabbitmqChannelProvider } from '@app/common/rmq/rmq.connection';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        MASTER_DB_HOST: Joi.string().required(),
        SLAVE1_DB_HOST: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD : Joi.string().required(),
        DB_NAME : Joi.string().required(),
        DB_PORT : Joi.number().required()
      }),
      envFilePath: ['./libs/.libs.env'],
    }),
  ],
  controllers: [BillingController],
  providers: [
    BillingService,
    ConnectionService,
    RabbitmqChannelProvider
  ],
  exports: [ConnectionService, RabbitmqChannelProvider ]
})
export class BillingModule {}
