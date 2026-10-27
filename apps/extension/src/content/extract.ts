import type { ExtractedProductData } from '../messaging/types';
import {
  AMAZON_ASIN_ATTRIBUTE_SELECTOR,
  AMAZON_ASIN_INPUT_SELECTORS,
  AMAZON_DETAIL_CONTAINER_SELECTORS,
  AMAZON_PRICE_SELECTORS,
  WALMART_PRICE_META_SELECTORS,
  WALMART_PRICE_SELECTORS,
} from './selectors';

function parsePrice(rawText: string | null | undefined): number | null {
  if (!rawText) return null;
  const match = rawText.match(/\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?/);
  if (!match) return null;
  const value = Number.parseFloat(match[0].replace(/,/g, ''));
  return Number.isFinite(value) ? value : null;
}

function firstMatchingText(selectors: readonly string[]): string | null {
  for (const selector of selectors) {
    try {
      const text = document.querySelector(selector)?.textContent?.trim();
      if (text) return text;
    } catch {
      // Selector no soportado en este DOM: se intenta el siguiente.
    }
  }
  return null;
}

function firstMatchingAttribute(selectors: readonly string[], attribute: string): string | null {
  for (const selector of selectors) {
    try {
      const value = document.querySelector(selector)?.getAttribute(attribute)?.trim();
      if (value) return value;
    } catch {
      // Selector no soportado en este DOM: se intenta el siguiente.
    }
  }
  return null;
}

function extractWalmartPriceFromJsonLd(): number | null {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent ?? '');
      const candidates = Array.isArray(data) ? data : [data];
      for (const candidate of candidates) {
        const offers = candidate?.offers;
        const price = offers?.price ?? offers?.[0]?.price;
        const parsed = parsePrice(price !== undefined ? String(price) : null);
        if (parsed !== null) return parsed;
      }
    } catch {
      // JSON-LD inválido o con forma inesperada: se ignora.
    }
  }
  return null;
}

export function extractWalmartData(): ExtractedProductData {
  const priceText = firstMatchingText(WALMART_PRICE_SELECTORS);
  const priceFromMeta = firstMatchingAttribute(WALMART_PRICE_META_SELECTORS, 'content');
  const price = parsePrice(priceText) ?? parsePrice(priceFromMeta) ?? extractWalmartPriceFromJsonLd();

  return { source: 'walmart', url: location.href, price, upc: null, asin: null };
}

function extractAsinFromUrl(): string | null {
  const match = location.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return match ? match[1].toUpperCase() : null;
}

function extractAmazonAsin(): string | null {
  return (
    extractAsinFromUrl() ??
    firstMatchingAttribute(AMAZON_ASIN_INPUT_SELECTORS, 'value') ??
    firstMatchingAttribute([AMAZON_ASIN_ATTRIBUTE_SELECTOR], 'data-asin')
  );
}

function normalizeLabel(label: string): string {
  return label.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function extractAmazonUpc(): string | null {
  const labelCandidates = ['upc'].map(normalizeLabel);

  for (const containerSelector of AMAZON_DETAIL_CONTAINER_SELECTORS) {
    let rows: NodeListOf<Element>;
    try {
      rows = document.querySelectorAll(containerSelector);
    } catch {
      continue;
    }

    for (const row of rows) {
      const labelText = row.querySelector('th, span.a-text-bold')?.textContent ?? '';
      if (!labelCandidates.some((candidate) => normalizeLabel(labelText).includes(candidate))) {
        continue;
      }

      const valueText = row.querySelector('td, span.a-text-bold ~ span')?.textContent?.trim();
      const fallbackText = row.textContent?.replace(labelText, '').trim();
      const value = valueText || fallbackText;
      if (value) return value;
    }
  }

  return null;
}

export function extractAmazonData(): ExtractedProductData {
  const priceText = firstMatchingText(AMAZON_PRICE_SELECTORS);
  const price = parsePrice(priceText);
  const asin = extractAmazonAsin();
  const upc = extractAmazonUpc();

  return { source: 'amazon', url: location.href, price, upc, asin };
}
