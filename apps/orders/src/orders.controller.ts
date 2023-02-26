import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { deliveryState } from './enum/delivery.enum';
import { orderState } from './enum/order.enum';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post()
  async createOrder(@Body() orderDto: OrderDto, @Req() req: any) {
    const request = {
      productId: orderDto.productId,
      price: orderDto.price,
      quantity: orderDto.quantity,
      orderState: orderState.결제대기,
      deliveryState: deliveryState.결제대기,
    };
    return this.ordersService.createOrder(request);
  }

  @Get()
  async getOrders() {
    return this.ordersService.getOrders();
  }
}
