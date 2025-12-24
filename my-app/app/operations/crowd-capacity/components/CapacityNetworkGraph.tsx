'use client';

import { useMemo, useState, useEffect } from 'react';
import { getAllCapacityRules, getUtilization, getCapacityStatusColor } from '../capacityData';
import { getAllTemples } from '../../temple-management/templeData';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  utilization: number;
  capacity: number;
  occupancy: number;
  status: 'active' | 'inactive';
  isLocked: boolean;
  vx: number;
  vy: number;
}

export default function CapacityNetworkGraph() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [temples, setTemples] = useState<Array<{ id: string; name: string; deity?: string }>>([]);
  const [animatedNodes, setAnimatedNodes] = useState<Node[]>([]);

  const initialNodes = useMemo(() => {
    const rules = getAllCapacityRules().filter(r => r.status === 'active');
    
    if (typeof window !== 'undefined') {
      const allTemples = getAllTemples();
      setTemples(allTemples.map(t => ({ id: t.id, name: t.name, deity: t.deity })));
    }

    if (rules.length === 0) return [];

    // Create nodes in a network/cluster layout (scattered like the image)
    // Use viewBox coordinates (0-800 width, 0-500 height)
    const width = 800;
    const height = 500;
    
    // Scatter nodes in a more organic way (not perfect circle)
    const positions = [
      { x: width * 0.2, y: height * 0.2 },
      { x: width * 0.8, y: height * 0.15 },
      { x: width * 0.15, y: height * 0.5 },
      { x: width * 0.85, y: height * 0.45 },
      { x: width * 0.25, y: height * 0.8 },
      { x: width * 0.75, y: height * 0.85 },
      { x: width * 0.5, y: height * 0.3 },
    ];

    return rules.map((rule, index) => {
      const pos = positions[index % positions.length];
      // Add some randomness for organic feel
      const x = pos.x + (Math.random() - 0.5) * 80;
      const y = pos.y + (Math.random() - 0.5) * 60;
      const utilization = getUtilization(rule.currentOccupancy, rule.maxCapacity);
      
      return {
        id: rule.id,
        label: rule.location,
        x: Math.max(50, Math.min(width - 50, x)),
        y: Math.max(50, Math.min(height - 50, y)),
        targetX: Math.max(50, Math.min(width - 50, x)),
        targetY: Math.max(50, Math.min(height - 50, y)),
        utilization,
        capacity: rule.maxCapacity,
        occupancy: rule.currentOccupancy,
        status: rule.status,
        isLocked: rule.isLocked,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      };
    });
  }, []);

  // Initialize animated nodes
  useEffect(() => {
    if (initialNodes.length > 0 && animatedNodes.length === 0) {
      setAnimatedNodes(initialNodes);
    }
  }, [initialNodes]);

  // Animate nodes movement
  useEffect(() => {
    if (animatedNodes.length === 0) return;

    const interval = setInterval(() => {
      setAnimatedNodes(prevNodes => {
        const width = 800;
        const height = 500;
        
        return prevNodes.map(node => {
          // Update position with velocity
          let newX = node.x + node.vx;
          let newY = node.y + node.vy;

          // Bounce off walls
          if (newX < 50 || newX > width - 50) {
            newX = Math.max(50, Math.min(width - 50, newX));
            return { ...node, x: newX, vx: -node.vx };
          }
          if (newY < 50 || newY > height - 50) {
            newY = Math.max(50, Math.min(height - 50, newY));
            return { ...node, y: newY, vy: -node.vy };
          }

          // Gradually move towards target with some drift
          const dx = node.targetX - node.x;
          const dy = node.targetY - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 5) {
            // Move towards target
            newX = node.x + (dx * 0.02) + node.vx;
            newY = node.y + (dy * 0.02) + node.vy;
          } else {
            // Add random drift
            newX = node.x + node.vx;
            newY = node.y + node.vy;
          }

          // Add slight random velocity changes for organic movement
          const newVx = node.vx + (Math.random() - 0.5) * 0.1;
          const newVy = node.vy + (Math.random() - 0.5) * 0.1;

          return {
            ...node,
            x: newX,
            y: newY,
            vx: Math.max(-1, Math.min(1, newVx)),
            vy: Math.max(-1, Math.min(1, newVy)),
          };
        });
      });
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [animatedNodes.length]);

  const nodes = animatedNodes.length > 0 ? animatedNodes : initialNodes;

  const getNodeColor = (utilization: number, isLocked: boolean) => {
    if (isLocked) return '#ef4444'; // red for locked
    const color = getCapacityStatusColor(utilization);
    const colorMap: Record<string, string> = {
      green: '#a87738',
      yellow: '#eab308',
      orange: '#f97316',
      red: '#ef4444',
    };
    return colorMap[color] || '#6b7280';
  };

  const getNodeSize = (capacity: number) => {
    // Scale node size based on capacity (min 30, max 80)
    const minCapacity = Math.min(...nodes.map(n => n.capacity));
    const maxCapacity = Math.max(...nodes.map(n => n.capacity));
    if (maxCapacity === minCapacity) return 50;
    const ratio = (capacity - minCapacity) / (maxCapacity - minCapacity);
    return 30 + ratio * 50;
  };

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <p>No capacity data available</p>
      </div>
    );
  }

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div className="relative w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden">
      {/* Network Canvas */}
      <svg 
        viewBox="0 0 800 500" 
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        {/* Background pattern (subtle dots like in image) */}
        <defs>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#e5e7eb" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />

        {/* Connections/Lines between nodes */}
        {nodes.length > 1 && nodes.map((node, i) => {
          // Connect to nearest nodes
          const connections = nodes
            .map((other, idx) => ({ 
              node: other, 
              idx, 
              dist: Math.sqrt(Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)) 
            }))
            .filter(item => item.idx !== i && item.dist < 250) // Only connect nearby nodes
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 2); // Connect to 2 nearest nodes
          
          return connections.map((conn, connIdx) => (
            <line
              key={`line-${i}-${connIdx}`}
              x1={node.x}
              y1={node.y}
              x2={conn.node.x}
              y2={conn.node.y}
              stroke="#d1d5db"
              strokeWidth="1"
              opacity="0.2"
              className="transition-all duration-50"
            />
          ));
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const size = getNodeSize(node.capacity);
          const color = getNodeColor(node.utilization, node.isLocked);
          const isSelected = selectedNode === node.id;
          
          return (
            <g key={node.id}>
              {/* Node Circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isSelected ? size + 5 : size}
                fill={color}
                stroke={isSelected ? '#f59e0b' : 'white'}
                strokeWidth={isSelected ? 3 : 2}
                className="cursor-pointer transition-all duration-50"
                onClick={() => setSelectedNode(node.id)}
                style={{ 
                  filter: isSelected ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }}
              />
              
              {/* Utilization Ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={size + 8}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * (size + 8)}`}
                strokeDashoffset={`${2 * Math.PI * (size + 8) * (1 - node.utilization / 100)}`}
                transform={`rotate(-90 ${node.x} ${node.y})`}
                opacity="0.3"
                className="transition-all duration-50"
              />

              {/* Locked Indicator */}
              {node.isLocked && (
                <circle
                  cx={node.x + size * 0.6}
                  cy={node.y - size * 0.6}
                  r="8"
                  fill="#ef4444"
                  stroke="white"
                  strokeWidth="2"
                />
              )}

              {/* Label Text (no background, like in image) */}
              <text
                x={node.x}
                y={node.y + size + 15}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700 pointer-events-none transition-all duration-50"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {node.label}
              </text>

              {/* Utilization Text */}
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-bold fill-white pointer-events-none transition-all duration-50"
              >
                {node.utilization}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Selected Node Info Panel */}
      {selectedNodeData && (
        <div className="absolute top-4 right-4 bg-white rounded-xl p-4 shadow-lg border border-gray-200 min-w-[200px] animate-[fade-in_0.3s_ease-out]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{selectedNodeData.label}</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Capacity:</span>
              <span className="font-semibold text-gray-900">{selectedNodeData.capacity.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Occupancy:</span>
              <span className="font-semibold text-gray-900">{selectedNodeData.occupancy.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Utilization:</span>
              <span className={`font-semibold ${
                getCapacityStatusColor(selectedNodeData.utilization) === 'red' ? 'text-red-600' :
                getCapacityStatusColor(selectedNodeData.utilization) === 'orange' ? 'text-orange-600' :
                getCapacityStatusColor(selectedNodeData.utilization) === 'yellow' ? 'text-yellow-600' : 'text-amber-600'
              }`}>
                {selectedNodeData.utilization}%
              </span>
            </div>
            {selectedNodeData.isLocked && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-red-600 font-medium">🔒 Locked</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">Utilization</div>
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">&lt;50%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600">50-70%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">70-90%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">&gt;90%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

