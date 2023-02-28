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
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'apps/auth/src/strategies/jwt.strategy';
import { UsersModule } from 'apps/auth/src/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    TypeOrmModule.forFeature([Product, Order]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RmqModule.register({
      name: BILLING_SERVICE,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ConnectionService, JwtStrategy],
})
export class OrdersModule {}
