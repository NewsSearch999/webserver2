import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { ConnectionService } from './connection/connection.service';
import { Order } from './entity/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Product } from './entity/product.entity';
import { RmqModule } from '@app/common/rmq/rmq.module';
import { BILLING_SERVICE } from './constants/service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_PORT: Joi.number().required(),
      }),
      envFilePath: './apps/orders/.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Product,
        Order
      ],
      keepConnectionAlive: true,
      // charset: 'utf8mb4',
      synchronize: false,
      logging: true,
    }),
    TypeOrmModule.forFeature([Product, Order]),
    RmqModule.register({
      name: BILLING_SERVICE,
    }), 
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ConnectionService],
})
export class OrdersModule {}
