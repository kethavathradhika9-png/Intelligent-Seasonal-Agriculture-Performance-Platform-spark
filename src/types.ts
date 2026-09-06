export interface AgriculturalRecord {
  id: string;
  state: string;
  district: string;
  crop_year: number;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Summer' | 'Autumn' | 'Winter' | 'Whole Year' | string;
  crop: string;
  crop_category: 'Cereals' | 'Pulses' | 'Oilseeds' | 'Cash Crops' | 'Fiber' | 'Horticulture' | string;
  area_ha: number;
  production_tonnes: number;
  yield_tonnes_per_ha: number;
  seasonal_rainfall_mm: number;
  avg_temperature_c: number;
  fertilizer_usage_kg_per_ha: number;
  irrigation_coverage_pct: number;
  market_price_inr_per_tonne: number;
  cost_of_cultivation_inr_per_ha: number;
  economic_revenue_inr_per_ha: number;
  net_profit_inr_per_ha: number;
}

export interface ColumnProfile {
  name: string;
  type: 'numeric-continuous' | 'numeric-discrete' | 'categorical-nominal' | 'categorical-ordinal' | 'temporal';
  distinctCount: number;
  nullCount: number;
  nullPercentage: number;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  sampleValues: (string | number)[];
  description: string;
  category: 'Administrative/Geo' | 'Temporal' | 'Agronomic/Performance' | 'Environmental' | 'Resource/Input' | 'Economic';
}

export interface DataQualityReport {
  totalRows: number;
  totalColumns: number;
  totalCells: number;
  totalMissingCells: number;
  missingCellsPct: number;
  duplicateRowsCount: number;
  duplicateRowsPct: number;
  severeOutlierCount: number;
  severeOutlierPct: number;
  dataQualityScore: number; // 0 to 100
  columns: ColumnProfile[];
  detectedSeasonalCol: string;
  detectedGeoCols: string[];
  detectedPerformanceCols: string[];
  detectedEnvironmentalCols: string[];
  detectedResourceCols: string[];
  detectedEconomicCols: string[];
}

export interface DataCleaningStep {
  id: string;
  timestamp: string;
  stage: string;
  columnOrScope: string;
  beforeState: string;
  transformationLogic: string;
  afterState: string;
  impactCount: number;
}

export interface SeasonalSummaryStats {
  season: string;
  recordCount: number;
  totalAreaHa: number;
  totalProductionTonnes: number;
  avgYield: number;
  medianYield: number;
  minYield: number;
  maxYield: number;
  stdDevYield: number;
  cvYieldPct: number; // Coefficient of variation: (SD/Mean)*100
  avgRainfallMm: number;
  avgFertilizerKgHa: number;
  avgIrrigationPct: number;
  avgTemperatureC: number;
  avgCostPerHa: number;
  avgRevenuePerHa: number;
  avgNetProfitPerHa: number;
  aspiScore: number; // Agricultural Season Performance Index (0-100)
  seasonRank: number;
}

export interface AnovaHypothesisTest {
  researchQuestion: string;
  nullHypothesis: string;
  altHypothesis: string;
  variableTested: string;
  groupingFactor: string;
  alpha: number;
  ssb: number; // Sum of Squares Between
  ssw: number; // Sum of Squares Within
  dfb: number; // Degrees of Freedom Between
  dfw: number; // Degrees of Freedom Within
  msb: number; // Mean Square Between
  msw: number; // Mean Square Within
  fStatistic: number;
  pValue: number;
  isSignificant: boolean;
  etaSquared: number; // Effect size (SSB / (SSB + SSW))
  practicalSignificance: string;
  interpretation: string;
}

export interface CorrelationMetric {
  var1: string;
  var2: string;
  pearsonR: number;
  spearmanRho: number;
  sampleSize: number;
  strengthLabel: 'Very Strong' | 'Strong' | 'Moderate' | 'Weak' | 'Negligible';
  direction: 'Positive' | 'Negative' | 'Neutral';
  pValueApprox: number;
  causationWarning: string;
}

export interface AnomalyRecord {
  recordId: string;
  crop: string;
  season: string;
  state: string;
  district: string;
  cropYear: number;
  metricName: string;
  observedValue: number;
  expectedBenchmark: number;
  zScore: number;
  anomalyType: 'Extreme High Yield' | 'Crop Failure / Severe Drop' | 'Drought Stress Yield Deficit' | 'Input Inefficiency' | 'Data Entry Discrepancy';
  confidence: 'High' | 'Medium' | 'Low';
  agronomicInterpretation: string;
}

export interface MlModelEvaluation {
  modelName: string;
  algorithmType: string;
  targetVariable: string;
  trainSampleSize: number;
  testSampleSize: number;
  mae: number;
  rmse: number;
  r2Score: number;
  featureImportance: { feature: string; weightPct: number }[];
  limitations: string;
}

export interface WhatIfSimulationInput {
  rainfallChangePct: number; // -50% to +50%
  fertilizerChangePct: number; // -50% to +50%
  irrigationCoveragePct: number; // 0 to 100%
  selectedSeason: string;
  selectedCrop: string;
}

export interface WhatIfSimulationResult {
  baselineYield: number;
  simulatedYield: number;
  deltaYieldPct: number;
  baselineNetProfit: number;
  simulatedNetProfit: number;
  deltaProfitPct: number;
  riskFactor: 'Low' | 'Moderate' | 'High' | 'Extreme';
  limitingNutrientOrConstraint: string;
  scientificDisclaimer: string;
}

export interface EvidenceBasedInsight {
  id: string;
  category: 'Seasonal Dominance' | 'Environmental Interaction' | 'Resource Efficiency' | 'Regional Disparity' | 'Economic Vulnerability' | 'Extreme Event';
  title: string;
  observation: string;
  evidence: string;
  interpretation: string;
  implication: string;
  possibleAction: string;
  confidenceGrade: 'A (Statistically Confirmed)' | 'B (Strong Correlation)' | 'C (Observational Pattern)';
}

export interface FilterState {
  searchQuery: string;
  selectedSeason: string;
  selectedState: string;
  selectedCrop: string;
  selectedCategory: string;
  minYear: number;
  maxYear: number;
}
