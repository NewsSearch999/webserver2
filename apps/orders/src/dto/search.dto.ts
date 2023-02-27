import {
    IsNotEmpty,
    IsNumber,
    IsString,
  } from 'class-validator';
  
  export class SearchDto {
    @IsString()
    product: string;

    @IsNumber()
    @IsNotEmpty()
    page: number;
  }