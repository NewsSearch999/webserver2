import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderDto {
  @ApiProperty({ description: '상품Id', required: true })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: '주문수량', required: true })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class GetOrderDto {
  @ApiProperty({ description: '주문ID' })
  orderId: number;

  @ApiProperty({ description: '상품재고' })
  stock: number;

  @ApiProperty({ description: '상품가격' })
  price: number;

  @ApiProperty({ description: '주문수량' })
  quantity: number;

  @ApiProperty({ description: '상품이름' })
  productName: string;

  @ApiProperty({ description: '주문일자' })
  createdAt: Date;

  @ApiProperty({ description: '주문상태' })
  orderState: string;

  @ApiProperty({ description: '배송상태' })
  deliveryState: string;

  @ApiProperty({ description: '상품이미지' })
  image: string;
}
