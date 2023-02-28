import { HttpException, Injectable, Logger } from '@nestjs/common';
import { deliveryState } from '@app/common/entity/enum/delivery.enum';
import { orderState } from '@app/common/entity/enum/order.enum';
import { ConnectionService } from './connection/connection.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  constructor(private readonly connectionService: ConnectionService) {}

  message(data) {
    this.logger.log('메시지큐...', data);
  }

  /**결제 트랜잭션 */
  async payment({ orderData }) {
    const connection = await this.connectionService.connection.getConnection();
    try {
      /**트랜잭션 시작 */
      await connection.query('START TRANSACTION');

      /**상품 재고 업데이트 */
      const productUpdateQuery = `
        UPDATE products SET stock = ?
        WHERE productId = ?
        `;

      /**주문 상태 업데이트 */
      const orderUpdateQuery = `
        UPDATE orders SET orderState = ?, deliveryState = ?
        WHERE orderId = ?
        `;

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
      await connection.release();
      this.logger.log(
        `[결제완료] 주문번호:${paymentData.orderId} 상품명:${paymentData.productName} 수량:${paymentData.quantity} 결제금액${paymentData.payment}원`,
      );
    } catch (e) {
      /**트랜잭션 롤백 */
      await connection.query('ROLLBACK');
      await connection.release();
      console.log(e);
      throw new HttpException(e.response, e.status);
    }
  }
}
