import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class AnalyzeProductDto {
  @IsOptional()
  @IsString()
  upc?: string;

  @IsNumber()
  @IsPositive()
  walmartPrice: number;

  @IsNumber()
  @IsPositive()
  amazonPrice: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  shippingCost?: number;
}
