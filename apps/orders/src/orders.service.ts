import {
  HttpException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionService } from './connection/connection.service';
import { BILLING_SERVICE } from './constants/service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly connectionService: ConnectionService,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async findProductByPK(productId) {
    const searchQuery = `SELECT * FROM products WHERE productId = (?)`;
    const product = await this.connectionService.Query(searchQuery, [
      [productId],
    ]);
    return product;
  }

  /**
   * 주문 생성
   * @param request
   * @returns
   */
  async createOrder(request) {
    const createQuery = `INSERT INTO orders (productId, quantity, price, orderState, deliveryState,userId) values (?)`;
    try {
      const product = await this.findProductByPK(request.productId);
      if (!product[0]) throw new HttpException('상품정보가 없습니다', 403);
      const order = await this.connectionService.Query(createQuery, [
        [
          request.productId,
          request.quantity,
          product[0].price,
          request.orderState,
          request.deliveryState,
          request.userId,
        ],
      ]);
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
        }),
      );

      return order;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 메인 상품 검색. 일단 가격 싼 순서대로 페이지네이션
   * @param page
   * @returns
   */

  async getProducts(price : number, productId?:number ){
    const seekQuery = `
    SELECT productId, productName, image, price, stock  FROM products
    WHERE price >= ? AND productId >= ? AND isDeleted = false 
    ORDER BY price, productId
    LIMIT 20`

    return this.connectionService.Query(
      seekQuery, [ price, productId ]
    )

  }

  /**
   * 특정 상품 검색
   * @param product
   * @param page
   * @returns
   */

  async findProducts(product:string, page:Number, productId?:number){
    const productName = product
    //첫 페이지는 가격 0 이상, 이후로는 마지막 가격을 파라미터로 받는다고 가정
    const lastPrice = Number(page);
    const seekQuery = `
    SELECT productId, productName, image, price, stock FROM products 
    WHERE price >= ? AND productName = ? AND productId >= ? AND isDeleted = false
    ORDER BY price, productId
    LIMIT 20`
    return this.connectionService.Query(
      seekQuery, [ lastPrice, productName, productId ]
    )
    
  }

  async getOrders() {
    const searchQuery = `
    SELECT * FROM Orders`;
    return this.connectionService.Query(searchQuery, []);
  }
}
