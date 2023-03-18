import { Module } from '@nestjs/common';
import { BillingControllerA } from './billing.controller.A';
import { BillingService } from './billing.service';
import { ConnectionService } from './connection/connection.service';
import { RabbitmqChannelProvider } from '@app/common/rmq/rmq.connection';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi'
import { BillingControllerB } from './billing.controller.B';
import { BillingControllerC } from './billing.controller.C';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({ 
        RABBIT_MQ_URI_A:  Joi.string().required(),
        RABBIT_MQ_URI_B:  Joi.string().required(),
        RABBIT_MQ_URI_C:  Joi.string().required(),
        MASTER_DB_HOST: Joi.string().required(),
        REPLICA_DB_HOST: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD : Joi.string().required(),
        DB_NAME : Joi.string().required(),
        DB_PORT : Joi.number().required()
      }),
      envFilePath: ['./libs/.libs.env'],
    }),
  ],
  controllers: [BillingControllerA, BillingControllerB, BillingControllerC],
  providers: [
    BillingService,
    ConnectionService,
    RabbitmqChannelProvider
  ],
  //exports: [ConnectionService, RabbitmqChannelProvider ]
})
export class BillingModule {}
