import { Logger, Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { RmqModule } from '@app/common/rmq/rmq.module';
import { ConnectionService } from './connection/connection.service';
import { DatabaseModule } from '@app/common/database/typeorm.module';

@Module({
  imports: [
    DatabaseModule,
    RmqModule,
  ],
  controllers: [BillingController],
  providers: [BillingService, ConnectionService],
})
export class BillingModule {}
