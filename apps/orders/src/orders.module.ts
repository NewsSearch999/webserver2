import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionService } from './connection/connection.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '@app/common/entity/order.entity';
import { Product } from '@app/common/entity/product.entity';
import { DatabaseModule } from '@app/common/database/Database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { UsersModule } from './auth/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ExchangeFunction } from './util/exchange.function';
import { RabbitmqChannelProvider } from '@app/common/rmq/rmq.connection';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule,
    TypeOrmModule.forFeature([Product, Order]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    //메시지큐 부하분산
    // RmqModule.register({
    //   name: BILLING,
    //   exchange: 'exchange1',
    // }),
    // RmqModule.register({
    //   name: PAYMENT,
    //   exchange: 'exchange2',
    // }),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    ConnectionService,
    JwtStrategy,
    ExchangeFunction,
    RabbitmqChannelProvider,
  ],
})
export class OrdersModule {}
