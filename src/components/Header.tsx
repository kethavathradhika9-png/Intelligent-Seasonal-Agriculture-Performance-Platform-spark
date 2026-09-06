import React from 'react';
import { Sprout, FileText, Presentation, HelpCircle, Upload, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DataQualityReport } from '../types';

interface HeaderProps {
  dataQuality: DataQualityReport;
  isCustomData: boolean;
  onOpenUpload: () => void;
  onOpenThesis: () => void;
  onOpenPpt: () => void;
  onOpenViva: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dataQuality,
  isCustomData,
  onOpenUpload,
  onOpenThesis,
  onOpenPpt,
  onOpenViva,
  onResetData,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-4">
          {/* Brand & Project Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white">
                  Seasonal Agriculture Intelligence Platform
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  B.Tech Major Project
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Decision-Support System • ANOVA Statistical Validation • Anomaly Diagnosis • Predictive What-If
              </p>
            </div>
          </div>

          {/* Dataset Status & Academic Action Suite */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Data Quality Pill */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-xs"
              title="Calculated Data Quality Score based on missing values, duplicates, and physical outliers"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">Data Quality:</span>
              <span className="font-semibold text-emerald-400">{dataQuality.dataQualityScore}%</span>
            </div>

            {/* Custom Data / Benchmark indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-300 font-mono">
                {isCustomData ? 'Custom CSV' : 'Benchmark DES'}: {dataQuality.totalRows} records
              </span>
            </div>

            {/* Reset to Benchmark if custom */}
            {isCustomData && (
              <button
                onClick={onResetData}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                title="Reset to benchmark agricultural dataset"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            {/* Upload CSV */}
            <button
              id="upload-csv-header-btn"
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600/80 text-slate-200 transition-colors"
              title="Upload your college CSV file to evaluate"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Upload CSV</span>
            </button>

            {/* Academic Suite Buttons */}
            <div className="h-4 w-px bg-slate-700 mx-0.5 hidden sm:block" />

            <button
              id="academic-thesis-header-btn"
              onClick={onOpenThesis}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
              title="View full 21-chapter B.Tech Major Project Thesis Report"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Major Report</span>
            </button>

            <button
              id="academic-ppt-header-btn"
              onClick={onOpenPpt}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-sm transition-colors"
              title="View 12-slide Project Defense Presentation"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>12-Slide PPT</span>
            </button>

            <button
              id="academic-viva-header-btn"
              onClick={onOpenViva}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-purple-600/90 hover:bg-purple-500 text-white shadow-sm transition-colors"
              title="Open Viva Voce Questions & Answers Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Viva Guide</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
