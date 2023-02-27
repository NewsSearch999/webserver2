import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import * as path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'libs/entity/user.entity';
import { join } from 'path';

const entityPath = path.join(__dirname, 'libs/entity/**/*.entity.ts');
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './libs/.libs.env',
        }),
      ],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: ['libs/entity/**/*.entity.ts', User],
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
