import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  Compass, 
  History, 
  FileText, 
  Settings, 
  Radio, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Menu,
  Cpu,
  Bot,
  Layers
} from 'lucide-react';
import { DashboardView, UserProfile } from '../../types';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';
import { SatQueryApiService, BackendHealth } from '../../services/apiService';

interface DashboardSidebarProps {
  currentView: DashboardView;
  onSelectView: (view: DashboardView) => void;
  onBackToLanding?: () => void;
  onCloseSidebar?: () => void;
  user: UserProfile | null;
  systemStatus?: string;
  onSignOut?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentView,
  onSelectView,
  onCloseSidebar,
  user,
  systemStatus = 'AI System Ready',
  onSignOut
}) => {
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);

  const pollHealth = async () => {
    const health = await SatQueryApiService.checkHealth();
    setBackendHealth(health);
  };

  useEffect(() => {
    let mounted = true;
    const runPoll = async () => {
      const health = await SatQueryApiService.checkHealth();
      if (mounted) setBackendHealth(health);
    };
    runPoll();
    const interval = setInterval(runPoll, 12000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const menuItems: Array<{
    id: DashboardView;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    {
      id: 'new-analysis',
      label: 'New Analysis',
      icon: Compass,
      badge: 'Core'
    },
    {
      id: 'models',
      label: 'Models & Tools',
      icon: Cpu,
      badge: '6 AI'
    },
    {
      id: 'workspace',
      label: 'Satellite Viewer',
      icon: Layers
    },
    {
      id: 'history',
      label: 'Analysis History',
      icon: History
    },
    {
      id: 'reports',
      label: 'Saved Reports',
      icon: FileText
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 lg:w-72 bg-gray-950/95 border-r border-white/10 text-white flex flex-col justify-between h-[calc(100vh-53px)] sticky top-[53px] select-none z-30 flex-shrink-0 overflow-y-auto backdrop-blur-md">
      {/* Top Section: Brand & Navigation */}
      <div>
        {/* Top Accent Strip */}
        <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500" />

        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center">
            <ModernSatelliteAiLogo size="sm" showText={true} />
          </div>

          <div className="flex items-center gap-1">
            {/* Menu Toggle Button */}
            {onCloseSidebar && (
              <button
                type="button"
                onClick={onCloseSidebar}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
                title="Close Sidebar Menu"
                aria-label="Close Sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="p-3 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">
            Operations Menu
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.98] group ${
                  isActive
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm'
                    : 'text-gray-400 hover:bg-white/5 border border-transparent hover:border-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isActive
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'bg-white/5 text-gray-400 group-hover:text-cyan-400 group-hover:bg-white/10'
                  }`}>
                    <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase flex-shrink-0 ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                      : 'bg-white/5 text-gray-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Active User & "AI System Ready" */}
      <div className="p-3 border-t border-white/10 bg-black/60 space-y-2">
        {/* User Card */}
        {user && (
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-white/10 flex-shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-cyan-950/60 text-cyan-300 font-bold text-xs flex items-center justify-center border border-cyan-500/30 flex-shrink-0">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {user.name}
                </div>
                <div className="text-[10px] text-gray-400 truncate">
                  {user.role}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`w-2 h-2 rounded-full ${backendHealth ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400'}`} title={backendHealth ? 'Online' : 'Offline'} />
            </div>
          </div>
        )}

        {/* Bottom Requirement: AI System Status */}
        <div
          onClick={pollHealth}
          className={`px-3 py-2 rounded-xl border flex items-center justify-between text-[11px] font-mono font-medium cursor-pointer transition-colors ${
            backendHealth
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/50'
              : 'bg-amber-950/30 border-amber-500/30 text-amber-300 hover:bg-amber-950/50'
          }`}
          title="Click to refresh AI Core status"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`relative inline-flex rounded-full h-2 w-2 ${backendHealth ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </span>
            <span>
              {backendHealth
                ? `SatQuery Core: ${backendHealth.device.toUpperCase()}`
                : 'AI Core: Fallback Mode'}
            </span>
          </div>
          <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
            backendHealth ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30' : 'bg-amber-900/50 text-amber-300 border border-amber-500/30'
          }`}>
            {backendHealth ? 'Connected' : 'Offline'}
          </span>
        </div>
      </div>
    </aside>
  );
};

