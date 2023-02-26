import {
    IsNotEmpty,
    IsNumber,
    IsPhoneNumber,
    IsPositive,
    IsString,
  } from 'class-validator';
  
  export class OrderDto {
    @IsNumber()
    @IsNotEmpty()
    productId: number;
  
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

  }