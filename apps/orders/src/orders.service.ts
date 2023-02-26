import { Inject, Injectable } from '@nestjs/common';
import { ConnectionService } from './connection/connection.service';
import { BILLING_SERVICE } from './constants/service';
import { ClientProxy } from '@nestjs/microservices';
import { OrderDto } from './dto/order.dto';
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

  async getOrders() {
    const searchQuery = `SELECT * FROM Orders`;
    return this.connectionService.Query(
      searchQuery, []
    );
  }
}
