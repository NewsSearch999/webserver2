import {
  HttpException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionService } from '@app/common/database/connection.service';
import { orderState } from '@app/common/entity/enum/order.enum';
import { OrdersPublish } from './orders.publish';

@Injectable()
export class OrdersService {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly ordersPublish: OrdersPublish,
    
  ) // @Inject(BILLING) private billingClient: ClientProxy, // @Inject(PAYMENT) private paymentClient: ClientProxy,
  {}

  async findProductByPK(productId) {
    const searchQuery = `SELECT * FROM products WHERE productId = (?)`;
    const connection =
      await this.connectionService.replicaConnection.getConnection();
    await connection.query('START TRANSACTION');

    const product = await connection.query(searchQuery, [[productId]]);
    await connection.commit();
    connection.release();
    return product[0][0];
  }

  /**
   * 주문 생성
   * @param request
   * @returns
   */
  async createOrder(request: object) {
    try {
      await this.ordersPublish.publishOrder(request);

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
    SELECT orders.orderId, orders.userId, orders.productId, orders.price, orders.orderState, orders.quantity, products.stock, products.productId, products.productName 
    FROM orders 
    LEFT OUTER JOIN products ON orders.productId = products.productId 
    WHERE orderId = ?`;

    // const connection =
    //   await this.connectionService.replicaConnectionBalancing();
    const connection = await this.connectionService.replicaConnection.getConnection()
    try {
      // Acquire the mutex to prevent concurrent access to the order data
      await connection.query('START TRANSACTION');

      /**주문 정보 조회 */
      const result = await connection.query(seekQuery, [Number(orderId)]);
      const orderData = JSON.parse(JSON.stringify(result))[0][0];
      console.log('result:', result[0]); //배열 안에 RowData 배열이 들어 있다.
      console.log('orderData:', orderData);

      /**주문자 확인 */
      if (orderData.userId !== userId)
        throw new HttpException('주문자가 일치하지 않습니다', 403);

      /**결제 유무 확인 */
      if (orderData.orderState == orderState.결제완료)
        throw new HttpException('이미 결제가 완료 되었습니다', 403);

      /**상품 수량 체크*/
      if (orderData.stock < orderData.quantity)
        throw new HttpException('재고가 부족합니다', 403);

      await connection.commit();
      connection.release();

      /**메세지큐(결제 데이터 전송)*/
      await this.ordersPublish.publishPayment(orderData);

      return `orderId:${orderData.orderId}, productName:${orderData.productName} : 결제처리 중입니다.`;
    } catch (error) {
      await connection.query('ROLLBACK');
      connection.release();
      console.log(error);
      throw new HttpException(error.response, error.status);
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
    const connection =
      await this.connectionService.replicaConnection.getConnection();

    const products = await connection.query(seekQuery, [
      price,
      price,
      productId,
    ]);

    connection.release();
    
    return products[0]
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

    const connection =
    await this.connectionService.replicaConnection.getConnection();
    const result = await connection.query(seekQuery, [
      lastPrice,
      productName,
      lastPrice,
      productName,
      productId,
    ]);

    return result[0]
  }

  /**주문 조회 */
  async getOrders(userId: number) {
    const searchQuery = `
    SELECT orderId,stock,products.price,quantity,productName,createdAt,orderState,deliveryState,image FROM orders
    LEFT OUTER JOIN products
    ON orders.productId = products.productId
    WHERE orders.userId = ?`;
    const connection =
    await this.connectionService.replicaConnection.getConnection();
    const orders = await connection.query(searchQuery, [userId]);

    connection.release();
    return orders[0]
  }
}
