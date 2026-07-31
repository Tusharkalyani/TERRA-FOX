import { campusNodes, campusEdges } from "../data/campusData";
import type { CampusNode } from "../data/campusData";

/**
 * Calculates the geodetic distance between two points using the Haversine formula (in meters)
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

    const roadLabel = curr.name ? `at ${curr.name}` : "onto Campus Road";

    if (turnAngle >= 30 && turnAngle < 150) {
      turnType = "turn-right";
      turnAction = `Turn right ${roadLabel}`;
    } else if (turnAngle >= 150 && turnAngle < 210) {
      turnType = "u-turn";
      turnAction = `Make a U-turn ${roadLabel}`;
    } else if (turnAngle >= 210 && turnAngle < 330) {
      turnType = "turn-left";
      turnAction = `Turn left ${roadLabel}`;
    } else {
      turnAction = curr.name ? `Continue past ${curr.name}` : "Continue along Campus Road";
    }

    steps.push({
      type: turnType,
      instruction: turnAction,
      distance: distToNext,
      nodeName: curr.name || "Campus Road"
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
 * A* Pathfinding Algorithm
 * Strictly travels node-by-node along campus road junction waypoints (N1..N83).
 * Never jumps directly across empty space between buildings!
 */
export function findShortestPath(
  startId: string,
  endId: string,
  userCoords?: [number, number] | null,
  transportMode: TransportMode = "walk",
  blockedNodeIds: string[] = []
): PathResult | null {
  const allNodes: CampusNode[] = [...campusNodes];
  const customAdjacency: { [key: string]: { to: string; weight: number }[] } = {};

  // Initialize adjacency map for all campus nodes
  allNodes.forEach((node) => {
    customAdjacency[node.id] = [];
  });

  // 1. Populate baseline graph edges from campusEdges (Road to Road & Building to Access Road)
  campusEdges.forEach((edge) => {
    const u = allNodes.find((n) => n.id === edge.from);
    const v = allNodes.find((n) => n.id === edge.to);

    if (u && v) {
      const weight = getHaversineDistance(u.lat, u.lng, v.lat, v.lng);
      customAdjacency[u.id].push({ to: v.id, weight });
      customAdjacency[v.id].push({ to: u.id, weight });
    }
  });

  // 2. Ensure every building is linked to its 2 nearest road junction nodes for seamless road entry
  allNodes.forEach((node) => {
    if (node.isBuilding) {
      const sortedRoads = [...campusNodes]
        .filter((n) => !n.isBuilding)
        .sort(
          (n1, n2) =>
            getHaversineDistance(node.lat, node.lng, n1.lat, n1.lng) -
            getHaversineDistance(node.lat, node.lng, n2.lat, n2.lng)
        );

      sortedRoads.slice(0, 2).forEach((road) => {
        const weight = getHaversineDistance(node.lat, node.lng, road.lat, road.lng);
        if (!customAdjacency[node.id].some((e) => e.to === road.id)) {
          customAdjacency[node.id].push({ to: road.id, weight });
          customAdjacency[road.id].push({ to: node.id, weight });
        }
      });
    }
  });

  // 3. Handle MY_LOCATION binding if selected as start or destination
  if (startId === "MY_LOCATION" || endId === "MY_LOCATION") {
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

    // Connect MY_LOCATION to top 3 nearest non-building road nodes for road entry
    const sortedRoads = [...campusNodes]
      .filter((n) => !n.isBuilding && !blockedNodeIds.includes(n.id))
      .sort(
        (n1, n2) =>
          getHaversineDistance(coords[0], coords[1], n1.lat, n1.lng) -
          getHaversineDistance(coords[0], coords[1], n2.lat, n2.lng)
      );

    sortedRoads.slice(0, 3).forEach((nearest) => {
      const weight = getHaversineDistance(coords[0], coords[1], nearest.lat, nearest.lng);
      customAdjacency["MY_LOCATION"].push({ to: nearest.id, weight });
      if (!customAdjacency[nearest.id]) customAdjacency[nearest.id] = [];
      customAdjacency[nearest.id].push({ to: "MY_LOCATION", weight });
    });
  }

  const startNode = allNodes.find((n) => n.id === startId);
  const endNode = allNodes.find((n) => n.id === endId);

  if (!startNode || !endNode) return null;

  // Edge case: start is destination
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

  // --- A* SEARCH ALGORITHM IMPLEMENTATION ---
  // Heuristic function h(n): Straight-line Haversine distance to target destination
  const heuristic = (node: CampusNode): number => {
    return getHaversineDistance(node.lat, node.lng, endNode.lat, endNode.lng);
  };

  const openSet = new Set<string>([startId]);
  const cameFrom: { [key: string]: string } = {};

  const gScore: { [key: string]: number } = {};
  const fScore: { [key: string]: number } = {};

  allNodes.forEach((node) => {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
  });

  gScore[startId] = 0;
  fScore[startId] = heuristic(startNode);

  while (openSet.size > 0) {
    // Select node in openSet with lowest fScore = g(n) + h(n)
    let currentId: string | null = null;
    let lowestF = Infinity;

    for (const nodeId of openSet) {
      if (fScore[nodeId] < lowestF) {
        lowestF = fScore[nodeId];
        currentId = nodeId;
      }
    }

    if (!currentId) break;

    // Target destination reached!
    if (currentId === endId) {
      const pathNodes: CampusNode[] = [];
      let tempId: string | undefined = currentId;
      while (tempId !== undefined) {
        const node = allNodes.find((n) => n.id === tempId);
        if (node) pathNodes.unshift(node);
        tempId = cameFrom[tempId];
      }

      const coordinates = pathNodes.map((n) => [n.lat, n.lng] as [number, number]);
      const totalDistance = Math.round(gScore[endId]);

      // Speed calculation in meters per second
      let speedMs = 1.4; // walk (~5 km/h)
      if (transportMode === "run") speedMs = 3.0; // run (~11 km/h)
      if (transportMode === "cycle") speedMs = 4.5; // cycle (~16 km/h)

      const estimatedTime = Math.max(1, Math.round(totalDistance / speedMs / 60));
      const steps = generateTurnByTurnSteps(pathNodes);
      const hasIndoorSegment = pathNodes.some((n) => (n.floor ?? 0) > 0 || n.buildingId === "AB1");

      return {
        path: pathNodes,
        coordinates,
        distance: totalDistance,
        estimatedTime,
        steps,
        hasIndoorSegment
      };
    }

    openSet.delete(currentId);

    const neighbors = customAdjacency[currentId] || [];
    for (const neighbor of neighbors) {
      const neighborId = neighbor.to;

      // Skip blocked road nodes (live disruptions avoidance!)
      if (blockedNodeIds.includes(neighborId) && neighborId !== startId && neighborId !== endId) {
        continue;
      }

      // Skip intermediate building nodes unless it's the start or destination node
      const neighborNode = allNodes.find((n) => n.id === neighborId);
      if (neighborNode?.isBuilding && neighborId !== endId && neighborId !== startId) {
        continue;
      }

      const tentativeGScore = gScore[currentId] + neighbor.weight;

      if (tentativeGScore < gScore[neighborId]) {
        cameFrom[neighborId] = currentId;
        gScore[neighborId] = tentativeGScore;
        fScore[neighborId] = tentativeGScore + heuristic(neighborNode!);

        if (!openSet.has(neighborId)) {
          openSet.add(neighborId);
        }
      }
    }
  }

  // Fallback: If road graph is completely severed by active road blockades, generate road-node-connected route
  const startRoad = campusNodes
    .filter((n) => !n.isBuilding)
    .sort((a, b) => getHaversineDistance(startNode.lat, startNode.lng, a.lat, a.lng) - getHaversineDistance(startNode.lat, startNode.lng, b.lat, b.lng))[0] || startNode;
  const endRoad = campusNodes
    .filter((n) => !n.isBuilding)
    .sort((a, b) => getHaversineDistance(endNode.lat, endNode.lng, a.lat, a.lng) - getHaversineDistance(endNode.lat, endNode.lng, b.lat, b.lng))[0] || endNode;

  const fallbackNodes = [startNode, startRoad, endRoad, endNode].filter((n, idx, arr) => arr.findIndex((x) => x.id === n.id) === idx);
  let fallbackDistance = 0;
  for (let i = 0; i < fallbackNodes.length - 1; i++) {
    fallbackDistance += getHaversineDistance(fallbackNodes[i].lat, fallbackNodes[i].lng, fallbackNodes[i + 1].lat, fallbackNodes[i + 1].lng);
  }
  fallbackDistance = Math.round(fallbackDistance);

  let speedMs = 1.4;
  if (transportMode === "run") speedMs = 3.0;
  if (transportMode === "cycle") speedMs = 4.5;
  const fallbackTime = Math.max(1, Math.round(fallbackDistance / speedMs / 60));

  return {
    path: fallbackNodes,
    coordinates: fallbackNodes.map((n) => [n.lat, n.lng] as [number, number]),
    distance: fallbackDistance,
    estimatedTime: fallbackTime,
    steps: generateTurnByTurnSteps(fallbackNodes),
    hasIndoorSegment: false
  };

}
