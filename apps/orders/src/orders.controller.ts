import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { SearchDto } from './dto/search.dto';
import { deliveryState } from './enum/delivery.enum';
import { orderState } from './enum/order.enum';
import { OrdersService } from './orders.service';
import { NumberPipe } from './pipes/number.pipe';
import { StringPipe } from './pipes/string.pipe';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

    /**
   * 주문생성
   * @param request 
   * @returns 
   */
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

  /**
   * 주문조회
   * @returns 
   */
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
    @Param('page', NumberPipe) page:number
  ) {
    const pageNum = Number(page) - 1
    console.log(page)
    console.log(pageNum)

    //첫 페이지는 가격 0 이상, 이후로는 마지막 가격을 파라미터로 받는다고 가정
    switch(pageNum)
    {
      case 0 :
      return this.ordersService.getProducts(pageNum);

      default :
      const lastPrice = Number(page)
      return this.ordersService.getProducts(lastPrice);
    }
  }

    /**
   * 특정 상품 검색
   * @param product 
   * @param page 
   * @returns 
   */
  @Get('products/:product/:page')
  async findProducts(
    @Param('product', StringPipe) product: string,
    @Param('page', NumberPipe) page : number,
  ){

    const pageNum = Number(page) - 1
    console.log(page)
    console.log(pageNum)

    //첫 페이지는 가격 0 이상, 이후로는 마지막 가격을 파라미터로 받는다고 가정
    switch(pageNum)
    {
      case 0 : 
      return this.ordersService.findProducts(product, pageNum)
    
      default :
      const lastPrice = Number(page)
      return this.ordersService.findProducts(product, lastPrice)
    
    }
  }
  
}
