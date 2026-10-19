export declare class RoiResponseDto {
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
