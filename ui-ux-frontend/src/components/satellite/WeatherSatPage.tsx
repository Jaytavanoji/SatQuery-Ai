import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Globe, 
  Compass,
  ExternalLink
} from 'lucide-react';
import { ModernSatelliteAiLogo } from '../landing/LandingNavbar';

const WINDY_SATELLITE_EMBED = 'https://embed.windy.com/embed2.html?lat=19.4107&lon=74.01284&detailLat=19.4107&detailLon=74.01284&width=100%25&height=100%25&zoom=8&level=surface&overlay=satellite&product=ecmwf&menu=&message=true&marker=true';
const ZOOM_EARTH_DIRECT_URL = 'https://zoom.earth/maps/satellite/#view=19.4107,74.01284,8z/place=20.964317,74.348728';

interface LocationPreset {
  name: string;
  url: string;
  badge: string;
}

const PRESETS: LocationPreset[] = [
  {
    name: 'Maharashtra (Live)',
    url: 'https://embed.windy.com/embed2.html?lat=19.4107&lon=74.01284&detailLat=19.4107&detailLon=74.01284&width=100%25&height=100%25&zoom=8&level=surface&overlay=satellite&product=ecmwf',
    badge: 'State'
  },
  {
    name: 'Mumbai Radar',
    url: 'https://embed.windy.com/embed2.html?lat=18.97&lon=72.82&detailLat=18.97&detailLon=72.82&width=100%25&height=100%25&zoom=9&level=surface&overlay=radar&product=radar',
    badge: 'Radar'
  },
  {
    name: 'Wind Streams',
    url: 'https://embed.windy.com/embed2.html?lat=19.4107&lon=74.01284&detailLat=19.4107&detailLon=74.01284&width=100%25&height=100%25&zoom=7&level=surface&overlay=wind&product=ecmwf',
    badge: 'Wind'
  },
  {
    name: 'Rain & Clouds',
    url: 'https://embed.windy.com/embed2.html?lat=19.4107&lon=74.01284&detailLat=19.4107&detailLon=74.01284&width=100%25&height=100%25&zoom=7&level=surface&overlay=rain&product=ecmwf',
    badge: 'Rain'
  }
];

export const WeatherSatPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUrl, setCurrentUrl] = useState<string>(WINDY_SATELLITE_EMBED);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('Maharashtra (Live)');

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleSelectPreset = (preset: LocationPreset) => {
    setSelectedPreset(preset.name);
    setCurrentUrl(preset.url);
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleOpenZoomEarth = () => {
    window.open(ZOOM_EARTH_DIRECT_URL, '_blank', 'noopener,noreferrer');
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
            title="SatQuery AI - Weather-Sat"
          >
            <ModernSatelliteAiLogo size="sm" showText={true} />
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Weather-Sat
            </span>
          </div>
        </div>

        {/* Center: Presets Quick Switch Buttons */}
        <div className="hidden md:flex items-center p-0.5 rounded-xl bg-white/5 border border-white/10">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedPreset === preset.name
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {preset.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Right: Controls (Refresh, Fullscreen, Open Zoom.Earth) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
            title="Reload Weather-Sat View"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
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
                <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Exit Full</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenZoomEarth}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            title="Open Zoom.Earth Studio"
          >
            <span className="hidden sm:inline">Zoom.Earth</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Main Body: Live Weather Satellite Iframe */}
      <div className="relative flex-1 w-full h-[calc(100vh-56px)] bg-black overflow-hidden">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative flex items-center justify-center mb-4">
              <div className="w-14 h-14 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <Globe className="w-6 h-6 text-emerald-400 absolute" />
            </div>
            <p className="text-sm font-semibold text-white tracking-wide font-['Space_Grotesk',sans-serif]">
              Loading Weather-Sat Live Satellite Feed...
            </p>
            <p className="text-xs text-emerald-400/90 font-mono mt-1">
              Live Satellite & Storm Telemetry
            </p>
          </div>
        )}

        {/* Embedded Weather Satellite Iframe */}
        <iframe
          key={iframeKey}
          src={currentUrl}
          title="SatQuery AI - Weather-Sat Viewer"
          className="w-full h-full border-0 relative z-10"
          onLoad={() => setIsLoading(false)}
          allow="geolocation; camera; microphone; fullscreen; clipboard-read; clipboard-write"
          loading="lazy"
        />
      </div>
    </div>
  );
};

// Export HarmonizedLandsatPage as an alias
export const HarmonizedLandsatPage = WeatherSatPage;

export default WeatherSatPage;
