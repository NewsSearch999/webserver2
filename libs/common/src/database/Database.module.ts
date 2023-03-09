import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import * as path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '@app/common/entity/user.entity';
import { Product } from '@app/common/entity/product.entity';
import { Order } from '@app/common/entity/order.entity';

const entityPath = path.join(__dirname, 'libs/entity/**/*.entity.ts');
@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      envFilePath: './libs/.libs.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        entities: [entityPath, User, Product, Order],
        replication: {
          master: {
            host: configService.get('MASTER_DB_HOST'),
            port: +configService.get('DB_PORT'),
            username: configService.get('DB_USER'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
          },
          slaves: [
            {
              host: configService.get('SLAVE1_DB_HOST'),
              port: +configService.get('DB_PORT'),
              username: configService.get('DB_USER'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_NAME'),
            },
            {
              host: configService.get('SLAVE2_DB_HOST'),
              port: +configService.get('DB_PORT'),
              username: configService.get('DB_USER'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_NAME'),
            },
          ],
        },
        synchronize: false,
        logging: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
