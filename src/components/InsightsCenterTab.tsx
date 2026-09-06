import React from 'react';
import { EvidenceBasedInsight } from '../types';
import { Lightbulb, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface InsightsCenterTabProps {
  insights: EvidenceBasedInsight[];
}

export const InsightsCenterTab: React.FC<InsightsCenterTabProps> = ({ insights }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Module 16–19: Evidence-Based Insights & Decision-Support Framework
          </h2>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-semibold">
            {insights.length} Verified Agronomic Insights
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Strict adherence to the 5-Stage Policy Framework: <strong className="text-slate-800">OBSERVATION → EVIDENCE → INTERPRETATION → IMPLICATION → POSSIBLE ACTION</strong>. Zero unsupported claims.
        </p>
      </div>

      {/* Insights Cards List */}
      <div className="space-y-4">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all space-y-3"
          >
            {/* Header: Title + Category + Confidence */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                  {ins.id}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{ins.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                  {ins.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {ins.confidenceGrade}
                </span>
              </div>
            </div>

            {/* 5-Stage Structured Sequence */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs pt-1">
              {/* Stage 1: Observation */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  1. Observation
                </div>
                <p className="text-slate-800 leading-relaxed">{ins.observation}</p>
              </div>

              {/* Stage 2: Evidence */}
              <div className="p-3 bg-sky-50/50 rounded-lg border border-sky-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  2. Empirical Evidence
                </div>
                <p className="text-slate-900 font-mono text-[11px] leading-relaxed">{ins.evidence}</p>
              </div>

              {/* Stage 3: Interpretation */}
              <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  3. Agronomic Cause
                </div>
                <p className="text-slate-800 leading-relaxed">{ins.interpretation}</p>
              </div>

              {/* Stage 4: Implication */}
              <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  4. Risk Implication
                </div>
                <p className="text-slate-800 leading-relaxed">{ins.implication}</p>
              </div>

              {/* Stage 5: Possible Action */}
              <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  5. Actionable Recommendation
                </div>
                <p className="text-emerald-950 font-medium leading-relaxed">{ins.possibleAction}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
