import { useEffect, useState } from 'react';
import type { RoiCalculationResult } from '@scanprofit/shared-types';
import {
  SCAN_PROFIT_DATA_EXTRACTED,
  SCAN_PROFIT_REQUEST_DATA,
  type ExtractedProductData,
  type ScanProfitMessage,
} from '../messaging/types';

function formatRoi(result: Pick<RoiCalculationResult, 'roiPercentage'>): string {
  return `${result.roiPercentage.toFixed(2)}%`;
}

function App() {
  const [extracted, setExtracted] = useState<ExtractedProductData | null>(null);

  useEffect(() => {
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (!tabId) return;

      chrome.tabs.sendMessage(tabId, { type: SCAN_PROFIT_REQUEST_DATA }, (response) => {
        if (chrome.runtime.lastError || !response) return;
        setExtracted(response as ExtractedProductData);
      });
    });

    const handleMessage = (message: ScanProfitMessage) => {
      if (message?.type === SCAN_PROFIT_DATA_EXTRACTED) {
        setExtracted(message.payload);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  return (
    <div className="flex h-full flex-col gap-3 p-4 bg-white text-slate-900">
      <h1 className="text-xl font-semibold">Panel de análisis</h1>
      <p className="text-sm text-slate-600">ROI estimado: {formatRoi({ roiPercentage: 0 })}</p>

      {extracted && (
        <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Detectado en {extracted.source === 'walmart' ? 'Walmart' : 'Amazon'}
          </p>
          <p>Precio: {extracted.price != null ? `$${extracted.price.toFixed(2)}` : 'No disponible'}</p>
          {(extracted.upc ?? extracted.asin) && <p>Código: {extracted.upc ?? extracted.asin}</p>}
        </div>
      )}
    </div>
  );
}

export default App;
