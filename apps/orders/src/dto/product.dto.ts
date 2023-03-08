import { ApiProperty } from '@nestjs/swagger';

export class getProductDto {
  @ApiProperty({ description: '상품Id' })
  productId: number;

  @ApiProperty({ description: '상품 이름' })
  productName: string;

  @ApiProperty({ description: '상품 이미지 URL' })
  image: string;

  @ApiProperty({ description: '상품 가격' })
  price: number;

  @ApiProperty({ description: '상품 재고' })
  stock: number;
}
