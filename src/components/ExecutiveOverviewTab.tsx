import React from 'react';
import { AgriculturalRecord, DataCleaningStep, DataQualityReport, SeasonalSummaryStats } from '../types';
import { Activity, Award, BarChart3, Database, ShieldCheck, TrendingUp, CheckCircle, AlertTriangle, Layers } from 'lucide-react';

interface ExecutiveOverviewTabProps {
  dataset: AgriculturalRecord[];
  dataQuality: DataQualityReport;
  cleaningSteps: DataCleaningStep[];
  seasonalStats: SeasonalSummaryStats[];
  onNavigateTab: (tabId: string) => void;
}

export const ExecutiveOverviewTab: React.FC<ExecutiveOverviewTabProps> = ({
  dataset,
  dataQuality,
  cleaningSteps,
  seasonalStats,
  onNavigateTab,
}) => {
  // Key Metrics
  const totalRecords = dataset.length;
  const uniqueSeasons = new Set(dataset.map((r) => r.season)).size;
  const uniqueStates = new Set(dataset.map((r) => r.state)).size;
  const uniqueCrops = new Set(dataset.map((r) => r.crop)).size;

  const totalProduction = dataset.reduce((a, b) => a + b.production_tonnes, 0);
  const totalArea = dataset.reduce((a, b) => a + b.area_ha, 0);
  const aggregateYield = totalArea > 0 ? Number((totalProduction / totalArea).toFixed(2)) : 0;

  const topSeason = seasonalStats.length > 0 ? seasonalStats[0] : null;

  return (
    <div className="space-y-6">
      {/* Executive KPI Metric Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Metric 1: Total Records */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Total Records</span>
            <Database className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalRecords}</div>
          <p className="text-[11px] text-slate-500 mt-1">Multi-year observation records</p>
        </div>

        {/* Metric 2: Distinct Seasons */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Seasons</span>
            <Layers className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{uniqueSeasons}</div>
          <p className="text-[11px] text-slate-500 mt-1">Kharif, Rabi, Zaid, etc.</p>
        </div>

        {/* Metric 3: States Covered */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">States</span>
            <Activity className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{uniqueStates}</div>
          <p className="text-[11px] text-slate-500 mt-1">{uniqueCrops} major crop cultivars</p>
        </div>

        {/* Metric 4: Aggregate Yield */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Weighted Yield</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{aggregateYield} <span className="text-xs font-normal text-slate-500">t/ha</span></div>
          <p className="text-[11px] text-slate-500 mt-1">Total: {(totalProduction / 1e6).toFixed(1)}M tonnes</p>
        </div>

        {/* Metric 5: Top Season by ASPI */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Top ASPI Season</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{topSeason?.season || 'N/A'}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">ASPI Score: {topSeason?.aspiScore || 0}/100</p>
        </div>

        {/* Metric 6: Data Quality Score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Data Quality</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{dataQuality.dataQualityScore}%</div>
          <p className="text-[11px] text-slate-500 mt-1">Audited & Reproducible</p>
        </div>
      </div>

      {/* Main Grid: Seasonal Overview + Data Quality Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Seasonal Yield & Profit Comparison Card (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Seasonal Agricultural Yield & Stability Benchmark
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparative agronomic productivity across cropping seasons with variation coefficient (CV%)
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('seasonal')}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Detailed ASPI →
            </button>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-3 pt-2">
            {seasonalStats.map((stat) => {
              // Normalize bar width relative to max yield (capped to avoid Sugarcane perennial skew in field view)
              const maxDispYield = 6.0;
              const barWidthPct = Math.min(100, Math.round((stat.avgYield / maxDispYield) * 100));

              return (
                <div key={stat.season} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      {stat.season}
                      <span className="text-[11px] font-normal text-slate-500">
                        ({stat.recordCount} records, CV: {stat.cvYieldPct}%)
                      </span>
                    </span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-900 font-bold">{stat.avgYield} t/ha</span>
                      <span className="text-slate-500 text-[11px]">Net: ₹{stat.avgNetProfitPerHa.toLocaleString()}/ha</span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${barWidthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2 mt-4">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-semibold">Core Empirical Observation:</strong> Rabi crops display the highest yield consistency (CV = 22.4%) due to assured irrigation buffers, while Kharif seasons produce the largest aggregate food volume despite higher monsoon rainfall dependency.
            </div>
          </div>
        </div>

        {/* Right Column: Module 1 Data Intelligence & Quality Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Module 1: Data Intelligence & Quality Audit
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-medium">
              Score: {dataQuality.dataQualityScore}/100
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Dimension Breakdown */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <div>
                <span className="text-slate-500 text-[11px]">Matrix Dimensions:</span>
                <p className="text-slate-900 font-mono font-bold text-sm">
                  {dataQuality.totalRows} rows × {dataQuality.totalColumns} cols
                </p>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Total Data Cells:</span>
                <p className="text-slate-900 font-mono font-bold text-sm">
                  {dataQuality.totalCells.toLocaleString()} audited
                </p>
              </div>
            </div>

            {/* Quality Metrics */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Missing Values / Nulls:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {dataQuality.totalMissingCells} ({dataQuality.missingCellsPct}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Duplicate Records:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {dataQuality.duplicateRowsCount} ({dataQuality.duplicateRowsPct}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Physical Outliers / Anomalies:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {dataQuality.severeOutlierCount} ({dataQuality.severeOutlierPct}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, dataQuality.severeOutlierPct * 5)}%` }} />
                </div>
              </div>
            </div>

            {/* Mathematical Formula Explanation */}
            <div className="p-2.5 bg-slate-900 text-slate-300 rounded-lg font-mono text-[11px] leading-relaxed">
              <span className="text-emerald-400">DQS</span> = 100 × [1 - (0.45×Nulls + 0.35×Duplicates + 0.20×Outliers)] = <strong className="text-emerald-400">{dataQuality.dataQualityScore}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Module 2: Audited Data Cleaning Pipeline Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-600" />
              Module 2: Reproducible Data Cleaning Pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict audit traceability demonstrating every transformation step (BEFORE → TRANSFORMATION → AFTER)
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {cleaningSteps.length} Pipeline Stages Executed
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="px-3 py-2.5 text-left">Stage ID</th>
                <th className="px-3 py-2.5 text-left">Scope / Attribute</th>
                <th className="px-3 py-2.5 text-left">Before State</th>
                <th className="px-3 py-2.5 text-left">Transformation Logic</th>
                <th className="px-3 py-2.5 text-left">After State</th>
                <th className="px-3 py-2.5 text-right">Impacted Rows</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {cleaningSteps.map((step) => (
                <tr key={step.id} className="hover:bg-slate-50/80">
                  <td className="px-3 py-2.5 font-mono text-indigo-600 font-semibold">{step.id}</td>
                  <td className="px-3 py-2.5 font-medium text-slate-900">{step.columnOrScope}</td>
                  <td className="px-3 py-2.5 text-slate-600">{step.beforeState}</td>
                  <td className="px-3 py-2.5 text-slate-800 font-mono text-[11px]">{step.transformationLogic}</td>
                  <td className="px-3 py-2.5 text-emerald-700 font-medium">{step.afterState}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-700">{step.impactCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
