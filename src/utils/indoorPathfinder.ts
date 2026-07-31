import type { IndoorNode } from "../components/IndoorNavigationModal";

export interface IndoorPathResult {
  path: IndoorNode[];
  totalDistance: number; // relative corridor units
  steps: IndoorNavigationStep[];
  nodeCount: number;
}

export interface IndoorNavigationStep {
  type: "start" | "straight" | "turn-left" | "turn-right" | "arrive";
  instruction: string;
  distance: number;
  nodeName: string;
}

/**
 * 2D Euclidean Distance Heuristic h(n) for A* Algorithm
 */
export function getEuclideanHeuristic(a: IndoorNode, b: IndoorNode): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates angle / bearing in degrees between two 2D floor points (0-360 deg)
 */
export function getIndoorBearing(a: IndoorNode, b: IndoorNode): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y; // SVG y grows downwards
  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;
  return (angleDeg + 360) % 360;
}

/**
 * Constructs bidirectional corridor graph adjacency list for AB2 & AB1 floor plans
 */
export function buildIndoorGraph(nodes: IndoorNode[]): Map<string, { node: IndoorNode; dist: number }[]> {
  const adjacencyMap = new Map<string, { node: IndoorNode; dist: number }[]>();

  nodes.forEach((n) => adjacencyMap.set(n.id, []));

  const nodeMap = new Map<string, IndoorNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  // Automatically connect nodes that are nearby in 2D layout (< 35% distance) or along perimeter
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const u = nodes[i];
      const v = nodes[j];
      const dist = getEuclideanHeuristic(u, v);

      // Connect if within corridor range (35% threshold)
      if (dist < 38) {
        adjacencyMap.get(u.id)?.push({ node: v, dist });
        adjacencyMap.get(v.id)?.push({ node: u, dist });
      }
    }
  }

  return adjacencyMap;
}

/**
 * A* (A-Star) Pathfinding Algorithm for Indoor Navigation
 * f(n) = g(n) + h(n)
 */
export function findIndoorPathAStar(
  nodes: IndoorNode[],
  startId: string,
  targetId: string
): IndoorPathResult | null {
  if (nodes.length === 0) return null;

  const nodeMap = new Map<string, IndoorNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const startNode = nodeMap.get(startId);
  const targetNode = nodeMap.get(targetId);

  if (!startNode || !targetNode) return null;

  if (startId === targetId) {
    return {
      path: [startNode],
      totalDistance: 0,
      steps: [
        {
          type: "arrive",
          instruction: `You are already at ${startNode.name}`,
          distance: 0,
          nodeName: startNode.name
        }
      ],
      nodeCount: 1
    };
  }

  const graph = buildIndoorGraph(nodes);

  // A* Open Set, gScore, fScore, cameFrom
  const openSet = new Set<string>([startId]);
  const cameFrom = new Map<string, string>();

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  nodes.forEach((n) => {
    gScore.set(n.id, Infinity);
    fScore.set(n.id, Infinity);
  });

  gScore.set(startId, 0);
  fScore.set(startId, getEuclideanHeuristic(startNode, targetNode));

  while (openSet.size > 0) {
    // Current node in openSet with lowest fScore
    let currentId: string | null = null;
    let lowestF = Infinity;

    openSet.forEach((id) => {
      const f = fScore.get(id) ?? Infinity;
      if (f < lowestF) {
        lowestF = f;
        currentId = id;
      }
    });

    if (!currentId) break;

    // Target reached! Reconstruct A* path
    if (currentId === targetId) {
      const reconstructedPath: IndoorNode[] = [];
      let curr: string | undefined = targetId;

      while (curr) {
        const node = nodeMap.get(curr);
        if (node) reconstructedPath.unshift(node);
        curr = cameFrom.get(curr);
      }

      const totalDistance = Math.round(gScore.get(targetId) || 0);
      const steps = generateIndoorTurnByTurnSteps(reconstructedPath);

      return {
        path: reconstructedPath,
        totalDistance,
        steps,
        nodeCount: reconstructedPath.length
      };
    }

    openSet.delete(currentId);
    const neighbors = graph.get(currentId) || [];

    for (const neighbor of neighbors) {
      const neighborId = neighbor.node.id;
      const tentativeG = (gScore.get(currentId) ?? Infinity) + neighbor.dist;

      if (tentativeG < (gScore.get(neighborId) ?? Infinity)) {
        cameFrom.set(neighborId, currentId);
        gScore.set(neighborId, tentativeG);

        const h = getEuclideanHeuristic(neighbor.node, targetNode);
        fScore.set(neighborId, tentativeG + h);

        openSet.add(neighborId);
      }
    }
  }

  // Fallback direct path if graph severed
  const fallbackPath = [startNode, targetNode];
  return {
    path: fallbackPath,
    totalDistance: Math.round(getEuclideanHeuristic(startNode, targetNode)),
    steps: generateIndoorTurnByTurnSteps(fallbackPath),
    nodeCount: 2
  };
}

/**
 * Generates turn-by-turn indoor directions based on angular changes along A* path
 */
export function generateIndoorTurnByTurnSteps(path: IndoorNode[]): IndoorNavigationStep[] {
  if (path.length === 0) return [];
  if (path.length === 1) {
    return [{
      type: "arrive",
      instruction: `You are at ${path[0].name}`,
      distance: 0,
      nodeName: path[0].name
    }];
  }

  const steps: IndoorNavigationStep[] = [];

  // Step 1: Start
  steps.push({
    type: "start",
    instruction: `Start at ${path[0].name}`,
    distance: Math.round(getEuclideanHeuristic(path[0], path[1])),
    nodeName: path[0].name
  });

  for (let i = 1; i < path.length - 1; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    const next = path[i + 1];

    const bearingIn = getIndoorBearing(prev, curr);
    const bearingOut = getIndoorBearing(curr, next);

    let angleDiff = bearingOut - bearingIn;
    while (angleDiff < -180) angleDiff += 360;
    while (angleDiff > 180) angleDiff -= 360;

    const segmentDist = Math.round(getEuclideanHeuristic(curr, next));

    if (angleDiff > 35) {
      steps.push({
        type: "turn-right",
        instruction: `Turn Right at ${curr.name} into hallway`,
        distance: segmentDist,
        nodeName: curr.name
      });
    } else if (angleDiff < -35) {
      steps.push({
        type: "turn-left",
        instruction: `Turn Left at ${curr.name} along corridor`,
        distance: segmentDist,
        nodeName: curr.name
      });
    } else {
      steps.push({
        type: "straight",
        instruction: `Pass ${curr.name} and proceed straight`,
        distance: segmentDist,
        nodeName: curr.name
      });
    }
  }

  // Final Destination Arrival Step
  const lastNode = path[path.length - 1];
  steps.push({
    type: "arrive",
    instruction: `Arrive at destination: ${lastNode.name}`,
    distance: 0,
    nodeName: lastNode.name
  });

  return steps;
}
