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
    <div className="absolute bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-500 w-[calc(100vw-100px)] sm:w-auto max-w-[90vw]">
      <div
        className={`dynamic-island-bounce flex items-center gap-2.5 sm:gap-3.5 bg-slate-950/90 dark:bg-slate-900/90 backdrop-blur-xl text-white border border-white/15 shadow-2xl px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full select-none justify-center sm:justify-start ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
            : "translate-y-24 opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <div className="bg-red-500 p-1.5 sm:p-2 rounded-full text-white shadow-md shadow-red-500/40 animate-pulse shrink-0">
          <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current rotate-45" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 font-extrabold text-xs tracking-tight min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5 text-[#C8A96B] font-black text-xs sm:text-sm shrink-0">
            <span>{getTransportEmoji(transportMode)}</span>
            <span>{route?.estimatedTime || 0} min</span>
            <span className="text-slate-300 font-bold text-xs hidden sm:inline">({route?.distance || 0}m)</span>
          </div>

          {currentInstruction && (
            <>
              <span className="text-slate-500 shrink-0">|</span>
              <div className="flex items-center gap-1 sm:gap-1.5 text-white font-extrabold text-xs min-w-0">
                <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C7D3C0] shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[320px]">{currentInstruction}</span>
              </div>
            </>
          )}
        </div>

        <div className="hidden sm:flex items-center text-[10px] font-bold text-[#C8A96B] bg-[#C8A96B]/15 px-2 py-0.5 rounded-full border border-[#C8A96B]/30 shrink-0">
          LIVE GPS
        </div>
      </div>
    </div>
  );
};

