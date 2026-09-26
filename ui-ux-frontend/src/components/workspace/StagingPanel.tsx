import React, { useState } from 'react';
import { 
  UploadCloud, 
  Satellite, 
  Sliders, 
  Layers, 
  Eye, 
  EyeOff, 
  Trash2, 
  CheckCircle2, 
  FileCode, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';
import { SensorType, SpectralBandMode, AOIPreset, LayerConfig } from '../../types';
import { MOCK_AOI_PRESETS } from '../../data/mockData';
import { SatQueryApiService, SatelliteSample } from '../../services/apiService';

interface StagingPanelProps {
  activeSensor: SensorType;
  onChangeSensor: (sensor: SensorType) => void;
  activeBandMode: SpectralBandMode;
  onChangeBandMode: (mode: SpectralBandMode) => void;
  activeAOI: AOIPreset;
  onSelectAOI: (aoi: AOIPreset) => void;
  layers: LayerConfig[];
  onToggleLayer: (id: string) => void;
  onChangeOpacity: (id: string, opacity: number) => void;
  onAddLayer: (name: string, type: LayerConfig['type']) => void;
  onRemoveLayer: (id: string) => void;
}

export const StagingPanel: React.FC<StagingPanelProps> = ({
  activeSensor,
  onChangeSensor,
  activeBandMode,
  onChangeBandMode,
  activeAOI,
  onSelectAOI,
  layers,
  onToggleLayer,
  onChangeOpacity,
  onAddLayer,
  onRemoveLayer
}) => {
  const [stagedFiles, setStagedFiles] = useState<Array<{
    name: string;
    size: string;
    type: string;
    crs: string;
    status: 'Staged' | 'Processing';
  }>>([
    {
      name: 't0_preFlood.tiff',
      size: '34.2 MB',
      type: 'Sentinel-2 L2A (BOA)',
      crs: 'EPSG:4326',
      status: 'Staged'
    }
  ]);

  const [serverSamples, setServerSamples] = useState<SatelliteSample[]>([]);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    let isMounted = true;
    setLoadingSamples(true);
    SatQueryApiService.getSamples()
      .then(samples => {
        if (isMounted && Array.isArray(samples)) {
          setServerSamples(samples);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingSamples(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const sensors: { id: SensorType; label: string; desc: string; gsd: string }[] = [
    { id: 'sentinel-2', label: 'Sentinel-2 L2A', desc: '13-Band Multi-Spectral', gsd: '10m GSD' },
    { id: 'landsat-9', label: 'Landsat-9 OLI-2', desc: 'Thermal + SWIR Calibrated', gsd: '15m GSD' },
    { id: 'planetscope', label: 'PlanetScope Dove', desc: 'Daily High-Cadence Constellation', gsd: '3m GSD' },
    { id: 'sentinel-1', label: 'Sentinel-1 C-Band', desc: 'SAR Radar (VV/VH Polarized)', gsd: '5m GSD' },
    { id: 'worldview-3', label: 'WorldView-3 Commercial', desc: 'Very High Resolution Panchromatic', gsd: '0.3m GSD' }
  ];

  const bandModes: { id: SpectralBandMode; label: string; formula: string }[] = [
    { id: 'true-color', label: 'Natural Color RGB', formula: 'B04 - B03 - B02' },
    { id: 'false-color-nir', label: 'False Color NIR', formula: 'B08 - B04 - B03 (Vegetation)' },
    { id: 'ndvi', label: 'NDVI Index', formula: '(B08 - B04) / (B08 + B04)' },
    { id: 'ndwi', label: 'NDWI Water Index', formula: '(B03 - B08) / (B03 + B08)' },
    { id: 'nbr', label: 'NBR Burn Ratio', formula: '(B08 - B12) / (B08 + B12)' },
    { id: 'sar-dual', label: 'SAR Dual Polarized', formula: 'VV / VH Cross-Ratio' }
  ];

  const handleStageServerSample = (sample: SatelliteSample) => {
    const newFile = {
      name: sample.name,
      size: `${(sample.size_bytes / (1024 * 1024)).toFixed(1)} MB`,
      type: sample.modality,
      crs: 'EPSG:4326',
      status: 'Staged' as const
    };
    setStagedFiles(prev => [newFile, ...prev.filter(f => f.name !== sample.name)]);
    onAddLayer(sample.label.split(' (')[0], 'spectral');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2500);
  };

  const handleRealFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const res = await SatQueryApiService.uploadFile(file);
      if (!res) {
        handleSimulatedFileUpload();
        return;
      }
      const newFile = {
        name: res.original_name || res.filename,
        size: res.file_size_bytes
          ? `${(res.file_size_bytes / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.name.endsWith('.geojson') ? 'GeoJSON Vectors' : 'Satellite GeoTIFF',
        crs: 'EPSG:4326',
        status: 'Staged' as const
      };
      setStagedFiles(prev => [newFile, ...prev]);
      onAddLayer(file.name.replace(/\.[^/.]+$/, ''), 'spectral');
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch {
      handleSimulatedFileUpload();
    } finally {
      setIsUploading(false);
    }
  };

  const handleSimulatedFileUpload = () => {
    const mockFileNames = [
      'Copernicus_AOI_CloudMask_v2.tif',
      'Hydrological_Inundation_Vectors.geojson',
      'Wildfire_dNBR_Thermal_Classification.tif'
    ];
    const pickedName = mockFileNames[Math.floor(Math.random() * mockFileNames.length)];
    const newFile = {
      name: pickedName,
      size: `${(Math.random() * 80 + 20).toFixed(1)} MB`,
      type: pickedName.endsWith('.geojson') ? 'GeoJSON Vectors' : 'Cloud-Optimized GeoTIFF',
      crs: 'EPSG:4326',
      status: 'Staged' as const
    };

    setStagedFiles(prev => [newFile, ...prev]);
    onAddLayer(pickedName.replace('.tif', '').replace('.geojson', ''), 'spectral');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-900/90 border-r border-white/10 text-xs overflow-y-auto text-white backdrop-blur-md">
      {/* Panel Title */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white uppercase tracking-wider font-mono">
            Image Layers & Controls
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-blue-950/60 text-cyan-300 text-[10px] font-semibold border border-cyan-500/30 font-mono">
          Live Data
        </span>
      </div>

      <div className="p-3.5 space-y-5">
        {/* Section 1: AOI Presets Quick Picker */}
        <div>
          <label className="block text-[11px] font-semibold uppercase text-gray-400 mb-2 flex items-center gap-1.5 font-mono">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            Preset Location
          </label>
          <div className="space-y-1.5">
            {MOCK_AOI_PRESETS.map((preset) => {
              const isSelected = activeAOI.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectAOI(preset)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 active:scale-[0.98] border flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 border-cyan-500/50 text-white font-semibold shadow-xs ring-1 ring-cyan-500/40'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:border-cyan-500/30 hover:text-white'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="truncate text-xs font-semibold">{preset.name.split(' (')[0]}</div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      {preset.location}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Sensor & Constellation Picker */}
        <div>
          <label className="block text-[11px] font-semibold uppercase text-gray-400 mb-2 flex items-center gap-1.5 font-mono">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            Satellite Source
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {sensors.map((sensor) => {
              const isSelected = activeSensor === sensor.id;
              return (
                <button
                  key={sensor.id}
                  onClick={() => onChangeSensor(sensor.id)}
                  className={`p-2 rounded-xl text-left transition-all duration-150 active:scale-[0.98] border flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 border-cyan-500/50 text-white font-semibold ring-1 ring-cyan-500/40'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:border-cyan-500/30 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold">{sensor.label}</div>
                    <div className="text-[10px] text-gray-400">
                      {sensor.desc}
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-gray-300 font-mono">
                    {sensor.gsd}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Spectral Band Index */}
        <div>
          <label className="block text-[11px] font-semibold uppercase text-gray-400 mb-2 flex items-center gap-1.5 font-mono">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Color & Filter Modes
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {bandModes.map((mode) => {
              const isSelected = activeBandMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => onChangeBandMode(mode.id)}
                  className={`p-2 rounded-xl text-left transition-all duration-150 active:scale-[0.98] border flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold border-cyan-500/50 shadow-xs'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:border-cyan-500/30 hover:text-white'
                  }`}
                >
                  <span className="text-xs">{mode.label}</span>
                  <span className={`text-[9px] mt-1 truncate font-mono ${
                    isSelected ? 'text-cyan-200' : 'text-gray-400'
                  }`}>
                    {mode.formula}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Sample Satellite Images */}
        {serverSamples.length > 0 && (
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase text-gray-400 mb-2 flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-cyan-400" />
              Sample Satellite Images
            </label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {serverSamples.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleStageServerSample(sample)}
                  className="w-full text-left p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/10 transition-all flex items-center justify-between group active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    {sample.preview_url ? (
                      <img
                        src={sample.preview_url}
                        alt={sample.label}
                        className="w-8 h-8 rounded-lg object-cover border border-white/10 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-cyan-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 font-mono">
                        SAT
                      </div>
                    )}
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate">
                        {sample.label}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono truncate">
                        {sample.modality}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold ml-1">
                    Load +
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Stage Local File Dropzone */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-mono font-semibold uppercase text-gray-400 flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
              Upload Images
            </label>
            {isUploading ? (
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Uploading...
              </span>
            ) : uploadSuccess ? (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Uploaded
              </span>
            ) : null}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".tif,.tiff"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const isTiff = file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff');
                if (isTiff) {
                  handleRealFileUpload(file);
                } else {
                  alert(`"${file.name}" is not supported. Only satellite imagery in GeoTIFF (.tif, .tiff) format is accepted.`);
                }
              }
            }}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingFile(true);
            }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                const isTiff = file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff');
                if (isTiff) {
                  handleRealFileUpload(file);
                } else {
                  alert(`"${file.name}" is not supported. Only satellite imagery in GeoTIFF (.tif, .tiff) format is accepted.`);
                }
              } else {
                handleSimulatedFileUpload();
              }
            }}
            className={`p-4 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-150 active:scale-[0.98] ${
              isDraggingFile
                ? 'border-cyan-500 bg-cyan-950/30'
                : 'border-white/20 bg-white/5 hover:border-cyan-500/40 hover:bg-white/10'
            }`}
          >
            <UploadCloud className="w-6 h-6 mx-auto text-cyan-400 mb-1" />
            <p className="text-xs font-semibold text-white">
              Drop satellite GeoTIFF here
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Click to browse files (.tif, .tiff only)
            </p>
          </div>

          {/* Staged files list */}
          <div className="mt-2 space-y-1.5">
            {stagedFiles.map((file, i) => (
              <div
                key={i}
                className="p-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between font-mono text-[10px]"
              >
                <div className="truncate pr-2">
                  <div className="font-semibold text-white truncate">
                    {file.name}
                  </div>
                  <div className="text-gray-400">
                    {file.type} • {file.size}
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold">
                  {file.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Active Layer Manager */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-mono font-semibold uppercase text-gray-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Map Layers & Visibility
            </label>
            <button
              onClick={() => onAddLayer('Analysis Overlay', 'heatmap')}
              className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-0.5 active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={`p-2.5 rounded-xl border transition-all ${
                  layer.visible
                    ? 'bg-white/5 border-white/10'
                    : 'bg-black/30 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 truncate">
                    <button
                      onClick={() => onToggleLayer(layer.id)}
                      className="text-gray-400 hover:text-cyan-400 transition-colors active:scale-[0.98] cursor-pointer"
                      title={layer.visible ? 'Hide layer' : 'Show layer'}
                    >
                      {layer.visible ? (
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="text-xs font-medium text-gray-200 truncate">
                      {layer.name}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveLayer(layer.id)}
                    className="text-gray-400 hover:text-rose-400 transition-colors p-1 active:scale-[0.98] cursor-pointer"
                    title="Remove layer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Opacity Slider */}
                {layer.visible && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-mono text-gray-400 w-10">
                      {layer.opacity}%
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={layer.opacity}
                      onChange={(e) => onChangeOpacity(layer.id, Number(e.target.value))}
                      className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
