// Animation utilities for Kitchen & Prasad Operations

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export function createParticles(
  x: number,
  y: number,
  count: number = 10,
  colors: string[] = ['#f59e0b', '#ef4444', '#f97316']
): Particle[] {
  return Array.from({ length: count }, () => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    life: 1.0,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map(particle => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      life: particle.life - 0.02,
      vx: particle.vx * 0.98,
      vy: particle.vy * 0.98,
    }))
    .filter(particle => particle.life > 0);
}

export function springAnimation(
  current: number,
  target: number,
  velocity: number = 0,
  stiffness: number = 0.1,
  damping: number = 0.8
): { value: number; velocity: number } {
  const force = (target - current) * stiffness;
  const newVelocity = (velocity + force) * damping;
  const newValue = current + newVelocity;
  
  return {
    value: newValue,
    velocity: newVelocity,
  };
}

export function bounceAnimation(
  current: number,
  target: number,
  velocity: number = 0,
  bounce: number = 0.6
): { value: number; velocity: number } {
  const force = (target - current) * 0.2;
  const newVelocity = (velocity + force) * bounce;
  const newValue = current + newVelocity;
  
  return {
    value: newValue,
    velocity: newVelocity,
  };
}

export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Physics-based node movement
export interface NodePhysics {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
}

export function updateNodePhysics(
  node: NodePhysics,
  attraction: number = 0.02,
  damping: number = 0.9,
  minDistance: number = 5
): NodePhysics {
  const dx = node.targetX - node.x;
  const dy = node.targetY - node.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance > minDistance) {
    node.vx += (dx * attraction);
    node.vy += (dy * attraction);
  }
  
  node.vx *= damping;
  node.vy *= damping;
  node.x += node.vx;
  node.y += node.vy;
  
  return node;
}

// Cluster detection
export function detectClusters(
  nodes: Array<{ x: number; y: number; id: string }>,
  threshold: number = 100
): string[][] {
  const clusters: string[][] = [];
  const visited = new Set<string>();
  
  nodes.forEach(node => {
    if (visited.has(node.id)) return;
    
    const cluster: string[] = [node.id];
    visited.add(node.id);
    
    const findNeighbors = (currentId: string) => {
      const currentNode = nodes.find(n => n.id === currentId);
      if (!currentNode) return;
      
      nodes.forEach(otherNode => {
        if (visited.has(otherNode.id)) return;
        
        const dist = distance(currentNode.x, currentNode.y, otherNode.x, otherNode.y);
        if (dist < threshold) {
          cluster.push(otherNode.id);
          visited.add(otherNode.id);
          findNeighbors(otherNode.id);
        }
      });
    };
    
    findNeighbors(node.id);
    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  });
  
  return clusters;
}

