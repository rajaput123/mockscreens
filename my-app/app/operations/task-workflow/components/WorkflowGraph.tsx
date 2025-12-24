'use client';

import { useState, useEffect, useMemo } from 'react';
import { Workflow, WorkflowStep } from '../taskWorkflowData';
import { updateNodePhysics } from '../../kitchen-prasad/utils/animations';

interface WorkflowNode {
  id: string;
  step: WorkflowStep;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
}

interface WorkflowGraphProps {
  workflow: Workflow;
  onStepClick?: (step: WorkflowStep) => void;
  width?: number;
  height?: number;
}

export default function WorkflowGraph({
  workflow,
  onStepClick,
  width = 1200,
  height = 600,
}: WorkflowGraphProps) {
  const [animatedNodes, setAnimatedNodes] = useState<WorkflowNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Initialize nodes in a horizontal flow layout
  const initialNodes = useMemo(() => {
    const nodes: WorkflowNode[] = [];
    const stepCount = workflow.steps.length;
    const spacing = width / (stepCount + 1);

    workflow.steps.forEach((step, index) => {
      const x = spacing * (index + 1);
      const y = height / 2 + (Math.random() - 0.5) * 100;

      nodes.push({
        id: step.id,
        step,
        x: Math.max(100, Math.min(width - 100, x)),
        y: Math.max(100, Math.min(height - 100, y)),
        targetX: Math.max(100, Math.min(width - 100, x)),
        targetY: Math.max(100, Math.min(height - 100, y)),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
      });
    });

    return nodes;
  }, [workflow, width, height]);

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
          if (updated.x < 100 || updated.x > width - 100) {
            updated.x = Math.max(100, Math.min(width - 100, updated.x));
            updated.vx = -updated.vx * 0.5;
          }
          if (updated.y < 100 || updated.y > height - 100) {
            updated.y = Math.max(100, Math.min(height - 100, updated.y));
            updated.vy = -updated.vy * 0.5;
          }

          // Return WorkflowNode with updated physics properties
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

  const getStepColor = (order: number, total: number) => {
    const hue = (order / total) * 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  const getConnections = () => {
    const connections: { from: string; to: string }[] = [];
    
    nodes.forEach(node => {
      node.step.nextSteps.forEach(nextStepId => {
        const nextNode = nodes.find(n => n.step.id === nextStepId);
        if (nextNode) {
          connections.push({
            from: node.id,
            to: nextNode.id,
          });
        }
      });
    });

    return connections;
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden">
      <svg 
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        <defs>
          <pattern id="workflowDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#8b5cf6" opacity="0.2" />
          </pattern>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#8b5cf6" />
          </marker>
        </defs>
        <rect width="100%" height="100%" fill="url(#workflowDots)" />

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
              strokeWidth="3"
              opacity="0.4"
              markerEnd="url(#arrowhead)"
              className="transition-all duration-50"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const stepColor = getStepColor(node.step.order, workflow.steps.length);
          const isHovered = hoveredNode === node.id;
          const size = 60;

          return (
            <g key={node.id}>
              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? size + 10 : size}
                fill={stepColor}
                stroke="white"
                strokeWidth={isHovered ? 5 : 3}
                className="cursor-pointer transition-all duration-50"
                onClick={() => onStepClick?.(node.step)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  filter: isHovered ? `drop-shadow(0 4px 12px ${stepColor}40)` : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }}
              />

              {/* Step number */}
              <text
                x={node.x}
                y={node.y - size - 15}
                textAnchor="middle"
                className="text-sm font-bold fill-gray-700 pointer-events-none"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                Step {node.step.order}
              </text>

              {/* Step name */}
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-bold fill-white pointer-events-none"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {node.step.name.substring(0, 8)}
              </text>

              {/* Duration badge */}
              {node.step.estimatedDuration && (
                <text
                  x={node.x}
                  y={node.y + size + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 pointer-events-none"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {node.step.estimatedDuration}h
                </text>
              )}

              {/* Approval indicator */}
              {node.step.requiredApproval && (
                <circle
                  cx={node.x + size - 10}
                  cy={node.y - size + 10}
                  r="8"
                  fill="#f59e0b"
                  stroke="white"
                  strokeWidth="2"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Workflow Info */}
      <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-md border border-gray-200">
        <div className="text-sm font-semibold text-gray-900 mb-1">{workflow.name}</div>
        <div className="text-xs text-gray-600">{workflow.description}</div>
        <div className="text-xs text-gray-500 mt-1">
          {workflow.steps.length} steps • {workflow.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg p-3 shadow-md border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">Workflow Steps</div>
        <div className="space-y-1">
          {workflow.steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getStepColor(step.order, workflow.steps.length) }}
              />
              <span className="text-gray-600">{step.order}. {step.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

