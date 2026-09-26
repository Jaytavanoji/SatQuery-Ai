import React from 'react';
import { 
  Compass, 
  Split, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Share2, 
  Sliders, 
  Check, 
  Maximize2
} from 'lucide-react';
import { AOIPreset, SensorType } from '../../types';

interface WorkspaceHeaderProps {
  activeAOI: AOIPreset;
  activeSensor: SensorType;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  viewMode: 'split' | 'side-by-side' | 'overlay';
  onChangeViewMode: (mode: 'split' | 'side-by-side' | 'overlay') => void;
  onExportReport: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  activeAOI,
  activeSensor,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  viewMode,
  onChangeViewMode,
  onExportReport
}) => {
  return (
    <div className="h-14 border-b border-white/10 bg-black/90 backdrop-blur-md px-4 flex items-center justify-between gap-4 select-none text-white">
      {/* Left: Active AOI Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
          <Compass className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate">
              {activeAOI.name}
            </h1>
            <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-white/5 text-cyan-300 border border-white/10 font-mono">
              {activeSensor}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 truncate font-mono">
            {activeAOI.coordinates[0].toFixed(3)}°N, {activeAOI.coordinates[1].toFixed(3)}°W • {activeAOI.areaKm2.toLocaleString()} km²
          </p>
        </div>
      </div>

      {/* Center: View Mode Toggle */}
      <div className="hidden md:flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
        <button
          onClick={() => onChangeViewMode('split')}
          className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] focus:outline-none cursor-pointer ${
            viewMode === 'split'
              ? 'bg-blue-600/30 text-cyan-300 border border-cyan-500/40 font-semibold shadow-xs'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Split className="w-3.5 h-3.5" />
          <span>Split Slider</span>
        </button>

        <button
          onClick={() => onChangeViewMode('side-by-side')}
          className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] focus:outline-none cursor-pointer ${
            viewMode === 'side-by-side'
              ? 'bg-blue-600/30 text-cyan-300 border border-cyan-500/40 font-semibold shadow-xs'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Side-by-Side</span>
        </button>

        <button
          onClick={() => onChangeViewMode('overlay')}
          className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] focus:outline-none cursor-pointer ${
            viewMode === 'overlay'
              ? 'bg-blue-600/30 text-cyan-300 border border-cyan-500/40 font-semibold shadow-xs'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Overlay</span>
        </button>
      </div>

      {/* Right: Map Controls & Export */}
      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center rounded-lg bg-white/5 border border-white/10 p-0.5">
          <button
            onClick={onZoomOut}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150 active:scale-[0.98] cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 text-[11px] text-gray-300 select-none font-semibold font-mono">
            {zoom}x
          </span>
          <button
            onClick={onZoomIn}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150 active:scale-[0.98] cursor-pointer"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onResetView}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150 active:scale-[0.98] cursor-pointer"
          title="Reset View Position"
          aria-label="Reset View Position"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onExportReport}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all duration-150 active:scale-[0.98] focus:outline-none cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Analysis</span>
        </button>
      </div>
    </div>
  );
};
