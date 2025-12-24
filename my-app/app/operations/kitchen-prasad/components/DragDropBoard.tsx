'use client';

import { useState, useRef, DragEvent } from 'react';
import { PrasadMenu } from '../prasadData';
import { FoodIcon } from './FoodIcons';

interface TimeSlot {
  day: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  time: string;
}

interface DragDropBoardProps {
  menus: PrasadMenu[];
  onMenuDrop?: (menu: PrasadMenu, slot: TimeSlot) => void;
  onNewMenuDrop?: (slot: TimeSlot) => void;
  onCreateMenu?: (slot: TimeSlot) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_SLOTS: Array<{ mealType: 'breakfast' | 'lunch' | 'dinner'; time: string }> = [
  { mealType: 'breakfast', time: '08:00' },
  { mealType: 'lunch', time: '12:00' },
  { mealType: 'dinner', time: '18:00' },
];

export default function DragDropBoard({
  menus,
  onMenuDrop,
  onNewMenuDrop,
  onCreateMenu,
}: DragDropBoardProps) {
  const [draggedMenu, setDraggedMenu] = useState<PrasadMenu | null>(null);
  const [draggedSlot, setDraggedSlot] = useState<TimeSlot | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<TimeSlot | null>(null);
  const [droppedMenus, setDroppedMenus] = useState<Map<string, PrasadMenu>>(new Map());

  const getSlotKey = (slot: TimeSlot) => `${slot.day}-${slot.mealType}`;

  const getMenuForSlot = (slot: TimeSlot): PrasadMenu | undefined => {
    const key = getSlotKey(slot);
    return droppedMenus.get(key) || menus.find(m => 
      m.mealType === slot.mealType && 
      m.startTime === slot.time
    );
  };

  const handleDragStart = (e: DragEvent, menu: PrasadMenu) => {
    setDraggedMenu(menu);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', menu.id);
    
    // Create custom drag preview
    const dragPreview = document.createElement('div');
    dragPreview.className = 'bg-white rounded-lg p-3 shadow-lg border-2 border-amber-500';
    dragPreview.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="text-amber-600">${menu.name}</div>
      </div>
    `;
    dragPreview.style.position = 'absolute';
    dragPreview.style.top = '-1000px';
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);
    setTimeout(() => document.body.removeChild(dragPreview), 0);
  };

  const handleDragOver = (e: DragEvent, slot: TimeSlot) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredSlot(slot);
  };

  const handleDragLeave = () => {
    setHoveredSlot(null);
  };

  const handleDrop = (e: DragEvent, slot: TimeSlot) => {
    e.preventDefault();
    setHoveredSlot(null);

    const data = e.dataTransfer.getData('text/plain');
    
    if (draggedMenu || (data && data !== 'new-menu')) {
      const menuToDrop = draggedMenu || menus.find(m => m.id === data);
      if (menuToDrop) {
        const key = getSlotKey(slot);
        setDroppedMenus(prev => new Map(prev).set(key, menuToDrop));
        onMenuDrop?.(menuToDrop, slot);
        setDraggedMenu(null);
      }
    } else if (data === 'new-menu') {
      onNewMenuDrop?.(slot);
      onCreateMenu?.(slot);
    }
  };

  const handleNewMenuDragStart = (e: DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', 'new-menu');
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return 'bg-amber-100 border-amber-300 text-amber-700';
      case 'lunch':
        return 'bg-amber-100 border-amber-300 text-amber-700';
      case 'dinner':
        return 'bg-amber-100 border-amber-300 text-amber-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6">
      {/* New Menu Card (Draggable) */}
      <div className="mb-6">
        <div
          draggable
          onDragStart={handleNewMenuDragStart}
          className="inline-flex items-center gap-2 px-4 py-3 bg-white rounded-lg border-2 border-dashed border-amber-400 text-amber-700 cursor-move hover:bg-amber-50 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">New Menu</span>
          <span className="text-xs text-gray-500">(Drag to time slot)</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header Row */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="font-semibold text-sm text-gray-700">Time</div>
            {DAYS.map(day => (
              <div key={day} className="font-semibold text-sm text-gray-700 text-center">
                {day.substring(0, 3)}
              </div>
            ))}
          </div>

          {/* Meal Slots */}
          {MEAL_SLOTS.map((mealSlot) => (
            <div key={mealSlot.mealType} className="mb-4">
              <div className="grid grid-cols-8 gap-2">
                {/* Time Label */}
                <div className="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-600">{mealSlot.time}</div>
                    <div className="text-xs text-gray-500 capitalize">{mealSlot.mealType}</div>
                  </div>
                </div>

                {/* Day Slots */}
                {DAYS.map((day) => {
                  const slot: TimeSlot = { day, mealType: mealSlot.mealType, time: mealSlot.time };
                  const menu = getMenuForSlot(slot);
                  const isHovered = hoveredSlot?.day === day && hoveredSlot?.mealType === mealSlot.mealType;
                  const isEmpty = !menu;

                  return (
                    <div
                      key={`${day}-${mealSlot.mealType}`}
                      onDragOver={(e) => handleDragOver(e, slot)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, slot)}
                      className={`min-h-[100px] p-2 rounded-lg border-2 transition-all duration-200 ${
                        isHovered
                          ? 'border-amber-500 bg-amber-100 scale-105 shadow-lg'
                          : isEmpty
                          ? 'border-dashed border-gray-300 bg-white hover:border-amber-400 hover:bg-amber-50'
                          : `${getMealTypeColor(mealSlot.mealType)} border-solid shadow-md`
                      }`}
                    >
                      {menu ? (
                        <div 
                          className="flex flex-col items-center justify-center h-full gap-2 animate-[bounce-in_0.3s_ease-out] group relative"
                          title={`${menu.name} - ${menu.items.map(i => i.name).join(', ')}`}
                        >
                          <FoodIcon mealType={menu.mealType || 'breakfast'} size={32} className="text-white" />
                          <div className="text-xs font-medium text-center truncate w-full">
                            {menu.name}
                          </div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                              menu.category === 'COUNTER_PAID' || menu.category === 'SEVA_PRASAD_PAID'
                                ? 'bg-amber-100 text-amber-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {menu.category === 'COUNTER_PAID' || menu.category === 'SEVA_PRASAD_PAID' ? 'Paid' : 'Free'}
                            </span>
                            <span className="text-xs opacity-75">
                              {menu.items.length} items
                            </span>
                          </div>
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl max-w-xs whitespace-nowrap">
                              <div className="font-semibold mb-1 text-white">{menu.name}</div>
                              <div className="text-gray-300">
                                <div className="font-medium mb-1 text-white">Items:</div>
                                <div className="space-y-0.5 max-h-40 overflow-y-auto">
                                  {menu.items.map((item, idx) => (
                                    <div key={idx} className="text-xs whitespace-normal">
                                      • {item.name} ({item.quantity} {item.unit})
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                                <div className="border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Existing Menus Sidebar (if any menus not placed) */}
      {menus.filter(m => !Array.from(droppedMenus.values()).some(dm => dm.id === m.id)).length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Available Menus</h3>
          <div className="flex flex-wrap gap-2">
            {menus
              .filter(m => !Array.from(droppedMenus.values()).some(dm => dm.id === m.id))
              .map((menu) => (
                <div
                  key={menu.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, menu)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:bg-gray-100 transition-all duration-200 group relative"
                  title={`${menu.name} - ${menu.items.map(i => i.name).join(', ')}`}
                >
                  <FoodIcon mealType={menu.mealType || 'breakfast'} size={20} />
                  <span className="text-sm font-medium text-gray-700">{menu.name}</span>
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl max-w-xs whitespace-nowrap">
                      <div className="font-semibold mb-1 text-white">{menu.name}</div>
                      <div className="text-gray-300">
                        <div className="font-medium mb-1 text-white">Items:</div>
                        <div className="space-y-0.5 max-h-40 overflow-y-auto">
                          {menu.items.map((item, idx) => (
                            <div key={idx} className="text-xs whitespace-normal">
                              • {item.name} ({item.quantity} {item.unit})
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-\\[bounce-in_0\\.3s_ease-out\\] {
          animation: bounce-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

