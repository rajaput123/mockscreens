'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Activity } from '../operationalPlanningData';
import { updateNodePhysics } from '../../kitchen-prasad/utils/animations';

interface ActivityNode {
  id: string;
  activity: Activity;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
}

interface ActivityNetworkGraphProps {
  activities: Activity[];
  onActivityClick?: (activity: Activity) => void;
  width?: number;
  height?: number;
}

export default function ActivityNetworkGraph({
  activities,
  onActivityClick,
  width = 1200,
  height = 700,
}: ActivityNetworkGraphProps) {
  const [animatedNodes, setAnimatedNodes] = useState<ActivityNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltipActivity, setTooltipActivity] = useState<Activity | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Initialize nodes grouped by type
  const initialNodes = useMemo(() => {
    const nodes: ActivityNode[] = [];
    const activitiesByType = activities.reduce((acc, activity) => {
      if (!acc[activity.type]) {
        acc[activity.type] = [];
      }
      acc[activity.type].push(activity);
      return acc;
    }, {} as Record<string, Activity[]>);

    const types = Object.keys(activitiesByType);
    const radius = Math.min(width, height) * 0.3;

    types.forEach((type, typeIndex) => {
      const typeActivities = activitiesByType[type];
      const angleStep = (2 * Math.PI) / typeActivities.length;
      const centerX = (typeIndex % 3) * 350 + 200;
      const centerY = Math.floor(typeIndex / 3) * 300 + 200;

      typeActivities.forEach((activity, activityIndex) => {
        const angle = activityIndex * angleStep;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        nodes.push({
          id: activity.id,
          activity,
          x: Math.max(80, Math.min(width - 80, x)),
          y: Math.max(80, Math.min(height - 80, y)),
          targetX: Math.max(80, Math.min(width - 80, x)),
          targetY: Math.max(80, Math.min(height - 80, y)),
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        });
      });
    });

    return nodes;
  }, [activities, width, height]);

  useEffect(() => {
    if (initialNodes.length > 0 && animatedNodes.length === 0) {
      setAnimatedNodes(initialNodes);
    }
  }, [initialNodes]);

  // Animate nodes (only when not dragging)
  useEffect(() => {
    if (animatedNodes.length === 0 || draggedNode) return;

    const interval = setInterval(() => {
      setAnimatedNodes(prevNodes => {
        return prevNodes.map(node => {
          // Skip animation for dragged node
          if (node.id === draggedNode) return node;

          const updated = updateNodePhysics(node, 0.02, 0.9, 5);
          
          // Bounce off walls
          if (updated.x < 80 || updated.x > width - 80) {
            updated.x = Math.max(80, Math.min(width - 80, updated.x));
            updated.vx = -updated.vx * 0.5;
          }
          if (updated.y < 80 || updated.y > height - 80) {
            updated.y = Math.max(80, Math.min(height - 80, updated.y));
            updated.vy = -updated.vy * 0.5;
          }

          // Return ActivityNode with updated physics properties
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
  }, [animatedNodes.length, width, height, draggedNode]);

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent<SVGCircleElement>, nodeId: string, nodeX: number, nodeY: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse() || undefined);

    setDraggedNode(nodeId);
    setDragOffset({
      x: svgPoint.x - nodeX,
      y: svgPoint.y - nodeY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNode || !dragOffset || !svgRef.current) return;

    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse() || undefined);

    const newX = Math.max(80, Math.min(width - 80, svgPoint.x - dragOffset.x));
    const newY = Math.max(80, Math.min(height - 80, svgPoint.y - dragOffset.y));

    setAnimatedNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === draggedNode
          ? {
              ...node,
              x: newX,
              y: newY,
              targetX: newX,
              targetY: newY,
              vx: 0,
              vy: 0,
            }
          : node
      )
    );
  };

  const handleMouseUp = () => {
    if (draggedNode) {
      setAnimatedNodes(prevNodes =>
        prevNodes.map(node =>
          node.id === draggedNode
            ? {
                ...node,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
              }
            : node
        )
      );
    }
    setDraggedNode(null);
    setDragOffset(null);
  };

  const nodes = animatedNodes.length > 0 ? animatedNodes : initialNodes;

  const getTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'ritual':
        return '#8b5cf6';
      case 'prasad':
        return '#f97316';
      case 'maintenance':
        return '#3b82f6';
      case 'cleaning':
        return '#a87738';
      case 'security':
        return '#ef4444';
      case 'event':
        return '#ec4899';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return '#a87738';
      case 'in-progress':
        return '#3b82f6';
      case 'delayed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getNodeSize = (activity: Activity) => {
    if (activity.priority === 'critical') return 45;
    if (activity.priority === 'high') return 40;
    if (activity.priority === 'medium') return 35;
    return 30;
  };

  // Get connections based on dependencies
  const getConnections = () => {
    const connections: { from: string; to: string }[] = [];
    
    nodes.forEach(node => {
      node.activity.dependencies.forEach(depId => {
        const depNode = nodes.find(n => n.activity.id === depId);
        if (depNode) {
          connections.push({ from: depNode.id, to: node.id });
        }
      });
    });

    return connections;
  };

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No activities available</p>
      </div>
    );
  }

  const hoveredNodeData = hoveredNode ? nodes.find(n => n.id === hoveredNode) : null;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg overflow-hidden"
    >
      <svg 
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <pattern id="activityDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#8b5cf6" opacity="0.2" />
          </pattern>
          <marker
            id="arrowhead-activity"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#8b5cf6" />
          </marker>
        </defs>
        <rect width="100%" height="100%" fill="url(#activityDots)" />

        {/* Connections */}
        {getConnections().map((conn, index) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <line
              key={`${conn.from}-${conn.to}-${index}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="#8b5cf6"
              strokeWidth="2"
              opacity="0.4"
              markerEnd="url(#arrowhead-activity)"
              className="transition-all duration-50"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, nodeIndex) => {
          const size = getNodeSize(node.activity);
          const typeColor = getTypeColor(node.activity.type);
          const statusColor = getStatusColor(node.activity.status);
          const isHovered = hoveredNode === node.id;

          return (
            <g key={`node-${node.id}-${nodeIndex}`}>
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
                r={isHovered || draggedNode === node.id ? size + 5 : size}
                fill={typeColor}
                stroke={isHovered || draggedNode === node.id ? '#8b5cf6' : 'white'}
                strokeWidth={isHovered || draggedNode === node.id ? 4 : 2}
                className={`${draggedNode === node.id ? 'cursor-grabbing' : 'cursor-grab'} transition-all duration-50`}
                onClick={(e) => {
                  if (!draggedNode) {
                    onActivityClick?.(node.activity);
                  }
                }}
                onMouseDown={(e) => handleMouseDown(e, node.id, node.x, node.y)}
                onMouseEnter={() => {
                  if (!draggedNode) {
                    setHoveredNode(node.id);
                    setTooltipActivity(node.activity);
                  }
                }}
                onMouseLeave={() => {
                  if (!draggedNode) {
                    setHoveredNode(null);
                    setTooltipActivity(null);
                  }
                }}
                style={{
                  filter: isHovered || draggedNode === node.id 
                    ? `drop-shadow(0 4px 12px ${typeColor}40)` 
                    : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  transform: draggedNode === node.id ? 'scale(1.1)' : 'scale(1)',
                  transition: draggedNode === node.id ? 'none' : 'all 0.1s ease-out',
                }}
              />

              {/* Activity label */}
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-bold fill-white pointer-events-none"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {node.activity.name.substring(0, 6)}
              </text>

              {/* Time label */}
              <text
                x={node.x}
                y={node.y + size + 18}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700 pointer-events-none"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {node.activity.startTime}
              </text>

              {/* Status label */}
              <text
                x={node.x}
                y={node.y + size + 32}
                textAnchor="middle"
                className="text-xs fill-gray-500 pointer-events-none capitalize"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {node.activity.status}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      {hoveredNode && tooltipActivity && hoveredNodeData && (
        <div
          className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 pointer-events-none"
          style={{
            left: `${(hoveredNodeData.x / width) * 100}%`,
            top: `${(hoveredNodeData.y / height) * 100}%`,
            transform: 'translate(20px, -50%)',
            minWidth: '240px',
            maxWidth: '320px',
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-bold text-gray-900 text-sm leading-tight">{tooltipActivity.name}</h4>
            <span
              className="ml-2 px-2 py-0.5 rounded text-xs font-semibold capitalize whitespace-nowrap"
              style={{
                backgroundColor: `${getStatusColor(tooltipActivity.status)}20`,
                color: getStatusColor(tooltipActivity.status),
              }}
            >
              {tooltipActivity.status}
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{tooltipActivity.startTime} - {tooltipActivity.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{tooltipActivity.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="capitalize">{tooltipActivity.type}</span>
              <span className="mx-1">•</span>
              <span className="capitalize font-medium">{tooltipActivity.priority} priority</span>
            </div>
            {tooltipActivity.description && (
              <p className="text-gray-500 mt-2 line-clamp-2">{tooltipActivity.description}</p>
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">Click for full details</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">Activity Types</div>
        <div className="flex flex-col gap-2 text-xs">
          {['ritual', 'prasad', 'maintenance', 'cleaning', 'security', 'event'].map((type) => {
            const color = getTypeColor(type as Activity['type']);
            return (
              <div key={type} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-gray-600 capitalize">{type}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

