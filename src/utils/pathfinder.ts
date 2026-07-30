import { campusNodes, campusEdges } from "../data/campusData";
import type { CampusNode } from "../data/campusData";

/**
 * Calculates the geodetic distance between two points using the Haversine formula
 */
export function getHaversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // returns distance in meters
}

/**
 * Calculates compass bearing (angle in degrees 0-360) from point 1 to point 2
 */
export function getBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return ((θ * 180) / Math.PI + 360) % 360;
}

/**
 * Converts a compass bearing degree into a cardinal direction label
 */
export function getCardinalDirection(bearing: number): string {
  if (bearing >= 337.5 || bearing < 22.5) return "North";
  if (bearing >= 22.5 && bearing < 67.5) return "Northeast";
  if (bearing >= 67.5 && bearing < 112.5) return "East";
  if (bearing >= 112.5 && bearing < 157.5) return "Southeast";
  if (bearing >= 157.5 && bearing < 202.5) return "South";
  if (bearing >= 202.5 && bearing < 247.5) return "Southwest";
  if (bearing >= 247.5 && bearing < 292.5) return "West";
  return "Northwest";
}

export type TransportMode = "walk" | "run" | "cycle";

export interface NavigationStep {
  type: "start" | "straight" | "turn-left" | "turn-right" | "u-turn" | "stairs" | "arrive";
  instruction: string;
  distance: number; // meters
  nodeName: string;
}

export interface PathResult {
  path: CampusNode[];
  coordinates: [number, number][];
  distance: number; // in meters
  estimatedTime: number; // in minutes
  steps: NavigationStep[];
  hasIndoorSegment: boolean;
}

/**
 * Generates human-readable turn-by-turn steps from an array of path nodes
 */
export function generateTurnByTurnSteps(path: CampusNode[]): NavigationStep[] {
  if (path.length === 0) return [];
  if (path.length === 1) {
    return [{
      type: "arrive",
      instruction: `You are at ${path[0].name}`,
      distance: 0,
      nodeName: path[0].name
    }];
  }

  const steps: NavigationStep[] = [];

  // Step 1: Start
  const firstBearing = getBearing(path[0].lat, path[0].lng, path[1].lat, path[1].lng);
  const startDir = getCardinalDirection(firstBearing);
  const firstDist = Math.round(getHaversineDistance(path[0].lat, path[0].lng, path[1].lat, path[1].lng));

  steps.push({
    type: "start",
    instruction: `Head ${startDir} from ${path[0].name}`,
    distance: firstDist,
    nodeName: path[0].name
  });

  // Intermediate steps
  for (let i = 1; i < path.length - 1; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    const next = path[i + 1];

    const distToNext = Math.round(getHaversineDistance(curr.lat, curr.lng, next.lat, next.lng));

    // Floor transition check
    if (curr.floor !== undefined && next.floor !== undefined && curr.floor !== next.floor) {
      steps.push({
        type: "stairs",
        instruction: `Take stairwell / elevator to Floor ${next.floor} (${next.name})`,
        distance: distToNext,
        nodeName: curr.name
      });
      continue;
    }

    const b1 = getBearing(prev.lat, prev.lng, curr.lat, curr.lng);
    const b2 = getBearing(curr.lat, curr.lng, next.lat, next.lng);
    const turnAngle = (b2 - b1 + 360) % 360;

    let turnType: NavigationStep["type"] = "straight";
    let turnAction = "Continue straight";

    if (turnAngle >= 30 && turnAngle < 150) {
      turnType = "turn-right";
      turnAction = "Turn right";
    } else if (turnAngle >= 150 && turnAngle < 210) {
      turnType = "u-turn";
      turnAction = "Make a U-turn";
    } else if (turnAngle >= 210 && turnAngle < 330) {
      turnType = "turn-left";
      turnAction = "Turn left";
    }

    steps.push({
      type: turnType,
      instruction: `${turnAction} at ${curr.name}`,
      distance: distToNext,
      nodeName: curr.name
    });
  }

  // Final Step: Destination arrival
  const destination = path[path.length - 1];
  steps.push({
    type: "arrive",
    instruction: `Arrive at ${destination.name}`,
    distance: 0,
    nodeName: destination.name
  });

  return steps;
}

/**
 * Runs 2D/3D A* Pathfinding Algorithm with dynamic user location binding
 */
export function findShortestPath(
  startId: string,
  endId: string,
  userCoords?: [number, number] | null,
  transportMode: TransportMode = "walk"
): PathResult | null {
  // 1. Prepare Nodes & Virtual Node for MY_LOCATION if requested
  const allNodes: CampusNode[] = [...campusNodes];
  const customAdjacency: { [key: string]: string[] } = {};

  // Build baseline adjacency
  campusNodes.forEach((node) => {
    customAdjacency[node.id] = [];
  });
  campusEdges.forEach((edge) => {
    if (customAdjacency[edge.from] && customAdjacency[edge.to]) {
      customAdjacency[edge.from].push(edge.to);
      customAdjacency[edge.to].push(edge.from);
    }
  });

  // Handle MY_LOCATION binding if selected as start or destination
  if (startId === "MY_LOCATION" || endId === "MY_LOCATION") {
    // Default fallback coordinates if userCoords not supplied
    const coords = userCoords || [23.075670, 76.854422];
    const myLocationNode: CampusNode = {
      id: "MY_LOCATION",
      name: "My Location",
      lat: coords[0],
      lng: coords[1],
      isBuilding: false,
      floor: 0,
      alt: 0
    };

    allNodes.push(myLocationNode);
    customAdjacency["MY_LOCATION"] = [];

    // Connect MY_LOCATION to nearest non-building road/junction node
    let nearestNodeId = "";
    let minDistance = Infinity;

    campusNodes.forEach((node) => {
      if (!node.isBuilding) {
        const dist = getHaversineDistance(coords[0], coords[1], node.lat, node.lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearestNodeId = node.id;
        }
      }
    });

    if (nearestNodeId) {
      customAdjacency["MY_LOCATION"].push(nearestNodeId);
      if (!customAdjacency[nearestNodeId]) customAdjacency[nearestNodeId] = [];
      customAdjacency[nearestNodeId].push("MY_LOCATION");
    }
  }

  const startNode = allNodes.find((n) => n.id === startId);
  const endNode = allNodes.find((n) => n.id === endId);

  if (!startNode || !endNode) return null;

  // Edge case: start is end
  if (startId === endId) {
    const steps = generateTurnByTurnSteps([startNode]);
    return {
      path: [startNode],
      coordinates: [[startNode.lat, startNode.lng]],
      distance: 0,
      estimatedTime: 0,
      steps,
      hasIndoorSegment: (startNode.floor ?? 0) > 0
    };
  }

  // A* Search
  const getHeuristicCost = (node: CampusNode): number => {
    return getHaversineDistance(node.lat, node.lng, endNode.lat, endNode.lng);
  };

  const openSet: string[] = [startId];
  const cameFrom: { [key: string]: string } = {};

  const gScore: { [key: string]: number } = {};
  const fScore: { [key: string]: number } = {};

  allNodes.forEach((node) => {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
  });

  gScore[startId] = 0;
  fScore[startId] = getHeuristicCost(startNode);

  while (openSet.length > 0) {
    let currentId = openSet[0];
    let lowestF = fScore[currentId];
    let currentIndex = 0;

    for (let i = 1; i < openSet.length; i++) {
      const id = openSet[i];
      if (fScore[id] < lowestF) {
        lowestF = fScore[id];
        currentId = id;
        currentIndex = i;
      }
    }

    if (currentId === endId) {
      const pathNodes: CampusNode[] = [];
      let tempId: string | undefined = currentId;
      while (tempId !== undefined) {
        const node = allNodes.find((n) => n.id === tempId);
        if (node) pathNodes.unshift(node);
        tempId = cameFrom[tempId];
      }

      const coordinates = pathNodes.map((n) => [n.lat, n.lng] as [number, number]);
      const distance = gScore[endId];

      // Speed multipliers in meters per second
      let speedMs = 1.4; // walk
      if (transportMode === "run") speedMs = 3.0;
      if (transportMode === "cycle") speedMs = 4.5;

      const estimatedTime = Math.max(1, Math.round(distance / speedMs / 60));
      const steps = generateTurnByTurnSteps(pathNodes);
      const hasIndoorSegment = pathNodes.some((n) => (n.floor ?? 0) > 0 || n.buildingId === "AB1");

      return {
        path: pathNodes,
        coordinates,
        distance: Math.round(distance),
        estimatedTime,
        steps,
        hasIndoorSegment
      };
    }

    openSet.splice(currentIndex, 1);

    const neighbors = customAdjacency[currentId] || [];
    for (const neighborId of neighbors) {
      const currentNode = allNodes.find((n) => n.id === currentId)!;
      const neighborNode = allNodes.find((n) => n.id === neighborId)!;

      // Skip intermediate building nodes unless it's the final destination
      if (neighborNode.isBuilding && neighborId !== endId && neighborId !== startId) {
        continue;
      }

      const stepCost = getHaversineDistance(
        currentNode.lat,
        currentNode.lng,
        neighborNode.lat,
        neighborNode.lng
      );

      const tentativeGScore = gScore[currentId] + stepCost;

      if (tentativeGScore < gScore[neighborId]) {
        cameFrom[neighborId] = currentId;
        gScore[neighborId] = tentativeGScore;
        fScore[neighborId] = tentativeGScore + getHeuristicCost(neighborNode);

        if (!openSet.includes(neighborId)) {
          openSet.push(neighborId);
        }
      }
    }
  }

  return null;
}
