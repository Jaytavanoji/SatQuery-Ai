# SATQUERY-AI — Earth Observation & Geospatial Intelligence Frontend

A production-ready React 19 (Vite + TypeScript + Tailwind CSS) web application for Earth Observation (EO) analysis powered by multi-modal foundation models and deterministic physics guardrails.

---

## 🚀 Key Highlights & New Features

### 1. Cinematic Zero-Delay Landing Interface (`/`)
- **GPU-Accelerated Visual Backdrop**: Features a live 60FPS video stream of Earth from orbit.
- **Zero-Latency Initial Rendering**: Removed artificial JavaScript timeout delays and opacity locks to deliver instantaneous DOM paint.
- **Unified Brand Design System**: Standardized **`SATQUERY-AI`** title typography in `Space Grotesk` with `#34d399` emerald/teal AI accents across all views.
- **Clean Typographic Focus**: Eliminated boxy logo placeholder frames, letting the premium brand typography stand cleanly on its own.
- **Centered Launch CTA**: Centered, high-contrast **Launch** button (`.cta-btn`) with balanced vertical alignment navigating straight into `/app`.
- **Interactive Showcase Suite**:
  - Comparative analysis: Agentic Multimodal Paradigm vs Legacy Silos.
  - Interactive Analysis Terminal preview.
  - SOTA SpaceNet benchmarks, use-case carousels, and architecture breakdown.

---

### 2. Standalone In-App Satellite Time-Series Archive (`/satellite-view`)
- **Direct Wayback Integration**: Embedded the ArcGIS Wayback global historical archive directly inside the web app with zero external redirects.
- **Pinpoint Indian Metropolitan Presets**:
  - **Pune (Active)**: `73.85674°E, 18.52043°N` (Zoom 14)
  - **Mumbai**: `72.83465°E, 18.92200°N` (Zoom 14)
  - **Surat**: `72.83106°E, 21.17024°N` (Zoom 14)
  - **Jaipur**: `75.82674°E, 26.92394°N` (Zoom 14)
- **Dedicated Telemetry Bar**: Includes instant location switcher, live reload, fullscreen toggles, and direct links to home or `/app`.

---

### 3. AI Analysis Workspace (`/app`)
- **Interactive Split-Slider Evidence Viewer**: Drag vertical partition across original satellite rasters and neural inference overlays.
- **Multi-Spectral Radiance & Reflectance Graphs**: 12-band spectral line graphs and land-cover composition bar charts.
- **One-Click Vector Export**: Instant copy and download of RFC 7946 GeoJSON polygons and bounding boxes with real-world ground area in hectares.
- **Dossier & Forensic Report Export**: Downloadable formatted Markdown and machine-readable JSON analytical dossiers.
- **Settings & Security**: Model confidence cutoff sliders, cloud masking thresholds, API key management, and theme customization.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **Language**: TypeScript (Strict type safety)
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Icons**: Lucide React (`lucide-react`)
- **Routing**: React Router (`/`, `/app`, `/satellite-view`, `/workspace`)

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend Connection
Create or edit `.env`:
```env
VITE_API_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```
Builds verified clean with **0 errors**.
