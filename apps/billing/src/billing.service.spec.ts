import { RabbitmqChannelProvider } from '@app/common/rmq/rmq.connection';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getProductDto } from 'apps/orders/src/dto/product.dto';
import { BillingService } from './billing.service';
import { ConnectionService } from './connection/connection.service';


describe('BillingService', () => {
  let billingService: BillingService;

  beforeEach(async () => {
    //가짜 모듈
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        
      ],
      providers: [
        BillingService,
        ConnectionService,
        RabbitmqChannelProvider,
        // {
        //   provide: ConnectionService,
        //   useClass: MockConnectionService, // use the mock class here
        // },
      ],
    }).compile();

    billingService = module.get<BillingService>(BillingService);
    //connectionServiceMock = module.get<ConnectionService>(ConnectionService);
  });

  it('should be defined', () => {
    expect(billingService).toBeDefined();
  });

  describe('findProductByPK', () => {
    it('return product by productId', async () => {
      const productData: getProductDto = {
        productId: 1,
        productName: 'Car',
        image: 'https://loremflickr.com/640/480',
        price: 6325,
        stock: 422,
      };

      const searchQueryMock = jest.fn();
      searchQueryMock.mockResolvedValue({
        rows: [productData],
      });

      const result = billingService.findProductByPK(1);
      expect(result).toBeInstanceOf(Promise);
      expect(result).toBe(productData);
    });
  });

  describe('createOrder', () => {});
});
