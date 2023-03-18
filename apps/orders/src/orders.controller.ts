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
import { GetOrderDto, OrderDto } from './dto/order.dto';
import { deliveryState } from '@app/common/entity/enum/delivery.enum';
import { orderState } from '@app/common/entity/enum/order.enum';
import { OrdersService } from './orders.service';
import { IdPipe } from './pipes/id.pipe';
import { NumberPipe } from './pipes/number.pipe';
import { StringPipe } from './pipes/string.pipe';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { number } from 'joi';
import { getProductDto } from './dto/product.dto';

@ApiTags('Order')
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * 주문생성
   * @body productId, quantity
   * @returns
   */
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  @Post('orders')
  @ApiOperation({ summary: '주문생성' })
  @ApiResponse({ status: 201, description: '주문생성 완료' })
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

  /**
   * 주문결제
   * @param orderId
   * @param req
   * @returns
   */
  @ApiBearerAuth('access-token')
  //@UseGuards(AuthGuard())
  @Put('orders/:orderId')
  @ApiOperation({ summary: '주문결제' })
  @ApiResponse({ status: 201, description: '주문처리중' })
  @ApiParam({ name: 'orderId', type: number, description: '주문ID' })
  async paymentOrder(
    //@Body('orderId', NumberPipe) orderId: number,
    @Param('orderId', NumberPipe) orderId: number,
    //@Req() req,
  ) {
    //const { userId } = req.user;
    const userId = 1002
    console.log(orderId)
    return this.ordersService.paymentOrder(orderId, userId);
  }

  /**
   * 주문조회
   * @returns
   */
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  @Get('orders')
  @ApiOperation({ summary: '주문조회' })
  @ApiResponse({
    status: 200,
    description: '주문리스트',
    type: GetOrderDto,
    isArray: true,
  })
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
  @ApiOperation({ summary: '메인페이지 상품 리스트' })
  @ApiParam({ name: 'price', description: '검색가격', required: false })
  @ApiParam({ name: 'productId', description: '검색상품Id', required: false })
  @ApiResponse({
    status: 200,
    description: '상품리스트',
    type: getProductDto,
    isArray: true,
  })
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
  @ApiOperation({ summary: '상품검색 조회' })
  @ApiResponse({
    status: 200,
    description: '상품리스트',
    type: getProductDto,
    isArray: true,
  })
  @ApiParam({ name: 'productName', description: '상품검색이름' })
  @ApiParam({ name: 'price', description: '검색가격' })
  @ApiParam({ name: 'productid', description: '검색상품ID' })
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
  @ApiOperation({ summary: '헬스체크 루트경로' })
  healthCheck() {
    console.log('orders app healthcheck');
  }
}
