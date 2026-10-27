import { useEffect, useState } from 'react';
import type { RoiCalculationResult } from '@scanprofit/shared-types';
import { ApiUnreachableError, calculateRoi } from '../services/api';
import {
  SCAN_PROFIT_DATA_EXTRACTED,
  SCAN_PROFIT_REQUEST_DATA,
  type ExtractedProductData,
  type ScanProfitMessage,
} from '../messaging/types';

function App() {
  const [walmartPrice, setWalmartPrice] = useState('0.00');
  const [amazonPrice, setAmazonPrice] = useState('0.00');
  const [shippingCost, setShippingCost] = useState('1.00');
  const [productCode, setProductCode] = useState<string | null>(null);
  const [result, setResult] = useState<RoiCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const applyExtractedData = (data: ExtractedProductData) => {
      if (data.price != null) {
        if (data.source === 'walmart') setWalmartPrice(data.price.toFixed(2));
        if (data.source === 'amazon') setAmazonPrice(data.price.toFixed(2));
      }
      const code = data.upc ?? data.asin;
      if (code) setProductCode(code);
    };

    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (!tabId) return;

      chrome.tabs.sendMessage(tabId, { type: SCAN_PROFIT_REQUEST_DATA }, (response) => {
        if (chrome.runtime.lastError || !response) return;
        applyExtractedData(response as ExtractedProductData);
      });
    });

    const handleMessage = (message: ScanProfitMessage) => {
      if (message?.type === SCAN_PROFIT_DATA_EXTRACTED) {
        applyExtractedData(message.payload);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const roi = await calculateRoi({
        walmartPrice: Number(walmartPrice),
        amazonPrice: Number(amazonPrice),
        shippingCost: Number(shippingCost),
        upc: productCode ?? undefined,
      });
      setResult(roi);
    } catch (err) {
      setResult(null);
      setError(
        err instanceof ApiUnreachableError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Ocurrió un error inesperado.',
      );
    } finally {
      setLoading(false);
    }
  };

  const isProfitable = (result?.roiPercentage ?? 0) >= 0;

  return (
    <div className="w-80 bg-slate-50 p-4 text-slate-900">
      <h1 className="mb-3 text-lg font-bold">ScanProfit</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label className="flex flex-col text-xs font-medium text-slate-600">
          Precio Walmart ($)
          <input
            type="number"
            step="0.01"
            min="0"
            value={walmartPrice}
            onChange={(e) => setWalmartPrice(e.target.value)}
            className="mt-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col text-xs font-medium text-slate-600">
          Precio Amazon ($)
          <input
            type="number"
            step="0.01"
            min="0"
            value={amazonPrice}
            onChange={(e) => setAmazonPrice(e.target.value)}
            className="mt-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col text-xs font-medium text-slate-600">
          Costo de Envío ($)
          <input
            type="number"
            step="0.01"
            min="0"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            className="mt-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
          />
        </label>

        {productCode && (
          <p className="text-xs text-slate-500">
            Código detectado: <span className="font-medium text-slate-700">{productCode}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading ? 'Calculando...' : 'Calcular ROI'}
        </button>
      </form>

      {error && (
        <div className="mt-3 rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-800">
          {error}
        </div>
      )}

      {result && !error && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div
            className={`col-span-2 rounded-lg p-3 text-center ${
              isProfitable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide">ROI</p>
            <p className="text-2xl font-bold">{result.roiPercentage.toFixed(2)}%</p>
          </div>

          <div
            className={`rounded-lg p-3 text-center ${
              isProfitable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide">Ganancia Neta</p>
            <p className="text-lg font-semibold">${result.netProfit.toFixed(2)}</p>
          </div>

          <div className="rounded-lg bg-slate-100 p-3 text-center text-slate-700">
            <p className="text-xs font-medium uppercase tracking-wide">Costo Total</p>
            <p className="text-lg font-semibold">${result.totalCost.toFixed(2)}</p>
          </div>

          <div className="col-span-2 rounded-lg bg-slate-100 p-3 text-slate-700">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide">Fees</p>
            <div className="flex justify-between text-sm">
              <span>Referral Fee</span>
              <span className="font-medium">${result.referralFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>FBA Fee</span>
              <span className="font-medium">${result.fbaFee.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
