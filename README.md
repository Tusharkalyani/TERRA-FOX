<div align="center">

<br/>

```
████████╗███████╗██████╗ ██████╗  █████╗     ███████╗ ██████╗ ██╗  ██╗
╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔══██╗    ██╔════╝██╔═══██╗╚██╗██╔╝
   ██║   █████╗  ██████╔╝██████╔╝███████║    █████╗  ██║   ██║ ╚███╔╝
   ██║   ██╔══╝  ██╔══██╗██╔══██╗██╔══██║    ██╔══╝  ██║   ██║ ██╔██╗
   ██║   ███████╗██║  ██║██║  ██║██║  ██║    ██║     ╚██████╔╝██╔╝ ██╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝      ╚═════╝ ╚═╝  ╚═╝
```

<br/>

**A next-generation campus GPS & navigation platform for VIT Bhopal University**

<br/>

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white)

<br/>

> *Navigate smarter. Explore deeper. Never get lost again.*

<br/>

</div>

---

## ✦ Overview

**Terra Fox** is a full-featured, real-time campus navigation web application built for **VIT Bhopal University**. It combines GPS-based outdoor routing, A\* pathfinding, indoor floor navigation, 3D building visualization, an AI chat assistant, live weather, and disruption alerts — all wrapped in a sleek, glassmorphic dark-mode interface.

---

## ✦ Features

### 🗺️ Interactive Satellite Campus Map
- Full-screen **Esri World Imagery** satellite tile layer rendered via **Leaflet**
- Smooth **animated flyTo transitions** when selecting buildings or routes
- Bounded map viewport — restricts panning beyond the VIT Bhopal campus boundary
- Custom **HTML/SVG map markers** for every campus building with category color coding
- Pulsing **"You Are Here"** GPS marker with animated ring
- Start **(A)** and Destination **(B)** markers with distinct emerald/rose color theming
- Per-building **rich popup cards** with route, indoor nav, and 3D view actions

---

### 📍 Smart Outdoor Pathfinding
- **A\* algorithm** with Haversine geodetic distance heuristic for accurate real-world routing
- Support for **three transport modes**:
  - 🚶 **Walk** — standard pedestrian speed
  - 🏃 **Run** — faster pace estimate
  - 🚴 **Cycle** — cycling speed estimate
- Automatic **ETA & distance calculation** displayed live on the Navigation Card
- **Disruption-aware routing** — active blocked nodes are automatically excluded from the path graph
- Animated **tri-layer route polyline** (glow halo → main red line → white inner accent)
- **Swap start/end** button for instant reverse routing
- Real GPS coordinates via `navigator.geolocation` with campus-center fallback

---

### 🏢 Indoor Navigation (AB1 & AB2)
- Full **floor-by-floor indoor maps** for Academic Block 1 and Academic Block 2 (Floors 1–4)
- Room-by-room **A\* pathfinding** within each floor using percentage-based blueprint coordinates
- Animated **SVG path rendering** on interactive floor blueprints
- Visual **node markers** for classrooms, labs, offices, and transit points (stairs/corridors)
- Step-by-step **indoor directions** with distance and ETA per step
- Dynamic **floor selector** with smooth tab transitions

---

### 🧊 3D Building Viewer
- Isometric **CSS 3D model** of Academic Block 1 with realistic floor stacking and shadow
- Interactive **tab views**: Isometric · Blueprint · Details
- Building detail panel: facilities, capacity, safety systems, energy rating
- Direct **"Open Indoor Navigation"** shortcut from within the 3D viewer

---

### 🤖 TerraFox AI Chat Assistant
- Floating AI chat widget (bottom-right corner) powered by an **on-device rule engine**
- Natural language understanding for queries like:
  - *"Route to Academic Block 1"*
  - *"Where is the cafeteria?"*
  - *"Show me hostels"*
  - *"Any active roadblocks?"*
- Responds with **building action cards** — one tap routes, pins, or opens 3D view
- **Suggested quick questions** on first open for instant discoverability
- Expandable fullscreen mode with **scroll-to-latest** auto-behavior
- Unread message badge indicator on the chat button

---

### 🔍 Global Search Bar
- Unified **live search** across all campus buildings and locations
- Category-filtered results with building icons and type labels
- Instant actions per result: **Route Here**, **Pin on Map**, **View in 3D**
- Keyboard-accessible dropdown with smooth open/close animation

---

### 🚧 Disruptions & Alerts Panel
- Real-time **campus disruption tracker** (blocked paths, construction, events)
- Each disruption shows severity badge (critical / warning / info), type icon, and description
- Toggle disruptions **on/off** — the pathfinder automatically reroutes around active blockages
- **Pulsing 🚧 warning markers** rendered on the map at affected node coordinates
- **Add custom disruptions** via the built-in form (title, description, type selector)
- Active disruption count badge on the panel button

---

### ☁️ Live Weather Widget
- Fetches real-time weather from the **Open-Meteo API** (no API key required)
- Displays live **temperature**, weather emoji, and status label
- WMO weather code mapping: Sunny · Cloudy · Rainy · Stormy · Snowy · Foggy · Hot · Cool
- Manual **refresh button** with spin animation

---

### 🌐 Multi-Language Support (i18n)
- **7 languages** fully supported across all UI strings:
  - 🇬🇧 English · 🇮🇳 Hindi · 🇮🇳 Telugu · 🇮🇳 Tamil · 🇮🇳 Marathi · 🇪🇸 Spanish · 🇫🇷 French
- **Live language switching** — no page reload required
- Language Picker modal with flag icons and native script display
- Built with **i18next** + **react-i18next**

---

### 🌙 Dark / Light Mode
- System-preference-aware **auto dark mode** on first load
- Persistent theme saved to `localStorage`
- One-click toggle (Sun ☀️ / Moon 🌙) in the top navigation bar
- All components styled for both modes via Tailwind `dark:` variant classes

---

### 🏝️ Dynamic Island ETA Bar
- Apple-inspired **Dynamic Island header** that appears when a route is active
- Displays live transport mode icon, total ETA, and distance
- Smoothly fades in/out based on route state

---

### 🗂️ Building Directory
- Searchable **campus directory** tab inside the Navigation Card
- Lists all campus buildings with category icons, descriptions, and quick-action buttons
- Filter by name or building ID

---

## ✦ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **UI Framework** | React 19 | Component-driven UI |
| **Language** | TypeScript 6 | Type-safe development |
| **Build Tool** | Vite 8 | Lightning-fast dev server & bundler |
| **Styling** | Tailwind CSS v4 | Utility-first responsive styling |
| **2D Maps** | Leaflet + react-leaflet | Interactive satellite map rendering |
| **Map Tiles** | Esri World Imagery | High-res satellite imagery |
| **GL Maps** | Mapbox GL + react-map-gl | GPU-accelerated vector maps |
| **3D Rendering** | Three.js + @react-three/fiber + @react-three/drei | WebGL 3D building viewer |
| **Pathfinding** | Custom A\* (TypeScript) | Outdoor & indoor shortest-path routing |
| **Geolocation** | Web Geolocation API | Real GPS positioning |
| **Internalization** | i18next + react-i18next | 7-language UI localization |
| **Icons** | Lucide React | Crisp, consistent SVG icons |
| **Weather API** | Open-Meteo (REST) | No-key live weather data |
| **Linter** | Oxlint | Fast Rust-based linting |

---

## ✦ Project Structure

```
terra-fox/
├── src/
│   ├── components/
│   │   ├── CampusMap.tsx          # Leaflet satellite map + markers + polyline routing
│   │   ├── NavigationCard.tsx     # Routing UI card with steps, transport, directory
│   │   ├── IndoorNavigationModal.tsx  # Floor-by-floor indoor pathfinder & blueprint
│   │   ├── Building3DViewer.tsx   # Isometric / blueprint / detail 3D modal
│   │   ├── ChatAssistant.tsx      # AI floating chat widget
│   │   ├── GlobalSearchBar.tsx    # Live universal campus search
│   │   ├── DisruptionsPanel.tsx   # Campus alerts & path-block manager
│   │   ├── WeatherWidget.tsx      # Live weather from Open-Meteo
│   │   ├── DynamicIsland.tsx      # ETA header bar
│   │   ├── LanguagePicker.tsx     # Language selector modal
│   │   └── MapThemeToggle.tsx     # Map style toggle
│   ├── data/
│   │   ├── campusData.ts          # All campus nodes, edges & building metadata
│   │   └── disruptionsData.ts     # Preset disruption definitions
│   ├── utils/
│   │   ├── pathfinder.ts          # Outdoor A* + Haversine + turn-by-turn generator
│   │   ├── indoorPathfinder.ts    # Indoor A* on blueprint coordinate graph
│   │   ├── buildingIcons.ts       # Category → icon/color/badge mapping
│   │   └── translations.ts        # All i18n translation strings (7 languages)
│   ├── App.tsx                    # Root app state & layout composition
│   ├── main.tsx                   # React DOM entry point
│   └── index.css                  # Global styles, glassmorphism, animations
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## ✦ Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/terra-fox.git
cd terra-fox

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173` with Hot Module Replacement enabled.

### Build

```bash
npm run build
```

Outputs optimized production assets to `/dist`.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## ✦ Key Algorithms

### Outdoor Pathfinding — A\* with Haversine

Terra Fox uses a custom **A\* (A-Star)** implementation over a pre-defined campus graph of nodes and weighted edges. The heuristic is the **Haversine formula** — computing geodetic great-circle distance between coordinates, ensuring accurate real-world distance estimation on a spherical Earth.

The pathfinder also generates **turn-by-turn navigation steps** by computing compass bearings between consecutive nodes and classifying direction changes as: `straight` · `turn-left` · `turn-right` · `u-turn` · `stairs` · `arrive`.

### Indoor Pathfinding — Blueprint A\*

A separate pathfinder runs over per-floor node graphs using **Euclidean distance on percentage-based blueprint coordinates** (0–100 x/y space). This allows the floor maps to remain resolution-independent while still supporting accurate path calculations.

### Disruption-Aware Routing

Any node IDs associated with active disruptions are passed as a `blockedNodeIds` array into the A\* call. The algorithm's neighbor expansion step **skips blocked nodes entirely**, forcing the path to detour around construction or closed areas automatically.

---

## ✦ Campus Coverage

Terra Fox covers the full **VIT Bhopal University** campus including:

| Category | Buildings |
|---|---|
| 🏛️ Academic | Academic Block 1 (AB1), Academic Block 2 (AB2) |
| 🧪 Labs & Research | Various department labs per floor |
| 🍽️ Food & Dining | Multiple cafeterias & food courts |
| 🏠 Hostels | Boys' & Girls' hostels |
| 🏥 Healthcare | Medical center / infirmary |
| 🏋️ Sports | Sports complex, grounds |
| 🛒 Convenience | Stationery, banks, ATMs |
| 🌿 Open Areas | Gardens, quad, main entrance |

---

## ✦ License

This project is intended for educational and campus-use purposes at VIT Bhopal University.

---

<div align="center">

<br/>

**Built with ❤️ for VIT Bhopal**

*Terra Fox — Your Campus. Mapped. Explored. Navigated.*

<br/>

</div>
