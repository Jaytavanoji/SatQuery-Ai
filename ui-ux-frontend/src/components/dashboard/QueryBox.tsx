import React from 'react';
import { MessageSquare, HelpCircle } from 'lucide-react';

interface QueryBoxProps {
  query: string;
  onChangeQuery: (query: string) => void;
  onAnalyze: () => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export const QueryBox: React.FC<QueryBoxProps> = ({
  query,
  onChangeQuery,
  onAnalyze,
  isProcessing,
  disabled = false
}) => {
  const suggestedQueries = [
    'Describe the land-cover in this image.',
    'Highlight the water body.',
    'What changed between these two dates?',
    'Has the built-up area increased?',
    'Identify built-up and water-covered regions using optical and SAR imagery.'
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (query.trim() && !isProcessing && !disabled) {
        onAnalyze();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label htmlFor="query-textarea" className="flex items-center gap-2 text-xs font-bold text-gray-200 uppercase">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>Ask a Question</span>
        </label>
        <span className="text-[11px] text-gray-400">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-gray-300">Enter ↵</kbd> to analyze
        </span>
      </div>

      {/* Query Text Area & Action Button */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gray-900/90 border border-white/10 focus-within:border-cyan-500/60 shadow-lg shadow-black/40 transition-all">
        <textarea
          id="query-textarea"
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing || disabled}
          placeholder="Ask a question about your satellite imagery (e.g., 'Analyze coastal erosion trends near Chennai')..."
          rows={3}
          className="w-full bg-transparent text-sm sm:text-base text-white placeholder-gray-500 resize-none outline-none leading-relaxed"
        />

        {/* Action Button Strip */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="hidden sm:inline">AI automatically selects the optimal analysis model</span>
          </div>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={!query.trim() || isProcessing || disabled}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm cursor-pointer ${
              query.trim() && !isProcessing && !disabled
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-cyan-500/20'
                : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>Analyze with SatQuery AI</span>
          </button>
        </div>
      </div>

      {/* Suggested Queries Chips */}
      <div className="space-y-2">
        <div className="text-[11px] text-gray-400 uppercase font-bold flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Suggested queries:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((suggested, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChangeQuery(suggested)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 hover:text-white transition-all text-left cursor-pointer"
            >
              {suggested}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
