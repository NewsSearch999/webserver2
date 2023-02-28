import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import * as Joi from 'joi';
import { RmqModule } from '@app/common/rmq/rmq.module';
import { ConnectionService } from './connection/connection.service';
import { DatabaseModule } from 'libs/database/typeorm.module';
import { UsersModule } from 'apps/auth/src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'libs/entity/order.entity';
import { Product } from 'libs/entity/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BILLING_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/billing/.env',
    }),
    RmqModule,
  ],
  controllers: [BillingController],
  providers: [BillingService, ConnectionService],
})
export class BillingModule {}
