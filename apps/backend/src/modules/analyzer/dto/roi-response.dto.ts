export class RoiResponseDto {
  amazonPrice: number;
  walmartPrice: number;
  shippingCost: number;
  referralFee: number;
  fbaFee: number;
  netProfit: number;
  roiPercentage: number;

  constructor(partial: Partial<RoiResponseDto>) {
    Object.assign(this, partial);
  }
}
