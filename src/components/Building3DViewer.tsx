import React, { useState } from "react";
import { X, Layers, MapPin, CheckCircle2, Shield, Flame, Activity } from "lucide-react";
import type { CampusNode } from "../data/campusData";
import { getBuildingCategoryInfo } from "../utils/buildingIcons";

interface Building3DViewerProps {
  building: CampusNode;
  onClose: () => void;
  onOpenIndoorNav?: (buildingId: "AB1" | "AB2") => void;
  isDarkMode?: boolean;
}

export const Building3DViewer: React.FC<Building3DViewerProps> = ({
  building,
  onClose,
  onOpenIndoorNav
}) => {

  const [activeTab, setActiveTab] = useState<"isometric" | "blueprint" | "details">("isometric");
  const category = getBuildingCategoryInfo(building);
  const IconComp = category.IconComponent;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl cursor-pointer transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl h-[85vh] bg-slate-900 text-white rounded-[2.5rem] shadow-2xl border border-white/15 overflow-hidden flex flex-col pointer-events-auto z-10">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${category.badgeBg} flex items-center justify-center shadow-lg`}>
              <IconComp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#8FA28A] bg-[#8FA28A]/15 px-2 py-0.5 rounded-full border border-[#8FA28A]/30">
                  {building.id}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {category.label}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                {building.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(building.id === "AB1" || building.id === "AB2") && (
              <button
                onClick={() => {
                  onClose();
                  if (onOpenIndoorNav) onOpenIndoorNav(building.id as "AB1" | "AB2");
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                🗺️ Indoor Floorplan Nav
              </button>
            )}

            {/* View Mode Switcher */}
            <div className="hidden sm:flex bg-slate-800/80 p-1 rounded-xl text-xs font-semibold border border-white/10">
              <button
                onClick={() => setActiveTab("isometric")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "isometric"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                3D Isometric
              </button>
              <button
                onClick={() => setActiveTab("blueprint")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "blueprint"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Blueprint
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "details"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Facility Specs
              </button>
            </div>

            <button 
              onClick={onClose}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-300 hover:text-white transition-all shadow-lg border border-white/10 cursor-pointer"
              title="Close View"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content View */}
        <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
          
          {activeTab === "isometric" && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Grid Background Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

              {/* Glowing Ambient Aura */}
              <div className="absolute w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none animate-pulse" />

              {/* SVG 3D Isometric Architectural Structure */}
              <svg 
                className="w-full max-w-lg h-72 sm:h-80 drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)]" 
                viewBox="0 0 400 300" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Base Shadow & Pedestal */}
                <ellipse cx="200" cy="240" rx="140" ry="40" fill="#030712" opacity="0.6" />
                <path d="M60 220 L200 270 L340 220 L200 170 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <path d="M60 220 L60 230 L200 280 L340 230 L340 220 L200 270 Z" fill="#0f172a" />

                {/* Main Building Left Facade */}
                <path d="M100 190 L200 230 L200 110 L100 70 Z" fill="url(#leftGradient)" stroke="#3b82f6" strokeWidth="1.5" />

                {/* Main Building Right Facade */}
                <path d="M200 230 L300 190 L300 70 L200 110 Z" fill="url(#rightGradient)" stroke="#2563eb" strokeWidth="1.5" />

                {/* Building Roof */}
                <path d="M100 70 L200 110 L300 70 L200 30 Z" fill="url(#topGradient)" stroke="#60a5fa" strokeWidth="2" />

                {/* Windows & Architectural Detailing (Left Facade) */}
                <path d="M120 100 L180 124 L180 144 L120 120 Z" fill="#60a5fa" opacity="0.8" />
                <path d="M120 135 L180 159 L180 179 L120 155 Z" fill="#60a5fa" opacity="0.8" />
                <path d="M120 170 L180 194 L180 214 L120 190 Z" fill="#38bdf8" opacity="0.9" />

                {/* Windows & Architectural Detailing (Right Facade) */}
                <path d="M220 124 L280 100 L280 120 L220 144 Z" fill="#3b82f6" opacity="0.8" />
                <path d="M220 159 L280 135 L280 155 L220 179 Z" fill="#3b82f6" opacity="0.8" />
                <path d="M220 194 L280 170 L280 190 L220 214 Z" fill="#60a5fa" opacity="0.9" />

                {/* Entrance Canopy */}
                <path d="M170 218 L200 230 L230 218 L200 206 Z" fill="#93c5fd" />
                <path d="M170 218 L170 230 L200 242 L200 230 Z" fill="#3b82f6" />
                <path d="M200 230 L200 242 L230 230 L230 218 Z" fill="#1d4ed8" />

                {/* Roof Solar Panels & Equipment */}
                <path d="M170 65 L200 77 L220 69 L190 57 Z" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
                <path d="M210 50 L230 58 L245 52 L225 44 Z" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />

                {/* Helipad / Roof Marker */}
                <circle cx="200" cy="70" r="14" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
                <text x="200" y="74" textAnchor="middle" fill="#f43f5e" fontSize="12" fontWeight="900">H</text>

                {/* Gradients */}
                <defs>
                  <linearGradient id="leftGradient" x1="100" y1="70" x2="200" y2="230" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  <linearGradient id="rightGradient" x1="200" y1="110" x2="300" y2="190" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <linearGradient id="topGradient" x1="100" y1="70" x2="300" y2="70" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="mt-4 text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-white/10">
                  Interactive Architectural Digital Twin Model
                </span>
              </div>
            </div>
          )}

          {activeTab === "blueprint" && (
            <div className="w-full max-w-lg bg-slate-950 p-6 rounded-3xl border border-blue-500/30 flex flex-col items-center">
              <div className="w-full flex items-center justify-between border-b border-blue-500/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-xs uppercase tracking-wider text-blue-400">Floor Blueprint Map</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">SCALE 1:200</span>
              </div>

              {/* Architectural Schematic Layout */}
              <div className="w-full h-48 border-2 border-dashed border-blue-500/40 rounded-2xl relative p-4 bg-blue-950/20 grid grid-cols-3 gap-2">
                <div className="border border-blue-400/40 rounded-xl p-2 flex flex-col justify-between bg-blue-900/10">
                  <span className="text-[9px] font-bold text-blue-300">W-101</span>
                  <span className="text-[10px] font-extrabold text-white">Main Entrance</span>
                </div>
                <div className="border border-blue-400/40 rounded-xl p-2 flex flex-col justify-between bg-blue-900/10">
                  <span className="text-[9px] font-bold text-blue-300">W-102</span>
                  <span className="text-[10px] font-extrabold text-white">Central Lobby</span>
                </div>
                <div className="border border-blue-400/40 rounded-xl p-2 flex flex-col justify-between bg-blue-900/10">
                  <span className="text-[9px] font-bold text-blue-300">W-103</span>
                  <span className="text-[10px] font-extrabold text-white">Service Desk</span>
                </div>
                <div className="col-span-2 border border-emerald-500/40 rounded-xl p-2 flex flex-col justify-between bg-emerald-900/10">
                  <span className="text-[9px] font-bold text-emerald-300">HUB-MAIN</span>
                  <span className="text-[10px] font-extrabold text-white">Primary Activity Area</span>
                </div>
                <div className="border border-purple-400/40 rounded-xl p-2 flex flex-col justify-between bg-purple-900/10">
                  <span className="text-[9px] font-bold text-purple-300">SEC-A</span>
                  <span className="text-[10px] font-extrabold text-white">Emergency Exit</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="w-full max-w-lg grid grid-cols-2 gap-3 text-left">
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/10 flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-400" /> Coordinates
                </span>
                <span className="font-mono text-xs font-bold text-white">
                  {building.lat.toFixed(5)}, {building.lng.toFixed(5)}
                </span>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/10 flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" /> Security Status
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Operational
                </span>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/10 flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-purple-400" /> Category
                </span>
                <span className="text-xs font-bold text-white">
                  {category.label}
                </span>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/10 flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" /> Walk Access
                </span>
                <span className="text-xs font-bold text-amber-400">
                  Direct Campus Road
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/90 text-center">
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            {building.description}
          </p>
        </div>
      </div>
    </div>
  );
};
