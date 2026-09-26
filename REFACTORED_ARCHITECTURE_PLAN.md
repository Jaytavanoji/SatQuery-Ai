# Geospatial AI Engine — Refactoring & System Architecture Plan (`REFACTORED_ARCHITECTURE_PLAN.md`)

## Executive Summary
This document outlines the systematic refactoring, modular architecture, anonymization, and verification process for the Geospatial AI Engine platform.

---

## 1. Architectural Principles

### 1.1 Structural Refactoring
- **Core Engine Package**: Renamed core package directory to `geospatial_engine`.
- **Web Dashboard**: Renamed web frontend directory to `web_dashboard`.
- **Script Entry Points**:
  - Headless CLI runner: `cli_runner.py`
  - REST API server: `server_entry.py`
  - Test verification runner: `geospatial_engine/verify_pipeline.py`
- **Submodule Naming**:
  - `data_schemas.py` (Pydantic v2 validation contracts)
  - `intent_router.py` (Intent parsing and routing controller)
  - `core_processor.py` (Master pipeline engine coordinator)
  - `dossier_exporter.py` (Report and dossier export engine)
  - `result_visualizer.py` (Mask, heatmap, and overlay renderer)
  - `raster_loader.py` (Multi-spectral and SAR GeoTIFF reader)
  - `tensor_preprocessors.py` (Surface reflectance & SAR dB calibration)
  - `spectral_calculators.py` (NDWI, NDVI, MNDWI, and Otsu thresholding)
  - `geospatial_metrics.py` (Ground resolution & area calculation)
  - `contour_vectorizer.py` (Sub-pixel GeoJSON polygon vectorizer)
  - `monotemporal_specialist.py` (Single-scene ConvNeXt-v2 model)
  - `bitemporal_change_detector.py` (Siamese ResNet-50 change model)
  - `multimodal_fusion_specialist.py` (14-Channel ViT Base fusion model)

### 1.2 Anonymization & Text Sanitization
- All explicit author names, personal handles, and individual developer references removed across code, comments, configurations, and documentation.
- Institutional and hackathon specific names replaced with clean, generic enterprise terms (`Geospatial AI Engine`, `Space Intelligence Benchmark`, `National Earth Observation Program`).

### 1.3 Frontend Modernization & Brand Harmonization
- **Dual Workspace Synchronization**: Kept `ui-ux-frontend/` and `web_dashboard/` fully synchronized with identical production builds and asset bundles.
- **Cinematic Zero-Delay Landing Interface**: Integrated video hero on `/` with zero-delay rendering (removed artificial animation timeouts for instantaneous initial paint).
- **Brand Typography Standardization**: Unified uppercase **`SATQUERY-AI`** across headers, landing, and footers using `Space Grotesk`, with crisp white letters and `#34d399` emerald/teal AI accents.
- **Logo Placeholder Removal**: Removed square icon frames and placeholder boxes, letting the premium typography speak for itself.
- **Standalone Satellite Archive**: Introduced dedicated in-app `/satellite-view` and `/workspace` routes embedding the global ArcGIS Wayback archive with pinpoint Indian coordinates (Pune, Mumbai, Surat, Jaipur) and no external redirects.
- **Interface Decoupling & Cleanup**: Removed legacy blinking badges, external bot widgets, and redundant popups.

---

## 2. Verification Protocol

1. **Backend Integration Suite**:
   ```bash
   python geospatial_engine/verify_pipeline.py
   ```
   *Status*: 🟢 5/5 tests passing 100% offline.

2. **Frontend Build Suites**:
   ```bash
   # Primary workspace
   npm --prefix ui-ux-frontend run build
   # Web dashboard production client
   npm --prefix web_dashboard run build
   ```
   *Status*: 🟢 Clean production builds across all folders (0 TypeScript/Vite errors).

3. **REST Server & Interactive Services**:
   - Backend API: `python server_entry.py` (Port 8000)
   - CLI Runner: `python cli_runner.py --demo`
   - Frontend Server: `npm run dev` (Port 5173 -> `/`, `/app`, `/satellite-view`)
