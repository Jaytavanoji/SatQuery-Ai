import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, CheckCircle2 } from 'lucide-react';
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

