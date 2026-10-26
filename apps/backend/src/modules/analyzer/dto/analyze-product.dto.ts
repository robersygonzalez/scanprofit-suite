import { AnalyzeProductInput } from '@scanprofit/shared-types';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class AnalyzeProductDto implements AnalyzeProductInput {
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
