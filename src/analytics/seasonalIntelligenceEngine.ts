import { AgriculturalRecord, SeasonalSummaryStats } from '../types';

export function computeSeasonalIntelligence(dataset: AgriculturalRecord[]): SeasonalSummaryStats[] {
  if (dataset.length === 0) return [];

  // Group by Season
  const seasonGroups = new Map<string, AgriculturalRecord[]>();
  for (const row of dataset) {
    const s = row.season || 'Unknown';
    if (!seasonGroups.has(s)) {
      seasonGroups.set(s, []);
    }
    seasonGroups.get(s)!.push(row);
  }

  // Pre-calculate global min/max for normalization in ASPI calculation
  const rawSummaries = Array.from(seasonGroups.entries()).map(([season, records]) => {
    const recordCount = records.length;
    const totalAreaHa = records.reduce((acc, r) => acc + r.area_ha, 0);
    const totalProductionTonnes = records.reduce((acc, r) => acc + r.production_tonnes, 0);

    const yields = records.map((r) => r.yield_tonnes_per_ha).sort((a, b) => a - b);
    const avgYield = yields.reduce((a, b) => a + b, 0) / recordCount;
    const mid = Math.floor(yields.length / 2);
    const medianYield = yields.length % 2 === 0 ? (yields[mid - 1] + yields[mid]) / 2 : yields[mid];
    const minYield = yields[0];
    const maxYield = yields[yields.length - 1];

    // Standard Deviation of Yield
    const varianceYield = yields.reduce((acc, y) => acc + Math.pow(y - avgYield, 2), 0) / (recordCount > 1 ? recordCount - 1 : 1);
    const stdDevYield = Math.sqrt(varianceYield);
    const cvYieldPct = avgYield > 0 ? (stdDevYield / avgYield) * 100 : 0;

    const avgRainfallMm = records.reduce((acc, r) => acc + r.seasonal_rainfall_mm, 0) / recordCount;
    const avgFertilizerKgHa = records.reduce((acc, r) => acc + r.fertilizer_usage_kg_per_ha, 0) / recordCount;
    const avgIrrigationPct = records.reduce((acc, r) => acc + r.irrigation_coverage_pct, 0) / recordCount;
    const avgTemperatureC = records.reduce((acc, r) => acc + r.avg_temperature_c, 0) / recordCount;

    const avgCostPerHa = records.reduce((acc, r) => acc + r.cost_of_cultivation_inr_per_ha, 0) / recordCount;
    const avgRevenuePerHa = records.reduce((acc, r) => acc + r.economic_revenue_inr_per_ha, 0) / recordCount;
    const avgNetProfitPerHa = records.reduce((acc, r) => acc + r.net_profit_inr_per_ha, 0) / recordCount;

    return {
      season,
      recordCount,
      totalAreaHa,
      totalProductionTonnes,
      avgYield: Number(avgYield.toFixed(2)),
      medianYield: Number(medianYield.toFixed(2)),
      minYield: Number(minYield.toFixed(2)),
      maxYield: Number(maxYield.toFixed(2)),
      stdDevYield: Number(stdDevYield.toFixed(2)),
      cvYieldPct: Number(cvYieldPct.toFixed(1)),
      avgRainfallMm: Math.round(avgRainfallMm),
      avgFertilizerKgHa: Math.round(avgFertilizerKgHa),
      avgIrrigationPct: Number(avgIrrigationPct.toFixed(1)),
      avgTemperatureC: Number(avgTemperatureC.toFixed(1)),
      avgCostPerHa: Math.round(avgCostPerHa),
      avgRevenuePerHa: Math.round(avgRevenuePerHa),
      avgNetProfitPerHa: Math.round(avgNetProfitPerHa),
      aspiScore: 0,
      seasonRank: 0,
    };
  });

  if (rawSummaries.length === 0) return [];

  // Exclude 'Whole Year' from skewing the standard seasonal rankings if it has huge perennial crops (like Sugarcane 80t/ha)
  // or handle robustly by using rank-percentile min-max normalization
  const yields = rawSummaries.map((s) => s.avgYield);
  const profits = rawSummaries.map((s) => s.avgNetProfitPerHa);
  const cvs = rawSummaries.map((s) => s.cvYieldPct);

  const minY = Math.min(...yields);
  const maxY = Math.max(...yields);
  const minP = Math.min(...profits);
  const maxP = Math.max(...profits);
  const minCv = Math.min(...cvs);
  const maxCv = Math.max(...cvs);

  // ASPI Formulation:
  // Weight 1 (w_yield) = 0.35 : Mean Agronomic Productivity
  // Weight 2 (w_profit) = 0.35 : Economic Net Profitability
  // Weight 3 (w_stability) = 0.30 : Risk Resilience / Low Variation (1 - norm_cv)
  const summariesWithAspi = rawSummaries.map((s) => {
    const normYield = maxY > minY ? (s.avgYield - minY) / (maxY - minY) : 0.5;
    const normProfit = maxP > minP ? (s.avgNetProfitPerHa - minP) / (maxP - minP) : 0.5;
    const normStability = maxCv > minCv ? 1 - (s.cvYieldPct - minCv) / (maxCv - minCv) : 0.5;

    const rawAspi = 0.35 * normYield + 0.35 * normProfit + 0.3 * normStability;
    const aspiScore = Math.max(10, Math.min(100, Math.round(rawAspi * 100)));

    return {
      ...s,
      aspiScore,
    };
  });

  // Rank by ASPI score descending
  summariesWithAspi.sort((a, b) => b.aspiScore - a.aspiScore);
  summariesWithAspi.forEach((s, idx) => {
    s.seasonRank = idx + 1;
  });

  return summariesWithAspi;
}
