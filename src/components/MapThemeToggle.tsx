import React from "react";
import { Sun, Moon, Layers } from "lucide-react";

export type MapTheme = "light" | "dark" | "contrast";

interface MapThemeToggleProps {
  currentTheme: MapTheme;
  onThemeChange: (theme: MapTheme) => void;
}

export const MapThemeToggle: React.FC<MapThemeToggleProps> = ({
  currentTheme,
  onThemeChange
}) => {
  return (
    <div className="glass-panel p-1 rounded-2xl shadow-lg border border-white/20 flex items-center gap-1 select-none">
      <button
        onClick={() => onThemeChange("light")}
        className={`p-2 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
          currentTheme === "light"
            ? "bg-white dark:bg-slate-700 shadow-md text-blue-500"
            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        }`}
        title="Light Mode (Minimalist)"
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => onThemeChange("dark")}
        className={`p-2 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
          currentTheme === "dark"
            ? "bg-white dark:bg-slate-700 shadow-md text-blue-400"
            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        }`}
        title="Dark Mode (Night-view)"
      >
        <Moon className="w-4 h-4" />
      </button>

      <button
        onClick={() => onThemeChange("contrast")}
        className={`p-2 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
          currentTheme === "contrast"
            ? "bg-white dark:bg-slate-700 shadow-md text-blue-500"
            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        }`}
        title="High Contrast (OpenStreetMap)"
      >
        <Layers className="w-4 h-4" />
      </button>
    </div>
  );
};
