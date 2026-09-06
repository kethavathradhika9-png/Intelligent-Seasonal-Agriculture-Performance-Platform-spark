import { AgriculturalRecord, ColumnProfile, DataQualityReport } from '../types';

export function runDataIntelligenceAudit(dataset: AgriculturalRecord[]): DataQualityReport {
  const totalRows = dataset.length;
  if (totalRows === 0) {
    return {
      totalRows: 0,
      totalColumns: 0,
      totalCells: 0,
      totalMissingCells: 0,
      missingCellsPct: 0,
      duplicateRowsCount: 0,
      duplicateRowsPct: 0,
      severeOutlierCount: 0,
      severeOutlierPct: 0,
      dataQualityScore: 0,
      columns: [],
      detectedSeasonalCol: 'season',
      detectedGeoCols: ['state', 'district'],
      detectedPerformanceCols: ['production_tonnes', 'yield_tonnes_per_ha'],
      detectedEnvironmentalCols: ['seasonal_rainfall_mm', 'avg_temperature_c'],
      detectedResourceCols: ['fertilizer_usage_kg_per_ha', 'irrigation_coverage_pct'],
      detectedEconomicCols: ['cost_of_cultivation_inr_per_ha', 'economic_revenue_inr_per_ha', 'net_profit_inr_per_ha'],
    };
  }

  const sample = dataset[0];
  const keys = Object.keys(sample) as (keyof AgriculturalRecord)[];
  const totalColumns = keys.length;
  const totalCells = totalRows * totalColumns;

  let totalMissingCells = 0;
  let severeOutlierCount = 0;
  let totalNumericalValues = 0;

  // Duplicate record check based on (state, district, crop_year, season, crop)
  const compositeKeys = new Set<string>();
  let duplicateRowsCount = 0;
  for (const row of dataset) {
    const key = `${row.state}-${row.district}-${row.crop_year}-${row.season}-${row.crop}`;
    if (compositeKeys.has(key)) {
      duplicateRowsCount++;
    } else {
      compositeKeys.add(key);
    }
  }

  const columns: ColumnProfile[] = keys.map((key) => {
    let nullCount = 0;
    const values = dataset.map((r) => r[key]);
    const nonNullValues = values.filter((v) => v !== null && v !== undefined && v !== '');
    nullCount = totalRows - nonNullValues.length;
    totalMissingCells += nullCount;

    const isNumeric = typeof sample[key] === 'number';
    let min: number | undefined;
    let max: number | undefined;
    let mean: number | undefined;
    let median: number | undefined;

    if (isNumeric) {
      const numVals = (nonNullValues as number[]).sort((a, b) => a - b);
      totalNumericalValues += numVals.length;
      if (numVals.length > 0) {
        min = numVals[0];
        max = numVals[numVals.length - 1];
        mean = Number((numVals.reduce((acc, curr) => acc + curr, 0) / numVals.length).toFixed(2));
        const mid = Math.floor(numVals.length / 2);
        median = numVals.length % 2 === 0 ? Number(((numVals[mid - 1] + numVals[mid]) / 2).toFixed(2)) : numVals[mid];

        // Outlier detection via IQR
        const q1 = numVals[Math.floor(numVals.length * 0.25)];
        const q3 = numVals[Math.floor(numVals.length * 0.75)];
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        for (const val of numVals) {
          if (val < lowerBound || val > upperBound) {
            severeOutlierCount++;
          }
        }
      }
    }

    const distinct = new Set(nonNullValues);
    const distinctCount = distinct.size;

    let colType: ColumnProfile['type'] = isNumeric ? 'numeric-continuous' : 'categorical-nominal';
    if (key === 'crop_year') colType = 'temporal';
    if (key === 'season') colType = 'categorical-ordinal';
    if (key === 'area_ha' || key === 'production_tonnes') colType = 'numeric-continuous';

    let category: ColumnProfile['category'] = 'Agronomic/Performance';
    if (key === 'state' || key === 'district') category = 'Administrative/Geo';
    else if (key === 'crop_year' || key === 'season') category = 'Temporal';
    else if (key === 'seasonal_rainfall_mm' || key === 'avg_temperature_c') category = 'Environmental';
    else if (key === 'fertilizer_usage_kg_per_ha' || key === 'irrigation_coverage_pct') category = 'Resource/Input';
    else if (key === 'market_price_inr_per_tonne' || key === 'cost_of_cultivation_inr_per_ha' || key === 'economic_revenue_inr_per_ha' || key === 'net_profit_inr_per_ha') category = 'Economic';

    const descMap: Record<string, string> = {
      id: 'Unique identifier for each agricultural reporting record.',
      state: 'Indian State jurisdiction where cultivation occurred.',
      district: 'Administrative district level subdivision.',
      crop_year: 'Agricultural calendar / harvest year.',
      season: 'Official agro-climatic cropping season (Kharif, Rabi, Zaid, Summer, Autumn, Winter, Whole Year).',
      crop: 'Botanical / agricultural crop cultivar name.',
      crop_category: 'Macro commodity grouping (Cereals, Pulses, Oilseeds, Cash Crops, Fiber).',
      area_ha: 'Total cultivated acreage / geographical land area in Hectares (ha).',
      production_tonnes: 'Aggregated total harvest volume output measured in Metric Tonnes (t).',
      yield_tonnes_per_ha: 'Agronomic productivity ratio: Output in tonnes per hectare (t/ha).',
      seasonal_rainfall_mm: 'Cumulative precipitation received during vegetative to maturation phases (mm).',
      avg_temperature_c: 'Mean ambient thermal temperature recorded during growing cycle (°C).',
      fertilizer_usage_kg_per_ha: 'Chemical nutrient input dosage (Total N-P-K applied in kg/ha).',
      irrigation_coverage_pct: 'Proportion of cropped area with assured canal/borewell irrigation infrastructure (%).',
      market_price_inr_per_tonne: 'Minimum Support Price (MSP) / Average APMC mandi wholesale realization (INR/t).',
      cost_of_cultivation_inr_per_ha: 'Operational comprehensive cost of cultivation (A2+FL / C2 formulation in INR/ha).',
      economic_revenue_inr_per_ha: 'Gross farm revenue generated per hectare (Yield × Mandi Price).',
      net_profit_inr_per_ha: 'Net farm economic return margin per hectare (Gross Revenue − Cultivation Cost).',
    };

    return {
      name: String(key),
      type: colType,
      distinctCount,
      nullCount,
      nullPercentage: Number(((nullCount / totalRows) * 100).toFixed(2)),
      min,
      max,
      mean,
      median,
      sampleValues: Array.from(distinct).slice(0, 4) as (string | number)[],
      description: descMap[String(key)] || `Agricultural variable ${String(key)}`,
      category,
    };
  });

  const missingCellsPct = Number(((totalMissingCells / totalCells) * 100).toFixed(2));
  const duplicateRowsPct = Number(((duplicateRowsCount / totalRows) * 100).toFixed(2));
  const severeOutlierPct = totalNumericalValues > 0 ? Number(((severeOutlierCount / totalNumericalValues) * 100).toFixed(2)) : 0;

  // Logical Data Quality Score formula
  // DQS = 100 * (1 - (0.45 * nullRatio + 0.35 * dupRatio + 0.20 * outlierRatio))
  const nullRatio = totalCells > 0 ? totalMissingCells / totalCells : 0;
  const dupRatio = totalRows > 0 ? duplicateRowsCount / totalRows : 0;
  const outlierRatio = totalNumericalValues > 0 ? Math.min(1, severeOutlierCount / totalNumericalValues) : 0;
  const rawScore = 100 * (1 - (0.45 * nullRatio + 0.35 * dupRatio + 0.20 * outlierRatio));
  const dataQualityScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    totalRows,
    totalColumns,
    totalCells,
    totalMissingCells,
    missingCellsPct,
    duplicateRowsCount,
    duplicateRowsPct,
    severeOutlierCount,
    severeOutlierPct,
    dataQualityScore,
    columns,
    detectedSeasonalCol: 'season',
    detectedGeoCols: ['state', 'district'],
    detectedPerformanceCols: ['production_tonnes', 'yield_tonnes_per_ha'],
    detectedEnvironmentalCols: ['seasonal_rainfall_mm', 'avg_temperature_c'],
    detectedResourceCols: ['fertilizer_usage_kg_per_ha', 'irrigation_coverage_pct'],
    detectedEconomicCols: ['cost_of_cultivation_inr_per_ha', 'economic_revenue_inr_per_ha', 'net_profit_inr_per_ha'],
  };
}
