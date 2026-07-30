import { useState, useEffect } from "react";
import { CampusMap } from "./components/CampusMap";
import { NavigationCard } from "./components/NavigationCard";
import { findShortestPath } from "./utils/pathfinder";
import type { PathResult } from "./utils/pathfinder";
import type { CampusNode } from "./data/campusData";
import { Sun, Moon } from "lucide-react";
import { WeatherWidget } from "./components/WeatherWidget";

function App() {
  const [startId, setStartId] = useState<string>("AB1"); // Default start at Academic Block 1
  const [endId, setEndId] = useState<string>("");
  const [selectedBuilding, setSelectedBuilding] = useState<CampusNode | null>(null);
  const [route, setRoute] = useState<PathResult | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

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

  // Recalculate route when start or destination changes
  useEffect(() => {
    if (startId && endId) {
      const shortestPath = findShortestPath(startId, endId);
      setRoute(shortestPath);
    } else {
      setRoute(null);
    }
  }, [startId, endId]);

  const handleStartChange = (id: string) => {
    setStartId(id);
    setSelectedBuilding(null); // Clear selected temporary state
  };

  const handleEndChange = (id: string) => {
    setEndId(id);
    setSelectedBuilding(null); // Clear selected temporary state
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

  const handleMarkerClick = (node: CampusNode) => {
    setSelectedBuilding(node);
    // Proactively guide the user: if no start is set, set it. If start is set but no end is set, set end.
    if (!startId) {
      setStartId(node.id);
    } else if (!endId && node.id !== startId) {
      setEndId(node.id);
    }
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
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Floating UI Elements Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 sm:p-6">
        {/* Top bar (with weather and dark mode switch) */}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
