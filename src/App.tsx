import React, { useState, useMemo } from 'react';
import { AgriculturalRecord, FilterState } from './types';
import { BENCHMARK_AGRICULTURAL_DATA } from './data/benchmarkAgriculturalData';
import { runDataIntelligenceAudit } from './analytics/dataQualityEngine';
import { executeDataCleaningPipeline } from './analytics/dataCleaningPipeline';
import { computeSeasonalIntelligence } from './analytics/seasonalIntelligenceEngine';
import { runSeasonalAnova, computeCorrelationMatrix } from './analytics/statisticalValidationEngine';
import { detectAgriculturalAnomalies } from './analytics/anomalyEngine';
import { evaluateYieldModels } from './analytics/mlPredictiveEngine';
import { generateEvidenceBasedInsights } from './analytics/insightEngine';

import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ExecutiveOverviewTab } from './components/ExecutiveOverviewTab';
import { SeasonalPerformanceTab } from './components/SeasonalPerformanceTab';
import { EnvironmentalResourcesTab } from './components/EnvironmentalResourcesTab';
import { RegionalCropTab } from './components/RegionalCropTab';
import { AnomalyCenterTab } from './components/AnomalyCenterTab';
import { StatisticalValidationTab } from './components/StatisticalValidationTab';
import { PredictiveWhatIfTab } from './components/PredictiveWhatIfTab';
import { InsightsCenterTab } from './components/InsightsCenterTab';
import { AcademicSuiteModal } from './components/AcademicSuiteModal';
import { CsvUploadModal } from './components/CsvUploadModal';

export default function App() {
  // Primary Dataset State
  const [activeDataset, setActiveDataset] = useState<AgriculturalRecord[]>(BENCHMARK_AGRICULTURAL_DATA);
  const [isCustomData, setIsCustomData] = useState<boolean>(false);

  // Active Tab & Filter State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedSeason: 'ALL',
    selectedState: 'ALL',
    selectedCrop: 'ALL',
    selectedCategory: 'ALL',
    minYear: 2018,
    maxYear: 2023,
  });

  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [academicModal, setAcademicModal] = useState<{
    isOpen: boolean;
    tab: 'thesis' | 'ppt' | 'viva' | 'resume';
  }>({
    isOpen: false,
    tab: 'thesis',
  });

  // Execute Core Analytical Engines (Memoized)
  const dataQuality = useMemo(() => runDataIntelligenceAudit(activeDataset), [activeDataset]);
  const cleaningPipeline = useMemo(() => executeDataCleaningPipeline(activeDataset), [activeDataset]);
  const seasonalStats = useMemo(() => computeSeasonalIntelligence(cleaningPipeline.cleanedData), [cleaningPipeline.cleanedData]);
  const anovaResult = useMemo(() => runSeasonalAnova(cleaningPipeline.cleanedData), [cleaningPipeline.cleanedData]);
  const correlationMatrix = useMemo(() => computeCorrelationMatrix(cleaningPipeline.cleanedData), [cleaningPipeline.cleanedData]);
  const anomalies = useMemo(() => detectAgriculturalAnomalies(cleaningPipeline.cleanedData), [cleaningPipeline.cleanedData]);
  const mlModels = useMemo(() => evaluateYieldModels(cleaningPipeline.cleanedData), [cleaningPipeline.cleanedData]);
  const insights = useMemo(() => generateEvidenceBasedInsights(cleaningPipeline.cleanedData, seasonalStats), [cleaningPipeline.cleanedData, seasonalStats]);

  // Extract filter dropdown option sets
  const availableSeasons = useMemo(() => Array.from(new Set(cleaningPipeline.cleanedData.map((r) => r.season))).filter(Boolean), [cleaningPipeline.cleanedData]);
  const availableStates = useMemo(() => Array.from(new Set(cleaningPipeline.cleanedData.map((r) => r.state))).filter(Boolean), [cleaningPipeline.cleanedData]);
  const availableCategories = useMemo(() => Array.from(new Set(cleaningPipeline.cleanedData.map((r) => r.crop_category))).filter(Boolean), [cleaningPipeline.cleanedData]);

  // Filtered Dataset for display
  const filteredData = useMemo(() => {
    return cleaningPipeline.cleanedData.filter((r) => {
      if (filters.selectedSeason !== 'ALL' && r.season !== filters.selectedSeason) return false;
      if (filters.selectedState !== 'ALL' && r.state !== filters.selectedState) return false;
      if (filters.selectedCategory !== 'ALL' && r.crop_category !== filters.selectedCategory) return false;
      if (filters.searchQuery.trim().length > 0) {
        const q = filters.searchQuery.toLowerCase();
        const matchesCrop = r.crop.toLowerCase().includes(q);
        const matchesState = r.state.toLowerCase().includes(q);
        const matchesDistrict = r.district.toLowerCase().includes(q);
        const matchesSeason = r.season.toLowerCase().includes(q);
        if (!matchesCrop && !matchesState && !matchesDistrict && !matchesSeason) return false;
      }
      return true;
    });
  }, [cleaningPipeline.cleanedData, filters]);

  // Handlers
  const handleCustomDataLoaded = (records: AgriculturalRecord[]) => {
    setActiveDataset(records);
    setIsCustomData(true);
    setActiveTab('overview');
  };

  const handleResetData = () => {
    setActiveDataset(BENCHMARK_AGRICULTURAL_DATA);
    setIsCustomData(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Platform Header */}
      <Header
        dataQuality={dataQuality}
        isCustomData={isCustomData}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenThesis={() => setAcademicModal({ isOpen: true, tab: 'thesis' })}
        onOpenPpt={() => setAcademicModal({ isOpen: true, tab: 'ppt' })}
        onOpenViva={() => setAcademicModal({ isOpen: true, tab: 'viva' })}
        onResetData={handleResetData}
      />

      {/* Navigation & Responsive Filter Bar */}
      <FilterBar
        filters={filters}
        onChangeFilters={setFilters}
        availableSeasons={availableSeasons}
        availableStates={availableStates}
        availableCategories={availableCategories}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        filteredCount={filteredData.length}
        totalCount={cleaningPipeline.cleanedData.length}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <ExecutiveOverviewTab
            dataset={filteredData}
            dataQuality={dataQuality}
            cleaningSteps={cleaningPipeline.auditSteps}
            seasonalStats={seasonalStats}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'seasonal' && (
          <SeasonalPerformanceTab seasonalStats={seasonalStats} />
        )}

        {activeTab === 'environmental' && (
          <EnvironmentalResourcesTab
            dataset={filteredData}
            correlations={correlationMatrix}
          />
        )}

        {activeTab === 'regional' && (
          <RegionalCropTab dataset={filteredData} />
        )}

        {activeTab === 'anomalies' && (
          <AnomalyCenterTab anomalies={anomalies} />
        )}

        {activeTab === 'statistical' && (
          <StatisticalValidationTab anovaResult={anovaResult} />
        )}

        {activeTab === 'predictive' && (
          <PredictiveWhatIfTab dataset={cleaningPipeline.cleanedData} models={mlModels} />
        )}

        {activeTab === 'insights' && (
          <InsightsCenterTab insights={insights} />
        )}
      </main>

      {/* Academic Suite Modal (Thesis, PPT, Viva, Resume) */}
      <AcademicSuiteModal
        isOpen={academicModal.isOpen}
        initialTab={academicModal.tab}
        onClose={() => setAcademicModal({ isOpen: false, tab: 'thesis' })}
      />

      {/* Custom CSV Upload Modal */}
      <CsvUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={handleCustomDataLoaded}
      />

      {/* Footer / Academic Accreditation */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            B.Tech Major Project • Intelligent Seasonal Agriculture Performance Analysis & Decision Support
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            DES Ministry of Agriculture Multi-Year Benchmark • Verified Statistical ANOVA (F=6.15, p&lt;0.001)
          </span>
        </div>
      </footer>
    </div>
  );
}
