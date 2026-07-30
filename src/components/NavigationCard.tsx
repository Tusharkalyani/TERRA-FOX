import React, { useState } from "react";
import { 
  Navigation, 
  ArrowRightLeft, 
  Clock, 
  Compass, 
  Search, 
  Info,
  Footprints,
  Bike,
  Zap,
  CornerUpRight,
  CornerUpLeft,
  MoveUp,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { buildings } from "../data/campusData";
import type { CampusNode } from "../data/campusData";
import type { PathResult, TransportMode, NavigationStep } from "../utils/pathfinder";
import { getBuildingCategoryInfo } from "../utils/buildingIcons";

interface NavigationCardProps {
  startId: string;
  endId: string;
  onStartChange: (id: string) => void;
  onEndChange: (id: string) => void;
  route: PathResult | null;
  onSwap: () => void;
  onSelectBuildingOnMap: (node: CampusNode) => void;
  onView3D: (node: CampusNode) => void;
  transportMode: TransportMode;
  onTransportModeChange: (mode: TransportMode) => void;
  onClearRoute: () => void;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({
  startId,
  endId,
  onStartChange,
  onEndChange,
  route,
  onSwap,
  onSelectBuildingOnMap,
  onView3D,
  transportMode,
  onTransportModeChange,
  onClearRoute
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"route" | "directory">("route");
  const [showAllSteps, setShowAllSteps] = useState(false);

  const filteredBuildings = buildings.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStepIcon = (step: NavigationStep) => {
    switch (step.type) {
      case "start":
        return <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case "turn-right":
        return <CornerUpRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case "turn-left":
        return <CornerUpLeft className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case "stairs":
        return <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case "arrive":
        return <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
      default:
        return <MoveUp className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    }
  };

  return (
    <div className="glass-panel w-full sm:w-[390px] rounded-3xl shadow-2xl p-5 border border-white/20 text-slate-800 dark:text-slate-100 flex flex-col max-h-[85vh] overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/50 dark:border-slate-800/40">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white p-2 rounded-xl shadow-md shadow-blue-500/20">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg leading-tight tracking-tight flex items-center gap-1.5">
              Antigravity GPS
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase">Instant Destination Routing</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-200/60 dark:bg-slate-800/50 p-0.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab("route")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "route"
                ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Route
          </button>
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "directory"
                ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Directory
          </button>
        </div>
      </div>

      {activeTab === "route" ? (
        <div className="flex flex-col gap-4 overflow-y-auto hide-scrollbar flex-1 pr-0.5">
          {/* Routing Selectors */}
          <div className="relative flex flex-col gap-2.5 bg-slate-50/70 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/50">
            {/* Start point */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-black shadow-sm">
                  A
                </div>
                <div className="w-0.5 h-7 bg-slate-300 dark:bg-slate-700"></div>
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Start Point</label>
                <select
                  value={startId}
                  onChange={(e) => onStartChange(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:ring-0 p-0 cursor-pointer"
                >
                  <option value="MY_LOCATION" className="dark:bg-slate-800 font-bold text-blue-500">
                    📍 My Location (Current GPS)
                  </option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id} className="dark:bg-slate-800">
                      {b.name} ({b.id})
                    </option>
                  ))}
                </select>
                {startId === "MY_LOCATION" && (
                  <p className="text-[9px] font-semibold text-blue-500 dark:text-blue-400 mt-0.5 animate-pulse">
                    📍 Drag the blue pin on map to adjust exact spot
                  </p>
                )}
              </div>
            </div>


            {/* Swap Button */}
            <button
              onClick={onSwap}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg hover:border-blue-400 transition-all hover:scale-110 active:scale-90 cursor-pointer z-10"
              title="Swap Start & Destination"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500 rotate-90 sm:rotate-0" />
            </button>

            {/* End point */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-500/15 border-2 border-rose-500 flex items-center justify-center text-rose-600 dark:text-rose-400 text-xs font-black shadow-sm">
                B
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Destination</label>
                <select
                  value={endId}
                  onChange={(e) => onEndChange(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:ring-0 p-0 cursor-pointer"
                >
                  <option value="" disabled className="dark:bg-slate-800">Select destination building...</option>
                  <option value="MY_LOCATION" className="dark:bg-slate-800 font-bold text-blue-500">
                    📍 My Location (Current GPS)
                  </option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id} className="dark:bg-slate-800">
                      {b.name} ({b.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Transport Mode Selector Pills */}
          <div className="grid grid-cols-3 gap-2 bg-slate-100/60 dark:bg-slate-900/40 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/40">
            <button
              onClick={() => onTransportModeChange("walk")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                transportMode === "walk"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Walk</span>
            </button>
            <button
              onClick={() => onTransportModeChange("run")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                transportMode === "run"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Run</span>
            </button>
            <button
              onClick={() => onTransportModeChange("cycle")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                transportMode === "cycle"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Cycle</span>
            </button>
          </div>

          {/* Route Info & Turn-by-Turn Steps */}
          {route ? (
            <div className="flex flex-col gap-3 animate-fade-in">
              {/* Distance & Time Header */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-3.5 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 mb-0.5">
                    <Navigation className="w-4 h-4" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Distance</span>
                  </div>
                  <span className="text-xl font-black tracking-tight">
                    {route.distance} <span className="text-xs font-bold text-slate-500">meters</span>
                  </span>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-3.5 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-0.5">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Est. Time</span>
                  </div>
                  <span className="text-xl font-black tracking-tight">
                    {route.estimatedTime} <span className="text-xs font-bold text-slate-500">mins</span>
                  </span>
                </div>
              </div>

              {/* Turn-by-Turn Steps Accordion */}
              <div className="bg-slate-50/60 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/50">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Turn-by-Turn Directions</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAllSteps(!showAllSteps)}
                      className="text-[10px] text-blue-500 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      {showAllSteps ? "Collapse" : `View all ${route.steps.length} steps`}
                      {showAllSteps ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={onClearRoute}
                      className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Clear Route"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Steps List */}
                <div className="flex flex-col gap-2.5 relative pl-2">
                  {(showAllSteps ? route.steps : route.steps.slice(0, 3)).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <div className="mt-0.5 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800 shrink-0">
                        {getStepIcon(step)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                          {step.instruction}
                        </p>
                        {step.distance > 0 && (
                          <span className="text-[10px] font-bold text-slate-400">
                            {step.distance} meters
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/50 px-4">
              <Compass className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2 stroke-[1.5]" />
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Click Any Building to Navigate</h3>
              <p className="text-[11px] text-slate-400 max-w-[240px]">
                Click or hover over any building on the map or directory below to instantly set it as destination and route from <strong>My Location</strong>.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Directory Tab */
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Search bar */}
          <div className="relative mb-3 flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search buildings or codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900/60 pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white"
            />
          </div>

          {/* Directory list */}
          <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-2 pr-1">
            {filteredBuildings.length > 0 ? (
              filteredBuildings.map((b) => {
                const category = getBuildingCategoryInfo(b);
                const IconComp = category.IconComponent;

                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      onEndChange(b.id);
                      onSelectBuildingOnMap(b);
                    }}
                    className="group flex flex-col bg-slate-50/50 dark:bg-slate-900/25 border border-slate-100 dark:border-slate-800/30 hover:bg-blue-500/5 dark:hover:bg-blue-500/5 hover:border-blue-500/20 dark:hover:border-blue-500/20 rounded-2xl p-3 cursor-pointer transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <div className={`p-1.5 rounded-xl border ${category.badgeBg} flex items-center justify-center shrink-0`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        {b.name}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-md">
                        {b.id}
                      </span>
                    </div>
                    {b.description && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed pl-7">
                        {b.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2 pl-7 text-[9px] font-bold">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEndChange(b.id);
                          onSelectBuildingOnMap(b);
                        }}
                        className="text-blue-500 hover:text-blue-600 flex items-center gap-1 group-hover:underline"
                      >
                        <Navigation className="w-3 h-3" />
                        Route Here from My Location
                      </button>
                      {b.id === "AB1" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView3D(b);
                          }}
                          className="text-indigo-500 hover:text-indigo-600 flex items-center gap-1 hover:underline"
                        >
                          View 3D
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No buildings match your search.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/40 text-[9px] text-slate-400 font-semibold flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3" />
          Click any building marker to set destination
        </span>
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
          AGY 2.0
        </span>
      </div>
    </div>
  );
};
