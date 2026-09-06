import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { AgriculturalRecord } from '../types';
import { Upload, X, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react';

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (records: AgriculturalRecord[]) => void;
}

export const CsvUploadModal: React.FC<CsvUploadModalProps> = ({ isOpen, onClose, onDataLoaded }) => {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    setError(null);
    setIsProcessing(true);

    Papa.parse<Record<string, any>>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        setIsProcessing(false);
        if (!results.data || results.data.length === 0) {
          setError('The uploaded CSV file is empty or unreadable.');
          return;
        }

        try {
          const rawRows = results.data;
          const mappedRecords: AgriculturalRecord[] = rawRows.map((row, idx) => {
            // Flexible case-insensitive column lookup
            const findCol = (keys: string[]): any => {
              const rowKeys = Object.keys(row);
              for (const k of keys) {
                const matched = rowKeys.find((rk) => rk.toLowerCase().replace(/[\s_-]/g, '') === k.toLowerCase().replace(/[\s_-]/g, ''));
                if (matched && row[matched] !== undefined && row[matched] !== null) {
                  return row[matched];
                }
              }
              return null;
            };

            const state = String(findCol(['state', 'state_name', 'statename']) || 'Unknown State').trim();
            const district = String(findCol(['district', 'district_name', 'districtname']) || 'Unknown District').trim();
            const cropYear = Number(findCol(['crop_year', 'cropyear', 'year']) || 2022);
            const season = String(findCol(['season', 'cropping_season', 'season_name']) || 'Kharif').trim();
            const crop = String(findCol(['crop', 'crop_name', 'commodity']) || 'Mixed Crop').trim();
            const cropCategory = String(findCol(['crop_category', 'category', 'type']) || 'Cereals').trim();

            const areaHa = Math.max(1, Number(findCol(['area', 'area_ha', 'acreage']) || 5000));
            const productionTonnes = Math.max(0, Number(findCol(['production', 'production_tonnes', 'harvest_tonnes']) || 15000));
            const yieldVal = Number(findCol(['yield', 'yield_tonnes_per_ha', 'productivity']) || (productionTonnes / areaHa));

            const rainfall = Number(findCol(['rainfall', 'seasonal_rainfall_mm', 'precipitation', 'rain']) || 800);
            const temp = Number(findCol(['temperature', 'avg_temperature_c', 'temp']) || 26.5);
            const fertilizer = Number(findCol(['fertilizer', 'fertilizer_usage_kg_per_ha', 'npk']) || 120);
            const irrigation = Math.min(100, Math.max(0, Number(findCol(['irrigation', 'irrigation_coverage_pct', 'irrigation_pct']) || 65)));

            const price = Number(findCol(['market_price_inr_per_tonne', 'price', 'mandi_price', 'msp']) || 22000);
            const cost = Number(findCol(['cost_of_cultivation_inr_per_ha', 'cost', 'cultivation_cost']) || 42000);

            const revenue = Math.round(yieldVal * price);
            const profit = revenue - cost;

            return {
              id: `CUSTOM-${idx + 1}`,
              state,
              district,
              crop_year: cropYear,
              season,
              crop,
              crop_category: cropCategory,
              area_ha: areaHa,
              production_tonnes: productionTonnes,
              yield_tonnes_per_ha: Number(yieldVal.toFixed(2)),
              seasonal_rainfall_mm: rainfall,
              avg_temperature_c: temp,
              fertilizer_usage_kg_per_ha: fertilizer,
              irrigation_coverage_pct: irrigation,
              soil_type: String(findCol(['soil', 'soil_type']) || 'Alluvial'),
              market_price_inr_per_tonne: price,
              cost_of_cultivation_inr_per_ha: cost,
              economic_revenue_inr_per_ha: revenue,
              net_profit_inr_per_ha: profit,
            };
          });

          if (mappedRecords.length === 0) {
            setError('Could not extract valid records from CSV.');
            return;
          }

          onDataLoaded(mappedRecords);
          onClose();
        } catch (err: any) {
          setError(`Mapping error: ${err.message || 'Malformed CSV format'}`);
        }
      },
      error: (err) => {
        setIsProcessing(false);
        setError(`Failed to parse CSV: ${err.message}`);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Upload className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold">Upload College / Custom Agricultural CSV</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Upload your official agricultural dataset CSV file. The platform automatically normalizes column names, recalculates Data Quality Scores, executes the ANOVA hypothesis test, and evaluates ML predictive models on your custom dataset.
          </p>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/20"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <span className="text-xs font-semibold text-slate-700 block">
              Drag and drop your CSV file here, or click to browse
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Supports Ministry of Agriculture (DES), Kaggle, and College format CSVs
            </span>
          </div>

          {isProcessing && (
            <div className="p-3 bg-sky-50 text-sky-800 text-xs rounded-lg flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
              <span>Parsing and validating CSV schema...</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-800 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <strong>Supported Schema Headers:</strong>
            <p>State, District, Crop_Year, Season, Crop, Area, Production, Yield, Rainfall, Temperature, Fertilizer, Irrigation, Price, Cost.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
