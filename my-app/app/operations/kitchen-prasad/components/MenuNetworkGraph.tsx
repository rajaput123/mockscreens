'use client';

import { useState, useEffect, useMemo } from 'react';
import { PrasadMenu } from '../prasadData';
import { FoodIcon } from './FoodIcons';
import { updateNodePhysics, detectClusters } from '../utils/animations';

interface NetworkNode {
  id: string;
  menu: PrasadMenu;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  cluster?: string;
}

interface MenuNetworkGraphProps {
  menus: PrasadMenu[];
  onNodeClick?: (menu: PrasadMenu) => void;
  width?: number;
  height?: number;
}

export default function MenuNetworkGraph({ 
  menus, 
  onNodeClick,
  width = 800,
  height = 500 
}: MenuNetworkGraphProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [animatedNodes, setAnimatedNodes] = useState<NetworkNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Initialize nodes with positions
  const initialNodes = useMemo(() => {
    if (menus.length === 0) return [];

    // Create initial positions in clusters
    const clusters = detectClusters(
      menus.map((m, i) => ({
        id: m.id,
        x: (i % 4) * 200 + 100,
        y: Math.floor(i / 4) * 150 + 100,
      })),
      200
    );

    return menus.map((menu, index) => {
      // Group by meal type or temple
      const mealTypeOffset = menu.mealType === 'breakfast' ? 0 : menu.mealType === 'lunch' ? 1 : 2;
      const x = (index % 3) * 250 + 150 + (mealTypeOffset * 50);
      const y = Math.floor(index / 3) * 180 + 150;
      
      return {
        id: menu.id,
        menu,
        x: Math.max(50, Math.min(width - 50, x)),
        y: Math.max(50, Math.min(height - 50, y)),
        targetX: Math.max(50, Math.min(width - 50, x)),
        targetY: Math.max(50, Math.min(height - 50, y)),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      };
    });
  }, [menus, width, height]);

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

          // Return NetworkNode with updated physics properties
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

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '#a87738'; // amber
      case 'lunch':
        return '#f59e0b'; // amber
      case 'dinner':
        return '#a87738'; // amber
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: PrasadMenu['status']) => {
    switch (status) {
      case 'completed':
      case 'distributed':
        return '#a87738';
      case 'prepared':
        return '#a87738';
      case 'in-progress':
        return '#f59e0b';
      case 'scheduled':
        return '#6b7280';
      case 'draft':
        return '#eab308';
      default:
        return '#6b7280';
    }
  };

  const selectedMenu = selectedNode ? menus.find(m => m.id === selectedNode) : null;

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No menus available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg overflow-hidden">
      <svg 
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        <defs>
          <pattern id="foodDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#f59e0b" opacity="0.2" />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#foodDots)" />

        {/* Connections between related menus */}
        {nodes.map((node, i) => {
          const connections = nodes
            .filter((other, idx) => {
              if (idx === i) return false;
              // Connect menus from same temple or same date
              return (
                other.menu.templeId === node.menu.templeId ||
                other.menu.date === node.menu.date
              );
            })
            .slice(0, 3); // Max 3 connections

          return connections.map((conn) => {
            const dist = Math.sqrt(
              Math.pow(node.x - conn.x, 2) + Math.pow(node.y - conn.y, 2)
            );
            if (dist > 300) return null;

            return (
              <line
                key={`line-${node.id}-${conn.id}`}
                x1={node.x}
                y1={node.y}
                x2={conn.x}
                y2={conn.y}
                stroke="#f59e0b"
                strokeWidth="1"
                opacity="0.2"
                className="transition-all duration-50"
              />
            );
          });
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const color = getMealTypeColor(node.menu.mealType || 'breakfast');
          const statusColor = getStatusColor(node.menu.status);
          const isSelected = selectedNode === node.id;
          const isHovered = hoveredNode === node.id;
          const size = isSelected ? 50 : isHovered ? 45 : 40;

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
                strokeDashoffset={`${2 * Math.PI * (size + 8) * 0.7}`}
                transform={`rotate(-90 ${node.x} ${node.y})`}
                opacity="0.4"
                className="transition-all duration-50"
              />

              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={size}
                fill={color}
                stroke={isSelected ? '#f59e0b' : 'white'}
                strokeWidth={isSelected ? 4 : 2}
                className="cursor-pointer transition-all duration-50"
                onClick={() => {
                  setSelectedNode(node.id);
                  onNodeClick?.(node.menu);
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  filter: isSelected || isHovered ? 'drop-shadow(0 4px 12px rgba(245,158,11,0.4))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }}
              />

              {/* Food icon */}
              <foreignObject
                x={node.x - size * 0.4}
                y={node.y - size * 0.4}
                width={size * 0.8}
                height={size * 0.8}
              >
                <div className="flex items-center justify-center w-full h-full text-white">
                  <FoodIcon mealType={node.menu.mealType || 'breakfast'} size={size * 0.6} />
                </div>
              </foreignObject>

              {/* Label */}
              <text
                x={node.x}
                y={node.y + size + 18}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700 pointer-events-none"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {node.menu.name.length > 15 ? node.menu.name.substring(0, 15) + '...' : node.menu.name}
              </text>

              {/* Time label */}
              <text
                x={node.x}
                y={node.y + size + 32}
                textAnchor="middle"
                className="text-xs fill-gray-500 pointer-events-none"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {node.menu.startTime}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Selected Menu Info Panel */}
      {selectedMenu && (
        <div className="absolute top-4 right-4 bg-white rounded-xl p-4 shadow-lg border border-gray-200 min-w-[250px] animate-[fade-in_0.3s_ease-out]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{selectedMenu.name}</h3>
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
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold text-gray-900">
                {new Date(selectedMenu.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-semibold text-gray-900">{selectedMenu.startTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Meal Type:</span>
              <span className="font-semibold text-gray-900 capitalize">{selectedMenu.mealType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Items:</span>
              <span className="font-semibold text-gray-900">{selectedMenu.items.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-semibold capitalize ${
                selectedMenu.status === 'completed' || selectedMenu.status === 'distributed' ? 'text-amber-600' :
                selectedMenu.status === 'prepared' ? 'text-amber-600' :
                selectedMenu.status === 'in-progress' ? 'text-amber-600' : 'text-gray-600'
              }`}>
                {selectedMenu.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">Meal Types</div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">Breakfast</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">Lunch</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">Dinner</span>
          </div>
        </div>
      </div>
    </div>
  );
}

