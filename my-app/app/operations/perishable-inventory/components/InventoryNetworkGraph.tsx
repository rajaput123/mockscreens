'use client';

import { useState, useEffect, useMemo } from 'react';
import { InventoryItem, getAllInventoryItems, getStockStatus } from '../inventoryData';
import { StockBatch, getAllStockBatches, getBatchesByLocation } from '../inventoryData';
import { updateNodePhysics } from '../../kitchen-prasad/utils/animations';

interface NetworkNode {
  id: string;
  item: InventoryItem;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  location: string;
}

interface InventoryNetworkGraphProps {
  items: InventoryItem[];
  onNodeClick?: (item: InventoryItem) => void;
  width?: number;
  height?: number;
}

export default function InventoryNetworkGraph({
  items,
  onNodeClick,
  width = 800,
  height = 500,
}: InventoryNetworkGraphProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [animatedNodes, setAnimatedNodes] = useState<NetworkNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [batches] = useState<StockBatch[]>(getAllStockBatches());

  // Initialize nodes grouped by location
  const initialNodes = useMemo(() => {
    if (items.length === 0) return [];

    // Group items by location
    const itemsByLocation = items.reduce((acc, item) => {
      if (!acc[item.location]) {
        acc[item.location] = [];
      }
      acc[item.location].push(item);
      return acc;
    }, {} as Record<string, InventoryItem[]>);

    const locations = Object.keys(itemsByLocation);
    const nodes: NetworkNode[] = [];

    locations.forEach((location, locIndex) => {
      const locationItems = itemsByLocation[location];
      const angleStep = (2 * Math.PI) / locationItems.length;
      const radius = 120;
      const centerX = (locIndex % 3) * 250 + 200;
      const centerY = Math.floor(locIndex / 3) * 200 + 150;

      locationItems.forEach((item, itemIndex) => {
        const angle = itemIndex * angleStep;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        nodes.push({
          id: item.id,
          item,
          x: Math.max(50, Math.min(width - 50, x)),
          y: Math.max(50, Math.min(height - 50, y)),
          targetX: Math.max(50, Math.min(width - 50, x)),
          targetY: Math.max(50, Math.min(height - 50, y)),
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          location,
        });
      });
    });

    return nodes;
  }, [items, width, height]);

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

  const getStockStatusColor = (item: InventoryItem) => {
    const status = getStockStatus(item);
    switch (status) {
      case 'good':
        return '#a87738'; // Green
      case 'low':
        return '#f59e0b'; // Amber
      case 'critical':
        return '#dc2626'; // Red
      default:
        return '#6b7280';
    }
  };

  const getCategoryColor = (category: InventoryItem['category']) => {
    switch (category) {
      case 'vegetables':
        return '#22c55e';
      case 'grains':
        return '#eab308';
      case 'spices':
        return '#f97316';
      case 'dairy':
        return '#3b82f6';
      case 'fruits':
        return '#ec4899';
      default:
        return '#6b7280';
    }
  };

  const getNodeSize = (item: InventoryItem) => {
    const maxStock = Math.max(...items.map(i => i.maxStockLevel));
    const ratio = item.currentStock / maxStock;
    return 30 + ratio * 40;
  };

  const selectedItem = selectedNode ? items.find(i => i.id === selectedNode) : null;
  const selectedBatches = selectedItem ? batches.filter(b => b.itemId === selectedItem.id && b.status === 'active') : [];

  // Group nodes by location for connections
  const nodesByLocation = nodes.reduce((acc, node) => {
    if (!acc[node.location]) {
      acc[node.location] = [];
    }
    acc[node.location].push(node);
    return acc;
  }, {} as Record<string, NetworkNode[]>);

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No inventory items available</p>
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
          <pattern id="inventoryDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#f59e0b" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#inventoryDots)" />

        {/* Connections between items in same location */}
        {Object.values(nodesByLocation).map((locationNodes) => {
          if (locationNodes.length < 2) return null;
          
          return locationNodes.map((node, i) => {
            const nextNode = locationNodes[(i + 1) % locationNodes.length];
            return (
              <line
                key={`line-${node.id}-${nextNode.id}`}
                x1={node.x}
                y1={node.y}
                x2={nextNode.x}
                y2={nextNode.y}
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
          const size = getNodeSize(node.item);
          const statusColor = getStockStatusColor(node.item);
          const categoryColor = getCategoryColor(node.item.category);
          const isSelected = selectedNode === node.id;
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
                r={isSelected ? size + 5 : isHovered ? size + 3 : size}
                fill={categoryColor}
                stroke={isSelected ? '#f59e0b' : 'white'}
                strokeWidth={isSelected ? 4 : 2}
                className="cursor-pointer transition-all duration-50"
                onClick={() => {
                  setSelectedNode(node.id);
                  onNodeClick?.(node.item);
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  filter: isSelected || isHovered ? `drop-shadow(0 4px 12px ${categoryColor}40)` : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }}
              />

              {/* Stock level indicator */}
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-bold fill-white pointer-events-none"
              >
                {node.item.currentStock}
              </text>

              {/* Label */}
              <text
                x={node.x}
                y={node.y + size + 18}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700 pointer-events-none"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {node.item.name.length > 12 ? node.item.name.substring(0, 12) + '...' : node.item.name}
              </text>

              {/* Location label */}
              <text
                x={node.x}
                y={node.y + size + 32}
                textAnchor="middle"
                className="text-xs fill-gray-500 pointer-events-none"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {node.location}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Selected Item Info Panel */}
      {selectedItem && (
        <div className="absolute top-4 right-4 bg-white rounded-xl p-4 shadow-lg border border-gray-200 min-w-[250px] animate-[fade-in_0.3s_ease-out]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{selectedItem.name}</h3>
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
              <span className="text-gray-600">Stock:</span>
              <span className="font-semibold text-gray-900">
                {selectedItem.currentStock} {selectedItem.unit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-semibold text-gray-900">{selectedItem.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-semibold text-gray-900 capitalize">{selectedItem.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Batches:</span>
              <span className="font-semibold text-gray-900">{selectedBatches.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-semibold capitalize ${
                getStockStatus(selectedItem) === 'good' ? 'text-amber-600' :
                getStockStatus(selectedItem) === 'low' ? 'text-amber-600' : 'text-red-600'
              }`}>
                {getStockStatus(selectedItem)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">Categories</div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">Vegetables</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600">Grains</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">Spices</span>
          </div>
        </div>
      </div>
    </div>
  );
}

