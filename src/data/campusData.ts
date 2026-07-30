export interface CampusNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isBuilding: boolean;
  description?: string;
}

export interface CampusEdge {
  from: string;
  to: string;
}

export const campusNodes: CampusNode[] = [
  // Buildings
  {
    id: "ADMIN",
    name: "Administration Building",
    lat: 12.9724,
    lng: 77.5932,
    isBuilding: true,
    description: "Main administrative services, register office, and admissions."
  },
  {
    id: "SEH",
    name: "Science & Engineering Hall",
    lat: 12.9728,
    lng: 77.5958,
    isBuilding: true,
    description: "State-of-the-art labs, classrooms, and technology hub."
  },
  {
    id: "LIB",
    name: "Main Library",
    lat: 12.9716,
    lng: 77.5946,
    isBuilding: true,
    description: "Central study hub, media lab, and 24/7 reading rooms."
  },
  {
    id: "SC",
    name: "Student Center",
    lat: 12.9704,
    lng: 77.5934,
    isBuilding: true,
    description: "Dining hall, student union offices, and recreational lounge."
  },
  {
    id: "ATH",
    name: "Athletic Complex",
    lat: 12.9708,
    lng: 77.5958,
    isBuilding: true,
    description: "Gymnasium, swimming pool, and outdoor track fields."
  },
  // Intermediate Junctions (Walkway intersections)
  {
    id: "J_NORTH",
    name: "North Walkway Junction",
    lat: 12.9726,
    lng: 77.5945,
    isBuilding: false
  },
  {
    id: "J_WEST",
    name: "West Quad Junction",
    lat: 12.9714,
    lng: 77.5931,
    isBuilding: false
  },
  {
    id: "J_CENTER",
    name: "Library Plaza Junction",
    lat: 12.9716,
    lng: 77.5941,
    isBuilding: false
  },
  {
    id: "J_EAST",
    name: "East Boulevard Junction",
    lat: 12.9718,
    lng: 77.5959,
    isBuilding: false
  },
  {
    id: "J_SOUTH",
    name: "South Walkway Junction",
    lat: 12.9704,
    lng: 77.5946,
    isBuilding: false
  }
];

export const campusEdges: CampusEdge[] = [
  // Connect buildings to nearest junctions
  { from: "ADMIN", to: "J_NORTH" },
  { from: "ADMIN", to: "J_WEST" },
  { from: "SEH", to: "J_NORTH" },
  { from: "SEH", to: "J_EAST" },
  { from: "LIB", to: "J_CENTER" },
  { from: "SC", to: "J_WEST" },
  { from: "SC", to: "J_SOUTH" },
  { from: "ATH", to: "J_EAST" },
  { from: "ATH", to: "J_SOUTH" },

  // Connect junctions together
  { from: "J_NORTH", to: "J_CENTER" },
  { from: "J_WEST", to: "J_CENTER" },
  { from: "J_SOUTH", to: "J_CENTER" },
  { from: "J_EAST", to: "J_CENTER" }
];
