'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../../components/layout/Header';
import {
  getAllDailyPlans,
  getDailyPlanByDate,
  DailyPlan,
  Activity,
} from '../operationalPlanningData';
import OperationsCalendar from '../components/OperationsCalendar';
import ActivityDetailModal from '../components/ActivityDetailModal';

export default function OperationsCalendarPage() {
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allPlans = getAllDailyPlans();
    setPlans(allPlans);
  };

  const selectedPlan = getDailyPlanByDate(selectedDate);

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
              <span className="text-gray-900 font-medium">Operations Calendar</span>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Operations Calendar</h1>
          <p className="text-lg text-gray-600">View and manage daily operations across all time periods</p>
        </div>

        {/* View Selector & Quick Actions */}
        <div className="mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView('day')}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  view === 'day'
                    ? 'bg-amber-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  view === 'week'
                    ? 'bg-amber-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  view === 'month'
                    ? 'bg-amber-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Month
              </button>
            </div>
            <Link
              href="/operations/operational-planning/daily-operations-plan"
              className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Daily Plan
            </Link>
          </div>
        </div>

        {/* Calendar */}
        <div className="mb-6">
          <OperationsCalendar
            plans={plans}
            view={view}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onActivityClick={setSelectedActivity}
          />
        </div>

        {/* Selected Date Summary */}
        {selectedPlan && selectedPlan.activities.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <p className="text-sm text-gray-600">{selectedPlan.activities.length} activities scheduled</p>
              </div>
              <Link
                href={`/operations/operational-planning/daily-operations-plan?date=${selectedDate}`}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all shadow-sm hover:shadow-md"
              >
                View Plan Details
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedPlan.activities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity)}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 p-4 bg-gray-50 rounded-xl border-2 ${
                    selectedActivity?.id === activity.id 
                      ? 'border-amber-500 bg-amber-50' 
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{activity.name}</h4>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      activity.status === 'completed' ? 'bg-amber-100 text-amber-700' :
                      activity.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                      activity.status === 'delayed' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{activity.startTime} - {activity.endTime}</span>
                    <span className="mx-1">•</span>
                    <span>{activity.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Detail Modal */}
        <ActivityDetailModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      </main>
    </div>
  );
}

