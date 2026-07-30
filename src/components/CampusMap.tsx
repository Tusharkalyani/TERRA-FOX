import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import { campusNodes } from "../data/campusData";
import type { CampusNode } from "../data/campusData";
import type { PathResult } from "../utils/pathfinder";

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

// Generates custom HTML/SVG markers dynamically matching Apple-esque aesthetics
const createCustomMarkerIcon = (
  node: CampusNode,
  isStart: boolean,
  isEnd: boolean,
  isSelected: boolean
) => {
  let colorClass = "bg-blue-500 text-white border-white shadow-blue-500/20";
  let ringClass = "border-blue-400";
  let animateClass = "";

  if (isStart) {
    colorClass = "bg-emerald-500 text-white border-white shadow-emerald-500/30";
    ringClass = "border-emerald-400";
    animateClass = "pulse-marker";
  } else if (isEnd) {
    colorClass = "bg-rose-500 text-white border-white shadow-rose-500/30";
    ringClass = "border-rose-400";
    animateClass = "pulse-marker";
  } else if (isSelected) {
    colorClass = "bg-blue-600 text-white border-white shadow-blue-600/30";
    ringClass = "border-blue-500";
    animateClass = "pulse-marker";
  }

  const html = `
    <div class="relative flex flex-col items-center justify-center w-10 h-10">
      ${animateClass
      ? `<div class="absolute -inset-2 rounded-full border-2 ${ringClass} ${animateClass} opacity-60"></div>`
      : ""
    }
      <div class="w-8 h-8 rounded-full flex items-center justify-center font-black text-[9px] shadow-lg border-2 tracking-tighter transition-all duration-300 ${colorClass}">
        ${node.id}
      </div>
      <div class="w-1.5 h-1.5 -mt-0.5 rotate-45 border-r border-b bg-current border-current shadow-sm"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-map-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 36]
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

          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={createCustomMarkerIcon(node, isStart, isEnd, isSelected)}
              eventHandlers={{
                click: () => onMarkerClick(node)
              }}
            >
              <Popup className="custom-popup rounded-2xl overflow-hidden">
                <div className="p-2 text-slate-800 dark:text-slate-100 max-w-[200px]">
                  <h3 className="font-bold text-xs mb-1 text-slate-900 dark:text-white flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {node.name}
                  </h3>
                  {node.description && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
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
