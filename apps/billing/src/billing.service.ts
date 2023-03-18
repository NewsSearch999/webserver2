import { HttpException, Injectable, Logger } from '@nestjs/common';
import { deliveryState } from '@app/common/entity/enum/delivery.enum';
import { orderState } from '@app/common/entity/enum/order.enum';
import { ConnectionService } from './connection/connection.service';

@Injectable()
export class BillingService {
  //logger 객체가 비동기적으로 동작하지 않아 cosole.log로 수정합니다.
  // private readonly logger = new Logger(BillingService.name);
  constructor(private readonly connectionService: ConnectionService) {}

  async findProductByPK(productId: number) {
    const searchQuery = `SELECT * FROM products WHERE productId = (?)`;
    const connection =
      await this.connectionService.replicaConnection.getConnection();
    await connection.query('START TRANSACTION');
    const product = await connection.query(searchQuery, [[productId]]);
    await connection.commit();
    connection.release();

    return product[0][0];
  }

  async createOrder(request) {
    const createQuery = `INSERT INTO orders (productId, quantity, price, orderState, deliveryState,userId) values (?)`;
    const connection =
      await this.connectionService.masterConnection.getConnection();

    try {
      /**트랜잭션 시작 */
      await connection.query('START TRANSACTION');
      // await connection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

      /**상품 정보 확인 */
      const product = await this.findProductByPK(request.productId);
      if (!product) throw new HttpException('상품정보가 없습니다', 403);
      if (product.stock <= 0) {
        return '재고 수량이 없습니다.';
      }

      const [results, fields] = await connection.query(createQuery, [
        [
          request.productId,
          request.quantity,
          product[0].price,
          request.orderState,
          request.deliveryState,
          request.userId,
        ],
      ]);

      if (results) {
        /**트랜잭션 커밋 */
        await connection.commit();
        connection.release();
        console.log(
          `[주문완료] 상품번호:${request.productId}, 수량:${request.quantity}`,
        );
        return fields;
      }
    } catch (e) {
      /**트랜잭션 롤백 */
      await connection.query('ROLLBACK');
      connection.release();
      console.log(e);
      throw new HttpException(e.response, e.status);
    }
  }

  /**결제 트랜잭션 */
  async payment(orderData) {
    const connection =
      await this.connectionService.masterConnection.getConnection();
    try {
      /**트랜잭션 시작 */
      await connection.query('START TRANSACTION');
      //await connection.query('SET SESSIION TRANSACTION ISOLATION LEVEL READ COMMITTED');
      /**
       * https://dev.mysql.com/doc/refman/8.0/en/set-transaction.html
       * code: 'ER_CANT_CHANGE_TX_ISOLATION',
          errno: 1568,
          sql: 'SET TRANSACTION ISOLATION LEVEL READ COMMITTED',
          sqlState: '25001',
          sqlMessage: "Transaction characteristics can't be changed while a transaction is in progress"
       */
      /**상품 재고 업데이트 */
      const productUpdateQuery = `UPDATE products SET stock = ? WHERE productId = ?`;
      // const productUpdateQuery = `UPDATE products SET stock = ? WHERE productId = ? FOR UPDATE`;
      //FOR UPDATE 절은 SELECT 문에서 사용되어 해당 행을 다른 트랜잭션으로부터 잠금(lock)을 걸어서 동시에 수정되지 않도록 하는 데 사용됩니다

      /**주문 상태 업데이트 */
      const orderUpdateQuery = `UPDATE orders SET orderState = ?, deliveryState = ? WHERE orderId = ?`;

      /**남은 수량 */
      const leftQuantity = orderData.stock - orderData.quantity;

      /**수량 업데이트 */
      await connection.query(productUpdateQuery, [
        leftQuantity,
        orderData.productId,
      ]);

      const updateOrderState = orderState.결제완료;
      const updateDeliveryState = deliveryState.배송대기;

      /**주문 상태 배송상태 업데이트 */
      await connection.query(orderUpdateQuery, [
        updateOrderState,
        updateDeliveryState,
        orderData.orderId,
      ]);

      /**결제 데이터 */
      const paymentData = {
        orderId: orderData.orderId,
        productId: orderData.productId,
        productName: orderData.productName,
        quantity: orderData.quantity,
        price: orderData.price,
        payment: orderData.price * orderData.quantity,
      };

      /**트랜잭션 커밋 */
      await connection.commit();
      connection.release();
      console.log(
        `[결제완료] 주문번호:${paymentData.orderId} 상품명:${paymentData.productName} 수량:${paymentData.quantity} 결제금액${paymentData.payment}원`,
      );
    } catch (e) {
      /**트랜잭션 롤백 */
      await connection.query('ROLLBACK');
      connection.release();
      console.log(e);
      throw new HttpException(e.response, e.status);
    }
  }
}
