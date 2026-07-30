import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import { Locate, Navigation } from "lucide-react";
import { campusNodes } from "../data/campusData";
import type { CampusNode } from "../data/campusData";
import type { PathResult } from "../utils/pathfinder";
import { getBuildingCategoryInfo } from "../utils/buildingIcons";

interface CampusMapProps {
  startId: string;
  endId: string;
  selectedBuilding: CampusNode | null;
  route: PathResult | null;
  onMarkerClick: (node: CampusNode) => void;
  onView3D: (node: CampusNode) => void;
  isDarkMode: boolean;
  userLocation: [number, number] | null;
  onLocationFound: (coords: [number, number], isMock: boolean) => void;
}

// Controller component to dynamically animate map center updates
const MapController: React.FC<{ focusCoords: [number, number] | null }> = ({ focusCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (focusCoords) {
      map.flyTo(focusCoords, 18, {
        animate: true,
        duration: 1.2
      });
    }
  }, [focusCoords, map]);

  return null;
};

// Sub-component to manage panning map viewport to GPS location
interface GPSButtonProps {
  userLocation: [number, number] | null;
  onLocationFound: (coords: [number, number], isMock: boolean) => void;
}

const FindMyLocationButton: React.FC<GPSButtonProps> = ({ onLocationFound }) => {
  const map = useMap();

  const handleLocate = () => {
    if (!navigator.geolocation) {
      triggerFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationFound([latitude, longitude], false);
        map.flyTo([latitude, longitude], 18, {
          animate: true,
          duration: 1.5
        });
      },
      (error) => {
        console.warn("Geolocation error:", error);
        triggerFallback();
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const triggerFallback = () => {
    // Default fallback coordinates near library/campus spine
    const mockCoords: [number, number] = [23.075670, 76.854422];
    onLocationFound(mockCoords, true);
    map.flyTo(mockCoords, 18, {
      animate: true,
      duration: 1.5
    });
  };

  return (
    <button
      onClick={handleLocate}
      className="absolute bottom-24 right-5 z-[1000] glass-panel w-10 h-10 rounded-full shadow-lg border border-white/20 text-slate-800 dark:text-slate-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all pointer-events-auto cursor-pointer"
      title="Find My Location (GPS)"
    >
      <Locate className="w-5 h-5 text-blue-500 dark:text-blue-400" />
    </button>
  );
};

// Pulse location marker for GPS User "You Are Here" dot
const createUserLocationMarkerIcon = () => {
  const html = `
    <div class="relative flex items-center justify-center w-7 h-7">
      <div class="absolute w-full h-full rounded-full bg-blue-500 gps-pulse-ring"></div>
      <div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md z-10 flex items-center justify-center text-white text-[8px] font-black">
        📍
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: "gps-location-marker",
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

// Generates custom vector HTML/SVG markers with category icons & short ID labels
const createCustomMarkerIcon = (
  node: CampusNode,
  isStart: boolean,
  isEnd: boolean,
  isSelected: boolean
) => {
  const category = getBuildingCategoryInfo(node);

  let pinBgClass = category.defaultPinBg;
  let ringClass = category.ringClass;
  let animateClass = "";
  let badgeLabel = "";

  if (isStart) {
    pinBgClass = "bg-emerald-500 text-white border-white shadow-emerald-500/50 scale-110";
    ringClass = "border-emerald-400";
    animateClass = "pulse-marker";
    badgeLabel = `<span class="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-emerald-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-md z-10">A</span>`;
  } else if (isEnd) {
    pinBgClass = "bg-rose-500 text-white border-white shadow-rose-500/50 scale-110";
    ringClass = "border-rose-400";
    animateClass = "pulse-marker";
    badgeLabel = `<span class="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-md z-10">B</span>`;
  } else if (isSelected) {
    pinBgClass = "bg-blue-600 text-white border-white shadow-blue-600/50 scale-110";
    ringClass = "border-blue-400";
    animateClass = "pulse-marker";
  }

  const html = `
    <div class="relative flex flex-col items-center justify-center group cursor-pointer">
      ${animateClass ? `<div class="absolute -inset-2 rounded-full border-2 ${ringClass} ${animateClass} opacity-60"></div>` : ""}
      ${badgeLabel}
      <div class="w-9 h-9 rounded-2xl flex items-center justify-center shadow-xl border-2 transition-all duration-300 transform group-hover:scale-115 ${pinBgClass}">
        ${category.iconSvg}
      </div>
      <div class="w-2 h-2 -mt-1 rotate-45 border-r border-b bg-current border-current shadow-sm opacity-80"></div>

      <!-- Visible short ID badge under node pin -->
      <div class="mt-0.5 px-1.5 py-0.5 rounded-md bg-slate-900/85 dark:bg-slate-950/90 text-white text-[9px] font-black tracking-wider border border-white/20 shadow-md backdrop-blur-sm whitespace-nowrap transition-transform duration-200 group-hover:scale-105 pointer-events-none">
        ${node.id}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-map-marker",
    iconSize: [64, 64],
    iconAnchor: [32, 38]
  });
};

export const CampusMap: React.FC<CampusMapProps> = ({
  startId,
  endId,
  selectedBuilding,
  route,
  onMarkerClick,
  onView3D,
  isDarkMode,
  userLocation,
  onLocationFound
}) => {
  // Center of campus (Main Library coords)
  const defaultCenter: [number, number] = [23.075670, 76.854422];

  // Map boundaries (South Latitude, West Longitude) and (North Latitude, East Longitude)
  const southWest = L.latLng(23.06729, 76.83948);
  const northEast = L.latLng(23.08697, 76.86577);
  const bounds = L.latLngBounds(southWest, northEast);

  // Dynamic targeting coordinates
  let targetCoords: [number, number] | null = null;
  if (selectedBuilding) {
    targetCoords = [selectedBuilding.lat, selectedBuilding.lng];
  } else if (route && route.coordinates.length > 0) {
    const midIndex = Math.floor(route.coordinates.length / 2);
    targetCoords = route.coordinates[midIndex];
  }

  // CartoDB Tile URLs (minimalist map styles)
  const tileUrl = isDarkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
  const buildings = campusNodes.filter((node) => node.isBuilding);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={17}
        minZoom={15}
        maxZoom={19}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        <ZoomControl position="bottomright" />
        
        {/* Dynamic Map panning controller */}
        <MapController focusCoords={targetCoords} />

        {/* GPS location overlay button */}
        <FindMyLocationButton userLocation={userLocation} onLocationFound={onLocationFound} />

        {/* Pulsing & Draggable User GPS Location Marker */}
        {userLocation && (
          <Marker 
            position={userLocation} 
            icon={createUserLocationMarkerIcon()}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                onLocationFound([position.lat, position.lng], false);
              }
            }}
          >
            <Popup className="custom-popup rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-3 text-slate-800 dark:text-slate-100 font-bold text-xs text-center flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-extrabold">
                  <Locate className="w-4 h-4 animate-pulse" />
                  <span>My Live Location</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {userLocation[0].toFixed(5)}, {userLocation[1].toFixed(5)}
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                  🖐️ Drag this pin anywhere on the map to correct your live location!
                </p>
              </div>
            </Popup>
          </Marker>
        )}


        {/* Building Markers */}
        {buildings.map((node) => {
          const isStart = node.id === startId;
          const isEnd = node.id === endId;
          const isSelected = selectedBuilding?.id === node.id;
          const category = getBuildingCategoryInfo(node);

          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={createCustomMarkerIcon(node, isStart, isEnd, isSelected)}
              eventHandlers={{
                click: () => onMarkerClick(node)
              }}
            >
              <Popup className="custom-popup rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-3 text-slate-800 dark:text-slate-100 max-w-[220px]">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${category.badgeBg}`}>
                      {category.label}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">
                      {node.id}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm mb-1 text-slate-900 dark:text-white leading-tight">
                    {node.name}
                  </h3>
                  {node.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                      {node.description}
                    </p>
                  )}

                  <div className="flex flex-col gap-1.5 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkerClick(node);
                      }}
                      className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/30 cursor-pointer"
                    >
                      <Navigation className="w-3 h-3 fill-current rotate-45" />
                      Route Here from My Location
                    </button>

                    {node.id === "AB1" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onView3D(node);
                        }}
                        className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        View 3D Structure
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Path route line */}
        {route && (
          <>
            {/* Outline Glow */}
            <Polyline
              positions={route.coordinates}
              pathOptions={{
                color: isDarkMode ? "#3b82f6" : "#2563eb",
                weight: 8,
                opacity: 0.15
              }}
            />
            {/* Main Styled Line */}
            <Polyline
              positions={route.coordinates}
              pathOptions={{
                color: isDarkMode ? "#60a5fa" : "#3b82f6",
                weight: 5,
                opacity: 0.95
              }}
              className="route-polyline"
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};
