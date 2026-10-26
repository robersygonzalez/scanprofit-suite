export interface AnalyzeProductInput {
  upc?: string;
  walmartPrice: number;
  amazonPrice: number;
  shippingCost?: number;
}
