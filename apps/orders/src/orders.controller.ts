import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { SearchDto } from './dto/search.dto';
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
      quantity: orderDto.quantity,
      orderState: orderState.결제대기,
      deliveryState: deliveryState.결제대기,
    };
    return this.ordersService.createOrder(request);
  }

  @Get('orders')
  async getOrders() {
    return this.ordersService.getOrders();
  }

  /**
   * 메인 검색. 일단 가격 싼 순서대로 페이지네이션
   * @param page 
   * @returns 
   */
  @Get('products/:page')
  async getProducts(
    @Param('page') page: SearchDto
  ) {
    return this.ordersService.getProducts(page);
  }

  @Get('products/:product/:page')
  async findProducts(
    @Param() request: SearchDto
  ){
    const product = request.product
    const page = request.page
    return this.ordersService.findProducts(product, page)
  }
  
}
