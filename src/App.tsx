import { useState, useEffect } from "react";
import { CampusMap } from "./components/CampusMap";
import { NavigationCard } from "./components/NavigationCard";
import { WeatherWidget } from "./components/WeatherWidget";
import { DynamicIsland } from "./components/DynamicIsland";
import { Building3DViewer } from "./components/Building3DViewer";
import { DisruptionsPanel } from "./components/DisruptionsPanel";
import { GlobalSearchBar } from "./components/GlobalSearchBar";
import { LanguagePicker } from "./components/LanguagePicker";
import { ChatAssistant } from "./components/ChatAssistant";
import { IndoorNavigationModal } from "./components/IndoorNavigationModal";
import { findShortestPath } from "./utils/pathfinder";
import type { PathResult, TransportMode } from "./utils/pathfinder";
import type { CampusNode } from "./data/campusData";
import { initialDisruptions } from "./data/disruptionsData";
import type { CampusDisruption } from "./data/disruptionsData";
import type { LanguageCode } from "./utils/translations";
import { Sun, Moon, Navigation as NavIcon } from "lucide-react";

function App() {
  const [startId, setStartId] = useState<string>("MY_LOCATION");
  const [endId, setEndId] = useState<string>("AB1");
  const [selectedBuilding, setSelectedBuilding] = useState<CampusNode | null>(null);
  const [viewerBuilding, setViewerBuilding] = useState<CampusNode | null>(null);
  const [indoorBuilding, setIndoorBuilding] = useState<"AB1" | "AB2" | null>(null);
  const [route, setRoute] = useState<PathResult | null>(null);
  const [transportMode, setTransportMode] = useState<TransportMode>("walk");
  const [disruptions, setDisruptions] = useState<CampusDisruption[]>(initialDisruptions);
  const [currentLang, setCurrentLang] = useState<LanguageCode>("en");
  // Mobile nav drawer open/close state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // User GPS location state
  const [userLocation, setUserLocation] = useState<[number, number] | null>([23.075670, 76.854422]);

  // Request user GPS position automatically on load
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
        },
        (error) => {
          console.warn("Initial geolocation error, using campus center default:", error);
          setUserLocation([23.075670, 76.854422]);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Apply dark mode class to html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Active blocked node IDs for A* path avoidance
  const blockedNodeIds = disruptions
    .filter((d) => d.active)
    .flatMap((d) => d.affectedNodeIds);

  // Recalculate route when start, destination, userLocation, transportMode, or disruptions change
  useEffect(() => {
    if (startId && endId) {
      const shortestPath = findShortestPath(startId, endId, userLocation, transportMode, blockedNodeIds);
      setRoute(shortestPath);
    } else {
      setRoute(null);
    }
  }, [startId, endId, userLocation, transportMode, disruptions]);

  const handleStartChange = (id: string) => {
    setStartId(id);
    setSelectedBuilding(null);
  };

  const handleEndChange = (id: string) => {
    setEndId(id);
    setSelectedBuilding(null);
  };

  const handleSwap = () => {
    const tempStart = startId;
    const tempEnd = endId;
    setStartId(tempEnd);
    setEndId(tempStart);
    setSelectedBuilding(null);
  };

  const handleSelectBuildingOnMap = (node: CampusNode) => {
    setSelectedBuilding(node);
  };

  // Instant Building Click: Sets destination to clicked building and start to My Location!
  const handleMarkerClick = (node: CampusNode) => {
    setSelectedBuilding(node);
    setEndId(node.id);
    setStartId("MY_LOCATION");
    // Auto-open nav drawer on mobile when a building is tapped
    setMobileNavOpen(true);
  };

  const handleLocationFound = (coords: [number, number], _isMock: boolean) => {
    setUserLocation(coords);
    if (startId === "MY_LOCATION" || endId === "MY_LOCATION") {
      const path = findShortestPath(startId, endId, coords, transportMode, blockedNodeIds);
      setRoute(path);
    }
  };

  const handleClearRoute = () => {
    setEndId("");
    setRoute(null);
  };

  const handleToggleDisruption = (id: string) => {
    setDisruptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  const handleAddDisruption = (newItem: CampusDisruption) => {
    setDisruptions((prev) => [newItem, ...prev]);
  };

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-slate-900">
      {/* ── Fullscreen Map Background ── */}
      <div className="absolute inset-0 z-0">
        <CampusMap
          startId={startId}
          endId={endId}
          selectedBuilding={selectedBuilding}
          route={route}
          onMarkerClick={handleMarkerClick}
          onView3D={(node) => setViewerBuilding(node)}
          onOpenIndoorNav={(bId) => setIndoorBuilding(bId)}
          isDarkMode={isDarkMode}
          userLocation={userLocation}
          onLocationFound={handleLocationFound}
          disruptions={disruptions}
        />
      </div>

      {/* ── Dynamic Island ETA bar ── */}
      <DynamicIsland route={route} transportMode={transportMode} />

      {/* ══════════════════════════════════
          TOP NAVIGATION BAR
          ══════════════════════════════════ */}
      <div className="absolute top-0 left-0 right-0 z-30 p-2 sm:p-4">
        <div className="glass-panel px-2 sm:px-4 py-1.5 sm:py-2 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-300/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl flex items-center justify-between gap-1.5 sm:gap-4">

          {/* Left: Language Selector */}
          <div className="flex items-center shrink-0">
            <LanguagePicker
              currentLang={currentLang}
              onLanguageChange={setCurrentLang}
            />
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 min-w-0 flex justify-center">
            <GlobalSearchBar
              onSelectBuilding={(building) => setSelectedBuilding(building)}
              onRouteToBuilding={(building) => {
                setEndId(building.id);
                setStartId("MY_LOCATION");
                setSelectedBuilding(building);
                setMobileNavOpen(true);
              }}
              onView3D={(building) => setViewerBuilding(building)}
            />
          </div>

          {/* Right: Disruptions, Weather & Theme Toggle */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <DisruptionsPanel
              disruptions={disruptions}
              onToggleDisruption={handleToggleDisruption}
              onSelectDestination={(buildingId) => {
                setEndId(buildingId);
                setStartId("MY_LOCATION");
              }}
              onAddDisruption={handleAddDisruption}
            />
            <WeatherWidget />
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-sm"
              style={{ minWidth: 36, minHeight: 36 }}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════
          DESKTOP: Floating NavigationCard (bottom-left)
          Shown only on sm (640px) and above
          ══════════════════════════════════ */}
      <div className="hidden sm:flex absolute bottom-6 left-6 z-10 items-end pointer-events-none">
        <div className="pointer-events-auto" style={{ maxHeight: "calc(100vh - 120px)", overflow: "hidden" }}>
          <NavigationCard
            startId={startId}
            endId={endId}
            onStartChange={handleStartChange}
            onEndChange={handleEndChange}
            route={route}
            onSwap={handleSwap}
            onSelectBuildingOnMap={handleSelectBuildingOnMap}
            onView3D={(node) => setViewerBuilding(node)}
            onOpenIndoorNav={(bId) => setIndoorBuilding(bId)}
            transportMode={transportMode}
            onTransportModeChange={setTransportMode}
            onClearRoute={handleClearRoute}
            currentLang={currentLang}
          />
        </div>
      </div>

      {/* ══════════════════════════════════
          MOBILE: Floating Action Button (Navigate)
          Shown below sm breakpoint only
          ══════════════════════════════════ */}
      <div className="sm:hidden absolute bottom-6 left-4 z-20 pointer-events-auto">
        <button
          onClick={() => setMobileNavOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-[#8FA28A] text-white rounded-2xl shadow-2xl shadow-[#8FA28A]/40 active:scale-95 transition-all border-2 border-white/20 backdrop-blur-xl"
          title="Open Navigation"
        >
          <NavIcon className="w-5 h-5 fill-current" />
          <span className="font-extrabold text-sm tracking-tight">Navigate</span>
          {route && (
            <span className="bg-white/20 text-white text-xs font-black px-2 py-0.5 rounded-full">
              {route.estimatedTime}m
            </span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════
          MOBILE: Bottom Sheet Nav Drawer
          ══════════════════════════════════ */}
      {mobileNavOpen && (
        <div className="sm:hidden fixed inset-0 z-40 flex flex-col justify-end pointer-events-auto">
          {/* Semi-transparent backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          {/* Animated drawer panel */}
          <div
            className="relative z-10 w-full flex flex-col"
            style={{ maxHeight: "88vh", animation: "slideUp 0.3s cubic-bezier(0.4,0,0.2,1) forwards" }}
          >
            {/* Drag handle — tap to dismiss */}
            <div
              className="flex justify-center items-center pt-2.5 pb-1.5 cursor-pointer"
              onClick={() => setMobileNavOpen(false)}
            >
              <div className="drawer-handle" />
            </div>
            {/* NavigationCard inside drawer */}
            <div className="flex-1 overflow-hidden px-3 pb-3 safe-bottom">
              <NavigationCard
                startId={startId}
                endId={endId}
                onStartChange={handleStartChange}
                onEndChange={handleEndChange}
                route={route}
                onSwap={handleSwap}
                onSelectBuildingOnMap={(node) => {
                  handleSelectBuildingOnMap(node);
                  setMobileNavOpen(false);
                }}
                onView3D={(node) => {
                  setViewerBuilding(node);
                  setMobileNavOpen(false);
                }}
                onOpenIndoorNav={(bId) => {
                  setIndoorBuilding(bId);
                  setMobileNavOpen(false);
                }}
                transportMode={transportMode}
                onTransportModeChange={setTransportMode}
                onClearRoute={() => {
                  handleClearRoute();
                  setMobileNavOpen(false);
                }}
                currentLang={currentLang}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 3D Model Viewer Modal ── */}
      {viewerBuilding && (
        <Building3DViewer
          building={viewerBuilding}
          onClose={() => setViewerBuilding(null)}
          onOpenIndoorNav={(bId) => setIndoorBuilding(bId)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* ── Indoor Navigation Modal (AB1 & AB2 Floor Map) ── */}
      {indoorBuilding && (
        <IndoorNavigationModal
          initialBuildingId={indoorBuilding}
          onClose={() => setIndoorBuilding(null)}
        />
      )}

      {/* ── Floating AI Chat Assistant Widget (Bottom Right) ── */}
      <ChatAssistant
        onRouteToBuilding={(building) => {
          setEndId(building.id);
          setStartId("MY_LOCATION");
          setSelectedBuilding(building);
        }}
        onSelectBuilding={(building) => setSelectedBuilding(building)}
        onView3D={(building) => setViewerBuilding(building)}
        onOpenIndoorNav={(bId) => setIndoorBuilding(bId)}
        disruptions={disruptions}
      />
    </div>
  );
}

export default App;
