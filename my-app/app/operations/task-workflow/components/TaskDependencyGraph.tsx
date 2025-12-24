'use client';

import { useState, useEffect, useMemo } from 'react';
import { Task, getAllTasks, getTaskDependencies, getBlockingTasks } from '../taskWorkflowData';
import { updateNodePhysics } from '../../kitchen-prasad/utils/animations';

interface TaskNode {
  id: string;
  task: Task;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
}

interface TaskDependencyGraphProps {
  tasks: Task[];
  selectedTaskId?: string;
  onTaskClick?: (task: Task) => void;
  width?: number;
  height?: number;
}

export default function TaskDependencyGraph({
  tasks,
  selectedTaskId,
  onTaskClick,
  width = 1200,
  height = 700,
}: TaskDependencyGraphProps) {
  const [animatedNodes, setAnimatedNodes] = useState<TaskNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Initialize nodes in a force-directed layout
  const initialNodes = useMemo(() => {
    const nodes: TaskNode[] = [];
    const taskCount = tasks.length;
    const radius = Math.min(width, height) * 0.35;
    const centerX = width / 2;
    const centerY = height / 2;

    tasks.forEach((task, index) => {
      const angle = (index / taskCount) * 2 * Math.PI;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      nodes.push({
        id: task.id,
        task,
        x: Math.max(80, Math.min(width - 80, x)),
        y: Math.max(80, Math.min(height - 80, y)),
        targetX: Math.max(80, Math.min(width - 80, x)),
        targetY: Math.max(80, Math.min(height - 80, y)),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    });

    return nodes;
  }, [tasks, width, height]);

  useEffect(() => {
    if (initialNodes.length > 0 && animatedNodes.length === 0) {
      setAnimatedNodes(initialNodes);
    }
  }, [initialNodes]);

  // Animate nodes with force-directed layout
  useEffect(() => {
    if (animatedNodes.length === 0) return;

    const interval = setInterval(() => {
      setAnimatedNodes(prevNodes => {
        return prevNodes.map(node => {
          // Apply physics
          let updated = updateNodePhysics(node, 0.02, 0.9, 5);

          // Apply repulsion from other nodes
          prevNodes.forEach(otherNode => {
            if (otherNode.id === node.id) return;
            
            const dx = updated.x - otherNode.x;
            const dy = updated.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0 && distance < 150) {
              const force = 0.1 / distance;
              updated.vx += (dx / distance) * force;
              updated.vy += (dy / distance) * force;
            }
          });

          // Apply attraction for dependencies
          const dependencies = getTaskDependencies(node.task.id);
          dependencies.forEach(depTask => {
            const depNode = prevNodes.find(n => n.task.id === depTask.id);
            if (depNode) {
              const dx = depNode.x - updated.x;
              const dy = depNode.y - updated.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > 0) {
                const force = 0.05;
                updated.vx += (dx / distance) * force;
                updated.vy += (dy / distance) * force;
              }
            }
          });

          // Bounce off walls
          if (updated.x < 80 || updated.x > width - 80) {
            updated.x = Math.max(80, Math.min(width - 80, updated.x));
            updated.vx = -updated.vx * 0.5;
          }
          if (updated.y < 80 || updated.y > height - 80) {
            updated.y = Math.max(80, Math.min(height - 80, updated.y));
            updated.vy = -updated.vy * 0.5;
          }

          // Return TaskNode with updated physics properties
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

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#eab308';
      case 'low':
        return '#a87738';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return '#a87738';
      case 'in-progress':
        return '#3b82f6';
      case 'blocked':
        return '#dc2626';
      case 'review':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getNodeSize = (task: Task) => {
    if (task.priority === 'critical') return 50;
    if (task.priority === 'high') return 40;
    if (task.priority === 'medium') return 35;
    return 30;
  };

  // Get all connections
  const getConnections = () => {
    const connections: { from: string; to: string; type: 'dependency' | 'blocking' }[] = [];
    
    nodes.forEach(node => {
      // Dependencies (this task depends on)
      node.task.dependencies.forEach(depId => {
        connections.push({ from: depId, to: node.id, type: 'dependency' });
      });
      
      // Blocking (this task blocks)
      node.task.blockedBy.forEach(blockedId => {
        connections.push({ from: node.id, to: blockedId, type: 'blocking' });
      });
    });

    return connections;
  };

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No tasks available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg overflow-hidden">
      <svg 
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        <defs>
          <pattern id="dependencyDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#6366f1" opacity="0.2" />
          </pattern>
          <marker
            id="arrowhead-dependency"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
          </marker>
          <marker
            id="arrowhead-blocking"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#dc2626" />
          </marker>
        </defs>
        <rect width="100%" height="100%" fill="url(#dependencyDots)" />

        {/* Connections */}
        {getConnections().map((conn, index) => {
          const fromNode = nodes.find(n => n.task.id === conn.from);
          const toNode = nodes.find(n => n.task.id === conn.to);
          if (!fromNode || !toNode) return null;

          const isDependency = conn.type === 'dependency';
          const strokeColor = isDependency ? '#3b82f6' : '#dc2626';
          const markerId = isDependency ? 'arrowhead-dependency' : 'arrowhead-blocking';

          return (
            <line
              key={`${conn.from}-${conn.to}-${index}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={strokeColor}
              strokeWidth={isDependency ? 2 : 3}
              strokeDasharray={isDependency ? '0' : '5,5'}
              opacity="0.5"
              markerEnd={`url(#${markerId})`}
              className="transition-all duration-50"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const size = getNodeSize(node.task);
          const priorityColor = getPriorityColor(node.task.priority);
          const statusColor = getStatusColor(node.task.status);
          const isHovered = hoveredNode === node.id;
          const isSelected = selectedTaskId === node.task.id;
          const isBlocked = node.task.status === 'blocked' || node.task.blockedBy.length > 0;

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
                strokeDashoffset={`${2 * Math.PI * (size + 8) * (1 - node.task.progress / 100)}`}
                transform={`rotate(-90 ${node.x} ${node.y})`}
                opacity="0.4"
                className="transition-all duration-50"
              />

              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered || isSelected ? size + 5 : size}
                fill={priorityColor}
                stroke={isSelected ? '#8b5cf6' : isHovered ? '#6366f1' : 'white'}
                strokeWidth={isSelected ? 5 : isHovered ? 4 : 2}
                className="cursor-pointer transition-all duration-50"
                onClick={() => onTaskClick?.(node.task)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  filter: isHovered || isSelected 
                    ? `drop-shadow(0 4px 12px ${priorityColor}40)` 
                    : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }}
              />

              {/* Blocked indicator */}
              {isBlocked && (
                <circle
                  cx={node.x + size - 8}
                  cy={node.y - size + 8}
                  r="8"
                  fill="#dc2626"
                  stroke="white"
                  strokeWidth="2"
                />
              )}

              {/* Task title */}
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-bold fill-white pointer-events-none"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {node.task.title.substring(0, 8)}
              </text>

              {/* Task label */}
              <text
                x={node.x}
                y={node.y + size + 18}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700 pointer-events-none"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {node.task.title.length > 15 
                  ? node.task.title.substring(0, 15) + '...' 
                  : node.task.title
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
                {node.task.status}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">Dependencies</div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-amber-500"></div>
            <span className="text-gray-600">Depends on</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-500 border-dashed"></div>
            <span className="text-gray-600">Blocks</span>
          </div>
        </div>
      </div>
    </div>
  );
}

