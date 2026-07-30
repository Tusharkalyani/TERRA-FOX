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

export const buildings: CampusNode[] = [
  {
    id: "LAB",
    name: "Lab Complex",
    lat: 23.0786587066161,
    lng: 76.84995795030068,
    description: "Main facility dedicated to practical laboratory sessions and research activities and placement office.",
    isBuilding: true
  },
  {
    id: "ARCH",
    name: "Architecture Building",
    lat: 23.07798049526238,
    lng: 76.85021513805361,
    description: "Academic building housing architecture studios, classrooms, and faculty offices.",
    isBuilding: true
  },
  {
    id: "AB1",
    name: "Academic Block 1",
    lat: 23.07770,
    lng: 76.85143,
    description: "Primary academic block featuring main lecture halls and classrooms.",
    isBuilding: true
  },
  {
    id: "AB2",
    name: "Academic Block 2",
    lat: 23.073777054168755,
    lng: 76.85580691447514,
    description: "Secondary academic block for theoretical classes and seminars.",
    isBuilding: true
  },
  {
    id: "MAYURI",
    name: "Mayuri Cafe",
    lat: 23.077244,
    lng: 76.850605,
    description: "Campus cafeteria providing regular meals, snacks, and beverages.",
    isBuilding: true
  },
  {
    id: "UNDERBELLY",
    name: "Underbelly",
    lat: 23.07757722798361,
    lng: 76.8505391898756,
    description: "Popular student food court and casual social hangout spot.",
    isBuilding: true
  },
  {
    id: "BH1",
    name: "Boys Hostel Block 1",
    lat: 23.07544,
    lng: 76.85992,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "BH2",
    name: "Boys Hostel Block 2",
    lat: 23.072944548713036,
    lng: 76.86009765240127,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "BH3",
    name: "Boys Hostel Block 3",
    lat: 23.07340,
    lng: 76.85938,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "BH4",
    name: "Boys Hostel Block 4",
    lat: 23.07304416561843,
    lng: 76.85878964809127,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "BH5",
    name: "Boys Hostel Block 5",
    lat: 23.073590152644297,
    lng: 76.85874049961807,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "BH6",
    name: "Boys Hostel Block 6",
    lat: 23.072485,
    lng: 76.859904,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "BH7",
    name: "Boys Hostel Block 7",
    lat: 23.07308,
    lng: 76.85941,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "BH8",
    name: "Boys Hostel Block 8",
    lat: 23.072465,
    lng: 76.858838,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "GH1",
    name: "Girls Hostel Block 1",
    lat: 23.07537,
    lng: 76.85250,
    description: "Residential accommodation block for female students.",
    isBuilding: true
  },
  {
    id: "GH2",
    name: "Girls Hostel Block 2",
    lat: 23.07552,
    lng: 76.85378,
    description: "Residential accommodation block for female students.",
    isBuilding: true
  },
  {
    id: "SPECIAL",
    name: "Special Block",
    lat: 23.07251,
    lng: 76.85771,
    description: "Designated facility for specialized academic programs and administrative use.",
    isBuilding: true
  },
  {
    id: "SAFAL",
    name: "safal",
    lat: 23.077436,
    lng: 76.850874,
    description: "On-campus shop supplying stationery, groceries, and daily essentials.",
    isBuilding: true
  },
  {
    id: "PARCEL PICKUP",
    name: "Parcel Pickup Point",
    lat: 23.07456,
    lng: 76.85009,
    description: "Designated open-air area for receiving and collecting courier deliveries.",
    isBuilding: true
  },
  {
    id: "MPH",
    name: "MPH",
    lat: 23.076117405710708,
    lng: 76.8497454307515,
    description: "Multi-Purpose Hall used for indoor sports, large events, and gatherings.",
    isBuilding: true
  },
  {
    id: "HOSPITAL",
    name: "Morphen Hospital",
    lat: 23.076072989049308,
    lng: 76.84975615958747,
    description: "Campus medical center providing primary healthcare and emergency services.",
    isBuilding: true
  },
  {
    id: "CRICKET GROUND",
    name: "cricket ground",
    lat: 23.07452,
    lng: 76.85404,
    description: "cricket ground.",
    isBuilding: true
  },
  {
    id: "GROUND",
    name: "ground",
    lat: 23.07436,
    lng: 76.85966,
    description: "ground.",
    isBuilding: true
  },
  {
    id: "CHANCELLORS HOUSE",
    name: "chancellors residence",
    lat: 23.07496,
    lng: 76.85133,
    description: "chancellors residence.",
    isBuilding: true
  },
  {
    id: "CENTRAL HOSTEL OFFICE",
    name: "central hostel office",
    lat: 23.07369,
    lng: 76.85934,
    description: "central hostel office.",
    isBuilding: true
  },
  {
    id: "MAYURI MESS",
    name: "mayuri mess",
    lat: 23.07360,
    lng: 76.86017,
    description: "mayuri mess.",
    isBuilding: true
  },
  {
    id: "OPEN AUDI",
    name: "open auditorium",
    lat: 23.07432,
    lng: 76.85106,
    description: "open auditorium.",
    isBuilding: true
  }

];

// Road Pathway Junctions following actual campus road network
export const roadNodes: CampusNode[] = [
  // West Corridor Road
  { id: "ROAD_W1", name: "North Lab Road", lat: 23.0786, lng: 76.8501, isBuilding: false },
  { id: "ROAD_W2", name: "Food Court Road", lat: 23.0776, lng: 76.8505, isBuilding: false },
  { id: "ROAD_W3", name: "Mayuri Store Pathway", lat: 23.0773, lng: 76.8507, isBuilding: false },
  { id: "ROAD_W4", name: "Hospital Road", lat: 23.0761, lng: 76.8499, isBuilding: false },
  { id: "ROAD_W5", name: "Parcel Point Road", lat: 23.0747, lng: 76.8502, isBuilding: false },

  // Main Central Spine Road
  { id: "ROAD_C1", name: "West Spine Connector", lat: 23.0748, lng: 76.8516, isBuilding: false },
  { id: "ROAD_C2", name: "Girls Hostel Quad Road", lat: 23.0751, lng: 76.8531, isBuilding: false },
  { id: "ROAD_C3", name: "GH2 Pathway", lat: 23.0752, lng: 76.8542, isBuilding: false },
  { id: "ROAD_C4", name: "Central Academic Avenue", lat: 23.0745, lng: 76.8550, isBuilding: false },
  { id: "ROAD_C5", name: "AB2 Entrance Road", lat: 23.0738, lng: 76.8558, isBuilding: false },

  // East Main Highway Connector Road
  { id: "ROAD_E1", name: "East Campus Highway", lat: 23.0746, lng: 76.8572, isBuilding: false },
  { id: "ROAD_E2", name: "East Academic Gateway", lat: 23.0750, lng: 76.8586, isBuilding: false },
  { id: "ROAD_E3", name: "AB1 & Hostel Main Road", lat: 23.0753, lng: 76.8596, isBuilding: false },

  // Boys Hostel Ring Road
  { id: "ROAD_BH_N", name: "Hostel North Loop", lat: 23.0745, lng: 76.8595, isBuilding: false },
  { id: "ROAD_BH_E", name: "Hostel East Loop", lat: 23.0728, lng: 76.8600, isBuilding: false },
  { id: "ROAD_BH_S", name: "Hostel South Loop", lat: 23.0724, lng: 76.8594, isBuilding: false },
  { id: "ROAD_BH_W", name: "Hostel West Loop", lat: 23.0727, lng: 76.8587, isBuilding: false }
];

export const campusNodes: CampusNode[] = [...buildings, ...roadNodes];

export const campusEdges: CampusEdge[] = [
  // Building links to nearest road pathway
  { from: "LAB", to: "ROAD_W1" },
  { from: "ARCH", to: "ROAD_W2" },
  { from: "UNDERBELLY", to: "ROAD_W2" },
  { from: "MAYURI", to: "ROAD_W3" },
  { from: "STORE", to: "ROAD_W3" },
  { from: "MPH", to: "ROAD_W4" },
  { from: "HOSPITAL", to: "ROAD_W4" },
  { from: "PARCEL", to: "ROAD_W5" },
  { from: "GH1", to: "ROAD_C2" },
  { from: "SPECIAL", to: "ROAD_C2" },
  { from: "GH2", to: "ROAD_C3" },
  { from: "AB2", to: "ROAD_C5" },
  { from: "AB1", to: "ROAD_E3" },
  { from: "BH1", to: "ROAD_E3" },
  { from: "BH2", to: "ROAD_BH_E" },
  { from: "BH3", to: "ROAD_BH_N" },
  { from: "BH4", to: "ROAD_BH_W" },
  { from: "BH5", to: "ROAD_BH_W" },
  { from: "BH6", to: "ROAD_BH_E" },
  { from: "BH7", to: "ROAD_BH_S" },
  { from: "BH8", to: "ROAD_BH_W" },

  // West Road Pathway
  { from: "ROAD_W1", to: "ROAD_W2" },
  { from: "ROAD_W2", to: "ROAD_W3" },
  { from: "ROAD_W3", to: "ROAD_W4" },
  { from: "ROAD_W4", to: "ROAD_W5" },

  // Main Central Spine Road Network
  { from: "ROAD_W5", to: "ROAD_C1" },
  { from: "ROAD_C1", to: "ROAD_C2" },
  { from: "ROAD_C2", to: "ROAD_C3" },
  { from: "ROAD_C3", to: "ROAD_C4" },
  { from: "ROAD_C4", to: "ROAD_C5" },

  // East Main Campus Highway
  { from: "ROAD_C4", to: "ROAD_E1" },
  { from: "ROAD_E1", to: "ROAD_E2" },
  { from: "ROAD_E2", to: "ROAD_E3" },

  // Hostel Ring Road Loop
  { from: "ROAD_E3", to: "ROAD_BH_N" },
  { from: "ROAD_BH_N", to: "ROAD_BH_E" },
  { from: "ROAD_BH_E", to: "ROAD_BH_S" },
  { from: "ROAD_BH_S", to: "ROAD_BH_W" },
  { from: "ROAD_BH_W", to: "ROAD_E2" },
  { from: "ROAD_BH_N", to: "ROAD_BH_W" }
];


