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
import { CursorFunction } from './util/cursor.fuction';
import { CONNECTION_NAME1 } from './constants/service';
import { CONNECTION_NAME2 } from './constants/service';
import { ExchangeFunction } from './util/exchange.function';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule,
    TypeOrmModule.forFeature([Product, Order]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    //메시지큐 부하분산
    RmqModule.register({
      name: CONNECTION_NAME1,
    }),
    RmqModule.register({
      name: CONNECTION_NAME2,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ConnectionService, JwtStrategy, ExchangeFunction],
})
export class OrdersModule {}
