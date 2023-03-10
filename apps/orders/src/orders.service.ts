import {
  HttpException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionService } from './connection/connection.service';
import { orderState } from '@app/common/entity/enum/order.enum';
import { ExchangeFunction } from './util/exchange.function';
import { RabbitmqChannelProvider } from '@app/common/rmq/rmq.connection';

@Injectable()
export class OrdersService {
  private channel: any;
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly exchangeFunction: ExchangeFunction,
    private readonly rabbitmqChannelProvider: RabbitmqChannelProvider, // @Inject(BILLING) private billingClient: ClientProxy,
  ) // @Inject(PAYMENT) private paymentClient: ClientProxy,
  {}

  async findProductByPK(productId) {
    const searchQuery = `SELECT * FROM products WHERE productId = (?)`;
    const product = await this.connectionService.slaveQuery(searchQuery, [
      [productId],
    ]);
    return product;
  }

  /**
   * 주문 생성
   * @param request
   * @returns
   */
  async createOrder(request: object) {
    try {
      //balanceArr = [exchange1 or 2, billing1 or 2, payment1 or 2]
      const [exchangeName, billingQueue, paymentQueue] =
        this.exchangeFunction.exchangeBalancing();

      this.channel = await this.rabbitmqChannelProvider.createChannel();

      //publish(exchange: string, routingKey: string, content: Buffer, options?: Options.Publish): boolean;
      this.channel.publish(
        exchangeName,
        `${exchangeName}.${billingQueue}`,
        Buffer.from(JSON.stringify(request)),
      );
      // channel.sendToQueue(billingQueue, Buffer.from(JSON.stringify(request)))

      // await channel.close();

      return `${request}: 주문처리 중입니다.`;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**주문 결제
   * @param orderId 주문ID
   * @param userId 유저ID
   */
  async paymentOrder(orderId: number, userId: number) {
    /**주문정보 조회 */
    const seekQuery = `
    SELECT orders.orderId,orders.userId,orders.productId,orders.price,orders.orderState,orders.quantity,products.stock,products.productId,products.productName 
    FROM orders
    LEFT OUTER JOIN products
    ON orders.productId = products.productId
    WHERE orderId = ?
    `;

    try {

      /**주문 정보 조회 */
      const row = await this.connectionService.slaveQuery(seekQuery, [orderId]);
      const orderData = row[0];

      /**주문자 확인 */
      if (orderData.userId !== userId)
        throw new HttpException('주문자가 일치하지 않습니다', 403);

      /**결제 유무 확인 */
      if (orderData.orderState == orderState.결제완료)
        throw new HttpException('이미 결제가 완료 되었습니다', 403);

      /**상품 수량 체크*/
      if (orderData.stock < orderData.quantity)
        throw new HttpException('재고가 부족합니다', 403);

      /**메세지큐(결제 데이터 전송)*/
      //balanceArr = [exchange1 or 2, billing1 or 2, payment1 or 2]
      const [exchangeName, billingQueue, paymentQueue] =
        this.exchangeFunction.exchangeBalancing();

      this.channel = await this.rabbitmqChannelProvider.createChannel();

      this.channel.publish(
        exchangeName,
        `${exchangeName}.${paymentQueue}`,
        Buffer.from(JSON.stringify(orderData)),
      );
      return `${orderData}: 결제처리 중입니다.`;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * 메인 상품 검색. 일단 가격 싼 순서대로 페이지네이션
   * @param page
   * @returns
   */

  async getProducts(price: number, productId?: number) {
    const seekQuery = `
    SELECT productId, productName, image, price, stock
    FROM products
    WHERE ((price > ? AND isDeleted = false) OR (price = ? AND productId > ? AND isDeleted = false))
    ORDER BY price, productId
    LIMIT 20`;

    return this.connectionService.slaveQuery(seekQuery, [
      price,
      price,
      productId,
    ]);
  }

  /**
   * 특정 상품 검색
   * @param product
   * @param page
   * @returns
   */

  async findProducts(product: string, page: Number, productId?: number) {
    const productName = product;
    //첫 페이지는 가격 0 이상, 이후로는 마지막 가격을 파라미터로 받는다고 가정
    const lastPrice = Number(page);
    const seekQuery = `
    SELECT productId, productName, image, price, stock FROM products 
    WHERE ((price > ? AND productName = ? AND isDeleted = false) OR (price = ? AND productName = ? AND productId > ? AND isDeleted = false))
    ORDER BY price, productId
    LIMIT 20`;
    return this.connectionService.slaveQuery(seekQuery, [
      lastPrice,
      productName,
      lastPrice,
      productName,
      productId,
    ]);
  }

  /**주문 조회 */
  async getOrders(userId: number) {
    const searchQuery = `
    SELECT orderId,stock,products.price,quantity,productName,createdAt,orderState,deliveryState,image FROM orders
    LEFT OUTER JOIN products
    ON orders.productId = products.productId
    WHERE orders.userId = ?`;
    return this.connectionService.slaveQuery(searchQuery, [userId]);
  }
}
