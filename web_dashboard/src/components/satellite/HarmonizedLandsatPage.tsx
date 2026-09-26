import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Globe, 
  Compass,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Layers,
  Activity,
  Maximize2
} from 'lucide-react';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';

const TARGET_NASA_URL = 'https://worldview.earthdata.nasa.gov/?v=-186.2570025302364,-0.16532027771004998,-133.6969895331391,29.618687087311777&z=4&l=Reference_Labels_15m,DoS_International_Boundaries,Coastlines_15m,IMERG_Precipitation_Rate_30min,IMERG_Precipitation_Rate(hidden),VIIRS_NOAA20_DayNightBand_At_Sensor_Radiance(hidden),VIIRS_NOAA20_DayNightBand_AtSensor_M15(hidden),VIIRS_SNPP_DayNightBand_At_Sensor_Radiance(hidden),VIIRS_SNPP_DayNightBand_AtSensor_M15(hidden),HLS_S30_Nadir_BRDF_Adjusted_Reflectance(hidden),HLS_L30_Nadir_BRDF_Adjusted_Reflectance(hidden),VIIRS_NOAA21_CorrectedReflectance_TrueColor,BlueMarble_NextGeneration(hidden),VIIRS_NOAA20_CorrectedReflectance_TrueColor(hidden),VIIRS_SNPP_CorrectedReflectance_TrueColor(hidden),MODIS_Aqua_CorrectedReflectance_TrueColor(hidden),MODIS_Terra_CorrectedReflectance_TrueColor&lg=false&s=73.8554,18.5208&t=2026-09-25-T00%3A00%3A59Z';

export const HarmonizedLandsatPage: React.FC = () => {
  const navigate = useNavigate();
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isIframeView, setIsIframeView] = useState<boolean>(true);

  const handleLaunchStudio = (url: string = TARGET_NASA_URL) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-hidden bg-slate-950 text-white select-none">
      {/* Top Header Navigation Bar */}
      <header className="h-14 bg-slate-950/95 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between z-40 backdrop-blur-md flex-shrink-0 sticky top-0">
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

        {/* Right: Controls & Direct Launch Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
            title="Reload Frame"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsIframeView(!isIframeView)}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-950/50 border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1.5"
            title="Toggle View Mode"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">{isIframeView ? 'Hub Overview' : 'Embedded Viewer'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleLaunchStudio(TARGET_NASA_URL)}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
            title="Launch NASA Earthdata Worldview Studio"
          >
            <span>Launch NASA Studio</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 relative w-full h-[calc(100vh-3.5rem)] bg-slate-950 flex flex-col">
        {isIframeView ? (
          <div className="relative w-full h-full flex flex-col">
            {/* Top Security & Launch Floating Notification Banner */}
            <div className="bg-slate-900/90 border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs text-slate-300 backdrop-blur-md z-20">
              <div className="flex items-center gap-2 truncate">
                <Globe className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-pulse" />
                <span className="truncate font-mono text-[11px]">
                  URL: <span className="text-emerald-300">worldview.earthdata.nasa.gov</span> (IMERG Precipitation + HLS + VIIRS NOAA21)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleLaunchStudio(TARGET_NASA_URL)}
                className="ml-2 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
              >
                <span>Open Direct Window</span>
                <ExternalLink className="w-3 h-3 text-emerald-300" />
              </button>
            </div>

            {/* Embedded Iframe & Security Fallback Layer */}
            <div className="relative flex-1 w-full h-full bg-slate-950">
              <iframe
                key={iframeKey}
                src={TARGET_NASA_URL}
                className="w-full h-full border-0 relative z-10"
                title="NASA Earthdata Worldview Studio"
                allow="fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              />

              {/* Underlying Fallback Layer shown if frame is blocked by SAMEORIGIN headers */}
              <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-950/90">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-lg font-bold text-white">Browser Framing Protection Active</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    NASA Earthdata servers enforce strict <code className="text-emerald-300 bg-white/5 px-1 py-0.5 rounded">X-Frame-Options: SAMEORIGIN</code> security policy. If the frame above appears blank, launch the workspace directly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchStudio(TARGET_NASA_URL)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Launch Interactive NASA Studio</span>
                  <ExternalLink className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Hub Overview Mode */
          <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-3xl w-full text-center space-y-8 my-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>NASA Earthdata GIBS - Harmonized Telemetry</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Space_Grotesk',sans-serif]">
                  Harmonized Landsat <span className="text-[#34d399]">Studio</span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto font-light">
                  Active layers: IMERG 30-min Precipitation Rate, HLS S30/L30 Nadir BRDF-Adjusted Reflectance, and VIIRS NOAA-21 Corrected Reflectance TrueColor.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => handleLaunchStudio(TARGET_NASA_URL)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 cursor-pointer flex items-center gap-3"
                >
                  <Sparkles className="w-5 h-5 text-slate-950 fill-current" />
                  <span>Open Full NASA Studio</span>
                  <ExternalLink className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsIframeView(true)}
                  className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Maximize2 className="w-4 h-4 text-cyan-400" />
                  <span>Switch to Frame View</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HarmonizedLandsatPage;

