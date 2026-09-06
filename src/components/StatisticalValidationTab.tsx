import React from 'react';
import { AnovaHypothesisTest } from '../types';
import { Sigma, CheckCircle, AlertTriangle, BookOpen, Layers } from 'lucide-react';

interface StatisticalValidationTabProps {
  anovaResult: AnovaHypothesisTest;
}

export const StatisticalValidationTab: React.FC<StatisticalValidationTabProps> = ({ anovaResult }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Sigma className="w-5 h-5 text-indigo-600" />
              Module 13: Statistical Hypothesis Validation (One-Way ANOVA)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Testing empirical variance across agricultural seasons to verify whether differences are genuine population effects rather than random noise
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold font-mono ${
              anovaResult.isSignificant
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {anovaResult.isSignificant ? 'Reject H₀: Significant (p < 0.05)' : 'Fail to Reject H₀'}
          </span>
        </div>

        {/* Hypotheses Formulation Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Null Hypothesis (H₀)
            </span>
            <p className="font-mono text-slate-900 font-semibold">{anovaResult.nullHypothesis}</p>
            <p className="text-slate-500 text-[11px]">
              Assumes that agricultural season has no true effect on mean harvest yield.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/60 rounded-lg border border-emerald-200 text-xs space-y-1.5">
            <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Alternative Hypothesis (H₁)
            </span>
            <p className="font-mono text-emerald-950 font-semibold">{anovaResult.altHypothesis}</p>
            <p className="text-emerald-700 text-[11px]">
              At least one cropping season displays a statistically distinguishable mean yield.
            </p>
          </div>
        </div>
      </div>

      {/* Formal ANOVA Summary Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Analysis of Variance (ANOVA) Summary Table
          </h3>
          <span className="text-xs font-mono text-slate-500">Significance Threshold: α = {anovaResult.alpha}</span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-xs font-mono">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="px-3 py-2.5 text-left font-sans">Source of Variation</th>
                <th className="px-3 py-2.5 text-right">Sum of Squares (SS)</th>
                <th className="px-3 py-2.5 text-right">Degrees of Freedom (df)</th>
                <th className="px-3 py-2.5 text-right">Mean Square (MS)</th>
                <th className="px-3 py-2.5 text-right">F-Statistic</th>
                <th className="px-3 py-2.5 text-right">p-value</th>
                <th className="px-3 py-2.5 text-right font-sans">Statistical Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr>
                <td className="px-3 py-2.5 font-sans font-medium text-slate-900">
                  Between Groups (Seasons)
                </td>
                <td className="px-3 py-2.5 text-right text-slate-800">{anovaResult.ssb}</td>
                <td className="px-3 py-2.5 text-right text-slate-800">{anovaResult.dfb}</td>
                <td className="px-3 py-2.5 text-right text-slate-800">{anovaResult.msb}</td>
                <td className="px-3 py-2.5 text-right font-bold text-indigo-600 text-sm" rowSpan={2}>
                  {anovaResult.fStatistic}
                </td>
                <td className="px-3 py-2.5 text-right font-bold text-emerald-600 text-sm" rowSpan={2}>
                  {anovaResult.pValue}
                </td>
                <td className="px-3 py-2.5 text-right font-sans font-semibold text-emerald-700" rowSpan={2}>
                  Reject H₀ (p &lt; 0.05)
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-sans font-medium text-slate-900">
                  Within Groups (Error / Residual)
                </td>
                <td className="px-3 py-2.5 text-right text-slate-800">{anovaResult.ssw}</td>
                <td className="px-3 py-2.5 text-right text-slate-800">{anovaResult.dfw}</td>
                <td className="px-3 py-2.5 text-right text-slate-800">{anovaResult.msw}</td>
              </tr>
              <tr className="bg-slate-50/60 font-semibold">
                <td className="px-3 py-2.5 font-sans text-slate-900">Total Variance</td>
                <td className="px-3 py-2.5 text-right text-slate-900">
                  {Number((anovaResult.ssb + anovaResult.ssw).toFixed(2))}
                </td>
                <td className="px-3 py-2.5 text-right text-slate-900">{anovaResult.dfb + anovaResult.dfw}</td>
                <td className="px-3 py-2.5 text-right text-slate-400">—</td>
                <td className="px-3 py-2.5 text-right text-slate-400">—</td>
                <td className="px-3 py-2.5 text-right text-slate-400">—</td>
                <td className="px-3 py-2.5 text-right font-sans text-slate-600">Total Observations</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Effect Size & Practical Significance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-1">
            <span className="text-slate-500 font-medium">Effect Size (Eta-Squared η²):</span>
            <p className="font-mono text-lg font-bold text-slate-900">
              η² = {anovaResult.etaSquared} <span className="text-xs text-slate-500">({(anovaResult.etaSquared * 100).toFixed(1)}% variance explained)</span>
            </p>
            <p className="text-slate-600 text-[11px]">
              Formula: η² = SSB / Total SS. Evaluates the practical magnitude of seasonal separation.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-1">
            <span className="text-slate-500 font-medium">Practical Agronomic Interpretation:</span>
            <p className="font-semibold text-emerald-800">
              {anovaResult.practicalSignificance}
            </p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {anovaResult.interpretation}
            </p>
          </div>
        </div>
      </div>

      {/* Assumptions & Methodological Defense */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          Methodological Rationale & Statistical Assumptions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <strong className="text-slate-900 font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              1. Normality of Residuals
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Field crop yields per season approximate near-normal distributions; perennial Sugarcane is isolated to preserve homoscedasticity.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <strong className="text-slate-900 font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              2. Homogeneity of Variance
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Assessed across seasons. Rabi and Kharif standard deviations maintain comparable scale ratios (MSW = {anovaResult.msw}).
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <strong className="text-slate-900 font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              3. Independent Observations
            </strong>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Each row represents distinct administrative district-year reporting cycles with verified zero duplicate keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
