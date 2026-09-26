import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Globe, 
  Compass
} from 'lucide-react';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';

const NASA_HLS_URL = 'https://go.nasa.gov/4dYfIaB';

export const HarmonizedLandsatPage: React.FC = () => {
  const navigate = useNavigate();
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch((err) => {
          console.warn('Exit fullscreen failed:', err);
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-950 text-white select-none">
      {/* Top Header Navigation Bar */}
      <header className="h-14 bg-gray-950/95 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between z-30 backdrop-blur-md flex-shrink-0">
        {/* Left: Navigation & Branding */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
            title="Return to Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/app')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 transition-all cursor-pointer"
            title="Open AI Analysis Dashboard"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">AI Dashboard</span>
          </button>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer"
            title="SatQuery AI - Harmonized Landsat"
          >
            <ModernSatelliteAiLogo size="sm" showText={true} />
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Harmonized Landsat
            </span>
          </div>
        </div>

        {/* Right: Controls (Refresh, Fullscreen) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
            title="Reload Harmonized Landsat View"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Exit Full</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Body: Embedded NASA Worldview HLS Engine URL */}
      <div className="relative flex-1 w-full h-[calc(100vh-56px)] bg-black overflow-hidden flex flex-col items-center justify-center">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-950/85 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative flex items-center justify-center mb-4">
              <div className="w-14 h-14 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <Globe className="w-6 h-6 text-emerald-400 absolute" />
            </div>
            <p className="text-sm font-bold text-white tracking-wide">
              Loading Harmonized Landsat Engine...
            </p>
            <p className="text-xs text-emerald-400 font-mono mt-1">
              NASA Earthdata Stream (go.nasa.gov/4dYfIaB)
            </p>
          </div>
        )}

        {/* Embedded NASA Worldview HLS Iframe */}
        <iframe
          key={iframeKey}
          src={NASA_HLS_URL}
          title="SatQuery AI - Harmonized Landsat"
          className="w-full h-full border-0 z-10"
          onLoad={() => setIsLoading(false)}
          allow="geolocation; camera; microphone; fullscreen; clipboard-read; clipboard-write"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default HarmonizedLandsatPage;
