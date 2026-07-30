import { useState, useEffect } from "react";
import { CampusMap } from "./components/CampusMap";
import { NavigationCard } from "./components/NavigationCard";
import { WeatherWidget } from "./components/WeatherWidget";
import { DynamicIsland } from "./components/DynamicIsland";
import { Building3DViewer } from "./components/Building3DViewer";
import { findShortestPath } from "./utils/pathfinder";
import type { PathResult, TransportMode } from "./utils/pathfinder";
import type { CampusNode } from "./data/campusData";
import { Sun, Moon } from "lucide-react";

function App() {
  const [startId, setStartId] = useState<string>("MY_LOCATION");
  const [endId, setEndId] = useState<string>("AB1"); // Default destination to Academic Block 1
  const [selectedBuilding, setSelectedBuilding] = useState<CampusNode | null>(null);
  const [viewerBuilding, setViewerBuilding] = useState<CampusNode | null>(null);
  const [route, setRoute] = useState<PathResult | null>(null);
  const [transportMode, setTransportMode] = useState<TransportMode>("walk");

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

  // Recalculate route when start, destination, userLocation, or transportMode changes
  useEffect(() => {
    if (startId && endId) {
      const shortestPath = findShortestPath(startId, endId, userLocation, transportMode);
      setRoute(shortestPath);
    } else {
      setRoute(null);
    }
  }, [startId, endId, userLocation, transportMode]);

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
      const path = findShortestPath(startId, endId, coords, transportMode);
      setRoute(path);
    }
  };

  const handleClearRoute = () => {
    setEndId("");
    setRoute(null);
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
        />
      </div>

      {/* Dynamic Island ETA & Turn-by-Turn header */}
      <DynamicIsland route={route} transportMode={transportMode} />

      {/* Floating UI Elements Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 sm:p-6">
        {/* Top bar (weather & dark mode switch) */}
        <div className="w-full flex justify-end items-center gap-3 pointer-events-auto">
          <WeatherWidget />
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="glass-panel p-3 rounded-2xl shadow-lg border border-white/20 text-slate-800 dark:text-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
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
    </div>
  );
}

export default App;
