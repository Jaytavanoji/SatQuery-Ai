import React, { useState, useRef, useEffect } from 'react';
import { 
  Sliders, 
  Target, 
  MapPin, 
  Eye, 
  Layers, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Compass, 
  Maximize2,
  Crosshair
} from 'lucide-react';
import { AOIPreset, SensorType, SpectralBandMode, LayerConfig } from '../../types';
import { SatQueryApiService } from '../../services/apiService';

interface GeospatialCanvasProps {
  activeAOI: AOIPreset;
  activeSensor: SensorType;
  activeBandMode: SpectralBandMode;
  layers: LayerConfig[];
  zoom: number;
  viewMode: 'split' | 'side-by-side' | 'overlay';
}

export const GeospatialCanvas: React.FC<GeospatialCanvasProps> = ({
  activeAOI,
  activeSensor,
  activeBandMode,
  layers,
  zoom,
  viewMode
}) => {
  const [splitPos, setSplitPos] = useState(50); // percentage (0-100)
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Cursor coordinates HUD
  const [cursorCoords, setCursorCoords] = useState({
    lat: activeAOI.coordinates[0],
    lng: activeAOI.coordinates[1],
    elev: 142,
    reflectance: 0.742
  });

  // Inspection tool state
  const [inspectedPoint, setInspectedPoint] = useState<{
    x: number;
    y: number;
    lat: number;
    lng: number;
    ndvi: number;
    classification: string;
    confidence: number;
    spectralBands: { name: string; val: number }[];
  } | null>({
    x: 42,
    y: 38,
    lat: activeAOI.coordinates[0] + 0.014,
    lng: activeAOI.coordinates[1] - 0.021,
    ndvi: 0.82,
    classification: 'Dense Equatorial Canopy',
    confidence: 98.4,
    spectralBands: [
      { name: 'B02 (Blue)', val: 0.041 },
      { name: 'B03 (Green)', val: 0.082 },
      { name: 'B04 (Red)', val: 0.038 },
      { name: 'B08 (NIR)', val: 0.584 },
      { name: 'B11 (SWIR)', val: 0.122 }
    ]
  });

  const [activeTimestamp, setActiveTimestamp] = useState<'T0' | 'T1'>('T1');
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({ width: 1200, height: 800 });

  useEffect(() => {
    if (!canvasRef.current) return;
    const updateSize = () => {
      if (canvasRef.current) {
        setCanvasDimensions({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const getCanvasBackgroundStyle = (visual: string): React.CSSProperties => {
    if (!visual) return { background: '#FFFFFF' };
    const resolvedVisual = visual.startsWith('/api/') ? SatQueryApiService.getFullUrl(visual) : visual;
    if (
      resolvedVisual.startsWith('/') ||
      resolvedVisual.startsWith('http') ||
      resolvedVisual.startsWith('data:') ||
      resolvedVisual.includes('.png') ||
      resolvedVisual.includes('.tif') ||
      resolvedVisual.includes('.jpg')
    ) {
      return {
        backgroundImage: `url(${resolvedVisual})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    return { background: visual };
  };

  // Update HUD coordinates on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDraggingSplit) {
      const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
      setSplitPos(Math.round(percent));
    } else if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }

    // Calculate simulated Lat/Lon from canvas bounds
    const latDelta = (y / rect.height - 0.5) * 0.1;
    const lngDelta = (x / rect.width - 0.5) * 0.1;

    setCursorCoords({
      lat: Number((activeAOI.coordinates[0] - latDelta).toFixed(4)),
      lng: Number((activeAOI.coordinates[1] + lngDelta).toFixed(4)),
      elev: Math.round(120 + ((x + y) % 90)),
      reflectance: Number((0.4 + (Math.sin(x * 0.02) * 0.3)).toFixed(3))
    });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!canvasRef.current || isDraggingSplit || isPanning) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setInspectedPoint({
      x,
      y,
      lat: cursorCoords.lat,
      lng: cursorCoords.lng,
      ndvi: Number((Math.random() * 0.6 + 0.3).toFixed(2)),
      classification: x > 50 ? 'Detected Change Area' : 'Vegetation',
      confidence: Number((Math.random() * 8 + 91).toFixed(1)),
      spectralBands: [
        { name: 'Blue Band', val: Number((Math.random() * 0.05 + 0.02).toFixed(3)) },
        { name: 'Green Band', val: Number((Math.random() * 0.06 + 0.04).toFixed(3)) },
        { name: 'Red Band', val: Number((Math.random() * 0.08 + 0.03).toFixed(3)) },
        { name: 'Near-Infrared', val: Number((Math.random() * 0.4 + 0.4).toFixed(3)) },
        { name: 'Shortwave-IR', val: Number((Math.random() * 0.15 + 0.05).toFixed(3)) }
      ]
    });
  };

  return (
    <div
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onClick={handleCanvasClick}
      className="relative flex-1 h-full w-full bg-black overflow-hidden select-none cursor-crosshair text-white"
    >
      {/* Background Geospatial Canvas World with simulated Pan/Zoom */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-75 origin-center"
        style={{
          transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`
        }}
      >
        {/* Layer 1: After / AI Inference Layer (Full width underneath) */}
        <div
          className="absolute inset-0 w-full h-full"
          style={getCanvasBackgroundStyle(activeTimestamp === 'T0' ? activeAOI.beforeVisual : activeAOI.afterVisual)}
        >
          {/* Detailed synthetic geospatial textures */}
          <div className="absolute inset-0 geo-grid-pattern opacity-25"></div>

          {/* AI Segmentation Feature Polygons & Vector Bounding Boxes */}
          {activeAOI.id === 'godavari-flood' || activeAOI.id === 'sentinel1-godavari-sar' ? (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Anomaly Box 1 - Godavari Inundation Zone */}
              <div className="absolute top-[22%] left-[26%] w-[320px] h-[220px] border-2 border-cyan-500 bg-cyan-950/40 rounded-xl p-3 flex flex-col justify-between shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-cyan-900 text-cyan-200 font-bold border border-cyan-500/40">
                    Flooded Area Detected
                  </span>
                  <span className="text-cyan-300 font-bold">71,105 ha</span>
                </div>
                <div className="space-y-0.5 text-[10px] font-mono text-gray-200">
                  <div>Confidence: 99.1% • AI Verified</div>
                  <div className="text-emerald-400 font-semibold">Water Index Confirmed</div>
                </div>
              </div>

              {/* Anomaly Box 2 - Submerged Cropland Risk */}
              <div className="absolute bottom-[20%] right-[22%] w-[260px] h-[160px] border-2 border-amber-500 bg-amber-950/40 rounded-xl p-3 flex flex-col justify-between shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-amber-900 text-amber-200 font-bold border border-amber-500/40">
                    Flooded Farmland Risk
                  </span>
                  <span className="text-amber-300 font-semibold">24,380 ha</span>
                </div>
                <div className="text-[10px] font-mono text-gray-300">
                  Water Depth &gt; 1.4m
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Anomaly Box 1 */}
              <div className="absolute top-[28%] left-[34%] w-[250px] h-[160px] border-2 border-rose-500 bg-rose-950/40 rounded-xl p-3 flex flex-col justify-between shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-rose-900 text-rose-200 font-bold border border-rose-500/40">
                    Tree Cover Loss Area
                  </span>
                  <span className="text-rose-300 font-semibold">48.2 ha</span>
                </div>
                <div className="text-[10px] font-mono text-gray-300">
                  Confidence: 98.6% • High Accuracy Model
                </div>
              </div>

              {/* Anomaly Box 2 */}
              <div className="absolute bottom-[22%] right-[28%] w-[220px] h-[130px] border-2 border-amber-500 bg-amber-950/40 rounded-xl p-3 flex flex-col justify-between shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-amber-900 text-amber-200 font-bold border border-amber-500/40">
                    Flooded Zone
                  </span>
                  <span className="text-amber-300 font-semibold">112 ha</span>
                </div>
                <div className="text-[10px] font-mono text-gray-300">
                  Water Depth &gt; 1.2m
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Layer 2: Before / Baseline Imagery (Clipped if in split mode) */}
        {viewMode !== 'overlay' && (
          <div
            className="absolute inset-0 h-full overflow-hidden pointer-events-none z-10"
            style={{
              width: viewMode === 'split' ? `${splitPos}%` : '50%'
            }}
          >
            <div
              className="absolute top-0 left-0 h-full"
              style={{
                width: canvasDimensions.width || '100%',
                ...getCanvasBackgroundStyle(activeAOI.beforeVisual)
              }}
            >
              <div className="absolute inset-0 geo-grid-pattern opacity-20"></div>
              {/* Natural terrain river vectors */}
              <svg className="absolute inset-0 w-full h-full opacity-30 stroke-cyan-400 fill-none" strokeWidth="2">
                <path d="M 0 300 Q 250 350 450 200 T 900 350 T 1400 250" />
                <path d="M 100 0 Q 300 220 500 450 T 700 800" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
            </div>
          </div>
        )}

        {/* Draggable Split Slider Handle in Split Mode */}
        {viewMode === 'split' && (
          <div
            onPointerDown={(e) => {
              setIsDraggingSplit(true);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerUp={(e) => {
              setIsDraggingSplit(false);
              try {
                e.currentTarget.releasePointerCapture(e.pointerId);
              } catch {
                // ignore
              }
            }}
            className="absolute top-0 bottom-0 w-1 bg-cyan-500 z-30 shadow-md cursor-ew-resize"
            style={{ left: `${splitPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-500 text-black border-2 border-white shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
              <Sliders className="w-4 h-4 rotate-90" />
            </div>
          </div>
        )}

        {/* Ground Inspection Tooltip */}
        {inspectedPoint && (
          <div
            className="absolute z-40 p-3.5 rounded-xl bg-gray-900/95 border border-white/20 text-white shadow-2xl pointer-events-auto font-mono text-xs w-64 animate-in fade-in backdrop-blur-md"
            style={{
              left: `${inspectedPoint.x}%`,
              top: `${inspectedPoint.y}%`,
              transform: 'translate(-50%, -115%)'
            }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
              <span className="font-bold text-cyan-400 flex items-center gap-1">
                <Crosshair className="w-3.5 h-3.5" />
                Area Details
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/60 text-cyan-300 font-bold border border-cyan-500/30">
                {inspectedPoint.confidence}%
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="font-semibold text-white truncate max-w-[130px]">
                  {inspectedPoint.classification}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vegetation Index:</span>
                <span className="font-bold text-emerald-400">{inspectedPoint.ndvi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Coordinates:</span>
                <span className="text-gray-200">{inspectedPoint.lat}°, {inspectedPoint.lng}°</span>
              </div>
            </div>

            {/* Band distribution bars */}
            <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">
                Color & Light Values
              </div>
              {inspectedPoint.spectralBands.map((band, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                  <span className="w-20 truncate text-gray-400">{band.name}</span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${Math.min(100, band.val * 120)}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right font-mono text-gray-300">{band.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* OVERLAY HUD CONTROLS */}

      {/* Top Left: Active Sensor & Band HUD */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-black/80 border border-white/10 text-[11px] font-mono text-gray-200 flex items-center gap-2 shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="font-bold text-white">{activeSensor.toUpperCase()}</span>
          <span className="text-white/20">|</span>
          <span className="text-cyan-300 font-semibold">{activeBandMode.toUpperCase()}</span>
          <span className="text-white/20">|</span>
          <span className="text-gray-400">Map Coords</span>
        </div>
      </div>

      {/* Top Right: Live Cursor Readout HUD */}
      <div className="absolute top-3 right-3 z-30 pointer-events-none">
        <div className="px-3 py-1.5 rounded-lg bg-black/80 border border-white/10 text-[11px] font-mono text-gray-300 space-y-0.5 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span>LAT: <strong className="text-white">{cursorCoords.lat}°</strong></span>
            <span>LON: <strong className="text-white">{cursorCoords.lng}°</strong></span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-gray-400">
            <span>ELEV: {cursorCoords.elev}m</span>
            <span>Reflectance: {cursorCoords.reflectance}</span>
            <span>Res: 0.5m</span>
          </div>
        </div>
      </div>

      {/* Bottom Left: Visual Classification Legend */}
      <div className="absolute bottom-3 left-3 z-30 p-2.5 rounded-xl bg-black/80 border border-white/10 text-[11px] font-mono text-gray-300 shadow-lg space-y-1.5 pointer-events-auto backdrop-blur-md">
        <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1">
          <Layers className="w-3 h-3 text-cyan-400" />
          Map Legend
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
            <span>Dense Forest</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
            <span>Tree Disturbance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-cyan-500"></span>
            <span>Open Water</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
            <span>Burn Area</span>
          </div>
        </div>
      </div>

      {/* Bottom Center: Multi-Temporal Scrubber */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 p-1 rounded-xl bg-black/80 border border-white/10 shadow-lg flex items-center gap-1 text-xs font-mono pointer-events-auto backdrop-blur-md">
        <button
          onClick={() => setActiveTimestamp('T0')}
          className={`px-3 py-1 rounded-lg transition-all duration-150 active:scale-[0.98] cursor-pointer ${
            activeTimestamp === 'T0'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            Before: June Image
          </span>
        </button>

        <button
          onClick={() => setActiveTimestamp('T1')}
          className={`px-3 py-1 rounded-lg transition-all duration-150 active:scale-[0.98] cursor-pointer ${
            activeTimestamp === 'T1'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            After: August Image
          </span>
        </button>
      </div>
    </div>
  );
};
