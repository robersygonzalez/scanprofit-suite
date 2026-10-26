import type { RoiCalculationResult } from '@scanprofit/shared-types';

function formatRoi(result: Pick<RoiCalculationResult, 'roiPercentage'>): string {
  return `${result.roiPercentage.toFixed(2)}%`;
}

function App() {
  return (
    <div className="flex h-full flex-col gap-3 p-4 bg-white text-slate-900">
      <h1 className="text-xl font-semibold">Panel de análisis</h1>
      <p className="text-sm text-slate-600">ROI estimado: {formatRoi({ roiPercentage: 0 })}</p>
    </div>
  );
}

export default App;
