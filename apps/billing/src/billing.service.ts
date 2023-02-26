import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name)

  message(data){
    this.logger.log('메시지큐...', data)
  }
}
