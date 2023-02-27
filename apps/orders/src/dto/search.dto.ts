import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class SearchDto {
    @IsOptional()
    @IsString()
    product: string;

    @IsNumber()
    @IsNotEmpty()
    page: number;
  }