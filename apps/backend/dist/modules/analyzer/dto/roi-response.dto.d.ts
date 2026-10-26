import { RoiCalculationResult } from '@scanprofit/shared-types';
export declare class RoiResponseDto implements RoiCalculationResult {
    amazonPrice: number;
    walmartPrice: number;
    shippingCost: number;
    totalCost: number;
    referralFee: number;
    fbaFee: number;
    netProfit: number;
    roiPercentage: number;
    constructor(partial: Partial<RoiResponseDto>);
}
