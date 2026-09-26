import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Globe, 
  Compass,
  ExternalLink,
  Layers,
  Activity,
  Zap,
  ShieldCheck,
  Radio,
  Sliders,
  Sparkles,
  Database
} from 'lucide-react';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';

const SHORT_NASA_URL = 'https://go.nasa.gov/4dYfIaB';

export const HarmonizedLandsatPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLaunchStudio = (url: string = SHORT_NASA_URL) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-x-hidden bg-slate-950 text-white select-none">
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

        {/* Right: Direct NASA Studio Launch Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleLaunchStudio(SHORT_NASA_URL)}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
            title="Launch NASA Earthdata Worldview Studio (go.nasa.gov/4dYfIaB)"
          >
            <span>Launch NASA Studio</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Background Grid Pattern & Ambient Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center space-y-8 my-auto py-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>NASA Earthdata GIBS Stream Active</span>
          </div>

          {/* Page Headline */}
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-['Space_Grotesk',sans-serif] leading-tight">
              Harmonized Landsat <span className="text-[#34d399]">Sentinel-2 (HLS)</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto font-light">
              High-frequency, 30-meter surface reflectance telemetry seamlessly combining NASA’s Landsat-8/9 and ESA’s Sentinel-2 constellations.
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md pt-2">
            <button
              type="button"
              onClick={() => handleLaunchStudio(SHORT_NASA_URL)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold text-base tracking-wide shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950 fill-current" />
              <span>Open NASA Worldview Studio</span>
              <ExternalLink className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </button>
          </div>

          <p className="text-xs font-mono text-emerald-400/90 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct Access URL: <code className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white font-mono">go.nasa.gov/4dYfIaB</code></span>
          </p>

          {/* Technical Telemetry Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pt-6 text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <Layers className="w-4 h-4" />
                <span>Constellations</span>
              </div>
              <p className="text-sm font-bold text-white">Landsat-8/9 + S2A/B</p>
              <p className="text-[11px] text-slate-400">Harmonized BRDF-adjusted surface reflectance (NBAR).</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <Activity className="w-4 h-4" />
                <span>Temporal Cadence</span>
              </div>
              <p className="text-sm font-bold text-white">2 to 3 Days Revisit</p>
              <p className="text-[11px] text-slate-400">Global short-timescale environmental tracking.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <Sliders className="w-4 h-4" />
                <span>Spatial Resolution</span>
              </div>
              <p className="text-sm font-bold text-white">30 Meters Uniform</p>
              <p className="text-[11px] text-slate-400">Atmospherically corrected with LaSRC/Fmask quality bits.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <Database className="w-4 h-4" />
                <span>Coverage</span>
              </div>
              <p className="text-sm font-bold text-white">Global Landmass</p>
              <p className="text-[11px] text-slate-400">Full 100% land surface & coastal waters coverage.</p>
            </div>
          </div>

          {/* Satellite Layer Presets Quick-Launch Grid */}
          <div className="w-full pt-4 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 text-left">
              Direct NASA Worldview HLS Layers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <button
                type="button"
                onClick={() => handleLaunchStudio('https://worldview.earthdata.nasa.gov/?l=HLS_S30_Nadir_BRDF_Adjusted_Reflectance,HLS_L30_Nadir_BRDF_Adjusted_Reflectance')}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">HLS S30 Sentinel-2 Reflectance</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Nadir BRDF-Adjusted Reflectance (S30)</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 flex-shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleLaunchStudio('https://worldview.earthdata.nasa.gov/?l=HLS_L30_Nadir_BRDF_Adjusted_Reflectance')}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">HLS L30 Landsat Reflectance</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Nadir BRDF-Adjusted Reflectance (L30)</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 flex-shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleLaunchStudio(SHORT_NASA_URL)}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">TrueColor 15m Composite</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">VIIRS & MODIS High-Res Basemap</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HarmonizedLandsatPage;
