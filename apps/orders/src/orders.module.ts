import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionService } from './connection/connection.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '@app/common/entity/order.entity';
import { Product } from '@app/common/entity/product.entity';
//import { DatabaseModule } from '@app/common/database/Database.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { RabbitmqChannelProvider } from '@app/common/rmq/rmq.connection';
import { OrdersPublish } from './orders.publish';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common/database/Database.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      //expandVariables: true,
      isGlobal: true,
      envFilePath: './libs/.libs.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Product, Order]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    ConnectionService,
    RabbitmqChannelProvider,
    OrdersPublish
  ],
})
export class OrdersModule {}
