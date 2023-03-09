import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { deliveryState } from '@app/common/entity/enum/delivery.enum';
import { orderState } from '@app/common/entity/enum/order.enum';
import { OrdersService } from './orders.service';
import { IdPipe } from './pipes/id.pipe';
import { NumberPipe } from './pipes/number.pipe';
import { StringPipe } from './pipes/string.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    ) {}

  /**
   * 주문생성
   * @body productId, quantity
   * @returns
   */
  // @UseGuards(AuthGuard())
  @Post('orders')
  async createOrder(@Body() orderDto: OrderDto, @Req() req) {
    // const { userId } = req.user; //주문자 ID
    let userId =1002
    const request = {
      productId: orderDto.productId,
      quantity: orderDto.quantity,
      orderState: orderState.결제대기,
      deliveryState: deliveryState.결제대기,
      userId: userId,
    };
    return this.ordersService.createOrder(request);
  }

  /**
   * 주문결제
   * @param orderId
   * @param req
   * @returns
   */
  // @UseGuards(AuthGuard())
  @Put('orders/:orderid') 
  async paymentOrder(
    @Param('orderid', NumberPipe) orderId: number,
    @Req() req,
  ) {
    // const { userId } = req.user;
    let userId = 1002
    return this.ordersService.paymentOrder(orderId, userId);
  }

  /**
   * 주문조회
   * @returns
   */
  @UseGuards(AuthGuard())
  @Get('orders')
  async getOrders(@Req() req) {
    const { userId } = req.user;
    return this.ordersService.getOrders(userId);
  }

  /**
   * 메인 검색. 가격 오름차순.
   * 첫 페이지는 기격 0
   * 이후 페이지부터 page = 오름차순 정렬의 마지막 price, 즉 그 페이지의 가장 비싼 가격
   * @param price
   * @returns
   */
  @Get('main/:price/:productid')
  async getProducts(
    @Param('price', NumberPipe) price: number,
    @Param('productid', IdPipe) productId?: number,
  ) {
    //첫 페이지는 가격 0 이상, 이후로는 마지막 가격을 파라미터로 받는다고 가정
    switch (price) {
      case 0:
        const cursorId = 1;
        return this.ordersService.getProducts(price, cursorId);

      default:
        const lastPrice = price;
        const lastId = productId;
        return this.ordersService.getProducts(lastPrice, lastId);
    }
  }

  /**
   * 특정 상품 검색
   * 첫 페이지는 page = 1
   * 이후 페이지부터 page = 오름차순 정렬의 마지막 price, 즉 그 페이지의 가장 비싼 가격
   * @param productName
   * @param price
   * @param productId
   * @returns
   */
  @Get('search/:productname/:price/:productid')
  async findProducts(
    @Param('productname', StringPipe) productName: string,
    @Param('price', NumberPipe) price: number,
    @Param('productid', IdPipe) productId?: number,
  ) {
    //첫 페이지(page=1)는 가격 0 이상, 이후로는 마지막 가격을 파라미터로 받는다고 가정
    switch (price) {
      case 0:
        const cursorId = 1;
        return this.ordersService.findProducts(productName, price, cursorId);

      default:
        const lastPrice = price;
        const lastId = productId;
        return this.ordersService.findProducts(productName, lastPrice, lastId);
    }
  }

  /**
   * 
   * ALB 헬스체크 경로
   */
  @Get('/')
  healthCheck(){
    console.log('orders app healthcheck')
  }

}
