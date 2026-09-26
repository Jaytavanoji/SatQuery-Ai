import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Eye, 
  Download
} from 'lucide-react';
import { ReportItem } from '../../types';
import { SatQueryApiService } from '../../services/apiService';
import { PdfReportService } from '../../services/pdfReportService';

interface AnalysisHistoryViewProps {
  onViewReport: (report: ReportItem) => void;
  onOpenInWorkspace?: (report: ReportItem) => void;
  customReports?: ReportItem[];
}

export const AnalysisHistoryView: React.FC<AnalysisHistoryViewProps> = ({
  onViewReport,
  onOpenInWorkspace,
  customReports = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Change' | 'Grounding' | 'VQA' | 'Optical+SAR'>('All');
  const [serverReports, setServerReports] = useState<ReportItem[]>([]);

  useEffect(() => {
    let mounted = true;
    SatQueryApiService.getReports().then(reps => {
      if (mounted && reps && reps.length > 0) {
        const mapped: ReportItem[] = reps.map(r => ({
          id: r.id,
          title: r.title,
          query: r.query,
          date: r.date,
          task: r.task,
          confidence: r.confidence,
          answer: r.answer,
          modelsUsed: r.modelsUsed,
          executionTime: r.executionTime,
          status: (r.status as any) || 'Generated',
          inputSummary: r.inputSummary,
          evidenceVisual: r.evidenceVisual,
          tags: r.tags,
        }));
        setServerReports(mapped);
      }
    });
    return () => { mounted = false; };
  }, []);

  const allItems = [...customReports, ...serverReports];

  const filteredReports = allItems.filter(item => {
    const matchesSearch = item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.task.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'All') return matchesSearch;
    if (selectedFilter === 'Change') return matchesSearch && item.task.includes('Change');
    if (selectedFilter === 'Grounding') return matchesSearch && item.task.includes('Grounding');
    if (selectedFilter === 'VQA') return matchesSearch && item.task.includes('VQA');
    if (selectedFilter === 'Optical+SAR') return matchesSearch && item.task.includes('SAR');
    return matchesSearch;
  });

  const handleDownloadSingle = async (report: ReportItem) => {
    await PdfReportService.downloadReportPdf(report);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200 text-white">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
          <History className="w-4 h-4 text-cyan-400" />
          <span>Past Analyses</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
          Analysis History
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Review previous questions, analysis results, and visual reports.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by query, task, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-white placeholder-gray-500 font-sans"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
          {(['All', 'Change', 'Grounding', 'VQA', 'Optical+SAR'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-lg transition-all font-semibold whitespace-nowrap cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-blue-600/40 text-cyan-300 border border-cyan-500/40 font-bold shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-gray-900/90 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black/40 border-b border-white/10 text-gray-400 font-bold uppercase text-[10px] font-mono">
                <th className="py-3 px-4">Query</th>
                <th className="py-3 px-4">Task</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredReports.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  {/* Query */}
                  <td className="py-3.5 px-4 font-semibold text-white max-w-xs truncate">
                    "{row.query}"
                    <span className="block text-[11px] text-gray-400 font-normal mt-0.5">
                      {row.inputSummary}
                    </span>
                  </td>

                  {/* Task */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-950/60 text-cyan-300 font-bold border border-cyan-500/30">
                      {row.task}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap font-mono text-[11px]">
                    {row.date}
                  </td>

                  {/* Confidence */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-400 font-mono">
                      {row.confidence}%
                    </span>
                  </td>

                  {/* Actions: View Result & Download Report */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewReport(row)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        title="View Result Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="hidden sm:inline">View Result</span>
                      </button>

                      <button
                        onClick={() => handleDownloadSingle(row)}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-cyan-400 hover:text-cyan-300 bg-white/5 transition-colors text-gray-400 cursor-pointer"
                        title="Download PDF Report"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
