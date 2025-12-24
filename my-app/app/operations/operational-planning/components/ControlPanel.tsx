'use client';

import { useState, useEffect } from 'react';
import { Activity, getTodayActivities, getUpcomingActivities } from '../operationalPlanningData';
import ActivityCard from './ActivityCard';

interface ControlPanelProps {
  activities: Activity[];
  onActivityClick?: (activity: Activity) => void;
}

export default function ControlPanel({ activities, onActivityClick }: ControlPanelProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'scheduled' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayActivities = getTodayActivities();
  const upcomingActivities = getUpcomingActivities(4);
  const inProgressActivities = activities.filter(a => a.status === 'in-progress');
  const scheduledActivities = activities.filter(a => a.status === 'scheduled');
  const completedActivities = activities.filter(a => a.status === 'completed');

  const filteredActivities = selectedStatus === 'all'
    ? activities
    : activities.filter(a => a.status === selectedStatus);

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-amber-500';
      case 'in-progress':
        return 'bg-amber-500 animate-pulse';
      case 'delayed':
        return 'bg-red-500';
      case 'scheduled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 text-white">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Operations Control Panel</h3>
          <div className="text-sm font-mono">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
        <p className="text-sm text-gray-300">Real-time operations monitoring and control</p>
      </div>

      {/* Status Filters */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selectedStatus === 'all'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All ({activities.length})
        </button>
        <button
          onClick={() => setSelectedStatus('scheduled')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selectedStatus === 'scheduled'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Scheduled ({scheduledActivities.length})
        </button>
        <button
          onClick={() => setSelectedStatus('in-progress')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selectedStatus === 'in-progress'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          In Progress ({inProgressActivities.length})
        </button>
        <button
          onClick={() => setSelectedStatus('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selectedStatus === 'completed'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Completed ({completedActivities.length})
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Today's Activities</div>
          <div className="text-2xl font-bold text-white">{todayActivities.length}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-blue-400">{inProgressActivities.length}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Upcoming (4h)</div>
          <div className="text-2xl font-bold text-yellow-400">{upcomingActivities.length}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-400">{completedActivities.length}</div>
        </div>
      </div>

      {/* Activity Status Grid */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
        <h4 className="text-sm font-semibold mb-4">Activity Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredActivities.map((activity) => {
            const statusColor = getStatusColor(activity.status);
            return (
              <div
                key={activity.id}
                onClick={() => onActivityClick?.(activity)}
                className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${statusColor}`} />
                  <div className="text-xs font-medium text-white truncate">
                    {activity.name}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {activity.startTime} - {activity.endTime}
                </div>
                <div className="text-xs text-gray-400">
                  {activity.location}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Activities */}
      {upcomingActivities.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <h4 className="text-sm font-semibold mb-4">Upcoming Activities (Next 4 Hours)</h4>
          <div className="space-y-2">
            {upcomingActivities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => onActivityClick?.(activity)}
                className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{activity.name}</div>
                    <div className="text-xs text-gray-400">
                      {activity.startTime} - {activity.location}
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.status)}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


