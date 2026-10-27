export const WALMART_PRICE_SELECTORS = [
  'span[itemprop="price"]',
  'span[data-testid="price-wrap"] span[itemprop="price"]',
  'div[data-testid="price-wrap"] span',
  'span[data-automation-id="product-price"]',
  'div[data-testid="price-section"] span',
  'span.price-characteristic',
] as const;

export const WALMART_PRICE_META_SELECTORS = ['meta[itemprop="price"]'] as const;

export const AMAZON_PRICE_SELECTORS = [
  '#corePriceDisplay_desktop_feature_div .a-price .a-offscreen',
  '#corePrice_feature_div .a-price .a-offscreen',
  '#apex_desktop .a-price .a-offscreen',
  'span.priceToPay .a-offscreen',
  'span.a-price.apexPriceToPay .a-offscreen',
  '#price_inside_buybox',
  '#priceblock_ourprice',
  '#priceblock_dealprice',
  '.a-price .a-offscreen',
] as const;

export const AMAZON_ASIN_INPUT_SELECTORS = ['#ASIN', 'input[name="ASIN"]'] as const;

export const AMAZON_ASIN_ATTRIBUTE_SELECTOR = '[data-asin]:not([data-asin=""])';

export const AMAZON_DETAIL_CONTAINER_SELECTORS = [
  '#productDetails_detailBullets_sections1 tr',
  '#detailBulletsWrapper_feature_div li',
  '#prodDetails tr',
  '#detailBullets_feature_div li',
] as const;
