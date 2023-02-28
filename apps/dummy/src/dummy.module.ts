import { Module } from '@nestjs/common';
import { ConnectionService } from './connection/connection.service';
import { DummyController } from './dummy.controller';
import { DummyService } from './dummy.service';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PORT: Joi.number().required(),
      }),
      envFilePath: 'libs/.libs.env',
    }),
  ],
  controllers: [DummyController],
  providers: [DummyService, ConnectionService],
})
export class DummyModule {}
