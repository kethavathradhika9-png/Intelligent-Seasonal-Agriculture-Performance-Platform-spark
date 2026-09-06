import React, { useState } from 'react';
import { AgriculturalRecord, MlModelEvaluation, WhatIfSimulationInput } from '../types';
import { simulateWhatIfScenario } from '../analytics/mlPredictiveEngine';
import { Cpu, Sliders, AlertTriangle, CheckCircle, TrendingUp, Info, ShieldAlert } from 'lucide-react';

interface PredictiveWhatIfTabProps {
  dataset: AgriculturalRecord[];
  models: MlModelEvaluation[];
}

export const PredictiveWhatIfTab: React.FC<PredictiveWhatIfTabProps> = ({ dataset, models }) => {
  const availableSeasons = ['ALL', 'Kharif', 'Rabi', 'Zaid', 'Summer', 'Winter'];
  const availableCrops = ['ALL', 'Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton', 'Mustard', 'Moong'];

  const [simInput, setSimInput] = useState<WhatIfSimulationInput>({
    rainfallChangePct: 0,
    fertilizerChangePct: 0,
    irrigationCoveragePct: 75,
    selectedSeason: 'Rabi',
    selectedCrop: 'Wheat',
  });

  const simResult = simulateWhatIfScenario(simInput, dataset);

  return (
    <div className="space-y-6">
      {/* Module 14: Machine Learning Model Evaluation Benchmarks */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              Module 14: Predictive Machine Learning Model Evaluation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative benchmark across regression architectures using 80/20 train-test cross-validation
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-mono font-semibold border border-indigo-200">
            Top Model: Gradient Boosted Trees (R² = 0.898)
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="px-3 py-2.5 text-left">Model Algorithm</th>
                <th className="px-3 py-2.5 text-left">Architecture Type</th>
                <th className="px-3 py-2.5 text-right font-mono">Train / Test (N)</th>
                <th className="px-3 py-2.5 text-right font-mono">MAE (t/ha)</th>
                <th className="px-3 py-2.5 text-right font-mono">RMSE (t/ha)</th>
                <th className="px-3 py-2.5 text-right font-mono">R² Score</th>
                <th className="px-3 py-2.5 text-left">Key Limitations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {models.map((m) => (
                <tr key={m.modelName} className="hover:bg-slate-50/80">
                  <td className="px-3 py-2.5 font-bold text-slate-900">{m.modelName}</td>
                  <td className="px-3 py-2.5 text-slate-600">{m.algorithmType}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-600">
                    {m.trainSampleSize} / {m.testSampleSize}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-800">{m.mae}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-800">{m.rmse}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-600 text-sm">
                    {m.r2Score}
                  </td>
                  <td className="px-3 py-2.5 text-slate-500 text-[11px] leading-relaxed max-w-xs">
                    {m.limitations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Feature Importance Breakdown */}
        {models[0] && (
          <div className="pt-2">
            <h4 className="text-xs font-semibold text-slate-800 mb-2">
              Empirical Feature Importance Distribution ({models[0].modelName}):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {models[0].featureImportance.map((fi) => (
                <div key={fi.feature} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span className="truncate">{fi.feature}</span>
                    <strong className="font-mono text-slate-900">{fi.weightPct}%</strong>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${fi.weightPct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Module 15: Interactive What-If Scenario Simulator */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600" />
              Module 15: Interactive What-If Scenario Simulator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate hypothetical climate variability and farm resource adjustments to forecast yield and economic margins.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-900 px-2.5 py-1 rounded border border-amber-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-medium">{simResult.scientificDisclaimer}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Simulation Parameters & Stress-Test Inputs
            </h3>

            {/* Season & Crop Selector */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Target Season</label>
                <select
                  value={simInput.selectedSeason}
                  onChange={(e) => setSimInput({ ...simInput, selectedSeason: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-hidden focus:border-slate-900"
                >
                  {availableSeasons.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Target Crop</label>
                <select
                  value={simInput.selectedCrop}
                  onChange={(e) => setSimInput({ ...simInput, selectedCrop: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-hidden focus:border-slate-900"
                >
                  {availableCrops.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rainfall Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Rainfall Variance:</span>
                <span className={`font-mono font-bold ${
                  simInput.rainfallChangePct < 0 ? 'text-red-600' : simInput.rainfallChangePct > 0 ? 'text-sky-600' : 'text-slate-800'
                }`}>
                  {simInput.rainfallChangePct > 0 ? `+${simInput.rainfallChangePct}%` : `${simInput.rainfallChangePct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={simInput.rainfallChangePct}
                onChange={(e) => setSimInput({ ...simInput, rainfallChangePct: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-50% (Severe Drought)</span>
                <span>0% (Norm)</span>
                <span>+50% (Excess Monsoon)</span>
              </div>
            </div>

            {/* Fertilizer Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Fertilizer Dosage Adjustment:</span>
                <span className="font-mono font-bold text-slate-900">
                  {simInput.fertilizerChangePct > 0 ? `+${simInput.fertilizerChangePct}%` : `${simInput.fertilizerChangePct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={simInput.fertilizerChangePct}
                onChange={(e) => setSimInput({ ...simInput, fertilizerChangePct: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-50% (Deficiency)</span>
                <span>0% (Baseline)</span>
                <span>+50% (High Dose)</span>
              </div>
            </div>

            {/* Irrigation Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Assured Irrigation Access:</span>
                <span className="font-mono font-bold text-emerald-600">{simInput.irrigationCoveragePct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={simInput.irrigationCoveragePct}
                onChange={(e) => setSimInput({ ...simInput, irrigationCoveragePct: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% (Pure Rainfed)</span>
                <span>50%</span>
                <span>100% (Assured Tubewell/Canal)</span>
              </div>
            </div>
          </div>

          {/* Simulation Output Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Forecasted Agronomic & Financial Outcomes
            </h3>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500">Simulated Harvest Yield</span>
                <div className="flex items-baseline gap-1 mt-1 font-mono">
                  <span className="text-2xl font-bold text-slate-900">{simResult.simulatedYield}</span>
                  <span className="text-xs text-slate-500">t/ha</span>
                </div>
                <div className="text-[11px] mt-1">
                  Baseline: {simResult.baselineYield} t/ha (
                  <strong className={simResult.deltaYieldPct >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                    {simResult.deltaYieldPct >= 0 ? `+${simResult.deltaYieldPct}%` : `${simResult.deltaYieldPct}%`}
                  </strong>
                  )
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500">Forecasted Net Profit</span>
                <div className="flex items-baseline gap-1 mt-1 font-mono">
                  <span className="text-2xl font-bold text-emerald-600">
                    ₹{simResult.simulatedNetProfit.toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] mt-1 text-slate-600">
                  Margin shift:{' '}
                  <strong className={simResult.deltaProfitPct >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                    {simResult.deltaProfitPct >= 0 ? `+${simResult.deltaProfitPct}%` : `${simResult.deltaProfitPct}%`}
                  </strong>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500">Simulated Agro-Risk Profile</span>
                <div className="mt-1">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase font-mono ${
                      simResult.riskFactor === 'Extreme'
                        ? 'bg-red-100 text-red-800'
                        : simResult.riskFactor === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : simResult.riskFactor === 'Moderate'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {simResult.riskFactor} Risk
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">Based on sensitivity elasticity</p>
              </div>
            </div>

            {/* Limiting Constraint Diagnosis */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <strong className="text-slate-900 font-semibold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-sky-600" />
                Agronomic Diagnostics (Liebig’s Law of the Minimum):
              </strong>
              <p className="text-slate-700 leading-relaxed">
                {simResult.limitingNutrientOrConstraint}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
