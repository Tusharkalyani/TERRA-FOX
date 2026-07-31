import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { buildings } from "../data/campusData";
import type { CampusNode } from "../data/campusData";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  onSelect: (node: CampusNode) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelect }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filtered = query.trim() === "" 
    ? []
    : buildings.filter(b => b.name.toLowerCase().includes(query.toLowerCase()) || b.id.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={wrapperRef} className="relative z-50">
      <div className="flex items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 shadow-lg transition-all focus-within:ring-2 focus-within:ring-blue-500 w-48 sm:w-64">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input
          type="text"
          className="bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 w-full placeholder-slate-400"
          placeholder={t('nav.search_block')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto hide-scrollbar">
          {filtered.map(b => (
            <button
              key={b.id}
              onClick={() => {
                onSelect(b);
                setIsOpen(false);
                setQuery("");
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{b.name}</div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400">{b.id}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
