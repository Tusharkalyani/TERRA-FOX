import React, { useState, useEffect, useRef } from "react";
import { Search, Navigation, Building2, MapPin, X, CornerDownLeft } from "lucide-react";
import { campusNodes } from "../data/campusData";
import type { CampusNode } from "../data/campusData";
import { getBuildingCategoryInfo } from "../utils/buildingIcons";

interface GlobalSearchBarProps {
  onSelectBuilding: (node: CampusNode) => void;
  onRouteToBuilding: (node: CampusNode) => void;
  onView3D?: (node: CampusNode) => void;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  onSelectBuilding,
  onRouteToBuilding,
  onView3D
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const buildings = campusNodes.filter((node) => node.isBuilding);

  const filtered = query.trim() === "" 
    ? [] 
    : buildings.filter((b) => 
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.id.toLowerCase().includes(query.toLowerCase()) ||
        (b.description && b.description.toLowerCase().includes(query.toLowerCase()))
      );

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      const target = filtered[selectedIndex] || filtered[0];
      if (target) {
        onRouteToBuilding(target);
        setIsOpen(false);
        setQuery("");
      }
    }
  };

  return (
    <div ref={searchRef} className="relative w-full z-50 pointer-events-auto">
      {/* Search Input Bar */}
      <div className="glass-panel px-3.5 py-2 sm:py-2.5 rounded-2xl shadow-xl border border-slate-300/80 dark:border-slate-700/80 flex items-center gap-3 backdrop-blur-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-[#8FA28A]/50 bg-white/90 dark:bg-slate-950/80">
        <div className="pl-1 text-slate-400 dark:text-slate-500 flex items-center shrink-0">
          <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#8FA28A] dark:text-[#C7D3C0]" />
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search campus buildings..."
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDownInInput}
          className="w-full bg-transparent text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none py-0.5"
        />

        {query ? (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-black text-slate-400 bg-slate-200/60 dark:bg-slate-800/80 rounded-lg border border-slate-300/50 dark:border-slate-700/60 mr-0.5 shrink-0">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Auto-complete Dropdown Panel */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 min-w-[280px] sm:min-w-[320px] bg-slate-900/95 text-white rounded-3xl shadow-2xl border border-white/15 overflow-hidden max-h-[380px] overflow-y-auto hide-scrollbar z-50 backdrop-blur-2xl animate-fade-in p-2 flex flex-col gap-1">

          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const category = getBuildingCategoryInfo(item);
              const IconComp = category.IconComponent || Building2;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onRouteToBuilding(item);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-2.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-[#8FA28A] text-white shadow-lg shadow-[#8FA28A]/30"
                      : "hover:bg-slate-800/70 text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-md ${category.defaultPinBg}`}>
                      <IconComp className="w-4 h-4 text-white" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs truncate leading-snug">
                          {item.name}
                        </span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-white/15 text-white/90 border border-white/20 shrink-0">
                          {item.id}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-300/80 truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBuilding(item);
                        setIsOpen(false);
                      }}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Inspect on Map"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </button>

                    {item.id === "AB1" && onView3D && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onView3D(item);
                          setIsOpen(false);
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-bold rounded-xl flex items-center gap-1 border border-white/10"
                        title="3D Model"
                      >
                        3D
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRouteToBuilding(item);
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className="px-2.5 py-1 bg-white text-[#8FA28A] hover:bg-slate-100 font-extrabold text-[10px] rounded-xl flex items-center gap-1 shadow-md transition-all"
                    >
                      <Navigation className="w-3 h-3 fill-current rotate-45" />
                      Route
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-slate-400">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40 stroke-[1.5]" />
              <p className="text-xs font-extrabold text-slate-300">No buildings found matching "{query}"</p>
              <p className="text-[10px] text-slate-400 mt-1">Try searching for AB1, LAB, ARCH, MAYURI, or BH1</p>
            </div>
          )}

          <div className="p-2 border-t border-white/10 flex items-center justify-between text-[9px] font-bold text-slate-400 px-3">
            <span>Press <kbd className="px-1 py-0.5 bg-slate-800 rounded text-white">↑</kbd> <kbd className="px-1 py-0.5 bg-slate-800 rounded text-white">↓</kbd> to navigate</span>
            <span className="flex items-center gap-1 text-blue-400 font-extrabold">
              <CornerDownLeft className="w-3 h-3" /> Enter to Route
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
