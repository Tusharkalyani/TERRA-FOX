export interface CampusDisruption {
  id: string;
  type: "blocked_path" | "room_change" | "maintenance" | "event";
  title: string;
  description: string;
  affectedNodeIds: string[]; // Nodes affected (pathfinding avoids these when active!)
  severity: "critical" | "warning" | "info";
  timestamp: string;
  active: boolean;
  relocation?: {
    originalLocation: string;
    newBuildingId: string;
    newBuildingName: string;
    newRoom: string;
  };
}

export const initialDisruptions: CampusDisruption[] = [
  {
    id: "DISRUPT-1",
    type: "blocked_path",
    title: "Central Spine Road Construction",
    description: "Repaving work near Central Spine (N21 - N22). Pathway closed to pedestrians.",
    affectedNodeIds: ["N21", "N22"],
    severity: "warning",
    timestamp: "10 mins ago",
    active: false
  },

  {
    id: "DISRUPT-2",
    type: "room_change",
    title: "CS302 Data Structures Class Relocated",
    description: "Morning lecture moved from AB2 Room 104 to Academic Block 1 Room 202 due to AC repair.",
    affectedNodeIds: [],
    severity: "info",
    timestamp: "25 mins ago",
    active: true,
    relocation: {
      originalLocation: "AB2 - Room 104",
      newBuildingId: "AB1",
      newBuildingName: "Academic Block 1",
      newRoom: "Room 202"
    }
  },
  {
    id: "DISRUPT-3",
    type: "maintenance",
    title: "Boys Hostel Ring Road Tree Trimming",
    description: "Maintenance crew active on N36 pathway near BH4/BH8.",
    affectedNodeIds: ["N36"],
    severity: "warning",
    timestamp: "1 hour ago",
    active: false
  }
];
