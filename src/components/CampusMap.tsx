import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import { Locate, Navigation } from "lucide-react";
import { campusNodes } from "../data/campusData";
import type { CampusNode } from "../data/campusData";
import type { PathResult } from "../utils/pathfinder";
import { getBuildingCategoryInfo } from "../utils/buildingIcons";
import type { CampusDisruption } from "../data/disruptionsData";

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
  disruptions?: CampusDisruption[];
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

// Generates custom vector HTML/SVG markers matching screenshot (Icon + Full Building Name Pill)
const createCustomMarkerIcon = (
  node: CampusNode,
  isStart: boolean,
  isEnd: boolean,
  isSelected: boolean
) => {
  const category = getBuildingCategoryInfo(node);

  let badgeBg = "bg-slate-950/85 text-white border-white/20 shadow-2xl backdrop-blur-md";
  let iconContainerBg = category.defaultPinBg;
  let animateClass = "";
  let badgeLabel = "";

  if (isStart) {
    iconContainerBg = "bg-emerald-500 text-white border-white shadow-emerald-500/50 scale-105";
    badgeBg = "bg-emerald-950/90 text-white border-emerald-400 shadow-emerald-500/40 backdrop-blur-md ring-2 ring-emerald-400";
    animateClass = "pulse-marker";
    badgeLabel = `<span class="w-4 h-4 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white shrink-0">A</span>`;
  } else if (isEnd) {
    iconContainerBg = "bg-rose-500 text-white border-white shadow-rose-500/50 scale-105";
    badgeBg = "bg-rose-950/90 text-white border-rose-400 shadow-rose-500/40 backdrop-blur-md ring-2 ring-rose-400";
    animateClass = "pulse-marker";
    badgeLabel = `<span class="w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white shrink-0">B</span>`;
  } else if (isSelected) {
    badgeBg = "bg-blue-950/95 text-white border-blue-400 shadow-blue-500/50 backdrop-blur-md ring-2 ring-blue-400 scale-105";
    animateClass = "pulse-marker";
  }

  const html = `
    <div class="relative flex items-center justify-start group cursor-pointer pointer-events-auto">
      ${animateClass ? `<div class="absolute -inset-1.5 rounded-full border-2 border-blue-400 ${animateClass} opacity-60"></div>` : ""}
      <div class="flex items-center gap-1.5 px-2 py-1 rounded-2xl ${badgeBg} border transition-all duration-300 transform group-hover:scale-108 whitespace-nowrap shadow-2xl">
        ${badgeLabel}
        <div class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-md border border-white/40 shrink-0 ${iconContainerBg}">
          ${category.iconSvg}
        </div>
        <span class="font-extrabold text-[11px] text-white tracking-tight drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.9)] pr-1">
          ${node.name}
        </span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-map-marker",
    iconSize: [220, 36],
    iconAnchor: [20, 18]
  });
};

export const CampusMap: React.FC<CampusMapProps> = ({
  startId,
  endId,
  selectedBuilding,
  route,
  onMarkerClick,
  onView3D,
  isDarkMode: _isDarkMode,
  userLocation,
  onLocationFound,
  disruptions = []
}) => {

  const defaultCenter: [number, number] = [23.075670, 76.854422];
  const southWest = L.latLng(23.06729, 76.83948);
  const northEast = L.latLng(23.08697, 76.86577);
  const bounds = L.latLngBounds(southWest, northEast);

  let targetCoords: [number, number] | null = null;
  if (selectedBuilding) {
    targetCoords = [selectedBuilding.lat, selectedBuilding.lng];
  } else if (route && route.coordinates.length > 0) {
    const midIndex = Math.floor(route.coordinates.length / 2);
    targetCoords = route.coordinates[midIndex];
  }

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
        {/* High-Resolution Satellite Map Tile Layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        />

        <ZoomControl position="bottomright" />
        <MapController focusCoords={targetCoords} />

        {/* Location & Recenter Button */}
        <FindMyLocationButton userLocation={userLocation} onLocationFound={onLocationFound} />

        {userLocation && (
          <Marker
            position={userLocation}
            icon={createUserLocationMarkerIcon()}
          >
            <Popup className="custom-popup rounded-2xl overflow-hidden">
              <div className="p-2 text-center text-xs font-bold">
                📍 You are here (My Location)
              </div>
            </Popup>
          </Marker>
        )}

        {/* Blocked Path Disruption Warning Markers */}
        {disruptions
          .filter((d) => d.active && d.affectedNodeIds.length > 0)
          .flatMap((d) => d.affectedNodeIds)
          .map((nodeId) => {
            const node = campusNodes.find((n) => n.id === nodeId);
            if (!node) return null;
            return (
              <Marker
                key={`blocked-${nodeId}`}
                position={[node.lat, node.lng]}
                icon={L.divIcon({
                  html: `
                    <div class="relative flex items-center justify-center w-8 h-8 pointer-events-auto">
                      <div class="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-60"></div>
                      <div class="w-7 h-7 rounded-full bg-rose-600 text-white border-2 border-white shadow-xl flex items-center justify-center text-xs font-bold z-10">
                        🚧
                      </div>
                    </div>
                  `,
                  className: "blocked-node-marker",
                  iconSize: [32, 32],
                  iconAnchor: [16, 16]
                })}
              >
                <Popup className="custom-popup rounded-2xl overflow-hidden shadow-2xl">
                  <div className="p-2.5 text-center max-w-[200px]">
                    <div className="text-rose-500 font-extrabold text-xs mb-1 flex items-center justify-center gap-1">
                      🚧 Pathway Blocked
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      Construction in progress. Pathfinder auto-reroutes traffic around this point ({nodeId}).
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Building Markers matching screenshot */}
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

        {/* Coral Pink Road Line */}
        {route && (
          <>
            <Polyline
              positions={route.coordinates}
              pathOptions={{
                color: "#f43f5e",
                weight: 14,
                opacity: 0.35,
                lineCap: "round",
                lineJoin: "round"
              }}
            />
            <Polyline
              positions={route.coordinates}
              pathOptions={{
                color: "#ff4757",
                weight: 5,
                opacity: 0.95,
                lineCap: "round",
                lineJoin: "round"
              }}
              className="route-polyline"
            />
            <Polyline
              positions={route.coordinates}
              pathOptions={{
                color: "#ffe4e6",
                weight: 2,
                opacity: 0.9,
                lineCap: "round",
                lineJoin: "round"
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};
