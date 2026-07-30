import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
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
  isDarkMode: boolean;
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

// Generates custom vector HTML/SVG markers with distinct building type icons & short ID labels
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
  isDarkMode
}) => {
  // Center of campus (Main Library coords)
  const defaultCenter: [number, number] = [23.075670, 76.854422];

  // Map boundaries (South Latitude, West Longitude) and (North Latitude, East Longitude)
  const southWest = L.latLng(23.06729, 76.83948);
  const northEast = L.latLng(23.08697, 76.86577);
  const bounds = L.latLngBounds(southWest, northEast);

  // Determine dynamic target coordinate to fly to
  let targetCoords: [number, number] | null = null;
  if (selectedBuilding) {
    targetCoords = [selectedBuilding.lat, selectedBuilding.lng];
  } else if (route && route.coordinates.length > 0) {
    // If routing but no specific building selected, let's fit the map or center around path
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
        minZoom={16}
        maxZoom={19}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        zoomControl={false} // Disable default top-left control to position it elegantly on the bottom-right
        className="w-full h-full"
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        <ZoomControl position="bottomright" />

        {/* Dynamic Map panning controller */}
        <MapController focusCoords={targetCoords} />

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
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {node.description}
                    </p>
                  )}
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

      {/* Elegant re-positioned zoom controls on bottom right */}
      <div className="absolute bottom-5 right-5 z-[1000] leaflet-bar border-none shadow-none">
        {/* React Leaflet renders zoom controls inside MapContainer. We styled it using custom CSS in index.css */}
      </div>
    </div>
  );
};
