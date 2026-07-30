import React, { useState } from "react";
import { 
  Navigation, 
  ArrowRightLeft, 
  Clock, 
  Compass, 
  Search, 
  Info
} from "lucide-react";
import { campusNodes } from "../data/campusData";
import type { CampusNode } from "../data/campusData";
import type { PathResult } from "../utils/pathfinder";
import { getBuildingCategoryInfo } from "../utils/buildingIcons";

interface NavigationCardProps {
  startId: string;
  endId: string;
  onStartChange: (id: string) => void;
  onEndChange: (id: string) => void;
  route: PathResult | null;
  onSwap: () => void;
  onSelectBuildingOnMap: (node: CampusNode) => void;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({
  startId,
  endId,
  onStartChange,
  onEndChange,
  route,
  onSwap,
  onSelectBuildingOnMap
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"route" | "directory">("route");

  const buildings = campusNodes.filter((node) => node.isBuilding);

  const filteredBuildings = buildings.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="glass-panel w-full sm:w-[380px] rounded-3xl shadow-2xl p-5 border border-white/20 text-slate-800 dark:text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/50 dark:border-slate-800/40">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 text-white p-2 rounded-xl shadow-md shadow-blue-500/20">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">Antigravity</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">Campus GPS • Vector Pins</p>
          </div>
        </div>
        <div className="flex bg-slate-200/60 dark:bg-slate-800/50 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab("route")}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === "route"
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Route
          </button>
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === "directory"
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Directory
          </button>
        </div>
      </div>

      {activeTab === "route" ? (
        <div className="flex flex-col gap-4 overflow-y-auto hide-scrollbar">
          {/* Routing Selectors */}
          <div className="relative flex flex-col gap-2 bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/30">
            {/* Start point */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  A
                </div>
                <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-700"></div>
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Start Location</label>
                <select
                  value={startId}
                  onChange={(e) => onStartChange(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 font-medium text-sm focus:outline-none focus:ring-0 p-0 cursor-pointer"
                >
                  <option value="" disabled className="dark:bg-slate-800">Select starting building</option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id} className="dark:bg-slate-800">
                      {b.name} ({b.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <button
              onClick={onSwap}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-600 transition-all hover:scale-105 active:scale-95"
              title="Swap Locations"
            >
              <ArrowRightLeft className="w-4 h-4 text-blue-500 rotate-90 sm:rotate-0" />
            </button>

            {/* End point */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-500/10 border border-rose-500 flex items-center justify-center text-rose-600 dark:text-rose-400 text-xs font-bold">
                B
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Destination</label>
                <select
                  value={endId}
                  onChange={(e) => onEndChange(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 font-medium text-sm focus:outline-none focus:ring-0 p-0 cursor-pointer"
                >
                  <option value="" disabled className="dark:bg-slate-800">Select destination building</option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id} className="dark:bg-slate-800">
                      {b.name} ({b.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Route Summary */}
          {route ? (
            <div className="flex flex-col gap-3 animate-fade-in">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/20 rounded-2xl p-3 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 mb-0.5">
                    <Navigation className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Distance</span>
                  </div>
                  <span className="text-xl font-extrabold tracking-tight">
                    {route.distance} <span className="text-xs font-medium text-slate-500">meters</span>
                  </span>
                </div>

                <div className="bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-3 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-0.5">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Walk Time</span>
                  </div>
                  <span className="text-xl font-extrabold tracking-tight">
                    {route.estimatedTime} <span className="text-xs font-medium text-slate-500">mins</span>
                  </span>
                </div>
              </div>

              {/* Waypoints List */}
              <div className="bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/30">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Route Details</span>
                <div className="flex flex-col gap-2 relative pl-4 border-l border-slate-200 dark:border-slate-800">
                  {route.path.map((node, idx) => {
                    const isBuilding = node.isBuilding;
                    const isStart = idx === 0;
                    const isEnd = idx === route.path.length - 1;
                    const catInfo = getBuildingCategoryInfo(node);
                    const CategoryIcon = catInfo.IconComponent;

                    return (
                      <div key={idx} className="relative flex items-start gap-2">
                        {/* Custom dot indicator */}
                        <div className={`absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full border ${
                          isStart ? "bg-emerald-500 border-emerald-500 scale-125" :
                          isEnd ? "bg-rose-500 border-rose-500 scale-125" :
                          "bg-blue-500 border-white dark:border-slate-900"
                        }`} />
                        
                        <div className="flex items-center gap-1.5">
                          {isBuilding && <CategoryIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                          <span className={`text-xs ${isBuilding ? "font-bold text-slate-800 dark:text-slate-100" : "font-medium text-slate-500 dark:text-slate-400"}`}>
                            {node.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/50 px-4">
              <Compass className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2 stroke-[1.5]" />
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ready for Pathfinding</h3>
              <p className="text-[11px] text-slate-400 max-w-[220px]">
                Select a starting location and destination to compute the shortest walking path.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Search bar */}
          <div className="relative mb-3 flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search buildings..."
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
                    onClick={() => onSelectBuildingOnMap(b)}
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
                    <div className="flex gap-2 mt-2 pl-7 text-[9px] font-bold text-blue-500">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartChange(b.id);
                        }}
                        className="hover:underline hover:text-blue-600"
                      >
                        Set Start
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEndChange(b.id);
                        }}
                        className="hover:underline hover:text-blue-600"
                      >
                        Set Destination
                      </button>
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
          Click buildings on the map to interact
        </span>
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
          AGY 2.0
        </span>
      </div>
    </div>
  );
};
