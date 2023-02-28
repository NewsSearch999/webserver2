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
import { SearchDto } from './dto/search.dto';
import { deliveryState } from 'libs/entity/enum/delivery.enum';
import { orderState } from 'libs/entity/enum/order.enum';
import { OrdersService } from './orders.service';
import { IdPipe } from './pipes/id.pipe';
import { NumberPipe } from './pipes/number.pipe';
import { StringPipe } from './pipes/string.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * 주문생성
   * @param request
   * @returns
   */
  @UseGuards(AuthGuard())
  @Post()
  async createOrder(@Body() orderDto: OrderDto, @Req() req) {
    const { userId } = req.user; //주문자 ID
    const request = {
      productId: orderDto.productId,
      quantity: orderDto.quantity,
      orderState: orderState.결제대기,
      deliveryState: deliveryState.결제대기,
      userId: userId,
    };
    return this.ordersService.createOrder(request);
  }

  /**주문 결제 */
  @UseGuards(AuthGuard())
  @Put('payment/:orderId')
  async paymentOrder(
    @Param('orderId', NumberPipe) orderId: number,
    @Req() req,
  ) {
    const { userId } = req.user;
    return this.ordersService.paymentOrder(orderId, userId);
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
   * 메인 검색. 가격 오름차순.
   * 첫 페이지는 page = 1
   * 이후 페이지부터 page = 오름차순 정렬의 마지막 price, 즉 그 페이지의 가장 비싼 가격
   * @param price
   * @returns
   */
  @Get('main/:price/:productId')
  async getProducts(
    @Param('price', NumberPipe) price: number,
    @Param('productId', IdPipe) productId?: number,
  ) {
    const cursorPrice = price - 1;

    //첫 페이지는 가격 0 이상, 이후로는 마지막 가격을 파라미터로 받는다고 가정
    switch (cursorPrice) {
      case 0:
        const cursorId = 1;
        return this.ordersService.getProducts(cursorPrice, cursorId);

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
   * @param product
   * @param page
   * @returns
   */
  @Get('search/:productname/:price/:productid')
  async findProducts(
    @Param('productname', StringPipe) productName: string,
    @Param('price', NumberPipe) price: number,
    @Param('productId', IdPipe) productId?: number,
  ) {
    const cursorPrice = price - 1;

    //첫 페이지(page=1)는 가격 0 이상, 이후로는 마지막 가격을 파라미터로 받는다고 가정
    switch (price) {
      case 0:
        const cursorId = 1;
        return this.ordersService.findProducts(
          productName,
          cursorPrice,
          cursorId,
        );

      default:
        const lastPrice = price;
        const lastId = productId;
        return this.ordersService.findProducts(productName, lastPrice, lastId);
    }
  }
}
