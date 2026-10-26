import type { Product } from '@scanprofit/shared-types';

const PLACEHOLDER_PRODUCT: Product = {
  upc: '000000000000',
  title: 'Escanea un producto para comenzar',
  bsr: 0,
  amazonPrice: 0,
  imageUrl: '',
};

function App() {
  return (
    <div className="flex flex-col gap-2 p-4 bg-white text-slate-900">
      <h1 className="text-lg font-semibold">ScanProfit</h1>
      <p className="text-sm text-slate-600">{PLACEHOLDER_PRODUCT.title}</p>
    </div>
  );
}

export default App;
