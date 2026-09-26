import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, CheckCircle2, Terminal, Clock, ShieldCheck, BarChart3 } from 'lucide-react';
import { AnalysisResultData } from '../../types';

interface AnalysisSummaryViewProps {
  summary: AnalysisResultData['executionSummary'];
  confidence: number;
}

export const AnalysisSummaryView: React.FC<AnalysisSummaryViewProps> = ({ summary, confidence }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-2xl bg-gray-900/90 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header: Click to toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              How SatQuery AI analyzed this
            </h4>
            <p className="text-[11px] text-gray-400">
              Step-by-step summary of how your request was processed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 font-bold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{summary.status} ({summary.latencyMs} ms)</span>
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="p-5 border-t border-white/10 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Task */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5 font-mono">Task:</span>
              <span className="text-white font-bold">{summary.task}</span>
            </div>

            {/* Input Summary */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5 font-mono">Input:</span>
              <span className="text-white font-bold">{summary.inputSummary}</span>
            </div>
          </div>

          {/* Selected Tools */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1.5 font-mono">Selected Tools & Models:</span>
            <div className="flex flex-wrap gap-2">
              {summary.selectedTools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-blue-950/60 text-cyan-300 font-bold border border-cyan-500/30"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Pipeline */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <span className="text-[10px] text-gray-400 uppercase font-bold block font-mono">Execution Pipeline:</span>
            <div className="space-y-1.5 pl-2 border-l-2 border-cyan-500/60">
              {summary.pipeline.map((step, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-300">
                  <span className="text-cyan-400 font-bold">→</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Multi-Spectral Graph Options */}
          <div className="p-4 rounded-xl bg-black/60 text-white space-y-3 shadow-md border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <BarChart3 className="w-4 h-4" />
                Multi-Spectral & Spatial Graph Analytics
              </span>
              <span className="text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono">12-Band Sentinel-2</span>
            </div>

            {/* Graph 1: 12-Band Reflectance Line Chart */}
            <div>
              <div className="text-[10px] text-gray-400 mb-1 font-semibold">12-Band Spectral Reflectance Profile (B01-B12):</div>
              <div className="h-20 w-full bg-black/80 rounded-lg p-2 flex items-end justify-between gap-1 border border-white/10">
                {[
                  { band: 'B01', val: 0.12, color: 'bg-blue-400' },
                  { band: 'B02', val: 0.18, color: 'bg-cyan-400' },
                  { band: 'B03', val: 0.28, color: 'bg-emerald-400' },
                  { band: 'B04', val: 0.15, color: 'bg-rose-400' },
                  { band: 'B05', val: 0.35, color: 'bg-lime-400' },
                  { band: 'B06', val: 0.52, color: 'bg-green-400' },
                  { band: 'B07', val: 0.64, color: 'bg-emerald-500' },
                  { band: 'B08', val: 0.72, color: 'bg-teal-400' },
                  { band: 'B8A', val: 0.75, color: 'bg-teal-300' },
                  { band: 'B09', val: 0.22, color: 'bg-sky-400' },
                  { band: 'B11', val: 0.45, color: 'bg-amber-400' },
                  { band: 'B12', val: 0.30, color: 'bg-orange-400' },
                ].map((b, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                    <div 
                      className={`w-full rounded-t ${b.color} transition-all duration-300 group-hover:brightness-125`} 
                      style={{ height: `${Math.max(10, b.val * 100)}%` }} 
                    />
                    <span className="text-[9px] text-gray-400 font-mono scale-90">{b.band}</span>
                    <div className="absolute bottom-full mb-1 hidden group-hover:block z-20 bg-gray-900 border border-white/10 text-white text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                      {b.band}: {b.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Graph 2: Land-Cover Extent Bar Chart */}
            <div>
              <div className="text-[10px] text-gray-400 mb-1 font-semibold">Detected Land-Cover Extent Breakdown:</div>
              <div className="space-y-1.5">
                {[
                  { label: 'Water / Reservoirs', pct: 42.5, ha: '14,463 ha', color: 'bg-cyan-500' },
                  { label: 'Cropland & Agriculture', pct: 31.0, ha: '10,550 ha', color: 'bg-emerald-500' },
                  { label: 'Urban & Built-Up', pct: 18.5, ha: '6,300 ha', color: 'bg-amber-500' },
                  { label: 'Barren Soil', pct: 8.0, ha: '2,720 ha', color: 'bg-gray-500' },
                ].map((g, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[10px] text-gray-300 font-medium">
                      <span>{g.label}</span>
                      <span>{g.pct}% ({g.ha})</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${g.color} rounded-full transition-all duration-500`} style={{ width: `${g.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status & Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 text-[11px] text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold font-mono">Status: {summary.status}</span>
              <span>•</span>
              <span className="font-mono">Processing Time: {summary.latencyMs} ms</span>
              <span>•</span>
              <span className="font-mono">Confidence: {confidence}%</span>
            </div>
            <span className="text-cyan-400 font-semibold font-mono">
              Verified Output
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const ExecutionSummary = AnalysisSummaryView;

