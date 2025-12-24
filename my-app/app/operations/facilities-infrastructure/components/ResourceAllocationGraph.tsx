'use client';

import { useState, useEffect, useMemo } from 'react';
import { Room, getAllRooms } from '../facilitiesData';
import { ParkingSlot, getAllParkingSlots } from '../facilitiesData';
import { updateNodePhysics } from '../../kitchen-prasad/utils/animations';

interface ResourceNode {
  id: string;
  resource: Room | ParkingSlot;
  type: 'room' | 'parking';
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  category: string;
}

interface ResourceAllocationGraphProps {
  rooms?: Room[];
  parkingSlots?: ParkingSlot[];
  onNodeClick?: (resource: Room | ParkingSlot) => void;
  width?: number;
  height?: number;
}

export default function ResourceAllocationGraph({
  rooms,
  parkingSlots,
  onNodeClick,
  width = 1000,
  height = 600,
}: ResourceAllocationGraphProps) {
  const [animatedNodes, setAnimatedNodes] = useState<ResourceNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  const allRooms = rooms || getAllRooms();
  const allParkingSlots = parkingSlots || getAllParkingSlots();

  // Initialize nodes grouped by category
  const initialNodes = useMemo(() => {
    const nodes: ResourceNode[] = [];
    
    // Group rooms by type
    const roomsByType = allRooms.reduce((acc, room) => {
      if (!acc[room.type]) {
        acc[room.type] = [];
      }
      acc[room.type].push(room);
      return acc;
    }, {} as Record<string, Room[]>);

    // Group parking by location
    const parkingByLocation = allParkingSlots.reduce((acc, slot) => {
      if (!acc[slot.location]) {
        acc[slot.location] = [];
      }
      acc[slot.location].push(slot);
      return acc;
    }, {} as Record<string, ParkingSlot[]>);

    let nodeIndex = 0;
    const categories = [
      ...Object.keys(roomsByType),
      ...Object.keys(parkingByLocation),
    ];

    categories.forEach((category, catIndex) => {
      const angleStep = (2 * Math.PI) / categories.length;
      const radius = Math.min(width, height) * 0.3;
      const centerX = (catIndex % 3) * 300 + 200;
      const centerY = Math.floor(catIndex / 3) * 250 + 150;

      // Add room nodes
      if (roomsByType[category]) {
        roomsByType[category].forEach((room, roomIndex) => {
          const angle = (roomIndex / roomsByType[category].length) * 2 * Math.PI;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          nodes.push({
            id: room.id,
            resource: room,
            type: 'room',
            x: Math.max(50, Math.min(width - 50, x)),
            y: Math.max(50, Math.min(height - 50, y)),
            targetX: Math.max(50, Math.min(width - 50, x)),
            targetY: Math.max(50, Math.min(height - 50, y)),
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            category,
          });
        });
      }

      // Add parking nodes
      if (parkingByLocation[category]) {
        parkingByLocation[category].forEach((slot, slotIndex) => {
          const angle = (slotIndex / parkingByLocation[category].length) * 2 * Math.PI;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          nodes.push({
            id: slot.id,
            resource: slot,
            type: 'parking',
            x: Math.max(50, Math.min(width - 50, x)),
            y: Math.max(50, Math.min(height - 50, y)),
            targetX: Math.max(50, Math.min(width - 50, x)),
            targetY: Math.max(50, Math.min(height - 50, y)),
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            category,
          });
        });
      }
    });

    return nodes;
  }, [allRooms, allParkingSlots, width, height]);

  // Initialize animated nodes
  useEffect(() => {
    if (initialNodes.length > 0 && animatedNodes.length === 0) {
      setAnimatedNodes(initialNodes);
    }
  }, [initialNodes]);

  // Animate nodes
  useEffect(() => {
    if (animatedNodes.length === 0) return;

    const interval = setInterval(() => {
      setAnimatedNodes(prevNodes => {
        return prevNodes.map(node => {
          const updated = updateNodePhysics(node, 0.02, 0.9, 5);
          
          // Bounce off walls
          if (updated.x < 50 || updated.x > width - 50) {
            updated.x = Math.max(50, Math.min(width - 50, updated.x));
            updated.vx = -updated.vx * 0.5;
          }
          if (updated.y < 50 || updated.y > height - 50) {
            updated.y = Math.max(50, Math.min(height - 50, updated.y));
            updated.vy = -updated.vy * 0.5;
          }

          // Return ResourceNode with updated physics properties
          return {
            ...node,
            x: updated.x,
            y: updated.y,
            vx: updated.vx,
            vy: updated.vy,
            targetX: updated.targetX,
            targetY: updated.targetY,
          };
        });
      });
    }, 50);

    return () => clearInterval(interval);
  }, [animatedNodes.length, width, height]);

  const nodes = animatedNodes.length > 0 ? animatedNodes : initialNodes;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#a87738'; // Green
      case 'occupied':
        return '#dc2626'; // Red
      case 'maintenance':
        return '#f59e0b'; // Amber
      case 'reserved':
        return '#2563eb'; // Blue
      default:
        return '#6b7280';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lodge':
        return '#3b82f6';
      case 'hall':
        return '#8b5cf6';
      case 'parking':
        return '#a87738';
      default:
        return '#6b7280';
    }
  };

  const getNodeSize = (resource: Room | ParkingSlot) => {
    if ('capacity' in resource) {
      // Room
      return 30 + (resource.capacity / 10) * 20;
    } else {
      // Parking slot
      return 25;
    }
  };

  // Group nodes by category for connections
  const nodesByCategory = nodes.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, ResourceNode[]>);

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No resources available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden">
      <svg 
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        <defs>
          <pattern id="resourceDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#8b5cf6" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#resourceDots)" />

        {/* Connections between resources in same category */}
        {Object.values(nodesByCategory).map((categoryNodes) => {
          if (categoryNodes.length < 2) return null;
          
          return categoryNodes.map((node, i) => {
            const nextNode = categoryNodes[(i + 1) % categoryNodes.length];
            return (
              <line
                key={`line-${node.id}-${nextNode.id}`}
                x1={node.x}
                y1={node.y}
                x2={nextNode.x}
                y2={nextNode.y}
                stroke="#8b5cf6"
                strokeWidth="1"
                opacity="0.2"
                className="transition-all duration-50"
              />
            );
          });
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const size = getNodeSize(node.resource);
          const statusColor = getStatusColor(node.resource.status);
          const typeColor = getTypeColor(
            node.type === 'room' ? (node.resource as Room).type : 'parking'
          );
          const isHovered = hoveredNode === node.id;

          return (
            <g key={node.id}>
              {/* Status ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={size + 8}
                fill="none"
                stroke={statusColor}
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * (size + 8)}`}
                strokeDashoffset={`${2 * Math.PI * (size + 8) * 0.3}`}
                transform={`rotate(-90 ${node.x} ${node.y})`}
                opacity="0.4"
                className="transition-all duration-50"
              />

              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? size + 5 : size}
                fill={typeColor}
                stroke={isHovered ? '#8b5cf6' : 'white'}
                strokeWidth={isHovered ? 4 : 2}
                className="cursor-pointer transition-all duration-50"
                onClick={() => onNodeClick?.(node.resource)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  filter: isHovered ? `drop-shadow(0 4px 12px ${typeColor}40)` : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }}
              />

              {/* Resource label */}
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-bold fill-white pointer-events-none"
              >
                {node.type === 'room' 
                  ? (node.resource as Room).name.substring(0, 3).toUpperCase()
                  : (node.resource as ParkingSlot).slotNumber.substring(0, 3)
                }
              </text>

              {/* Label */}
              <text
                x={node.x}
                y={node.y + size + 18}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700 pointer-events-none"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {node.type === 'room'
                  ? (node.resource as Room).name.length > 12 
                    ? (node.resource as Room).name.substring(0, 12) + '...' 
                    : (node.resource as Room).name
                  : (node.resource as ParkingSlot).slotNumber
                }
              </text>

              {/* Status label */}
              <text
                x={node.x}
                y={node.y + size + 32}
                textAnchor="middle"
                className="text-xs fill-gray-500 pointer-events-none capitalize"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {node.resource.status}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">Resource Types</div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">Lodge</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">Hall</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">Parking</span>
          </div>
        </div>
      </div>
    </div>
  );
}

