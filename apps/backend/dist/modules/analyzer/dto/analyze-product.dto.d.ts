import { AnalyzeProductInput } from '@scanprofit/shared-types';
export declare class AnalyzeProductDto implements AnalyzeProductInput {
    upc?: string;
    walmartPrice: number;
    amazonPrice: number;
    shippingCost?: number;
}
