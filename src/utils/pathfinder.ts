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

// Build adjacency list for fast lookup during pathfinding
const adjacencyList: { [key: string]: string[] } = {};

// Initialize list
campusNodes.forEach((node) => {
  adjacencyList[node.id] = [];
});

// Populating bidirectional connections
campusEdges.forEach((edge) => {
  if (adjacencyList[edge.from] && adjacencyList[edge.to]) {
    adjacencyList[edge.from].push(edge.to);
    adjacencyList[edge.to].push(edge.from);
  }
});

export interface PathResult {
  path: CampusNode[];
  coordinates: [number, number][];
  distance: number; // in meters
  estimatedTime: number; // in minutes
}

/**
 * Runs the A* (A-Star) Pathfinding Algorithm to find the shortest route between two campus nodes.
 */
export function findShortestPath(startId: string, endId: string): PathResult | null {
  const startNode = campusNodes.find((n) => n.id === startId);
  const endNode = campusNodes.find((n) => n.id === endId);

  if (!startNode || !endNode) return null;

  // Edge case: start is end
  if (startId === endId) {
    return {
      path: [startNode],
      coordinates: [[startNode.lat, startNode.lng]],
      distance: 0,
      estimatedTime: 0,
    };
  }

  // Heuristic function: Straight-line Haversine distance from node to endNode
  const getHeuristicCost = (node: CampusNode): number => {
    return getHaversineDistance(node.lat, node.lng, endNode.lat, endNode.lng);
  };

  const openSet: string[] = [startId];
  const cameFrom: { [key: string]: string } = {};

  const gScore: { [key: string]: number } = {};
  const fScore: { [key: string]: number } = {};

  campusNodes.forEach((node) => {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
  });

  gScore[startId] = 0;
  fScore[startId] = getHeuristicCost(startNode);

  while (openSet.length > 0) {
    // Get the node in openSet with the lowest fScore
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

    // Path found
    if (currentId === endId) {
      const pathNodes: CampusNode[] = [];
      let tempId: string | undefined = currentId;
      while (tempId !== undefined) {
        const node = campusNodes.find((n) => n.id === tempId);
        if (node) pathNodes.unshift(node);
        tempId = cameFrom[tempId];
      }

      const coordinates = pathNodes.map((n) => [n.lat, n.lng] as [number, number]);
      const distance = gScore[endId];
      // Average human walking speed is ~1.4 meters per second
      const estimatedTime = Math.max(1, Math.round(distance / 1.4 / 60)); // at least 1 min if non-zero

      return {
        path: pathNodes,
        coordinates,
        distance: Math.round(distance),
        estimatedTime,
      };
    }

    // Remove current node from openSet
    openSet.splice(currentIndex, 1);

    // Evaluate neighbors
    const neighbors = adjacencyList[currentId] || [];
    for (const neighborId of neighbors) {
      const currentNode = campusNodes.find((n) => n.id === currentId)!;
      const neighborNode = campusNodes.find((n) => n.id === neighborId)!;

      // Distance from current to neighbor
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

  return null; // No path found
}
