import { AgriculturalRecord, AnomalyRecord } from '../types';

export function detectAgriculturalAnomalies(dataset: AgriculturalRecord[]): AnomalyRecord[] {
  if (dataset.length === 0) return [];

  const anomalies: AnomalyRecord[] = [];

  // 1. Crop-specific yield benchmark distributions
  const cropYields = new Map<string, number[]>();
  for (const r of dataset) {
    if (!cropYields.has(r.crop)) cropYields.set(r.crop, []);
    cropYields.get(r.crop)!.push(r.yield_tonnes_per_ha);
  }

  const cropStats = new Map<string, { mean: number; sd: number; q1: number; q3: number; iqr: number }>();
  cropYields.forEach((yields, crop) => {
    const sorted = [...yields].sort((a, b) => a - b);
    const n = sorted.length;
    const mean = sorted.reduce((a, b) => a + b, 0) / n;
    const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n > 1 ? n - 1 : 1);
    const sd = Math.sqrt(variance);

    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;

    cropStats.set(crop, { mean, sd, q1, q3, iqr });
  });

  for (const r of dataset) {
    const stats = cropStats.get(r.crop);
    if (!stats) continue;

    const zScore = stats.sd > 0 ? Number(((r.yield_tonnes_per_ha - stats.mean) / stats.sd).toFixed(2)) : 0;

    // Check for severe drought anomaly: low rainfall + low yield
    if (r.seasonal_rainfall_mm < 200 && r.irrigation_coverage_pct < 20 && r.yield_tonnes_per_ha < stats.mean * 0.6) {
      anomalies.push({
        recordId: r.id,
        crop: r.crop,
        season: r.season,
        state: r.state,
        district: r.district,
        cropYear: r.crop_year,
        metricName: 'Yield & Precipitation',
        observedValue: r.yield_tonnes_per_ha,
        expectedBenchmark: Number(stats.mean.toFixed(2)),
        zScore,
        anomalyType: 'Drought Stress Yield Deficit',
        confidence: 'High',
        agronomicInterpretation: `A severe deficit in seasonal rainfall (${r.seasonal_rainfall_mm} mm) combined with minimal irrigation coverage (${r.irrigation_coverage_pct}%) precipitated an acute ${Math.round((1 - r.yield_tonnes_per_ha / stats.mean) * 100)}% harvest reduction below crop normal.`,
      });
      continue;
    }

    // Check for flood / pest damage: excessive rainfall + catastrophic yield drop
    if (r.seasonal_rainfall_mm > 1300 && r.yield_tonnes_per_ha < stats.mean * 0.5) {
      anomalies.push({
        recordId: r.id,
        crop: r.crop,
        season: r.season,
        state: r.state,
        district: r.district,
        cropYear: r.crop_year,
        metricName: 'Yield under Heavy Monsoon',
        observedValue: r.yield_tonnes_per_ha,
        expectedBenchmark: Number(stats.mean.toFixed(2)),
        zScore,
        anomalyType: 'Crop Failure / Severe Drop',
        confidence: 'High',
        agronomicInterpretation: `Unseasonable monsoon inundation (${r.seasonal_rainfall_mm} mm) induced root asphyxiation, lodging, and foliar disease, causing yield collapse to ${r.yield_tonnes_per_ha} t/ha.`,
      });
      continue;
    }

    // Check for extreme high productivity
    if (zScore > 2.0 || r.yield_tonnes_per_ha > stats.q3 + 1.5 * stats.iqr) {
      anomalies.push({
        recordId: r.id,
        crop: r.crop,
        season: r.season,
        state: r.state,
        district: r.district,
        cropYear: r.crop_year,
        metricName: 'Record High Harvest Yield',
        observedValue: r.yield_tonnes_per_ha,
        expectedBenchmark: Number(stats.mean.toFixed(2)),
        zScore,
        anomalyType: 'Extreme High Yield',
        confidence: 'High',
        agronomicInterpretation: `Productivity surpassed the 95th percentile benchmark due to synergy between assured micro-irrigation (${r.irrigation_coverage_pct}%) and optimal seasonal thermal regime (${r.avg_temperature_c}°C).`,
      });
      continue;
    }

    // Check for input inefficiency: high fertilizer (> 160 kg/ha) but sub-par yield
    if (r.fertilizer_usage_kg_per_ha > 170 && r.yield_tonnes_per_ha <= stats.mean && r.crop !== 'Sugarcane') {
      anomalies.push({
        recordId: r.id,
        crop: r.crop,
        season: r.season,
        state: r.state,
        district: r.district,
        cropYear: r.crop_year,
        metricName: 'Fertilizer Input Response',
        observedValue: r.fertilizer_usage_kg_per_ha,
        expectedBenchmark: 110,
        zScore: Number(((r.fertilizer_usage_kg_per_ha - 110) / 30).toFixed(2)),
        anomalyType: 'Input Inefficiency',
        confidence: 'Medium',
        agronomicInterpretation: `Excessive NPK fertilizer dose (${r.fertilizer_usage_kg_per_ha} kg/ha) failed to translate into yield gains (${r.yield_tonnes_per_ha} t/ha), indicative of micronutrient deficiency or soil salinity saturation.`,
      });
    }
  }

  // Sort by absolute z-score descending
  anomalies.sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore));
  return anomalies;
}
