import React, { useState } from 'react';
import { SeasonalSummaryStats } from '../types';
import { Award, Layers, TrendingUp, Info, HelpCircle } from 'lucide-react';

interface SeasonalPerformanceTabProps {
  seasonalStats: SeasonalSummaryStats[];
}

export const SeasonalPerformanceTab: React.FC<SeasonalPerformanceTabProps> = ({ seasonalStats }) => {
  const [selectedSeason, setSelectedSeason] = useState<string>(
    seasonalStats.length > 0 ? seasonalStats[0].season : 'Rabi'
  );

  const activeSeasonData = seasonalStats.find((s) => s.season === selectedSeason) || seasonalStats[0];

  return (
    <div className="space-y-6">
      {/* ASPI Header Card & Rationale Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Module 5: Agricultural Season Performance Index (ASPI)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical multi-criteria ranking combining physical productivity, farmer economic viability, and climate stability.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-900 border border-amber-200/80 px-3 py-1.5 rounded-lg">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Formula: ASPI = 0.35·Yield_norm + 0.35·Profit_norm + 0.30·(1 - CV_norm)</span>
          </div>
        </div>

        {/* ASPI Scoreboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {seasonalStats.map((s) => {
            const isSelected = s.season === selectedSeason;
            return (
              <button
                key={s.season}
                id={`season-card-${s.season.toLowerCase()}`}
                onClick={() => setSelectedSeason(s.season)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/50'
                    : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-mono px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isSelected ? 'bg-slate-800 text-amber-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    #{s.seasonRank}
                  </span>
                  <span className={isSelected ? 'text-slate-400' : 'text-slate-500'}>
                    {s.recordCount} recs
                  </span>
                </div>
                <div className="font-semibold text-sm truncate">{s.season}</div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className={`text-xl font-bold font-mono ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {s.aspiScore}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                    ASPI Index
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Season Deep-Dive Profile */}
      {activeSeasonData && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {activeSeasonData.season} Agro-Climatic & Performance Profile (Rank #{activeSeasonData.seasonRank})
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed distribution across physical yield, moisture reliance, input dosage, and economics
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold font-mono">
              ASPI Score: {activeSeasonData.aspiScore}/100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500">Mean Harvest Yield</span>
              <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {activeSeasonData.avgYield} <span className="text-xs font-normal text-slate-500">t/ha</span>
              </p>
              <span className="text-[10px] text-slate-400">Median: {activeSeasonData.medianYield} t/ha</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500">Yield Risk & Variance</span>
              <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                CV: {activeSeasonData.cvYieldPct}%
              </p>
              <span className="text-[10px] text-slate-400">Std Dev: ±{activeSeasonData.stdDevYield} t/ha</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500">Mean Precipitation</span>
              <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {activeSeasonData.avgRainfallMm} <span className="text-xs font-normal text-slate-500">mm</span>
              </p>
              <span className="text-[10px] text-slate-400">Temp: {activeSeasonData.avgTemperatureC}°C</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500">Mean Net Farm Margin</span>
              <p className="text-lg font-bold text-emerald-600 font-mono mt-0.5">
                ₹{activeSeasonData.avgNetProfitPerHa.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400">Cost: ₹{activeSeasonData.avgCostPerHa.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Module 4: Comprehensive Descriptive Statistics Matrix */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Module 4: Full Seasonal Descriptive Statistics Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical mathematical metrics: Mean, Median, Min, Max, Standard Deviation, and CV% across all available seasons.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="px-3 py-2.5 text-left">Season</th>
                <th className="px-3 py-2.5 text-right">Records (N)</th>
                <th className="px-3 py-2.5 text-right">Mean Yield (t/ha)</th>
                <th className="px-3 py-2.5 text-right">Median Yield</th>
                <th className="px-3 py-2.5 text-right">Min - Max</th>
                <th className="px-3 py-2.5 text-right">Std Dev (σ)</th>
                <th className="px-3 py-2.5 text-right">CV (%)</th>
                <th className="px-3 py-2.5 text-right">Rainfall (mm)</th>
                <th className="px-3 py-2.5 text-right">Irrigation (%)</th>
                <th className="px-3 py-2.5 text-right">Net Profit (₹/ha)</th>
                <th className="px-3 py-2.5 text-right">ASPI Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {seasonalStats.map((stat) => (
                <tr key={stat.season} className="hover:bg-slate-50/80">
                  <td className="px-3 py-2.5 font-semibold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {stat.season}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-600">{stat.recordCount}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900">{stat.avgYield}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-600">{stat.medianYield}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-600">{stat.minYield} - {stat.maxYield}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-600">±{stat.stdDevYield}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-800 font-semibold">{stat.cvYieldPct}%</td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-600">{stat.avgRainfallMm}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-600">{stat.avgIrrigationPct}%</td>
                  <td className="px-3 py-2.5 text-right font-mono text-emerald-700 font-semibold">₹{stat.avgNetProfitPerHa.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-indigo-600">{stat.aspiScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
