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

import { getTranslation } from "../utils/translations";
import type { LanguageCode } from "../utils/translations";

interface NavigationCardProps {
  startId: string;
  endId: string;
  onStartChange: (id: string) => void;
  onEndChange: (id: string) => void;
  route: PathResult | null;
  onSwap: () => void;
  onSelectBuildingOnMap: (node: CampusNode) => void;
  onView3D: (node: CampusNode) => void;
  onOpenIndoorNav?: (buildingId: "AB1" | "AB2") => void;
  transportMode: TransportMode;
  onTransportModeChange: (mode: TransportMode) => void;
  onClearRoute: () => void;
  currentLang?: LanguageCode;
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
  onOpenIndoorNav,
  transportMode,
  onTransportModeChange,
  onClearRoute,
  currentLang = "en"
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
        return <MapPin className="w-3.5 h-3.5 text-[#8FA28A] shrink-0" />;
      case "turn-right":
        return <CornerUpRight className="w-3.5 h-3.5 text-[#8FA28A] shrink-0" />;
      case "turn-left":
        return <CornerUpLeft className="w-3.5 h-3.5 text-[#8FA28A] shrink-0" />;
      case "stairs":
        return <Info className="w-3.5 h-3.5 text-[#C8A96B] shrink-0" />;
      case "arrive":
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A96B] shrink-0" />;
      default:
        return <MoveUp className="w-3.5 h-3.5 text-[#8FA28A] shrink-0" />;
    }
  };

  return (
    <div className="glass-panel w-full sm:w-[390px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 border border-slate-300/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl text-slate-900 dark:text-white flex flex-col max-h-[80vh] sm:max-h-[85vh] overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#8FA28A] text-white p-2 rounded-xl shadow-md shadow-[#8FA28A]/30">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-black text-lg leading-tight tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              {getTranslation(currentLang || "en", "appTitle", "TERRA FOX")} GPS
            </h1>
            <p className="text-[10px] text-[#C8A96B] font-extrabold tracking-wider uppercase">
              {getTranslation(currentLang || "en", "subtitle", "VIT Bhopal Campus GPS")}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700">
          <button
            onClick={() => setActiveTab("route")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-black ${
              activeTab === "route"
                ? "bg-[#8FA28A] text-white shadow-md shadow-[#8FA28A]/30"
                : "text-slate-800 dark:text-slate-200 hover:text-[#8FA28A]"
            }`}
          >
            {getTranslation(currentLang || "en", "routeTab", "Route")}
          </button>
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-black ${
              activeTab === "directory"
                ? "bg-[#8FA28A] text-white shadow-md shadow-[#8FA28A]/30"
                : "text-slate-800 dark:text-slate-200 hover:text-[#8FA28A]"
            }`}
          >
            {getTranslation(currentLang || "en", "directoryTab", "Directory")}
          </button>
        </div>
      </div>

      {activeTab === "route" ? (
        <div className="flex flex-col gap-4 overflow-y-auto hide-scrollbar flex-1 pr-0.5">
          {/* Routing Selectors */}
          <div className="relative flex flex-col gap-3 bg-slate-100/90 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700/80 shadow-sm">
            {/* Start point */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#8FA28A] text-white flex items-center justify-center text-xs font-black shadow-md">
                  A
                </div>
                <div className="w-0.5 h-8 bg-slate-400 dark:bg-slate-600"></div>
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] text-slate-700 dark:text-slate-300 font-black uppercase tracking-wider block mb-1">
                  {getTranslation(currentLang || "en", "startPoint", "START POINT")}
                </label>
                <select
                  value={startId}
                  onChange={(e) => onStartChange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-xs rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#8FA28A] cursor-pointer shadow-sm"
                >
                  <option value="MY_LOCATION" className="dark:bg-slate-900 font-bold text-[#8FA28A] dark:text-[#C7D3C0]">
                    📍 {getTranslation(currentLang || "en", "myLocation", "My Location (Current GPS)")}
                  </option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id} className="dark:bg-slate-900">
                      {b.name} ({b.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <button
              onClick={onSwap}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#8FA28A] text-white border-2 border-white dark:border-slate-800 shadow-lg hover:bg-[#7e9179] hover:scale-110 active:scale-90 transition-all cursor-pointer z-10"
              title="Swap Start & Destination"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 rotate-90 sm:rotate-0" />
            </button>

            {/* End point */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#C8A96B] text-white flex items-center justify-center text-xs font-black shadow-md">
                B
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] text-slate-700 dark:text-slate-300 font-black uppercase tracking-wider block mb-1">
                  {getTranslation(currentLang || "en", "destination", "DESTINATION")}
                </label>
                <select
                  value={endId}
                  onChange={(e) => onEndChange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-xs rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#8FA28A] cursor-pointer shadow-sm"
                >
                  <option value="" disabled className="dark:bg-slate-900">
                    {getTranslation(currentLang || "en", "selectDestination", "Select Destination Building...")}
                  </option>
                  <option value="MY_LOCATION" className="dark:bg-slate-900 font-bold text-[#8FA28A] dark:text-[#C7D3C0]">
                    📍 {getTranslation(currentLang || "en", "myLocation", "My Location (Current GPS)")}
                  </option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id} className="dark:bg-slate-900">
                      {b.name} ({b.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Transport Mode Selector Pills */}
          <div className="grid grid-cols-3 gap-2 bg-slate-200 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => onTransportModeChange("walk")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                transportMode === "walk"
                  ? "bg-[#8FA28A] text-white shadow-md shadow-[#8FA28A]/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>{getTranslation(currentLang || "en", "walk", "Walk")}</span>
            </button>
            <button
              onClick={() => onTransportModeChange("run")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                transportMode === "run"
                  ? "bg-[#8FA28A] text-white shadow-md shadow-[#8FA28A]/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{getTranslation(currentLang || "en", "run", "Run")}</span>
            </button>
            <button
              onClick={() => onTransportModeChange("cycle")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                transportMode === "cycle"
                  ? "bg-[#8FA28A] text-white shadow-md shadow-[#8FA28A]/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>{getTranslation(currentLang || "en", "cycle", "Cycle")}</span>
            </button>
          </div>

          {/* Route Info & Turn-by-Turn Steps */}
          {route ? (
            <div className="flex flex-col gap-3 animate-fade-in">
              {/* Distance & Time Header */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#8FA28A] text-white border-2 border-[#C7D3C0]/50 rounded-2xl p-3.5 flex flex-col justify-center shadow-lg shadow-[#8FA28A]/20">
                  <div className="flex items-center gap-1.5 text-[#F7F4ED] mb-0.5 font-black">
                    <Navigation className="w-4 h-4 text-white" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#F7F4ED]">
                      {getTranslation(currentLang || "en", "distance", "DISTANCE")}
                    </span>
                  </div>
                  <span className="text-2xl font-black tracking-tight text-white">
                    {route.distance} <span className="text-xs font-black text-[#F7F4ED]">{getTranslation(currentLang || "en", "meters", "meters")}</span>
                  </span>
                </div>

                <div className="bg-[#C8A96B] text-white border-2 border-[#F7F4ED]/30 rounded-2xl p-3.5 flex flex-col justify-center shadow-lg shadow-[#C8A96B]/20">
                  <div className="flex items-center gap-1.5 text-[#F7F4ED] mb-0.5 font-black">
                    <Clock className="w-4 h-4 text-white" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#F7F4ED]">
                      {getTranslation(currentLang || "en", "estTime", "EST. TIME")}
                    </span>
                  </div>
                  <span className="text-2xl font-black tracking-tight text-white">
                    {route.estimatedTime} <span className="text-xs font-black text-emerald-100">{getTranslation(currentLang || "en", "mins", "mins")}</span>
                  </span>
                </div>
              </div>


              {/* Turn-by-Turn Steps Accordion */}
              <div className="bg-slate-100 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] text-slate-800 dark:text-slate-200 font-black uppercase tracking-wider">
                    {getTranslation(currentLang || "en", "turnByTurn", "Turn-by-Turn Directions")}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAllSteps(!showAllSteps)}
                      className="text-[10px] text-[#8FA28A] dark:text-[#C7D3C0] font-black hover:text-[#C8A96B] flex items-center gap-0.5 cursor-pointer"
                    >
                      {showAllSteps ? getTranslation(currentLang || "en", "collapse", "Collapse") : `${getTranslation(currentLang || "en", "viewAllSteps", "View all")} (${route.steps.length})`}
                      {showAllSteps ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={onClearRoute}
                      className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-[#C8A96B] transition-colors"
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
                      <div className="mt-0.5 p-1 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-300 dark:border-slate-700">
                        {getStepIcon(step)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-slate-900 dark:text-white leading-snug">
                          {step.instruction}
                        </p>
                        {step.distance > 0 && (
                          <span className="text-[10px] font-black text-[#C8A96B] dark:text-[#C8A96B]">
                            {step.distance} {getTranslation(currentLang || "en", "meters", "meters")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-100 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 px-4">
              <Compass className="w-10 h-10 text-[#8FA28A] mb-2 stroke-[1.5] animate-pulse" />
              <h3 className="text-xs font-black text-slate-900 dark:text-white mb-1">Click Any Building to Navigate</h3>
              <p className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400 max-w-[240px]">
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
                        className="text-[#8FA28A] hover:text-[#C8A96B] flex items-center gap-1 group-hover:underline font-extrabold"
                      >
                        <Navigation className="w-3 h-3" />
                        Route Here from My Location
                      </button>
                      {(b.id === "AB1" || b.id === "AB2") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenIndoorNav) onOpenIndoorNav(b.id as "AB1" | "AB2");
                          }}
                          className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-extrabold"
                        >
                          <Compass className="w-3 h-3" />
                          Indoor Map
                        </button>
                      )}
                      {b.id === "AB1" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView3D(b);
                          }}
                          className="text-[#C8A96B] hover:text-[#8FA28A] flex items-center gap-1 hover:underline font-extrabold"
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
        <span className="text-[10px] font-bold text-[#8FA28A] uppercase tracking-widest">
          AGY 2.0
        </span>
      </div>
    </div>
  );
};
