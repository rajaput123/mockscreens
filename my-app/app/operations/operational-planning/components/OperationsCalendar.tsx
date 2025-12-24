'use client';

import { useState, useMemo } from 'react';
import { DailyPlan, Activity, getDailyPlanByDate } from '../operationalPlanningData';
import Link from 'next/link';

interface OperationsCalendarProps {
  plans: DailyPlan[];
  view: 'day' | 'week' | 'month';
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
  onActivityClick?: (activity: Activity) => void;
}

export default function OperationsCalendar({
  plans,
  view = 'week',
  selectedDate,
  onDateSelect,
  onActivityClick,
}: OperationsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);

  const today = new Date().toISOString().split('T')[0];

  const getDaysInWeek = (date: string) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    const monday = new Date(d.setDate(diff));
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };

  const getDaysInMonth = (date: string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: string[] = [];
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i).toISOString().split('T')[0]);
    }
    
    return days;
  };

  const getActivitiesForDate = (date: string): Activity[] => {
    const plan = getDailyPlanByDate(date);
    return plan ? plan.activities : [];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isToday = (dateStr: string) => {
    return dateStr === today;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const d = new Date(currentDate);
    if (view === 'day') {
      d.setDate(d.getDate() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      d.setDate(d.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      d.setMonth(d.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setCurrentDate(today);
    onDateSelect?.(today);
  };

  const getActivityTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'ritual':
        return 'bg-amber-500';
      case 'prasad':
        return 'bg-orange-500';
      case 'maintenance':
        return 'bg-amber-500';
      case 'cleaning':
        return 'bg-amber-500';
      case 'security':
        return 'bg-red-500';
      case 'event':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Day View
  if (view === 'day') {
    const activities = getActivitiesForDate(currentDate);
    const sortedActivities = [...activities].sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    );
    
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-1">{formatDate(currentDate)}</h3>
              <p className="text-amber-100 text-sm">{sortedActivities.length} activities scheduled</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm font-medium transition-all"
              >
                Today
              </button>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6">
          {sortedActivities.length > 0 ? (
            <div className="space-y-4">
              {sortedActivities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => onActivityClick?.(activity)}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className={`w-3 h-3 rounded-full mt-2 ${getActivityTypeColor(activity.type)}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        activity.status === 'completed' ? 'bg-amber-100 text-amber-700' :
                        activity.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                        activity.status === 'delayed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{activity.startTime} - {activity.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>{activity.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No activities scheduled for this day</p>
              <Link
                href={`/operations/operational-planning/daily-operations-plan?date=${currentDate}`}
                className="mt-4 inline-block px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all"
              >
                Create Plan for This Day
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Week View
  if (view === 'week') {
    const weekDays = getDaysInWeek(currentDate);
    const weekStart = weekDays[0];
    const weekEnd = weekDays[6];
    
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-1">
                {new Date(weekStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {new Date(weekEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <p className="text-amber-100 text-sm">Week View</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm font-medium transition-all"
              >
                Today
              </button>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Week Grid */}
        <div className="p-6">
          <div className="grid grid-cols-7 gap-3">
            {weekDays.map((date) => {
              const activities = getActivitiesForDate(date);
              const isSelected = selectedDate === date;
              const isTodayDate = isToday(date);
              
              return (
                <div
                  key={date}
                  onClick={() => {
                    setCurrentDate(date);
                    onDateSelect?.(date);
                  }}
                  className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50 shadow-md'
                      : isTodayDate
                      ? 'border-blue-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-2xl font-bold ${
                      isSelected ? 'text-amber-700' : isTodayDate ? 'text-amber-700' : 'text-gray-900'
                    }`}>
                      {new Date(date).getDate()}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {activities.slice(0, 3).map((activity) => (
                      <div
                        key={activity.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onActivityClick?.(activity);
                        }}
                        className={`text-xs p-2 rounded-lg truncate cursor-pointer transition-all hover:scale-105 ${getActivityTypeColor(activity.type)} text-white font-medium`}
                        title={activity.name}
                      >
                        {activity.startTime} {activity.name}
                      </div>
                    ))}
                    {activities.length > 3 && (
                      <div className="text-xs text-gray-500 font-medium pt-1">
                        +{activities.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Month View
  const monthDays = getDaysInMonth(currentDate);
  const firstDay = new Date(monthDays[0]);
  const startOffset = firstDay.getDay();
  const monthName = new Date(currentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-1">{monthName}</h3>
            <p className="text-amber-100 text-sm">Month View</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm font-medium transition-all"
            >
              Today
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-700 text-sm py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-gray-50 rounded-lg" />
          ))}
          
          {/* Month days */}
          {monthDays.map((date) => {
            const activities = getActivitiesForDate(date);
            const isSelected = selectedDate === date;
            const isTodayDate = isToday(date);
            
            return (
              <div
                key={date}
                onClick={() => {
                  setCurrentDate(date);
                  onDateSelect?.(date);
                }}
                className={`aspect-square p-2 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50'
                    : isTodayDate
                    ? 'border-blue-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`text-sm font-bold mb-1 ${
                  isSelected ? 'text-amber-700' : isTodayDate ? 'text-amber-700' : 'text-gray-900'
                }`}>
                  {new Date(date).getDate()}
                </div>
                <div className="space-y-0.5">
                  {activities.slice(0, 2).map((activity) => (
                    <div
                      key={activity.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onActivityClick?.(activity);
                      }}
                      className={`text-[10px] p-1 rounded truncate cursor-pointer ${getActivityTypeColor(activity.type)} text-white font-medium`}
                      title={activity.name}
                    >
                      {activity.startTime}
                    </div>
                  ))}
                  {activities.length > 2 && (
                    <div className="text-[10px] text-gray-500 font-medium">
                      +{activities.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
