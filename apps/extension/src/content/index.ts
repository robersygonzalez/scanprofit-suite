import {
  SCAN_PROFIT_DATA_EXTRACTED,
  SCAN_PROFIT_REQUEST_DATA,
  type ExtractedProductData,
  type MarketplaceSource,
  type ScanProfitMessage,
} from '../messaging/types';
import { extractAmazonData, extractWalmartData } from './extract';

let lastExtractedData: ExtractedProductData | null = null;

function detectSource(): MarketplaceSource | null {
  const host = location.hostname;
  if (host.includes('walmart.com')) return 'walmart';
  if (host.includes('amazon.com')) return 'amazon';
  return null;
}

function safeExtract(source: MarketplaceSource): ExtractedProductData {
  try {
    return source === 'walmart' ? extractWalmartData() : extractAmazonData();
  } catch {
    // Si la extracción falla, se devuelven campos vacíos para que el usuario los complete a mano.
    return { source, url: location.href, price: null, upc: null, asin: null };
  }
}

function sendExtractedData(data: ExtractedProductData): void {
  if (!chrome?.runtime?.sendMessage) return;

  try {
    chrome.runtime.sendMessage({ type: SCAN_PROFIT_DATA_EXTRACTED, payload: data }, () => {
      // Se consulta lastError para evitar "Unchecked runtime.lastError" cuando el
      // popup/sidepanel no está abierto; no hay nada que manejar en ese caso.
      void chrome.runtime.lastError;
    });
  } catch {
    // El contexto de la extensión puede invalidarse tras una recarga/actualización.
  }
}

function runExtraction(): void {
  const source = detectSource();
  if (!source) return;

  const data = safeExtract(source);
  lastExtractedData = data;
  sendExtractedData(data);
}

if (chrome?.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((message: ScanProfitMessage, _sender, sendResponse) => {
    if (message?.type === SCAN_PROFIT_REQUEST_DATA) {
      sendResponse(lastExtractedData);
    }
  });
}

runExtraction();

// Walmart y Amazon hidratan el precio de forma asíncrona tras la carga inicial del DOM,
// por lo que se reintenta unas pocas veces hasta obtener un precio o agotar los intentos.
for (const delay of [500, 1500, 3000]) {
  window.setTimeout(() => {
    if (lastExtractedData?.price == null) runExtraction();
  }, delay);
}
