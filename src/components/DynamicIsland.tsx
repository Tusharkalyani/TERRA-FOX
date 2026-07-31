import React from "react";
import { Navigation, Compass } from "lucide-react";
import type { PathResult, TransportMode } from "../utils/pathfinder";

interface DynamicIslandProps {
  route: PathResult | null;
  transportMode: TransportMode;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({ route, transportMode }) => {
  const isVisible = route !== null && route.distance > 0;

  // Next step instruction
  const firstStep = route?.steps && route.steps.length > 0 ? route.steps[0] : null;
  const secondStep = route?.steps && route.steps.length > 1 ? route.steps[1] : null;
  const currentInstruction = secondStep ? secondStep.instruction : firstStep?.instruction || "";

  const getTransportEmoji = (mode: TransportMode) => {
    if (mode === "run") return "🏃";
    if (mode === "cycle") return "🚴";
    return "🚶";
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-500">
      <div
        className={`dynamic-island-bounce flex items-center gap-3.5 bg-slate-950/90 dark:bg-slate-900/90 backdrop-blur-xl text-white border border-white/15 shadow-2xl px-5 py-2.5 rounded-full select-none ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
            : "-translate-y-24 opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <div className="bg-blue-500 p-2 rounded-full text-white shadow-md shadow-blue-500/40 animate-pulse">
          <Navigation className="w-3.5 h-3.5 fill-current rotate-45" />
        </div>
        
        <div className="flex items-center gap-3 font-extrabold text-xs tracking-tight">
          <div className="flex items-center gap-1.5 text-emerald-400 font-black text-sm">
            <span>{getTransportEmoji(transportMode)}</span>
            <span>{route?.estimatedTime || 0} min</span>
            <span className="text-slate-300 font-bold text-xs">({route?.distance || 0}m)</span>
          </div>
          
          {currentInstruction && (
            <>
              <span className="text-slate-500">|</span>
              <div className="flex items-center gap-1.5 text-white font-extrabold text-xs max-w-[220px] sm:max-w-[320px] truncate">
                <Compass className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{currentInstruction}</span>
              </div>
            </>
          )}
        </div>


        <div className="hidden sm:flex items-center text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
          LIVE GPS
        </div>
      </div>
    </div>
  );
};
