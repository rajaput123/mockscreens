'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../../components/layout/Header';
import {
  getAllDailyPlans,
  getTodayActivities,
  getUpcomingActivities,
  getActivitiesByStatus,
  DailyPlan,
  Activity,
} from '../operationalPlanningData';
import ActivityDetailModal from '../components/ActivityDetailModal';

export default function ControlPanelPage() {
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'scheduled' | 'in-progress' | 'completed' | 'delayed'>('all');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  const loadData = () => {
    const allPlans = getAllDailyPlans();
    const allActivities = allPlans.flatMap(plan => plan.activities);
    setPlans(allPlans);
    setActivities(allActivities);
  };

  const todayActivities = getTodayActivities();
  const upcomingActivities = getUpcomingActivities(4);
  const inProgressActivities = getActivitiesByStatus('in-progress');
  const scheduledActivities = getActivitiesByStatus('scheduled');
  const completedActivities = getActivitiesByStatus('completed');
  const delayedActivities = activities.filter(a => a.status === 'delayed');

  const filteredActivities = selectedStatus === 'all'
    ? todayActivities
    : todayActivities.filter(a => a.status === selectedStatus);

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-amber-500';
      case 'in-progress':
        return 'bg-amber-500';
      case 'delayed':
        return 'bg-red-500';
      case 'scheduled':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'in-progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'delayed':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'scheduled':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <Link href="/operations/operational-planning" className="hover:text-gray-900 transition-colors">
                Operational Planning & Control
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-900 font-medium">Operations Control Panel</span>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Operations Control Panel</h1>
              <p className="text-lg text-gray-600">Real-time monitoring and control of daily operations</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Current Time</div>
              <div className="text-2xl font-bold text-gray-900 font-mono">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
              </div>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">In Progress</h3>
              <div className={`w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center ${inProgressActivities.length > 0 ? 'animate-pulse' : ''}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold mb-1">{inProgressActivities.length}</p>
            <p className="text-sm opacity-80">Activities running now</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">Scheduled</h3>
              <svg className="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-4xl font-bold mb-1">{scheduledActivities.length}</p>
            <p className="text-sm opacity-80">Upcoming today</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">Completed</h3>
              <svg className="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-4xl font-bold mb-1">{completedActivities.length}</p>
            <p className="text-sm opacity-80">Finished today</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">Delayed</h3>
              <svg className="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-4xl font-bold mb-1">{delayedActivities.length}</p>
            <p className="text-sm opacity-80">Requires attention</p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-700 mr-2">Filter by Status:</span>
            {[
              { key: 'all', label: 'All Activities', count: todayActivities.length },
              { key: 'scheduled', label: 'Scheduled', count: scheduledActivities.length },
              { key: 'in-progress', label: 'In Progress', count: inProgressActivities.length },
              { key: 'completed', label: 'Completed', count: completedActivities.length },
              { key: 'delayed', label: 'Delayed', count: delayedActivities.length },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedStatus(filter.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedStatus === filter.key
                    ? 'bg-amber-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Activities Alert */}
        {upcomingActivities.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-900">Upcoming Activities</h3>
                <p className="text-sm text-amber-700">Next 4 hours</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingActivities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity)}
                  className="p-4 bg-white border border-amber-200 rounded-xl cursor-pointer hover:border-amber-400 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-gray-900 text-sm">{activity.name}</div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadgeColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{activity.startTime}</span>
                    <span className="mx-1">•</span>
                    <span>{activity.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtered Activities Grid */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {selectedStatus === 'all' ? 'All' : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Activities
              </h3>
              <p className="text-sm text-gray-600">{filteredActivities.length} activities found</p>
            </div>
          </div>
          {filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity)}
                  className={`p-4 bg-gray-50 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
                    selectedActivity?.id === activity.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{activity.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{activity.description}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${getStatusColor(activity.status)} ${activity.status === 'in-progress' ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{activity.startTime} - {activity.endTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>{activity.location}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadgeColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No {selectedStatus === 'all' ? '' : selectedStatus} activities found</p>
            </div>
          )}
        </div>

        {/* Activity Detail Modal */}
        <ActivityDetailModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      </main>
    </div>
  );
}
