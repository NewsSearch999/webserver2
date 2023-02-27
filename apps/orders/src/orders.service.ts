import { Inject, Injectable } from '@nestjs/common';
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

  async findProductByPK(productId){
    const searchQuery = `SELECT * FROM products WHERE productId = (?)`
    const product = await this.connectionService.Query(
      searchQuery, [
        [
          productId
        ]
      ]
    )
    return product
  }

  /**
   * 주문 생성
   * @param request 
   * @returns 
   */
  async createOrder(request) {

    const createQuery = `INSERT INTO orders (productId, quantity, price, orderState, deliveryState) values (?)`;
    try {
      const product = await this.findProductByPK(request.productId)
      console.log(product[0])
      
      const order = await this.connectionService.Query(createQuery, [
        [
          request.productId,
          request.quantity,
          product[0].price,
          request.orderState,
          request.deliveryState
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
  async getProducts(page : number){
    const pageNum = Number(page)
    const offSetQuery = `
    SELECT * FROM products 
    WHERE isDeleted = false 
    ORDER BY price ASC 
    LIMIT 10 OFFSET ?`

    const lastPrice = Number(page)
    const seekQuery = `
    SELECT * FROM products
    WHERE isDeleted = false AND price > ?
    ORDER BY price ASC
    LIMIT 10`

    // return this.connectionService.Query(
    //   offSetQuery, [ pageNum ]
    // )

    return this.connectionService.Query(
      seekQuery, [ lastPrice ]
    )
  }


  /**
   * 특정 상품 검색
   * @param product 
   * @param page 
   * @returns 
   */
  async findProducts(product:string, page:Number){
    const productName = product
    const pageNum = Number(page)
    const offSetQuery = `
    SELECT * FROM products 
    WHERE productName = ? AND isDeleted = false 
    ORDER BY price ASC 
    LIMIT 10 OFFSET ?`


    //첫 페이지는 가격 0 이상, 이후로는 마지막 가격을 파라미터로 받는다고 가정
    const lastPrice = Number(page)
    const seekQuery = `
    SELECT * FROM products 
    WHERE productName = ? AND isDeleted = false AND price > ?
    ORDER BY price ASC 
    LIMIT 10`


    // return this.connectionService.Query(
    //   offSetQuery, [ productName, pageNum ]
    // )

    return this.connectionService.Query(
      seekQuery, [ productName, lastPrice]
    )
    
  }

  async getOrders() {
    const searchQuery = `
    SELECT * FROM Orders`;
    return this.connectionService.Query(
      searchQuery, []
    );
  }
}
