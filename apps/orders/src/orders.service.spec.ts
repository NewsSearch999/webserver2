import { RabbitmqChannelProvider } from '@app/common/rmq/rmq.connection';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
// import { ConnectionService } from './connection/connection.service';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
       // ConnectionService,
        RabbitmqChannelProvider,
        ConfigService
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrders', () => {

    it('return array', () => {
      const result = service.getOrders(1);
      expect(result).toBeInstanceOf(Promise);
    });


    
  });
});
