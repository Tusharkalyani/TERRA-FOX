import React, { useState } from "react";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X, 
  Layers, 
  ArrowRight, 
  Plus, 
  CheckCircle2,
  Bell
} from "lucide-react";
import type { CampusDisruption } from "../data/disruptionsData";

interface DisruptionsPanelProps {
  disruptions: CampusDisruption[];
  onToggleDisruption: (id: string) => void;
  onSelectDestination: (buildingId: string) => void;
  onAddDisruption: (disruption: CampusDisruption) => void;
}

export const DisruptionsPanel: React.FC<DisruptionsPanelProps> = ({
  disruptions,
  onToggleDisruption,
  onSelectDestination,
  onAddDisruption
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<CampusDisruption["type"]>("blocked_path");

  const activeDisruptions = disruptions.filter((d) => d.active);

  const getSeverityBadge = (severity: CampusDisruption["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-[#C8A96B]/25 text-[#C8A96B] border-[#C8A96B]/40";
      case "warning":
        return "bg-[#C8A96B]/15 text-[#C8A96B] border-[#C8A96B]/30";
      default:
        return "bg-[#8FA28A]/15 text-[#8FA28A] border-[#8FA28A]/30";
    }
  };

  const getTypeIcon = (type: CampusDisruption["type"]) => {
    switch (type) {
      case "blocked_path":
        return <AlertTriangle className="w-4 h-4 text-[#C8A96B]" />;
      case "room_change":
        return <Layers className="w-4 h-4 text-[#8FA28A]" />;
      case "maintenance":
        return <AlertCircle className="w-4 h-4 text-[#C8A96B]" />;
      default:
        return <Info className="w-4 h-4 text-[#8FA28A]" />;
    }
  };

  const handleCreateDisruption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: CampusDisruption = {
      id: `DISRUPT-${Date.now()}`,
      type: newType,
      title: newTitle,
      description: newDesc || "User reported live campus event.",
      affectedNodeIds: newType === "blocked_path" ? ["N21"] : [],
      severity: "warning",
      timestamp: "Just now",
      active: true
    };

    onAddDisruption(item);
    setNewTitle("");
    setNewDesc("");
    setShowAddForm(false);
  };

  return (
    <>
      {/* Floating Trigger Button on Top Bar */}
      <button
        onClick={() => setIsOpen(true)}
        className="glass-panel px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl shadow-lg border border-white/20 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 sm:gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer pointer-events-auto"
        style={{ minHeight: 36 }}
        title="Live Campus Disruptions & Room Relocations"
      >
        <div className="relative flex items-center justify-center">
          <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
          {activeDisruptions.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
          )}
        </div>
        <span className="hidden sm:inline text-xs font-black tracking-tight">
          Alerts ({activeDisruptions.length})
        </span>
        {/* Mobile-only: show count badge instead of text */}
        {activeDisruptions.length > 0 && (
          <span className="sm:hidden text-[10px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded-full leading-none">
            {activeDisruptions.length}
          </span>
        )}
      </button>

      {/* Modal Hub */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[85vh] z-10 pointer-events-auto">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-base tracking-tight text-white leading-none">
                    Live Campus Disruptions
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Path Blockages & Room Relocations
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content List */}
            <div className="p-5 flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-400">Active Incidents</span>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Report Alert
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleCreateDisruption} className="bg-slate-800/80 p-4 rounded-2xl border border-blue-500/30 flex flex-col gap-3 mb-2 animate-fade-in">
                  <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Report Campus Issue</span>
                  <input
                    type="text"
                    placeholder="Title (e.g. Tree Trimming at AB1 Road)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-900 text-xs text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description / Room info..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-slate-900 text-xs text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex items-center justify-between">
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as CampusDisruption["type"])}
                      className="bg-slate-900 text-xs text-slate-300 p-2 rounded-xl border border-white/10 focus:outline-none"
                    >
                      <option value="blocked_path">🚧 Blocked Path</option>
                      <option value="room_change">🏫 Room Relocation</option>
                      <option value="maintenance">🛠️ Maintenance</option>
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer"
                    >
                      Publish Alert
                    </button>
                  </div>
                </form>
              )}

              {disruptions.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.active 
                      ? "bg-slate-800/60 border-slate-700/60" 
                      : "bg-slate-900/40 border-slate-800/40 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-slate-800 border border-white/10">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-white leading-tight">
                          {item.title}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.timestamp}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getSeverityBadge(item.severity)}`}>
                      {item.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Room Relocation Card Button */}
                  {item.relocation && (
                    <div className="mb-3 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-slate-400 line-through mr-2">{item.relocation.originalLocation}</span>
                        <span className="font-extrabold text-emerald-400 flex items-center gap-1 inline-flex">
                          <ArrowRight className="w-3 h-3" />
                          {item.relocation.newBuildingName} ({item.relocation.newRoom})
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (item.relocation) {
                            onSelectDestination(item.relocation.newBuildingId);
                            setIsOpen(false);
                          }
                        }}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-extrabold rounded-lg transition-all shadow-md cursor-pointer"
                      >
                        Route Here
                      </button>
                    </div>
                  )}

                  {/* Toggle Avoidance Checkbox for Blocked Paths */}
                  {item.affectedNodeIds.length > 0 && (
                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                      <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                        Avoid in A* Pathfinder ({item.affectedNodeIds.join(", ")})
                      </span>
                      <button
                        onClick={() => onToggleDisruption(item.id)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                          item.active 
                            ? "bg-rose-500 text-white shadow-md shadow-rose-500/20" 
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        {item.active ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Avoidance Active
                          </>
                        ) : (
                          "Enable Avoidance"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-slate-950 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              A* Algorithm automatically re-routes traffic around active blocked paths
            </div>
          </div>
        </div>
      )}
    </>
  );
};
