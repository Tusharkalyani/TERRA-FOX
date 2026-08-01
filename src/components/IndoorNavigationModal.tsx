import React, { useState, useEffect } from "react";
import { 
  X, 
  Navigation, 
  MapPin, 
  CornerUpRight, 
  Footprints, 
  Building2,
  Sparkles,
  Zap
} from "lucide-react";
import { findIndoorPathAStar } from "../utils/indoorPathfinder";

export interface IndoorNode {
  id: string;
  name: string;
  category: "classroom" | "lab" | "office" | "facility" | "transit";
  floor: number;
  x: number; // percentage coordinate 0-100 on blueprint
  y: number;
}

export interface IndoorEdge {
  from: string;
  to: string;
  distance: number;
}

interface IndoorNavigationModalProps {
  initialBuildingId?: "AB1" | "AB2";
  onClose: () => void;
}

// Dynamic Floor Node Generator: Ensures EVERY floor has correct room numbers matching its floor prefix!
export const getNodesForBuildingAndFloor = (
  buildingId: "AB1" | "AB2",
  floorNumber: number
): IndoorNode[] => {
  const prefix = floorNumber * 100; // 100, 200, 300, 400

  if (buildingId === "AB2") {
    // AB2 Floorplan Layout (Following handwritten blueprint structure with floor-specific room numbers)
    return [
      // West Corridor (Left)
      { id: `STAIRS_W_F${floorNumber}`, name: `West Stairs (Floor ${floorNumber})`, category: "transit", floor: floorNumber, x: 12, y: 78 },
      { id: `ROOM_${prefix + 1}`, name: `Room ${prefix + 1}`, category: "classroom", floor: floorNumber, x: 12, y: 88 },
      { id: `ROOM_${prefix + 2}`, name: `Room ${prefix + 2} + Cabin`, category: "classroom", floor: floorNumber, x: 18, y: 82 },
      { id: `ROOM_${prefix + 3}`, name: `Room ${prefix + 3}`, category: "classroom", floor: floorNumber, x: 12, y: 55 },
      { id: `ROOM_${prefix + 4}`, name: `Room ${prefix + 4}`, category: "classroom", floor: floorNumber, x: 12, y: 28 },

      // North Corridor (Top)
      { id: `STAIRS_N_F${floorNumber}`, name: `North Stairs (Floor ${floorNumber})`, category: "transit", floor: floorNumber, x: 26, y: 24 },
      { 
        id: `LAB_${prefix + 9}`, 
        name: floorNumber === 4 ? "Lab 409 & Cabin" : `Lab ${prefix + 9} & Cabin`, 
        category: "lab", 
        floor: floorNumber, 
        x: 40, 
        y: 20 
      },
      { id: `BOYS_WASHROOM_F${floorNumber}`, name: `Boys Washroom (F${floorNumber})`, category: "facility", floor: floorNumber, x: 54, y: 18 },
      { id: `ROOM_${prefix + 14}`, name: `Room ${prefix + 14}`, category: "classroom", floor: floorNumber, x: 68, y: 15 },
      { id: `ROOM_${prefix + 15}`, name: `Room ${prefix + 15}`, category: "classroom", floor: floorNumber, x: 78, y: 22 },
      { id: `ROOM_${prefix + 16}`, name: `Room ${prefix + 16}`, category: "classroom", floor: floorNumber, x: 88, y: 22 },

      // East Corridor (Right)
      { id: `ROOM_${prefix + 21}`, name: `Room ${prefix + 21}`, category: "classroom", floor: floorNumber, x: 88, y: 35 },
      { id: `ROOM_${prefix + 22}`, name: `Room ${prefix + 22}`, category: "classroom", floor: floorNumber, x: 88, y: 48 },
      { id: `ROOM_${prefix + 17}`, name: `Room ${prefix + 17}`, category: "classroom", floor: floorNumber, x: 74, y: 44 },
      { id: `ROOM_${prefix + 18}`, name: `Room ${prefix + 18}`, category: "classroom", floor: floorNumber, x: 74, y: 58 },
      { id: `ROOM_${prefix + 19}`, name: `Room ${prefix + 19}`, category: "classroom", floor: floorNumber, x: 74, y: 70 },
      { id: `ROOM_${prefix + 20}`, name: `Room ${prefix + 20}`, category: "classroom", floor: floorNumber, x: 74, y: 82 },
      { id: `ROOM_${prefix + 23}`, name: `Room ${prefix + 23}`, category: "classroom", floor: floorNumber, x: 88, y: 86 },
      { id: `STAIRS_E_F${floorNumber}`, name: `East Stairs (F${floorNumber})`, category: "transit", floor: floorNumber, x: 88, y: 92 },
      { id: `LIFT_E_F${floorNumber}`, name: `East Elevator / Lift (F${floorNumber})`, category: "transit", floor: floorNumber, x: 70, y: 90 },

      // South Corridor (Bottom Center) - Floor-Specific Specialized Labs
      { 
        id: `LAB1_F${floorNumber}`, 
        name: floorNumber === 4 ? "OS Studio Lab" : floorNumber === 3 ? "AI & Machine Learning Lab" : floorNumber === 2 ? "Data Structures Lab" : "Physics Lab", 
        category: "lab", 
        floor: floorNumber, 
        x: 56, 
        y: 82 
      },
      { 
        id: `LAB2_F${floorNumber}`, 
        name: floorNumber === 4 ? "Software Engineering Studio" : floorNumber === 3 ? "Web Tech Studio" : floorNumber === 2 ? "Algorithms Studio" : "Basic Electronics Lab", 
        category: "lab", 
        floor: floorNumber, 
        x: 42, 
        y: 84 
      },
      { id: `FACULTY_CABIN_F${floorNumber}`, name: `Faculty Cabins (Floor ${floorNumber})`, category: "office", floor: floorNumber, x: 28, y: 84 }
    ];
  } else {
    // AB1 Floorplan Layout per Floor with Floor-Specific Room Numbers
    return [
      { id: `AB1_ENTRANCE_F${floorNumber}`, name: `Floor ${floorNumber} Main Lobby`, category: "transit", floor: floorNumber, x: 50, y: 85 },
      { id: `AB1_OFFICE_F${floorNumber}`, name: floorNumber === 1 ? "Dean Office" : floorNumber === 2 ? "HOD Office" : floorNumber === 3 ? "Administration Office" : "Faculty Lounge", category: "office", floor: floorNumber, x: 20, y: 70 },
      { id: `AB1_${prefix + 1}`, name: `Lecture Hall ${prefix + 1}`, category: "classroom", floor: floorNumber, x: 20, y: 40 },
      { id: `AB1_${prefix + 2}`, name: `Lecture Hall ${prefix + 2}`, category: "classroom", floor: floorNumber, x: 20, y: 20 },
      { id: `AB1_HALL_F${floorNumber}`, name: floorNumber === 1 ? "Main Auditorium" : floorNumber === 2 ? "Seminar Hall A" : floorNumber === 3 ? "Conference Room" : "Project Exhibition Hall", category: "facility", floor: floorNumber, x: 50, y: 25 },
      { id: `AB1_LAB_F${floorNumber}`, name: floorNumber === 1 ? "Central Computer Lab" : floorNumber === 2 ? "VLSI & Embedded Lab" : floorNumber === 3 ? "Network Security Lab" : "Robotics & IoT Lab", category: "lab", floor: floorNumber, x: 80, y: 20 },
      { id: `AB1_${prefix + 3}`, name: `Classroom ${prefix + 3}`, category: "classroom", floor: floorNumber, x: 80, y: 45 },
      { id: `AB1_${prefix + 4}`, name: `Classroom ${prefix + 4}`, category: "classroom", floor: floorNumber, x: 80, y: 70 },
      { id: `AB1_LIFT_F${floorNumber}`, name: `Central Lift (F${floorNumber})`, category: "transit", floor: floorNumber, x: 50, y: 55 },
      { id: `AB1_STAIRS_F${floorNumber}`, name: `Central Stairs (F${floorNumber})`, category: "transit", floor: floorNumber, x: 42, y: 55 }
    ];
  }
};

export const IndoorNavigationModal: React.FC<IndoorNavigationModalProps> = ({
  initialBuildingId = "AB2",
  onClose
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<"AB1" | "AB2">(initialBuildingId);
  const [selectedFloor, setSelectedFloor] = useState<number>(selectedBuilding === "AB2" ? 4 : 1);

  // Active Floor Nodes generated dynamically based on selected building and floor level!
  const [activeNodes, setActiveNodes] = useState<IndoorNode[]>(() =>
    getNodesForBuildingAndFloor(initialBuildingId, selectedBuilding === "AB2" ? 4 : 1)
  );

  const [startRoomId, setStartRoomId] = useState<string>("");
  const [targetRoomId, setTargetRoomId] = useState<string>("");

  // Update activeNodes and reset start/target rooms when building or floor changes
  useEffect(() => {
    const newNodes = getNodesForBuildingAndFloor(selectedBuilding, selectedFloor);
    setActiveNodes(newNodes);
    if (newNodes.length > 1) {
      setStartRoomId(newNodes[0].id);
      setTargetRoomId(newNodes[newNodes.length - 2]?.id || newNodes[1].id);
    }
  }, [selectedBuilding, selectedFloor]);

  const startNode = activeNodes.find((n) => n.id === startRoomId) || activeNodes[0] || {
    id: "start",
    name: "Start Point",
    category: "transit",
    floor: selectedFloor,
    x: 12,
    y: 78
  };

  const targetNode = activeNodes.find((n) => n.id === targetRoomId) || activeNodes[1] || {
    id: "target",
    name: "Destination Room",
    category: "classroom",
    floor: selectedFloor,
    x: 88,
    y: 86
  };

  // A* (A-Star) Pathfinding Algorithm Result: f(n) = g(n) + h(n)
  const aStarResult = findIndoorPathAStar(activeNodes, startRoomId, targetRoomId);
  const pathNodes = aStarResult?.path || [startNode, targetNode];
  const indoorSteps = aStarResult?.steps || [];

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-3 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-xl cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[95vh] sm:h-[85vh] bg-slate-900 text-white rounded-t-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col pointer-events-auto z-10">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  INDOOR MAP & NAVIGATION
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedBuilding === "AB2" && selectedFloor === 4
                    ? "Blueprint Spec (Floor 4 Diagram)"
                    : `Floor ${selectedFloor} Room Layout`}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                {selectedBuilding === "AB2" ? "Academic Block 2 (AB2)" : "Academic Block 1 (AB1)"} — Floor {selectedFloor}
              </h2>
            </div>
          </div>

          {/* Controls: Building Switcher & Close */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => {
                  setSelectedBuilding("AB1");
                  setSelectedFloor(1);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  selectedBuilding === "AB1"
                    ? "bg-rose-500 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                AB1
              </button>
              <button
                onClick={() => {
                  setSelectedBuilding("AB2");
                  setSelectedFloor(4);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  selectedBuilding === "AB2"
                    ? "bg-rose-500 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                AB2 (Blueprint Spec)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Indoor Navigation Route Selection Bar */}
        <div className="p-3 sm:p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Start Room Selector */}
            <div className="flex-1 min-w-[140px] flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex-1">
                <label className="block text-[9px] font-black uppercase text-slate-400">
                  Start Room (Floor {selectedFloor})
                </label>
                <select
                  value={startRoomId}
                  onChange={(e) => setStartRoomId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none w-full cursor-pointer"
                >
                  {activeNodes.map((n) => (
                    <option key={n.id} value={n.id} className="bg-slate-900 text-white">
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <span className="text-slate-500 font-black text-xs">➔</span>

            {/* Destination Room Selector */}
            <div className="flex-1 min-w-[140px] flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5">
              <Navigation className="w-4 h-4 text-rose-400 rotate-45 shrink-0" />
              <div className="flex-1">
                <label className="block text-[9px] font-black uppercase text-slate-400">
                  Destination Room (Floor {selectedFloor})
                </label>
                <select
                  value={targetRoomId}
                  onChange={(e) => setTargetRoomId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none w-full cursor-pointer"
                >
                  {activeNodes.map((n) => (
                    <option key={n.id} value={n.id} className="bg-slate-900 text-white">
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Floor Selection Buttons (Floor 1, 2, 3, 4) */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-800 flex-wrap">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase px-1">Floor:</span>
            {[1, 2, 3, 4].map((fl) => (
              <button
                key={fl}
                onClick={() => setSelectedFloor(fl)}
                className={`px-2 sm:px-3 py-1 text-xs font-extrabold rounded-lg sm:rounded-xl transition-all cursor-pointer ${
                  selectedFloor === fl
                    ? "bg-rose-500 text-white shadow-md shadow-rose-900/50 scale-105"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span className="hidden sm:inline">Floor </span>{fl}
              </button>
            ))}
          </div>
        </div>

        {/* Main Floorplan Blueprint Canvas & Directions */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Blueprint SVG Map Visualizer */}
          <div className="flex-1 relative bg-slate-950 p-4 flex items-center justify-center overflow-hidden">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative w-full max-w-2xl h-full max-h-[460px] border-2 border-slate-800 rounded-3xl bg-slate-900/90 p-4 shadow-2xl flex items-center justify-center">
              
              {/* Floor Blueprint SVG */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-xl"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Outer Architectural Perimeter */}
                <rect x="5" y="10" width="90" height="80" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                <rect x="22" y="32" width="56" height="42" fill="#020617" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />

                {/* Corridor Walkway Overlay */}
                <path
                  d="M 12,28 L 88,22 L 88,86 L 28,84 Z"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Animated Red Internal Navigation Path */}
                {pathNodes.length > 1 && (
                  <polyline
                    points={pathNodes.map((n) => `${n.x},${n.y}`).join(" ")}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="4,3"
                    className="animate-pulse"
                  />
                )}

                {/* Render Room Nodes */}
                {activeNodes.map((node) => {
                  const isStart = node.id === startRoomId;
                  const isTarget = node.id === targetRoomId;
                  const isTransit = node.category === "transit";
                  const isLab = node.category === "lab";

                  let nodeColor = "#334155";
                  let textColor = "#94a3b8";

                  if (isStart) {
                    nodeColor = "#10b981";
                    textColor = "#ffffff";
                  } else if (isTarget) {
                    nodeColor = "#ef4444";
                    textColor = "#ffffff";
                  } else if (isLab) {
                    nodeColor = "#8b5cf6";
                  } else if (isTransit) {
                    nodeColor = "#0284c7";
                  }

                  return (
                    <g
                      key={node.id}
                      onClick={() => setTargetRoomId(node.id)}
                      className="cursor-pointer group"
                    >
                      {/* Room Node Dot */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isStart || isTarget ? "3.5" : "2"}
                        fill={nodeColor}
                        stroke="#ffffff"
                        strokeWidth={isStart || isTarget ? "1" : "0.5"}
                      />

                      {/* Pulse halo for Start & Target */}
                      {(isStart || isTarget) && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="5"
                          fill="none"
                          stroke={isStart ? "#10b981" : "#ef4444"}
                          strokeWidth="0.8"
                          className="animate-ping opacity-75"
                        />
                      )}

                      {/* Room Label with Correct Room Number */}
                      <text
                        x={node.x}
                        y={node.y - 3.5}
                        textAnchor="middle"
                        fill={textColor}
                        fontSize="2.2"
                        fontWeight="800"
                        className="select-none transition-all group-hover:fill-rose-300"
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Legend Overlay */}
              <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 p-2 rounded-xl text-[9px] flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Start Point
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Target Room
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> Labs & Studios
                </div>
              </div>
            </div>
          </div>

          {/* Turn-by-Turn Indoor Directions Sidebar */}
          <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-3 sm:p-4 flex flex-col justify-between shrink-0 overflow-y-auto max-h-[200px] md:max-h-none">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5" /> Turn-by-Turn Indoor Route
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedBuilding} — Floor {selectedFloor}
                </span>
              </div>

              {/* A* Algorithm Status Badge */}
              <div className="mb-3 p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-rose-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-rose-400" /> A* Algorithm Path
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  {aStarResult?.nodeCount || 0} nodes ({aStarResult?.totalDistance || 0}m)
                </span>
              </div>

              {/* Indoor Route Steps from A* Algorithm */}
              <div className="flex flex-col gap-2.5 relative pl-2">
                {indoorSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <div className="mt-0.5 p-1 rounded-lg bg-slate-800 border border-slate-700 text-rose-400 shrink-0">
                      {step.type === "start" ? (
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      ) : step.type === "arrive" ? (
                        <Navigation className="w-3.5 h-3.5 text-rose-400 rotate-45" />
                      ) : (
                        <CornerUpRight className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-200 text-xs leading-snug">{step.instruction}</p>
                      {step.distance > 0 && (
                        <span className="text-[9px] font-mono text-slate-400">{step.distance}m</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Room Fast-Select Buttons for Selected Floor */}
              <div className="mt-5 pt-3 border-t border-slate-800">
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase mb-2">
                  Quick Select ({selectedBuilding} — Floor {selectedFloor})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeNodes
                    .filter((n) => n.category === "classroom" || n.category === "lab" || n.category === "facility")
                    .slice(0, 5)
                    .map((n) => (
                      <button
                        key={n.id}
                        onClick={() => setTargetRoomId(n.id)}
                        className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer ${
                          targetRoomId === n.id
                            ? "bg-rose-500 text-white border-rose-400 shadow-sm"
                            : "bg-slate-800 hover:bg-rose-500/20 text-slate-200 border-slate-700"
                        }`}
                      >
                        {n.name}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 font-bold text-rose-300">
                <Sparkles className="w-3 h-3 text-rose-400" /> TERRA-FOX Indoor GPS
              </span>
              <span className="font-mono">{selectedBuilding}-F{selectedFloor}-SPEC</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
