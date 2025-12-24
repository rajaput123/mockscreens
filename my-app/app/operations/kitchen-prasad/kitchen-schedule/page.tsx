'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import { 
  getAllKitchenPlans,
  saveKitchenPlan,
  KitchenPlan 
} from '../prasadData';
import { getAllTemples } from '../../temple-management/templeData';
import { PRASAD_CATEGORY, PRASAD_CATEGORY_METADATA, DISTRIBUTION_POINT } from '../prasadTypes';
import { getSevasByDate, getSevasByTime } from '../kitchenPlanning';

export default function KitchenSchedulePage() {
  const [plans, setPlans] = useState<KitchenPlan[]>([]);
  const [temples, setTemples] = useState<Array<{ id: string; name: string; deity?: string }>>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showSevaOverlay, setShowSevaOverlay] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allPlans = getAllKitchenPlans();
    setPlans(allPlans);
    
    const allTemples = getAllTemples();
    setTemples(allTemples.map(t => ({ id: t.id, name: t.name, deity: t.deity })));
  };

  const getTempleName = (templeId: string) => {
    const temple = temples.find(t => t.id === templeId);
    return temple?.deity || temple?.name || templeId;
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getWeekDays = () => {
    const start = getWeekStart(currentDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getPlansForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return plans.filter(p => p.date === dateStr);
  };

  const getCategoryColor = (category: PRASAD_CATEGORY) => {
    const metadata = PRASAD_CATEGORY_METADATA[category];
    return metadata.color;
  };

  const getDistributionPointIcon = (point: DISTRIBUTION_POINT) => {
    switch (point) {
      case DISTRIBUTION_POINT.ANNADAN_HALL:
        return '🏛️';
      case DISTRIBUTION_POINT.COUNTER:
        return '🏪';
      case DISTRIBUTION_POINT.SEVA_AREA:
        return '🕉️';
      default:
        return '📍';
    }
  };

  const weekDays = getWeekDays();
  const weekStart = getWeekStart(currentDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Time slots for the day
  const timeSlots = [
    { time: '06:00', label: '6 AM' },
    { time: '08:00', label: '8 AM' },
    { time: '10:00', label: '10 AM' },
    { time: '12:00', label: '12 PM' },
    { time: '14:00', label: '2 PM' },
    { time: '16:00', label: '4 PM' },
    { time: '18:00', label: '6 PM' },
    { time: '20:00', label: '8 PM' },
  ];

  return (
    <ModuleLayout
      title="Kitchen Schedule"
      description="View kitchen schedule with prasad categories and seva integration"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Kitchen Schedule</h2>
            <p className="text-sm text-gray-600 mt-1">
              {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSevaOverlay(!showSevaOverlay)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showSevaOverlay
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {showSevaOverlay ? '✓' : ''} Show Seva Schedule
            </button>
            <button
              onClick={() => navigateWeek('prev')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-colors"
            >
              ←
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
            >
              Today
            </button>
            <button
              onClick={() => navigateWeek('next')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Category Legend */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-sm font-medium text-gray-700">Categories:</span>
          {Object.values(PRASAD_CATEGORY).map((category) => {
            const metadata = PRASAD_CATEGORY_METADATA[category];
            return (
              <div key={category} className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded ${metadata.color.bg} ${metadata.color.border} border-2`}></span>
                <span className="text-xs text-gray-600">{metadata.icon} {metadata.ui.shortLabel}</span>
              </div>
            );
          })}
          {showSevaOverlay && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="w-4 h-4 rounded bg-amber-100 border-2 border-amber-300"></span>
              <span className="text-xs text-gray-600">📅 Seva Schedule</span>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
        <div className="p-6">
          {/* Week Header */}
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="font-medium text-gray-700">Time</div>
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="text-center p-2 border-b-2 border-gray-200"
              >
                <div className="text-xs font-medium text-gray-500 uppercase">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-semibold mt-1 ${
                  day.toDateString() === new Date().toDateString()
                    ? 'text-amber-600'
                    : 'text-gray-900'
                }`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <div key={slot.time} className="grid grid-cols-8 gap-2">
                <div className="p-2 text-sm text-gray-600 font-medium">
                  {slot.label}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const dateStr = day.toISOString().split('T')[0];
                  const dayPlans = getPlansForDate(day).filter(p => {
                    const planTime = p.startTime.split(':');
                    const slotTime = slot.time.split(':');
                    const planMinutes = parseInt(planTime[0]) * 60 + parseInt(planTime[1]);
                    const slotMinutes = parseInt(slotTime[0]) * 60 + parseInt(slotTime[1]);
                    return Math.abs(planMinutes - slotMinutes) <= 30; // Within 30 minutes
                  });
                  
                  const sevas = showSevaOverlay ? getSevasByTime(dateStr, slot.time) : [];
                  
                  return (
                    <div
                      key={dayIndex}
                      className="min-h-[80px] p-2 border-2 rounded-lg bg-gray-50 hover:border-amber-300 transition-all"
                    >
                      {/* Plans */}
                      {dayPlans.map((plan) => {
                        const metadata = PRASAD_CATEGORY_METADATA[plan.category];
                        return (
                          <div
                            key={plan.id}
                            className={`mb-1 p-2 rounded border text-xs ${metadata.color.bg} ${metadata.color.border} border-2`}
                            title={`${plan.name} - ${metadata.ui.shortLabel}`}
                          >
                            <div className="flex items-center gap-1 mb-1">
                              <span>{metadata.icon}</span>
                              <span className="font-medium truncate">{plan.name}</span>
                            </div>
                            <div className="text-xs opacity-75 flex items-center gap-1">
                              <span>{getDistributionPointIcon(plan.distributionPoint)}</span>
                              <span className="truncate">{getTempleName(plan.templeId)}</span>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Seva Overlay */}
                      {showSevaOverlay && sevas.length > 0 && (
                        <div className="mt-1 p-1 bg-amber-100 border border-amber-300 rounded text-xs">
                          <div className="text-amber-700 font-medium">📅 Sevas:</div>
                          {sevas.slice(0, 2).map((seva) => (
                            <div key={seva.id} className="text-amber-600 truncate">
                              {seva.name}
                            </div>
                          ))}
                          {sevas.length > 2 && (
                            <div className="text-amber-500">+{sevas.length - 2} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <HelpButton module="kitchen-prasad" />
    </ModuleLayout>
  );
}
