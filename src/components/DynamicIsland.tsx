import React from "react";
import { Clock, Navigation } from "lucide-react";
import type { PathResult } from "../utils/pathfinder";

interface DynamicIslandProps {
  route: PathResult | null;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({ route }) => {
  const isVisible = route !== null && route.distance > 0;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div
        className={`dynamic-island-bounce flex items-center gap-3 bg-slate-950/95 dark:bg-slate-900/95 text-white border border-white/10 shadow-2xl px-5 py-2.5 rounded-full select-none ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
            : "-translate-y-24 opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <div className="bg-blue-500 p-1.5 rounded-full text-white animate-pulse">
          <Navigation className="w-3.5 h-3.5 fill-current rotate-45" />
        </div>
        
        <div className="flex items-center gap-2 font-semibold text-sm tracking-tight pr-1">
          <div className="flex items-center gap-1 text-emerald-400">
            <span>🚶</span>
            <span>{route?.estimatedTime || 0} min</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-300 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>({route?.distance || 0}m)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
