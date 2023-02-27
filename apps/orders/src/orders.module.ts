import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { ConnectionService } from './connection/connection.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from 'libs/entity/order.entity';
import { Product } from 'libs/entity/product.entity';
import { RmqModule } from '@app/common/rmq/rmq.module';
import { BILLING_SERVICE } from './constants/service';
import { DatabaseModule } from 'libs/database/typeorm.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Product, Order]),
    RmqModule.register({
      name: BILLING_SERVICE,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ConnectionService],
})
export class OrdersModule {}
