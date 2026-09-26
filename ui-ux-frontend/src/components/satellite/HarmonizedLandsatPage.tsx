import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Globe, 
  Compass,
  Sprout,
  Zap,
  Trees,
  Snowflake,
  ExternalLink
} from 'lucide-react';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';

const SHORT_NASA_URL = 'https://go.nasa.gov/4dYfIaB';
const BASE_HLS_URL = 'https://worldview.earthdata.nasa.gov/?v=-190.17099702033968,-103.7933030432878,181.43813376534368,106.78520440193276&l=Reference_Labels_15m(hidden),DoS_International_Boundaries(hidden),Coastlines_15m,HLS_S30_Nadir_BRDF_Adjusted_Reflectance(hidden),HLS_L30_Nadir_BRDF_Adjusted_Reflectance(hidden),VIIRS_NOAA20_CorrectedReflectance_TrueColor(hidden),VIIRS_SNPP_CorrectedReflectance_TrueColor(hidden),MODIS_Aqua_CorrectedReflectance_TrueColor(hidden),MODIS_Terra_CorrectedReflectance_TrueColor&lg=false&tr=hls_intro&t=2020-10-15-T16%3A46%3A06Z';

interface HLSPreset {
  id: string;
  name: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  description: string;
  badge: string;
  locationName: string;
}

const INDIAN_HLS_PRESETS: HLSPreset[] = [
  {
    id: 'crop-cycles',
    name: 'Agricultural Health & Crop Cycles (Punjab / Indo-Gangetic)',
    shortLabel: 'Crop Cycles',
    icon: Sprout,
    url: 'https://worldview.earthdata.nasa.gov/?v=73.5,28.0,78.5,31.5&l=Reference_Labels_15m,Coastlines_15m,HLS_S30_Nadir_BRDF_Adjusted_Reflectance,HLS_L30_Nadir_BRDF_Adjusted_Reflectance&lg=false&tr=hls_intro&t=2020-10-15-T16%3A46%3A06Z',
    description: 'Tracks short-term vegetation changes & crop greening across Indo-Gangetic Plains using NDVI.',
    badge: 'Agriculture',
    locationName: 'Punjab / Haryana Croplands'
  },
  {
    id: 'rapid-disaster',
    name: 'Rapid Disaster Impact (Assam Brahmaputra Floods)',
    shortLabel: 'Disaster Impact',
    icon: Zap,
    url: 'https://worldview.earthdata.nasa.gov/?v=90.0,24.5,96.0,28.5&l=Reference_Labels_15m,Coastlines_15m,HLS_S30_Nadir_BRDF_Adjusted_Reflectance,HLS_L30_Nadir_BRDF_Adjusted_Reflectance&lg=false&tr=hls_intro&t=2020-10-15-T16%3A46%3A06Z',
    description: 'Provides fast before-and-after floodwater boundary and active hazard mapping over Assam.',
    badge: 'Floods',
    locationName: 'Assam Brahmaputra Basin'
  },
  {
    id: 'deforestation',
    name: 'Deforestation & Land Use (Western Ghats)',
    shortLabel: 'Deforestation',
    icon: Trees,
    url: 'https://worldview.earthdata.nasa.gov/?v=73.0,11.0,77.5,16.0&l=Reference_Labels_15m,Coastlines_15m,HLS_S30_Nadir_BRDF_Adjusted_Reflectance,HLS_L30_Nadir_BRDF_Adjusted_Reflectance&lg=false&tr=hls_intro&t=2020-10-15-T16%3A46%3A06Z',
    description: 'Tracks logging, canopy dynamics, and urban expansion along the Western Ghats.',
    badge: 'Forestry',
    locationName: 'Western Ghats Canopy'
  },
  {
    id: 'snow-ice',
    name: 'Snow & Ice Dynamics (Himalayas & Himachal)',
    shortLabel: 'Snow & Ice',
    icon: Snowflake,
    url: 'https://worldview.earthdata.nasa.gov/?v=76.0,30.5,80.5,34.5&l=Reference_Labels_15m,Coastlines_15m,HLS_S30_Nadir_BRDF_Adjusted_Reflectance,HLS_L30_Nadir_BRDF_Adjusted_Reflectance&lg=false&tr=hls_intro&t=2020-10-15-T16%3A46%3A06Z',
    description: 'Monitors rapid melting, glacier retreat, and seasonal snowpack accumulation over Indian Himalayas.',
    badge: 'Glaciers',
    locationName: 'Himachal & Himalayan Range'
  }
];

export const HarmonizedLandsatPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUrl, setCurrentUrl] = useState<string>(SHORT_NASA_URL);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('crop-cycles');

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleSelectPreset = (preset: HLSPreset) => {
    setSelectedPresetId(preset.id);
    setCurrentUrl(preset.url);
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

  const currentPreset = INDIAN_HLS_PRESETS.find(p => p.id === selectedPresetId) || INDIAN_HLS_PRESETS[0];

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
            <span className="hidden lg:inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Harmonized Landsat
            </span>
          </div>
        </div>

        {/* Center: Presets Quick Access Buttons (100% Indian Data) */}
        <div className="hidden lg:flex items-center p-0.5 rounded-xl bg-white/5 border border-white/10">
          {INDIAN_HLS_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                title={preset.description}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span>{preset.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Controls (NASA Studio Direct Link, Refresh, Fullscreen) */}
        <div className="flex items-center gap-2">
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            title="Open direct NASA Earthdata Worldview Studio (go.nasa.gov/4dYfIaB)"
          >
            <span>NASA Studio</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </a>

          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
            title="Reload Harmonized Landsat Engine"
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

      {/* Sub-Header Mobile / Tablet Quick Selectors Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-white/10 overflow-x-auto gap-2 scrollbar-none">
        {INDIAN_HLS_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'text-gray-400 bg-white/5'
              }`}
            >
              <Icon className="w-3 h-3 text-emerald-400" />
              <span>{preset.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Main Body: Embedded NASA Worldview HLS Engine Inside Website */}
      <div className="relative flex-1 w-full h-[calc(100vh-56px)] bg-black overflow-hidden flex flex-col items-center justify-center">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-950/90 backdrop-blur-md transition-opacity duration-300">
            <div className="relative flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <Globe className="w-7 h-7 text-emerald-400 absolute" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide">
              NASA Harmonized Landsat Sentinel-2 (HLS) Engine
            </h2>
            <p className="text-xs text-emerald-400 font-mono mt-1">
              Selected Preset: {currentPreset.name}
            </p>
            <p className="text-xs text-gray-300 font-sans mt-2 max-w-lg text-center px-4 leading-relaxed">
              {currentPreset.description}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>Launch NASA Worldview Studio (go.nasa.gov/4dYfIaB)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setIsLoading(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition-all cursor-pointer"
              >
                Hide Loading Screen
              </button>
            </div>
          </div>
        )}

        {/* Embedded NASA Worldview HLS Iframe */}
        <iframe
          key={iframeKey}
          src={currentUrl}
          title="SatQuery AI - Harmonized Landsat NASA Earthdata Engine"
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
