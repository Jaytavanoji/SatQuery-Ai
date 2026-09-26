import React from 'react';
import { CheckCircle2, Circle, Loader2, Sparkles, Cpu } from 'lucide-react';
import { AgentProcessStep } from '../../types';

interface AgentProcessingViewProps {
  currentStepIndex: number;
  steps: AgentProcessStep[];
  selectedTask?: string;
  selectedModel?: string;
}

export const AgentProcessingView: React.FC<AgentProcessingViewProps> = ({
  currentStepIndex,
  steps,
  selectedTask,
  selectedModel
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-gray-900/90 border border-white/10 shadow-2xl backdrop-blur-md space-y-6 animate-in fade-in duration-300">
      {/* Title & Agent Activity */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-950/60 text-cyan-400 flex items-center justify-center border border-cyan-500/40 shadow-xs">
            <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>AI Analysis in Progress</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </h3>
            <p className="text-xs text-gray-400">
              Processing satellite images and generating verified geospatial answers
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>AI Engine Active</span>
        </div>
      </div>

      {/* Step-by-Step Workflow */}
      <div className="space-y-3 text-xs max-w-xl mx-auto">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 font-mono">
          Analyzing request...
        </div>

        {steps.map((step, index) => {
          const isDone = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : isCurrent
                  ? 'bg-blue-950/60 border-cyan-500/50 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                  : 'bg-black/40 border-white/5 text-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                )}

                <div>
                  <span className={`font-semibold ${isCurrent ? 'font-bold text-white' : ''}`}>
                    {isDone ? `✓ ${step.title}` : isCurrent ? `● ${step.title}` : `○ ${step.title}`}
                  </span>
                  {step.detail && (
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {step.detail}
                    </span>
                  )}
                </div>
              </div>

              {isDone && (
                <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono tracking-wider">
                  Done
                </span>
              )}
              {isCurrent && (
                <span className="text-[10px] text-cyan-400 font-bold uppercase font-mono tracking-wider animate-pulse">
                  Working
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Dispatched Model Notification Pill */}
      {selectedModel && (
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs text-gray-400">
          <span>Active Model: <strong className="text-cyan-400">{selectedModel}</strong></span>
          <span>Task: <strong className="text-white">{selectedTask || 'Image Analysis'}</strong></span>
        </div>
      )}
    </div>
  );
};
