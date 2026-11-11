export interface Product {
  upc: string;
  title: string;
  bsr: number;
  amazonPrice: number;
  imageUrl: string;
  asin?: string;
  referralFee?: number;
  fbaFee?: number;
}
