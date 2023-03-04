import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { ConnectionService } from './connection/connection.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '@app/common/entity/order.entity';
import { Product } from '@app/common/entity/product.entity';
import { RmqModule } from '@app/common/rmq/rmq.module';
import { BILLING_SERVICE, PAYMENT_SERVICE } from './constants/service';
import { DatabaseModule } from '@app/common/database/Database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { UsersModule } from './auth/users/users.module';
import { AuthModule } from './auth/auth.module';
import { RmqService } from '@app/common/rmq/rmq.service';

@Module({
  imports: [
    RmqModule,
    AuthModule,
    DatabaseModule,
    UsersModule,
    TypeOrmModule.forFeature([Product, Order]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // RmqModule.register({
    //   name: BILLING_SERVICE,
    // }),
    // RmqModule.register({
    //   name: PAYMENT_SERVICE,
    // }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ConnectionService, JwtStrategy],
})
export class OrdersModule {}
