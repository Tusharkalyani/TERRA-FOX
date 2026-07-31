import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { supportedLanguages } from "../utils/translations";
import type { LanguageCode } from "../utils/translations";

interface LanguagePickerProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  currentLang,
  onLanguageChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = supportedLanguages.find((l) => l.code === currentLang) || supportedLanguages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative z-[99999] pointer-events-auto">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel px-2.5 py-1.5 rounded-2xl shadow-lg border border-slate-300/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer bg-white/90 dark:bg-slate-900/90"
        title="Select Language / भाषा चुनें"
      >
        <span className="text-sm">{selectedOption.flag}</span>
        <span className="text-xs font-extrabold tracking-tight hidden sm:inline">
          {selectedOption.nativeName}
        </span>
        <Globe className="w-3.5 h-3.5 text-rose-400 sm:hidden" />
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Language Selector Dropdown: Positioned left-0 to open towards the right and stay above all panels */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-52 bg-slate-900/98 text-white rounded-2xl shadow-2xl shadow-slate-950 border border-slate-700/80 overflow-hidden z-[99999] backdrop-blur-2xl animate-fade-in p-1.5 flex flex-col gap-1">
          <div className="px-2.5 py-1.5 text-[9px] font-black text-rose-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
            <span>Select Language / भाषा चुनें</span>
            <Globe className="w-3.5 h-3.5 text-rose-400" />
          </div>

          <div className="flex flex-col gap-0.5 max-h-[260px] overflow-y-auto custom-scrollbar">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === currentLang;

              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "bg-rose-500 text-white font-extrabold shadow-md shadow-rose-900/40"
                      : "hover:bg-slate-800/80 text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <div className="flex flex-col text-left">
                      <span className="leading-tight font-bold">{lang.nativeName}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{lang.name}</span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
