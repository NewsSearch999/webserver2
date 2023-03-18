import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionService } from '@app/common/database/connection.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '@app/common/entity/order.entity';
import { Product } from '@app/common/entity/product.entity';
import { DatabaseModule } from '@app/common/database/Database.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { RabbitmqChannelProvider } from '@app/common/rmq/rmq.connection';
import { OrdersPublish } from './orders.publish';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Product, Order]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
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
    RabbitmqChannelProvider,
    OrdersPublish,
  ],
})
export class OrdersModule {}
