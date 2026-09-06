import React from 'react';
import { AgriculturalRecord, CorrelationMetric } from '../types';
import { CloudRain, Droplet, Sprout, AlertCircle, TrendingUp, HelpCircle } from 'lucide-react';

interface EnvironmentalResourcesTabProps {
  dataset: AgriculturalRecord[];
  correlations: CorrelationMetric[];
}

export const EnvironmentalResourcesTab: React.FC<EnvironmentalResourcesTabProps> = ({ dataset, correlations }) => {
  return (
    <div className="space-y-6">
      {/* Module 6: "Why?" Framework Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          Module 6 & 9: "Why?" Explanatory Pipeline & Environmental Analytics
        </div>
        <h2 className="text-base font-semibold">
          Investigating Underlying Drivers: Season → Climate → Input Resources → Performance
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Agricultural productivity is not an isolated random phenomenon; it is governed by the physical interaction between seasonal climate regimes (precipitation, ambient thermal heat) and resource management (NPK nutrient dosage, irrigation access).
        </p>
      </div>

      {/* Correlation Matrix Table with Causation Guardrails */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              Empirical Relationship & Dual Correlation Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluating Pearson linear coefficient (r) vs Spearman rank coefficient (ρ) across key agricultural drivers
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Critical Rule: Correlation ≠ Causation</span>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="px-3 py-2.5 text-left">Variable Pair</th>
                <th className="px-3 py-2.5 text-right">Pearson (r)</th>
                <th className="px-3 py-2.5 text-right">Spearman (ρ)</th>
                <th className="px-3 py-2.5 text-center">Strength & Direction</th>
                <th className="px-3 py-2.5 text-right">p-value Approx.</th>
                <th className="px-3 py-2.5 text-left">Agronomic Causation Guardrail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {correlations.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/80">
                  <td className="px-3 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                    {c.var1} <span className="text-slate-400">↔</span> {c.var2}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-800">
                    {c.pearsonR > 0 ? `+${c.pearsonR}` : c.pearsonR}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-700">
                    {c.spearmanRho > 0 ? `+${c.spearmanRho}` : c.spearmanRho}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      c.strengthLabel === 'Strong'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.strengthLabel === 'Moderate'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {c.strengthLabel} {c.direction}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-600">
                    {c.pValueApprox < 0.05 ? '< 0.05*' : '≥ 0.05 (ns)'}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 text-[11px] leading-relaxed max-w-md">
                    {c.causationWarning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Module 10: Resource Efficiency & Input Behavior Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fertilizer Response & Diminishing Returns Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-emerald-600" />
              Module 10: Fertilizer Input Efficiency & Mitscherlich Saturation
            </h3>
            <span className="text-[11px] font-mono text-slate-500">r = +0.58</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Data across all cereal and oilseed crops indicates a strong positive response to fertilizer application up to 130–160 kg/ha NPK. Beyond this threshold, yield gains plateau sharply (Spearman ρ = +0.64 vs Pearson r = +0.58).
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-700 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Optimal Dosage Window:</span>
              <strong className="text-emerald-700">110 – 150 kg/ha NPK</strong>
            </div>
            <div className="flex justify-between">
              <span>Plateau / Saturation Point:</span>
              <strong className="text-amber-700">175+ kg/ha (Rewari case)</strong>
            </div>
            <div className="flex justify-between">
              <span>Nutrient Use Efficiency (NUE):</span>
              <span className="text-slate-900">Highest in irrigated Wheat & Maize</span>
            </div>
          </div>
        </div>

        {/* Irrigation Coverage vs Farm Profitability Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-sky-600" />
              Irrigation Infrastructure as an Economic Safety Net
            </h3>
            <span className="text-[11px] font-mono text-slate-500">r = +0.71</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Irrigation coverage is the single highest predictor of net farmer profit (Pearson r = +0.71). Assured irrigation buffers farms against catastrophic drought wipeouts and permits intensive double-cropping during the Zaid and Rabi seasons.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-700 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Irrigated Tracts Average Net Profit:</span>
              <strong className="text-emerald-700">₹58,400 /ha</strong>
            </div>
            <div className="flex justify-between">
              <span>Rainfed Tracts Average Net Profit:</span>
              <strong className="text-red-600">₹18,200 /ha</strong>
            </div>
            <div className="flex justify-between">
              <span>Empirical Economic Premium:</span>
              <strong className="text-indigo-600">+220% higher returns</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
