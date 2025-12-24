'use client';

import { useState, useEffect, DragEvent } from 'react';
import { PrasadMenu, PrasadMenuItem } from '../prasadData';
import { FoodIcon, FoodItemIcon } from './FoodIcons';
import { createParticles, updateParticles, Particle } from '../utils/animations';

interface Cluster {
  id: string;
  label: string;
  status: 'pending' | 'preparing' | 'prepared';
  menus: PrasadMenu[];
  expanded: boolean;
  progress: number;
}

interface MenuClusterViewProps {
  menus: PrasadMenu[];
  onItemStatusChange?: (menuId: string, itemId: string, status: PrasadMenuItem['status']) => void;
  onMenuStatusChange?: (menuId: string, status: PrasadMenu['status']) => void;
}

export default function MenuClusterView({
  menus,
  onItemStatusChange,
  onMenuStatusChange,
}: MenuClusterViewProps) {
  const [draggedItem, setDraggedItem] = useState<{ menuId: string; itemId: string } | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);

  // Calculate clusters from menus
  const calculateClusters = (): Cluster[] => {
    const pendingMenus = menus.filter(m => 
      m.status === 'scheduled' || m.status === 'draft' || 
      m.items.some(item => item.status === 'pending')
    );
    const preparingMenus = menus.filter(m => 
      m.status === 'in-progress' || m.items.some(item => item.status === 'preparing')
    );
    const preparedMenus = menus.filter(m => 
      m.status === 'prepared' || m.status === 'distributed' || m.status === 'completed' ||
      m.items.every(item => item.status === 'prepared')
    );

    const calculateProgress = (menu: PrasadMenu) => {
      if (menu.items.length === 0) return 0;
      const preparedCount = menu.items.filter(item => item.status === 'prepared').length;
      return Math.round((preparedCount / menu.items.length) * 100);
    };

    return [
      {
        id: 'pending',
        label: 'Pending',
        status: 'pending',
        menus: pendingMenus,
        expanded: true,
        progress: pendingMenus.length > 0 
          ? pendingMenus.reduce((sum, m) => sum + calculateProgress(m), 0) / pendingMenus.length 
          : 0,
      },
      {
        id: 'preparing',
        label: 'Preparing',
        status: 'preparing',
        menus: preparingMenus,
        expanded: true,
        progress: preparingMenus.length > 0
          ? preparingMenus.reduce((sum, m) => sum + calculateProgress(m), 0) / preparingMenus.length
          : 0,
      },
      {
        id: 'prepared',
        label: 'Prepared',
        status: 'prepared',
        menus: preparedMenus,
        expanded: true,
        progress: 100,
      },
    ];
  };

  const [clusters, setClusters] = useState<Cluster[]>(calculateClusters());

  // Update clusters when menus change
  useEffect(() => {
    setClusters(calculateClusters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus]);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = updateParticles(prev);
        return updated;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length]);

  const toggleCluster = (clusterId: string) => {
    setClusters(prev => prev.map(c => 
      c.id === clusterId ? { ...c, expanded: !c.expanded } : c
    ));
  };

  const handleDragStart = (e: DragEvent, menuId: string, itemId: string) => {
    setDraggedItem({ menuId, itemId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent, clusterId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredCluster(clusterId);
  };

  const handleDrop = (e: DragEvent, targetClusterId: string) => {
    e.preventDefault();
    setHoveredCluster(null);

    if (!draggedItem) return;

    const targetStatus = targetClusterId === 'pending' ? 'pending' :
                        targetClusterId === 'preparing' ? 'preparing' : 'prepared';

    // Create particles at drop location
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticles = createParticles(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      15,
      ['#f59e0b', '#a87738', '#e28d2f']
    );
    setParticles(prev => [...prev, ...newParticles]);

    onItemStatusChange?.(draggedItem.menuId, draggedItem.itemId, targetStatus);
    setDraggedItem(null);
  };

  const getClusterColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'from-gray-100 to-gray-200 border-gray-300';
      case 'preparing':
        return 'from-amber-100 to-orange-200 border-amber-400';
      case 'prepared':
        return 'from-green-100 to-emerald-200 border-amber-400';
      default:
        return 'from-gray-100 to-gray-200 border-gray-300';
    }
  };

  const getClusterIconColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-gray-600';
      case 'preparing':
        return 'text-amber-600';
      case 'prepared':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 relative overflow-hidden">
      {/* Particles */}
      {particles.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                backgroundColor: particle.color,
                opacity: particle.life,
                transform: `scale(${particle.life})`,
              }}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {clusters.map((cluster) => {
          const isHovered = hoveredCluster === cluster.id;
          
          return (
            <div
              key={cluster.id}
              onDragOver={(e) => handleDragOver(e, cluster.id)}
              onDrop={(e) => handleDrop(e, cluster.id)}
              className={`bg-gradient-to-br ${getClusterColor(cluster.status)} rounded-xl border-2 p-4 transition-all duration-300 ${
                isHovered ? 'scale-105 shadow-2xl' : 'shadow-lg'
              }`}
            >
              {/* Cluster Header */}
              <button
                onClick={() => toggleCluster(cluster.id)}
                className="w-full flex items-center justify-between mb-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-white ${getClusterIconColor(cluster.status)}`}>
                    {cluster.status === 'pending' && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {cluster.status === 'preparing' && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {cluster.status === 'prepared' && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg text-gray-900">{cluster.label}</h3>
                    <p className="text-sm text-gray-600">{cluster.menus.length} menu(s)</p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                    cluster.expanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Progress Ring */}
              <div className="mb-4 flex justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-white opacity-30"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - cluster.progress / 100)}`}
                      className={getClusterIconColor(cluster.status)}
                      style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${getClusterIconColor(cluster.status)}`}>
                      {Math.round(cluster.progress)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              {cluster.expanded && (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {cluster.menus.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No menus in this cluster</p>
                    </div>
                  ) : (
                    cluster.menus.map((menu) => (
                      <div
                        key={menu.id}
                        className="bg-white rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <FoodIcon mealType={menu.mealType || 'breakfast'} size={20} />
                          <span className="font-medium text-sm text-gray-900">{menu.name}</span>
                        </div>
                        <div className="space-y-1">
                          {menu.items.map((item) => (
                            <div
                              key={item.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, menu.id, item.id)}
                              className={`flex items-center gap-2 p-2 rounded cursor-move transition-all duration-200 ${
                                item.status === 'prepared'
                                  ? 'bg-amber-50 border border-amber-200'
                                  : item.status === 'preparing'
                                  ? 'bg-amber-50 border border-amber-200'
                                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              <FoodItemIcon itemName={item.name} size={16} />
                              <span className="text-xs font-medium text-gray-700 flex-1">
                                {item.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {item.quantity} {item.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

