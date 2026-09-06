import React, { useState } from 'react';
import { AgriculturalRecord } from '../types';
import { MapPin, Sprout, BarChart2, ShieldAlert } from 'lucide-react';

interface RegionalCropTabProps {
  dataset: AgriculturalRecord[];
}

export const RegionalCropTab: React.FC<RegionalCropTabProps> = ({ dataset }) => {
  const [viewMode, setViewMode] = useState<'crop' | 'state'>('crop');

  // Compute Crop-Level Statistics
  const cropMap = new Map<string, {
    records: AgriculturalRecord[];
    category: string;
    seasons: Set<string>;
    states: Set<string>;
  }>();

  dataset.forEach((r) => {
    if (!cropMap.has(r.crop)) {
      cropMap.set(r.crop, {
        records: [],
        category: r.crop_category,
        seasons: new Set(),
        states: new Set(),
      });
    }
    const entry = cropMap.get(r.crop)!;
    entry.records.push(r);
    entry.seasons.add(r.season);
    entry.states.add(r.state);
  });

  const cropStats = Array.from(cropMap.entries()).map(([crop, data]) => {
    const n = data.records.length;
    const yields = data.records.map((r) => r.yield_tonnes_per_ha);
    const avgYield = Number((yields.reduce((a, b) => a + b, 0) / n).toFixed(2));
    const avgProfit = Math.round(data.records.reduce((a, b) => a + b.net_profit_inr_per_ha, 0) / n);
    const avgIrrigation = Number((data.records.reduce((a, b) => a + b.irrigation_coverage_pct, 0) / n).toFixed(1));

    // Calculate CV
    const mean = avgYield;
    const variance = yields.reduce((acc, y) => acc + Math.pow(y - mean, 2), 0) / (n > 1 ? n - 1 : 1);
    const cvPct = mean > 0 ? Number(((Math.sqrt(variance) / mean) * 100).toFixed(1)) : 0;

    return {
      crop,
      category: data.category,
      recordCount: n,
      avgYield,
      cvPct,
      avgProfit,
      avgIrrigation,
      seasons: Array.from(data.seasons).join(', '),
      states: Array.from(data.states).join(', '),
    };
  }).sort((a, b) => b.avgProfit - a.avgProfit);

  // Compute State-Level Statistics
  const stateMap = new Map<string, AgriculturalRecord[]>();
  dataset.forEach((r) => {
    if (!stateMap.has(r.state)) stateMap.set(r.state, []);
    stateMap.get(r.state)!.push(r);
  });

  const stateStats = Array.from(stateMap.entries()).map(([state, records]) => {
    const n = records.length;
    const avgYield = Number((records.reduce((a, b) => a + b.yield_tonnes_per_ha, 0) / n).toFixed(2));
    const avgProfit = Math.round(records.reduce((a, b) => a + b.net_profit_inr_per_ha, 0) / n);
    const avgRainfall = Math.round(records.reduce((a, b) => a + b.seasonal_rainfall_mm, 0) / n);
    const avgIrrigation = Number((records.reduce((a, b) => a + b.irrigation_coverage_pct, 0) / n).toFixed(1));

    return {
      state,
      recordCount: n,
      avgYield,
      avgProfit,
      avgRainfall,
      avgIrrigation,
    };
  }).sort((a, b) => b.avgYield - a.avgYield);

  return (
    <div className="space-y-6">
      {/* Top Toggle Switch */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-600" />
            Modules 7, 8 & 11: Crop, Geographic & Multi-Dimensional Agronomics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluating performance across distinct crop cultivars, regional agro-climatic zones, and seasonal suitability
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setViewMode('crop')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              viewMode === 'crop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Crop Matrix (Module 7)
          </button>
          <button
            onClick={() => setViewMode('state')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              viewMode === 'state' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Regional Matrix (Module 8)
          </button>
        </div>
      </div>

      {viewMode === 'crop' ? (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              Crop Cultivar Performance, Risk (CV%), & Net Return Matrix
            </h3>
            <span className="text-xs text-slate-500 font-mono">{cropStats.length} Unique Crops Analyzed</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="px-3 py-2.5 text-left">Crop</th>
                  <th className="px-3 py-2.5 text-left">Category</th>
                  <th className="px-3 py-2.5 text-right">Mean Yield</th>
                  <th className="px-3 py-2.5 text-right">Stability (CV%)</th>
                  <th className="px-3 py-2.5 text-right">Irrigation</th>
                  <th className="px-3 py-2.5 text-right">Net Profit</th>
                  <th className="px-3 py-2.5 text-left">Recorded Seasons</th>
                  <th className="px-3 py-2.5 text-left">Major States</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {cropStats.map((c) => (
                  <tr key={c.crop} className="hover:bg-slate-50/80">
                    <td className="px-3 py-2.5 font-bold text-slate-900">{c.crop}</td>
                    <td className="px-3 py-2.5 text-slate-600">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                        {c.category}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900">{c.avgYield} t/ha</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-700 font-medium">{c.cvPct}%</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-600">{c.avgIrrigation}%</td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-700">
                      ₹{c.avgProfit.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{c.seasons}</td>
                    <td className="px-3 py-2.5 text-slate-500 truncate max-w-xs">{c.states}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600" />
              State-Level Agricultural Performance & Environmental Risk Profile
            </h3>
            <span className="text-xs text-slate-500 font-mono">{stateStats.length} Agricultural States</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="px-3 py-2.5 text-left">State / Agricultural Territory</th>
                  <th className="px-3 py-2.5 text-right">Records Audited</th>
                  <th className="px-3 py-2.5 text-right">Mean Harvest Yield</th>
                  <th className="px-3 py-2.5 text-right">Avg Rainfall (mm)</th>
                  <th className="px-3 py-2.5 text-right">Irrigation Coverage</th>
                  <th className="px-3 py-2.5 text-right">Avg Net Farmer Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {stateStats.map((s) => (
                  <tr key={s.state} className="hover:bg-slate-50/80">
                    <td className="px-3 py-2.5 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                      {s.state}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-600">{s.recordCount}</td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900">{s.avgYield} t/ha</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-600">{s.avgRainfall} mm</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-600">{s.avgIrrigation}%</td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-700">
                      ₹{s.avgProfit.toLocaleString()}/ha
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
