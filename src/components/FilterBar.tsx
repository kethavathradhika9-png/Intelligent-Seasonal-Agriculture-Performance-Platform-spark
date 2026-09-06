import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  availableSeasons: string[];
  availableStates: string[];
  availableCategories: string[];
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  filteredCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  availableSeasons,
  availableStates,
  availableCategories,
  activeTab,
  onSelectTab,
  filteredCount,
  totalCount,
}) => {
  const tabs = [
    { id: 'overview', label: 'Executive Overview' },
    { id: 'seasonal', label: 'Seasonal Performance & ASPI' },
    { id: 'environmental', label: 'Environment & Resources' },
    { id: 'regional', label: 'Regional & Crop Analytics' },
    { id: 'anomalies', label: 'Anomaly Center' },
    { id: 'statistical', label: 'Statistical Validation (ANOVA)' },
    { id: 'predictive', label: 'Predictive ML & What-If' },
    { id: 'insights', label: 'Evidence-Based Insights' },
  ];

  const hasActiveFilters =
    filters.selectedSeason !== 'ALL' ||
    filters.selectedState !== 'ALL' ||
    filters.selectedCategory !== 'ALL' ||
    filters.searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    onChangeFilters({
      searchQuery: '',
      selectedSeason: 'ALL',
      selectedState: 'ALL',
      selectedCrop: 'ALL',
      selectedCategory: 'ALL',
      minYear: 2018,
      maxYear: 2023,
    });
  };

  return (
    <div className="bg-white border-b border-slate-200 sticky top-[65px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Module Tabs Navigation */}
        <div className="flex items-center overflow-x-auto space-x-1 py-2 border-b border-slate-100 scrollbar-thin">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row */}
        <div className="py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filters:</span>
            </span>

            {/* Season Filter */}
            <select
              id="filter-season-select"
              value={filters.selectedSeason}
              onChange={(e) => onChangeFilters({ ...filters, selectedSeason: e.target.value })}
              aria-label="Filter by Season"
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-hidden"
            >
              <option value="ALL">All Seasons</option>
              {availableSeasons.map((s) => (
                <option key={s} value={s}>
                  Season: {s}
                </option>
              ))}
            </select>

            {/* State Filter */}
            <select
              id="filter-state-select"
              value={filters.selectedState}
              onChange={(e) => onChangeFilters({ ...filters, selectedState: e.target.value })}
              aria-label="Filter by State"
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-hidden"
            >
              <option value="ALL">All States</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  State: {st}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              id="filter-category-select"
              value={filters.selectedCategory}
              onChange={(e) => onChangeFilters({ ...filters, selectedCategory: e.target.value })}
              aria-label="Filter by Crop Category"
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-hidden"
            >
              <option value="ALL">All Crop Categories</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-slate-500 hover:text-red-600 px-2 py-1 rounded bg-slate-100 hover:bg-red-50 border border-slate-200 transition-colors"
                title="Clear all filters"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search Input & Matching Counter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="filter-search-input"
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
                placeholder="Search crop, district..."
                className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-hidden w-40 sm:w-52"
              />
            </div>
            <span className="text-slate-500 font-mono text-[11px] whitespace-nowrap">
              Showing <strong className="text-slate-800">{filteredCount}</strong> of {totalCount} records
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
