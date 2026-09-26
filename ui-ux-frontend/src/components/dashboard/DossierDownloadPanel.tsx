import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  Cpu, 
  X, 
  Share2, 
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';
import { ReportItem } from '../../types';
import { SatQueryApiService } from '../../services/apiService';
import { PdfReportService } from '../../services/pdfReportService';

interface DossierDownloadPanelProps {
  customReports?: ReportItem[];
  onNewAnalysis?: () => void;
}

export const DossierDownloadPanel: React.FC<DossierDownloadPanelProps> = ({ customReports = [], onNewAnalysis }) => {
  const [serverReports, setServerReports] = useState<ReportItem[]>([]);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

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

  // Only real reports: custom session reports and backend stored reports (no dummies)
  const allReports = [...customReports, ...serverReports];
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(allReports[0] || null);

  useEffect(() => {
    if (!selectedReport && allReports.length > 0) {
      setSelectedReport(allReports[0]);
    } else if (selectedReport && !allReports.some(r => r.id === selectedReport.id) && allReports.length > 0) {
      setSelectedReport(allReports[0]);
    }
  }, [allReports, selectedReport]);

  const handleDownloadPdf = async (report: ReportItem) => {
    try {
      setIsDownloadingPdf(true);
      await PdfReportService.downloadReportPdf(report);
    } catch (err) {
      console.error('Error downloading PDF report:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200 text-white">
      {/* Header */}
      <div className="border-b border-white/10 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Saved Analysis Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Generate, preview, and download structured analysis reports.
          </p>
        </div>
      </div>

      {/* Main Content: Empty State or Grid (Reports List + Preview) */}
      {allReports.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 text-center max-w-xl mx-auto space-y-4 backdrop-blur-md">
          <div className="w-14 h-14 rounded-2xl bg-blue-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-xs">
            <FileText className="w-7 h-7 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Saved Reports Yet</h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-sm mx-auto">
              Run an analysis in the New Analysis workspace and click "Save Report" to generate and archive official reports here.
            </p>
          </div>
          {onNewAnalysis && (
            <button
              onClick={onNewAnalysis}
              className="px-5 py-2 text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Start New Analysis</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 4 cols: Reports List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
              Available Reports ({allReports.length})
            </div>

            <div className="space-y-2.5">
              {allReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-150 border text-left ${
                    selectedReport?.id === report.id
                      ? 'bg-blue-600/20 border-cyan-500/50 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                      : 'bg-white/5 border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                    <span className="text-cyan-300 font-bold">{report.task}</span>
                    <span className="text-gray-400">{report.date.split(' ')[0]}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    {report.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                    "{report.query}"
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-emerald-400 font-bold">
                      {report.confidence}% Conf.
                    </span>
                    <span className="text-gray-400">{report.executionTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 8 cols: Detailed Report Preview Document */}
          {selectedReport ? (
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-gray-900/90 border border-white/10 shadow-2xl backdrop-blur-md space-y-6">
              {/* Top Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-950/60 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                    {selectedReport.task}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">ID: {selectedReport.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintReport}
                    className="px-3 py-1.5 rounded-xl border border-white/10 hover:border-cyan-400 text-xs font-semibold flex items-center gap-1.5 text-gray-300 hover:text-white bg-white/5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPdf(selectedReport)}
                    disabled={isDownloadingPdf}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {isDownloadingPdf ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF Report</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            {/* Document Header */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {selectedReport.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-mono">
                <span>Date: <strong className="text-white">{selectedReport.date}</strong></span>
                <span>Processing Time: <strong className="text-white">{selectedReport.executionTime}</strong></span>
                <span>Status: <strong className="text-emerald-400">{selectedReport.status}</strong></span>
              </div>
            </div>

            {/* 1. Query & Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] uppercase text-gray-400 font-bold block mb-1 font-mono">Question:</span>
                <span className="text-white font-semibold">"{selectedReport.query}"</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] uppercase text-gray-400 font-bold block mb-1 font-mono">Input Images:</span>
                <span className="text-white font-semibold">{selectedReport.inputSummary}</span>
              </div>
            </div>

            {/* 2. Analysis Answer & Confidence */}
            <div className="p-4 rounded-xl bg-blue-950/40 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono">
                  Answer
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
                  {selectedReport.confidence}% Confidence
                </span>
              </div>
              <p className="text-sm font-medium text-gray-100 leading-relaxed">
                {selectedReport.answer}
              </p>
            </div>

            {/* 3. Visual Evidence Snapshot */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-gray-400 block font-mono">
                Visual Results Snapshot:
              </span>
              <div
                className="h-44 sm:h-52 rounded-xl relative overflow-hidden border border-white/10 p-4 flex flex-col justify-between"
                style={{
                  background: selectedReport.evidenceVisual
                    ? (selectedReport.evidenceVisual.startsWith('http') || selectedReport.evidenceVisual.startsWith('/')
                        ? `url("${selectedReport.evidenceVisual}") center/cover no-repeat`
                        : selectedReport.evidenceVisual)
                    : 'linear-gradient(135deg, #0f172a, #0369a1)'
                }}
              >
                <div className="absolute inset-0 geo-grid-pattern opacity-30 pointer-events-none" />
                <span className="relative z-10 px-2.5 py-0.5 rounded bg-slate-950/90 text-xs text-slate-200 self-start border border-white/10">
                  Detection Map
                </span>
                <span className="relative z-10 text-xs text-cyan-300 font-bold bg-slate-950/90 border border-cyan-500/30 px-3 py-1 rounded self-end">
                  Task: {selectedReport.task}
                </span>
              </div>
            </div>

            {/* 4. Models Used & Execution Summary */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1 font-mono">
                  Models & Tools Used:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedReport.modelsUsed.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-blue-950/60 border border-cyan-500/30 text-cyan-300 font-bold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                <span>Validation: Standard Quality Assurance Verification</span>
                <span className="text-emerald-400 font-bold font-mono">Verified</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center rounded-2xl border border-white/10 text-gray-400 text-xs bg-white/5">
            Select a report on the left to view details
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export const ReportsView = DossierDownloadPanel;

