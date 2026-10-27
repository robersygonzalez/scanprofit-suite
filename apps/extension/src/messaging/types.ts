export type MarketplaceSource = 'walmart' | 'amazon';

export interface ExtractedProductData {
  source: MarketplaceSource;
  url: string;
  price: number | null;
  upc: string | null;
  asin: string | null;
}

export const SCAN_PROFIT_DATA_EXTRACTED = 'SCAN_PROFIT_DATA_EXTRACTED';
export const SCAN_PROFIT_REQUEST_DATA = 'SCAN_PROFIT_REQUEST_DATA';

export interface DataExtractedMessage {
  type: typeof SCAN_PROFIT_DATA_EXTRACTED;
  payload: ExtractedProductData;
}

export interface RequestDataMessage {
  type: typeof SCAN_PROFIT_REQUEST_DATA;
}

export type ScanProfitMessage = DataExtractedMessage | RequestDataMessage;
