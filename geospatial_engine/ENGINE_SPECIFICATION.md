# Geospatial AI Engine — Core Architecture & Physics Ledger (`ENGINE_SPECIFICATION.md`)

## 1. Executive Summary & Purpose

The **Geospatial AI Engine** is an offline, high-precision geospatial artificial intelligence reasoning engine designed for Earth observation data. It provides specialized support for multi-spectral optical surface reflectance (e.g. Sentinel-2 L2A, Landsat-8/9) and Synthetic Aperture Radar (SAR) C-band backscatter ($\text{VV}, \text{VH}$ in decibels).

The core engine provides an end-to-end pipeline capable of:
1. Ingesting raw 16-bit multi-spectral optical and dual-polarization SAR GeoTIFF products.
2. Converting raw Digital Numbers (DN) to physically calibrated surface reflectance ($\rho \in [0.0, 1.0]$) and radar backscatter ($\sigma^0$ in dB).
3. Interpreting multimodal natural language user queries (e.g. flood extent delineation, urban growth, drought monitoring, damage assessment).
4. Routing tasks dynamically to specialized deep-learning backbones (`ConvNeXt-v2` single-scene, `Siamese ResNet-50` change detection, or `14-Channel ViT` cross-modal fusion).
5. Grounding neural network inferences with deterministic physical spectral indices ($\text{NDWI}, \text{MNDWI}, \text{NDVI}$) and SAR backscatter thresholding.
6. Emitting verifiable, geo-referenced analytical outputs (GeoJSON vector geometries, raster masks, heatmaps, overlays, and synthesized audit traces).

---

## 2. Directory Structure

```text
geospatial_engine/
├── ENGINE_SPECIFICATION.md       <-- Architecture ledger, physics specifications & API docs
├── verify_pipeline.py            <-- End-to-end integration and smoke test suite (5/5 benchmarks)
├── configs/
│   ├── spectral_indices.yaml     <-- Band equations, index rules, and verification thresholds
│   └── model_registry.yaml       <-- Neural network backbone architectures & checkpoint configs
└── src/
    ├── core_processor.py         <-- Master GeospatialAIEngine pipeline coordinator
    ├── controller/
    │   ├── data_schemas.py       <-- Pydantic v2 models for queries, task routes, audit traces
    │   └── intent_router.py      <-- Heuristic & VLM multi-modal intent router
    ├── ingestion/
    │   ├── raster_loader.py      <-- 16-bit GeoTIFF reader, CRS preservation, band slicing
    │   └── tensor_preprocessors.py<-- Reflectance /10000 scaling and SAR linear-to-dB conversion
    ├── physics/
    │   ├── spectral_calculators.py<-- Deterministic index computing & Otsu thresholding
    │   ├── geospatial_metrics.py <-- Ground resolution & hectare area calculators
    │   └── contour_vectorizer.py <-- Sub-pixel GeoJSON polygon vectorizer
    ├── specialists/
    │   ├── monotemporal_specialist.py    <-- ConvNeXt-v2 visual backbone for S1 / S2 feature extraction
    │   ├── bitemporal_change_detector.py <-- ResNet-50 Siamese difference engine for bi-temporal pairs
    │   └── multimodal_fusion_specialist.py<-- 14-Channel ViT Base fusion for joint Optical-SAR reasoning
    └── export/
        ├── dossier_exporter.py    <-- JSON & Markdown analytical report generator
        └── result_visualizer.py   <-- Binary mask, heatmap, and overlay renderer
```

---

## 3. Engineering & Technical Decisions

### 3.1 Radiometric Precision & 16-Bit Processing
- Optical satellite sensors record radiance at 12 to 16 bits per pixel (values spanning 0 to 65535).
- Downscaling raw data directly to 8-bit integers (0–255) leads to severe quantization error and eliminates subtle spectral variations required for index analysis.
- **Decision:** All ingestion pipelines maintain native `float32` internal buffers loaded directly from `uint16` rasters.

### 3.2 Reflectance Normalization
- Sentinel-2 Level-2A bottom-of-atmosphere (BOA) surface reflectance is distributed as integer Digital Numbers (DN) scaled by a factor of 10,000.
- **Decision:** Optical preprocessor executes:
  $$\rho_{\lambda} = \frac{\text{DN}_{\lambda}}{10000.0}$$
  Values are clamped to physical bounds $[0.0, 1.0]$ with NoData handling preserving masking flags.

### 3.3 SAR Backscatter Calibration & Decibel Transformation
- Sentinel-1 Ground Range Detected (GRD) amplitude/intensity values exhibit extreme dynamic ranges with speckle noise.
- Water surfaces exhibit specular reflection away from radar antennas, yielding dark backscatter (low return), while urban structures exhibit double-bounce returns (high return).
- **Decision:** SAR linear intensity ($I = \text{DN}^2$) is converted to sigma-nought ($\sigma^0$) backscatter in decibels:
  $$\sigma^0_{\text{dB}} = 10 \cdot \log_{10}(\max(I, \epsilon))$$
  where $\epsilon = 10^{-7}$ prevents numerical singularity. Terrestrial backscatter bounds $[-30\text{ dB}, 0\text{ dB}]$ are enforced.

### 3.4 Coordinate Reference System (CRS) & Spatial Geometry
- Spatial queries must not decouple pixel arrays from geographic references.
- **Decision:** Every raster array retains its affine transformation matrix (`affine.Affine`) and spatial CRS (e.g. EPSG:4326, EPSG:32643 / UTM zones). Vectorization outputs are projected to standard WGS84 (`EPSG:4326`) GeoJSON geometries.

---

## 4. Mathematical & Physical Formulations

| Index / Metric | Mathematical Definition | Physical Purpose |
| :--- | :--- | :--- |
| **NDVI** (Normalized Difference Vegetation Index) | $\frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red} + \epsilon}$ | Distinguishes green chlorophyll absorption from near-infrared cellular scattering. |
| **NDWI** (Normalized Difference Water Index - McFeeters) | $\frac{\text{Green} - \text{NIR}}{\text{Green} + \text{NIR} + \epsilon}$ | Highlights open water bodies by leveraging green reflectance and NIR absorption. |
| **MNDWI** (Modified NDWI - Xu) | $\frac{\text{Green} - \text{SWIR1}}{\text{Green} + \text{SWIR1} + \epsilon}$ | Suppresses built-up urban noise and improves turbidity/sediment resilience. |
| **SAR Backscatter** ($\sigma^0_{\text{dB}}$) | $10 \cdot \log_{10}(\text{DN}^2 + \epsilon)$ | Delineates surface roughness, dielectric properties, and flood inundation. |
| **SAR Cross-Ratio** (CR) | $\sigma^0_{\text{VH}} - \sigma^0_{\text{VV}}$ | Sensitive to volume scattering vs. surface scattering (crop canopy structure). |

---

## 5. Development Roadmap & Implementation Ledger

| Step | Target File | Status | Description |
| :---: | :--- | :---: | :--- |
| **0** | `geospatial_engine/ENGINE_SPECIFICATION.md` | **Completed** | Master architectural ledger, physics specifications, and system roadmap. |
| **1** | `requirements.txt` | **Completed** | Production runtime dependencies (Rasterio, PyTorch, Pydantic, etc.). |
| **2** | `geospatial_engine/configs/spectral_indices.yaml` | **Completed** | Index band equations, sensor channel mappings, and verification thresholds. |
| **3** | `geospatial_engine/configs/model_registry.yaml` | **Completed** | Specialist backbone configurations (ConvNeXt-v2, ResNet-50, ViT 14-ch). |
| **4** | `geospatial_engine/src/ingestion/raster_loader.py` | **Completed** | Robust 16-bit GeoTIFF reader, CRS parsing, and band slicing. |
| **5** | `geospatial_engine/src/ingestion/tensor_preprocessors.py` | **Completed** | Reflectance scaling (/10000) and SAR dB conversion. |
| **6** | `geospatial_engine/src/controller/data_schemas.py` | **Completed** | Pydantic schemas for queries, routes, audit logs, and outputs. |
| **7** | `geospatial_engine/src/controller/intent_router.py` | **Completed** | Intent-based multi-modal query router. |
| **8** | `geospatial_engine/src/physics/spectral_calculators.py` | **Completed** | Deterministic spectral/SAR index calculator and spatial bbox checker. |
| **9** | `geospatial_engine/src/specialists/monotemporal_specialist.py` | **Completed** | Single-scene feature extraction specialist (ConvNeXt-v2). |
| **10** | `geospatial_engine/src/specialists/bitemporal_change_detector.py` | **Completed** | Bi-temporal Siamese difference specialist (ResNet-50). |
| **11** | `geospatial_engine/src/specialists/multimodal_fusion_specialist.py` | **Completed** | Multimodal 14-channel joint optical-SAR specialist (ViT Base). |
| **12** | `geospatial_engine/src/core_processor.py` | **Completed** | Master GeospatialAIEngine pipeline orchestration and synthesis. |
| **13** | `geospatial_engine/verify_pipeline.py` | **Completed** | End-to-end integration test runner with synthetic GeoTIFF fixtures. |
| **14** | `server_entry.py` | **Completed** | FastAPI REST API backend on Port 8000 serving specialist endpoints. |
| **15** | `ui-ux-frontend` / `web_dashboard` | **Completed** | React 19 web frontend with zero-delay cinematic landing, standalone in-app Wayback satellite viewer, and AI analysis dashboard. |
