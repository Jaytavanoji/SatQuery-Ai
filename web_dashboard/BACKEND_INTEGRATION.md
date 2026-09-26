# SatQuery-AI — Backend Integration Guide & API Contract

This guide defines the API contract for connecting **any backend** (Python, Node.js, Go, Java, etc.) to the **SatQuery-AI** standalone frontend.

---

## 1. Quick Setup: Connecting Your Backend

1. In the frontend root directory (`/Users/priyo/ui-ux-frontend/`), open or create `.env`:
```env
# Set this to your new backend server URL
VITE_API_URL=http://localhost:8000
```
2. Start the frontend:
```bash
npm run dev
```
3. The frontend is live at `http://localhost:5173`:
- `/` -> Cinematic Landing Page (Unified `SATQUERY-AI` branding, zero-delay rendering, and centered Launch CTA)
- `/app` -> Satellite AI Operations Dashboard & reasoning workspace
- `/satellite-view` & `/workspace` -> Standalone in-app ArcGIS Wayback historical satellite viewer (with Pune, Mumbai, Surat, and Jaipur pinpoint presets)

---

## 2. API Endpoints Specification

All endpoints are prefixed with `/api`.

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Verifies backend engine status.
- **Expected Response (200 OK)**:
```json
{
  "status": "healthy",
  "engine": "Custom EO Core",
  "version": "1.0.0",
  "device": "cpu",
  "specialists_ready": ["segmentation", "detection"],
  "physics_verifier": "active"
}
```

### 2. Available Models & Specialists
- **Endpoint**: `GET /api/models`
- **Description**: Returns available AI models and neural specialists.
- **Expected Response (200 OK)**:
```json
{
  "models": [
    {
      "id": "sar-flood",
      "name": "SAR Flood Detection",
      "badge": "Active",
      "status": "Active",
      "description": "Satellite flood segmentation",
      "supportedInput": "Sentinel-1",
      "architecture": "U-Net",
      "precision": "FP16",
      "parameters": "34.8M",
      "benchmarkMetric": "IoU: 0.89",
      "latencyMs": 140,
      "taskType": "flood"
    }
  ]
}
```

### 3. Pre-bundled Sample Datasets
- **Endpoint**: `GET /api/samples`
- **Description**: Sample satellite images users can click to quickly analyze.
- **Expected Response (200 OK)**:
```json
{
  "samples": [
    {
      "id": "sample-1",
      "name": "Central Agriculture Swath",
      "label": "Multispectral Agriculture",
      "modality": "Sentinel-2",
      "description": "Cropland health sample",
      "recommendedTask": "vegetation",
      "size_bytes": 1024000,
      "path": "samples/sample_cropland.png",
      "url": "/data/inputs/samples/sample_cropland.png"
    }
  ]
}
```

### 4. Uploaded Datasets List
- **Endpoint**: `GET /api/uploads`
- **Description**: List of images previously uploaded by the user.
- **Expected Response (200 OK)**:
```json
{
  "uploads": []
}
```

### 5. File Upload
- **Endpoint**: `POST /api/upload`
- **Request Format**: `multipart/form-data` with field `file`
- **Expected Response (200 OK)**:
```json
{
  "filename": "image.png",
  "file_path": "uploads/image.png",
  "url": "/data/inputs/uploads/image.png",
  "preview_url": "/data/inputs/uploads/image.png"
}
```

### 6. Run Spatial Analysis (Core Action)
- **Endpoint**: `POST /api/analyze`
- **Request Format**: `multipart/form-data`
  - `query_text`: string
  - `confidence_threshold`: float/string (e.g. 0.45)
  - `enable_physics_verification`: boolean/string ("true" / "false")
  - `file`: optional file upload
  - `image_path`: optional path string
- **Expected Response (200 OK)**:
```json
{
  "success": true,
  "query_text": "Identify changes",
  "task_type": "urban",
  "summary_text": "Detected 1,420 hectares of urban area with 94.2% confidence.",
  "statistics": {
    "detected_pixel_count": 45000,
    "total_scene_pixels": 1000000,
    "coverage_percentage": 4.5,
    "area_hectares": 1420.0,
    "mean_probability": 0.942,
    "bounding_boxes": []
  },
  "bounding_boxes": [],
  "urls": {
    "mask": "/data/outputs/mask.png",
    "heatmap": "/data/outputs/heatmap.png",
    "overlay": "/data/outputs/overlay.png"
  }
}
```

### 7. AI Copilot Chat
- **Endpoint**: `POST /api/chat`
- **Request Format**: `application/json` (`{"message": "Hello", "aoi": "optional"}`)
- **Expected Response (200 OK)**:
```json
{
  "response": "Satellite telemetry processed.",
  "confidence": 0.95,
  "citations": ["Satellite Feed"]
}
```

### 8. Reports
- **Endpoint**: `GET /api/reports`
- **Expected Response (200 OK)**:
```json
{
  "reports": []
}
```
