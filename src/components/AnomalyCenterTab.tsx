import React, { useState } from 'react';
import { AnomalyRecord } from '../types';
import { AlertOctagon, TrendingDown, TrendingUp, Zap, HelpCircle, Filter } from 'lucide-react';

interface AnomalyCenterTabProps {
  anomalies: AnomalyRecord[];
}

export const AnomalyCenterTab: React.FC<AnomalyCenterTabProps> = ({ anomalies }) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = anomalies.filter(
    (a) => filterType === 'ALL' || a.anomalyType === filterType
  );

  const types = Array.from(new Set(anomalies.map((a) => a.anomalyType)));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-500" />
              Module 12: Multi-Method Anomaly Detection & Failure Diagnosis
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical isolation of climatic shocks, flood damage, and input saturation using Tukey IQR and Standardized Z-Scores (|Z| ≥ 2.0)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label="Filter anomalies by category"
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 font-medium outline-hidden"
            >
              <option value="ALL">All Anomaly Types ({anomalies.length})</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Anomaly Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs">
            <div className="flex items-center justify-between text-red-700 font-semibold mb-1">
              <span>Drought Yield Shocks</span>
              <TrendingDown className="w-4 h-4" />
            </div>
            <p className="text-lg font-bold text-red-900 font-mono">
              {anomalies.filter((a) => a.anomalyType.includes('Drought')).length}
            </p>
            <span className="text-[10px] text-red-600">Low rainfall + low irrigation</span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
            <div className="flex items-center justify-between text-amber-700 font-semibold mb-1">
              <span>Crop Failures / Inundation</span>
              <AlertOctagon className="w-4 h-4" />
            </div>
            <p className="text-lg font-bold text-amber-900 font-mono">
              {anomalies.filter((a) => a.anomalyType.includes('Crop Failure')).length}
            </p>
            <span className="text-[10px] text-amber-600">Monsoon flood / pest blight</span>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs">
            <div className="flex items-center justify-between text-indigo-700 font-semibold mb-1">
              <span>Input Inefficiencies</span>
              <Zap className="w-4 h-4" />
            </div>
            <p className="text-lg font-bold text-indigo-900 font-mono">
              {anomalies.filter((a) => a.anomalyType.includes('Inefficiency')).length}
            </p>
            <span className="text-[10px] text-indigo-600">Excess NPK without yield return</span>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
            <div className="flex items-center justify-between text-emerald-700 font-semibold mb-1">
              <span>Record High Harvests</span>
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-lg font-bold text-emerald-900 font-mono">
              {anomalies.filter((a) => a.anomalyType.includes('Extreme High')).length}
            </p>
            <span className="text-[10px] text-emerald-600">Optimal irrigation synergy</span>
          </div>
        </div>
      </div>

      {/* Anomaly Cards List */}
      <div className="space-y-3">
        {filtered.map((anomaly, idx) => {
          const isDeficit = anomaly.observedValue < anomaly.expectedBenchmark;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider font-mono ${
                      anomaly.anomalyType.includes('Drought') || anomaly.anomalyType.includes('Failure')
                        ? 'bg-red-100 text-red-800'
                        : anomaly.anomalyType.includes('Extreme High')
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {anomaly.anomalyType}
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    {anomaly.crop} ({anomaly.season}, {anomaly.cropYear})
                  </span>
                  <span className="text-xs text-slate-500">
                    • {anomaly.district}, {anomaly.state}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-500">Z-Score:</span>
                  <strong
                    className={`font-bold ${
                      Math.abs(anomaly.zScore) >= 2.5
                        ? 'text-red-600'
                        : Math.abs(anomaly.zScore) >= 2.0
                        ? 'text-amber-600'
                        : 'text-slate-900'
                    }`}
                  >
                    {anomaly.zScore > 0 ? `+${anomaly.zScore}` : anomaly.zScore}
                  </strong>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                    Confidence: {anomaly.confidence}
                  </span>
                </div>
              </div>

              {/* Numerical Discrepancy Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                <div>
                  <span className="text-slate-500 text-[11px]">Metric Tested:</span>
                  <p className="font-semibold text-slate-900">{anomaly.metricName}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Observed Empirical Value:</span>
                  <p className="font-mono font-bold text-slate-900 text-sm">
                    {anomaly.observedValue}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Expected Benchmark (Norm):</span>
                  <p className="font-mono font-semibold text-slate-700 text-sm">
                    {anomaly.expectedBenchmark} ({isDeficit ? 'Deficit' : 'Surplus'})
                  </p>
                </div>
              </div>

              {/* Agronomic Root-Cause Interpretation */}
              <div className="text-xs text-slate-700 bg-slate-50/50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                <strong className="text-slate-900 font-semibold">Agronomic Mechanism & Diagnostics: </strong>
                {anomaly.agronomicInterpretation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
