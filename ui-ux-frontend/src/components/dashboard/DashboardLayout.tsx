import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, AlertCircle, ArrowLeft, Layers, Compass } from 'lucide-react';
import { NewAnalysisWorkspace } from './NewAnalysisWorkspace';
import { AnalysisHistoryView } from './AnalysisHistoryView';
import { ReportsView } from './DossierDownloadPanel';
import { ModelsAndToolsView } from './ModelsAndToolsView';
import { SettingsView } from '../settings/SettingsView';
import { WorkspaceView } from '../workspace/WorkspaceView';
import { 
  DashboardView, 
  UserProfile, 
  ReportItem 
} from '../../types';
import { AnalysisScenario, MOCK_SCENARIOS } from '../../data/mockData';
import { Footer } from '../layout/Footer';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';
import { SatQueryApiService, BackendHealth } from '../../services/apiService';

interface DashboardLayoutProps {
  user: UserProfile;
  onBackToLanding: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  initialView?: DashboardView;
  onSignOut?: () => void;
  initialQuery?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  onBackToLanding,
  onUpdateProfile,
  initialView = 'new-analysis',
  onSignOut,
  initialQuery
}) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<DashboardView>(initialView);
  const [selectedScenario] = useState<AnalysisScenario>(() => {
    if (initialQuery && initialQuery.trim()) {
      return {
        ...MOCK_SCENARIOS[0],
        defaultQuery: initialQuery.trim()
      };
    }
    return MOCK_SCENARIOS[0];
  });
  const [savedReports, setSavedReports] = useState<ReportItem[]>([]);
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);
  const [healthStatus, setHealthStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const checkBackendHealth = async () => {
    setHealthStatus('checking');
    try {
      const health = await SatQueryApiService.checkHealth();
      if (health && (health.status === 'ok' || health.status === 'online' || health.status === 'healthy')) {
        setBackendHealth(health);
        setHealthStatus('online');
      } else {
        setBackendHealth(null);
        setHealthStatus('offline');
      }
    } catch {
      setBackendHealth(null);
      setHealthStatus('offline');
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const timer = setInterval(checkBackendHealth, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveReport = (report: ReportItem) => {
    setSavedReports(prev => [report, ...prev]);
  };

  const handleViewReportInHistory = (_report: ReportItem) => {
    setCurrentView('reports');
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Workspace Top Header Bar - with Back to Home button */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-2.5 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Button to return to landing page */}
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-xs sm:text-sm shadow-xs hover:border-cyan-500/40 transition-all cursor-pointer active:scale-95"
            title="Return to Landing Page"
            aria-label="Return to Landing Page"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back to Home</span>
          </button>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <ModernSatelliteAiLogo size="sm" showText={true} />
          </div>

          {/* Quick Switcher: New Analysis, Satellite View, Saved Reports */}
          <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/10 ml-1 sm:ml-2">
            <button
              type="button"
              onClick={() => {
                setCurrentView('new-analysis');
                window.location.hash = '';
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'new-analysis'
                  ? 'bg-blue-600/30 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              New Analysis
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/satellite-view');
              }}
              className="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 text-gray-300 hover:text-white hover:bg-white/10"
              title="Open Standalone Satellite View (ArcGIS Wayback)"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Satellite View</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('reports');
                window.location.hash = 'reports';
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'reports'
                  ? 'bg-blue-600/30 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Saved Reports {savedReports.length > 0 && `(${savedReports.length})`}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace (Full Width - No Side Menu) */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-[calc(100vh-53px)]">
          <div className="flex-1">
            {/* View 1: New Analysis */}
            {currentView === 'new-analysis' && (
              <NewAnalysisWorkspace
                initialScenario={selectedScenario}
                onSaveReport={handleSaveReport}
                onViewReports={() => setCurrentView('reports')}
              />
            )}

            {/* View 2: Models & Tools */}
            {currentView === 'models' && (
              <ModelsAndToolsView
                onSelectModelTask={() => {
                  setCurrentView('new-analysis');
                }}
              />
            )}

            {/* View 4: Geospatial Canvas / Workspace */}
            {currentView === 'workspace' && (
              <WorkspaceView />
            )}

            {/* View 5: Analysis History */}
            {currentView === 'history' && (
              <AnalysisHistoryView
                customReports={savedReports}
                onViewReport={handleViewReportInHistory}
                onOpenInWorkspace={(_rep) => {
                  setCurrentView('new-analysis');
                }}
              />
            )}

            {/* View 6: Saved Reports */}
            {currentView === 'reports' && (
              <ReportsView 
                customReports={savedReports} 
                onNewAnalysis={() => setCurrentView('new-analysis')}
              />
            )}

            {/* View 7: Settings Page */}
            {currentView === 'settings' && (
              <SettingsView
                user={user}
                onUpdateProfile={onUpdateProfile}
                initialTab="profile"
                onSignOut={onSignOut}
              />
            )}
          </div>

          {/* Workspace Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
};
