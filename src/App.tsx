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
import { findShortestPath } from "./utils/pathfinder";
import type { PathResult, TransportMode } from "./utils/pathfinder";
import type { CampusNode } from "./data/campusData";
import { initialDisruptions } from "./data/disruptionsData";
import type { CampusDisruption } from "./data/disruptionsData";
import type { LanguageCode } from "./utils/translations";
import { Sun, Moon } from "lucide-react";

function App() {
  const [startId, setStartId] = useState<string>("MY_LOCATION");
  const [endId, setEndId] = useState<string>("AB1"); // Default destination to Academic Block 1
  const [selectedBuilding, setSelectedBuilding] = useState<CampusNode | null>(null);
  const [viewerBuilding, setViewerBuilding] = useState<CampusNode | null>(null);
  const [route, setRoute] = useState<PathResult | null>(null);
  const [transportMode, setTransportMode] = useState<TransportMode>("walk");
  const [disruptions, setDisruptions] = useState<CampusDisruption[]>(initialDisruptions);
  const [currentLang, setCurrentLang] = useState<LanguageCode>("en");

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
      {/* Fullscreen Map Background */}
      <div className="absolute inset-0 z-0">
        <CampusMap
          startId={startId}
          endId={endId}
          selectedBuilding={selectedBuilding}
          route={route}
          onMarkerClick={handleMarkerClick}
          onView3D={(node) => setViewerBuilding(node)}
          isDarkMode={isDarkMode}
          userLocation={userLocation}
          onLocationFound={handleLocationFound}
          disruptions={disruptions}
        />
      </div>

      {/* Dynamic Island ETA & Turn-by-Turn header */}
      <DynamicIsland route={route} transportMode={transportMode} />

      {/* Floating UI Elements Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 sm:p-6">
        {/* Unified Top Navigation Bar */}
        <div className="w-full pointer-events-auto">
          <div className="glass-panel px-3 sm:px-4 py-2 rounded-3xl shadow-2xl border border-slate-300/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Left Action Controls (Language Selector) */}
            <div className="flex items-center gap-2 shrink-0">
              <LanguagePicker
                currentLang={currentLang}
                onLanguageChange={setCurrentLang}
              />
            </div>

            {/* Center Section: Enlarged Global Search Bar */}
            <div className="flex-1 flex justify-center max-w-sm sm:max-w-xl md:max-w-2xl mx-1 sm:mx-3">
              <GlobalSearchBar
                onSelectBuilding={(building) => setSelectedBuilding(building)}
                onRouteToBuilding={(building) => {
                  setEndId(building.id);
                  setStartId("MY_LOCATION");
                  setSelectedBuilding(building);
                }}
                onView3D={(building) => setViewerBuilding(building)}
              />
            </div>

            {/* Right Action Controls (Disruptions, Weather & Theme Toggle) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-sm"
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






        {/* Main routing card placement (floating on bottom-left) */}
        <div className="flex justify-start items-end h-full mt-2 sm:mt-0 max-h-[85vh]">
          <div className="pointer-events-auto w-full sm:w-auto">
            <NavigationCard
              startId={startId}
              endId={endId}
              onStartChange={handleStartChange}
              onEndChange={handleEndChange}
              route={route}
              onSwap={handleSwap}
              onSelectBuildingOnMap={handleSelectBuildingOnMap}
              onView3D={(node) => setViewerBuilding(node)}
              transportMode={transportMode}
              onTransportModeChange={setTransportMode}
              onClearRoute={handleClearRoute}
              currentLang={currentLang}
            />

          </div>
        </div>
      </div>

      {/* 3D Model Viewer Modal */}
      {viewerBuilding && (
        <Building3DViewer 
          building={viewerBuilding} 
          onClose={() => setViewerBuilding(null)} 
          isDarkMode={isDarkMode} 
        />
      )}

      {/* Floating AI Chat Assistant Widget (Bottom Right) */}
      <ChatAssistant
        onRouteToBuilding={(building) => {
          setEndId(building.id);
          setStartId("MY_LOCATION");
          setSelectedBuilding(building);
        }}
        onSelectBuilding={(building) => setSelectedBuilding(building)}
        onView3D={(building) => setViewerBuilding(building)}
        disruptions={disruptions}
      />
    </div>
  );
}

export default App;
