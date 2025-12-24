'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/layout/Header';
import {
  getAllDailyPlans,
  getActiveDailyPlans,
  getPlansByStatus,
  getTodayActivities,
  getUpcomingActivities,
  getActivitiesByStatus,
  DailyPlan,
  Activity,
} from './operationalPlanningData';
import ActivityNetworkGraph from './components/ActivityNetworkGraph';
import ActivityDetailModal from './components/ActivityDetailModal';

export default function OperationalPlanningDashboard() {
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allPlans = getAllDailyPlans();
    const today = getTodayActivities();
    setPlans(allPlans);
    setTodayActivities(today);
  };

  const activePlans = getActiveDailyPlans();
  const draftPlans = getPlansByStatus('draft');
  const completedPlans = getPlansByStatus('completed');
  const scheduledActivities = getActivitiesByStatus('scheduled');
  const inProgressActivities = getActivitiesByStatus('in-progress');
  const completedActivities = getActivitiesByStatus('completed');
  const upcomingActivities = getUpcomingActivities(4);

  // Flatten and deduplicate activities by ID
  const allActivities = plans.flatMap(plan => plan.activities);
  const uniqueActivities = Array.from(
    new Map(allActivities.map(activity => [activity.id, activity])).values()
  );

  const stats = {
    totalPlans: plans.length,
    activePlans: activePlans.length,
    draftPlans: draftPlans.length,
    completedPlans: completedPlans.length,
    todayActivities: todayActivities.length,
    scheduledActivities: scheduledActivities.length,
    inProgressActivities: inProgressActivities.length,
    completedActivities: completedActivities.length,
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
              <span className="text-gray-900 font-medium">Operational Planning & Control</span>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Operational Planning & Control</h1>
          <p className="text-lg text-gray-600">Plan and control daily operations across all facilities</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Manage Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Manage</h3>
            <Link
              href="/operations/operational-planning/daily-operations-plan"
              className="inline-flex items-center justify-center w-full px-6 py-4 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Daily Operations Plan
            </Link>
          </div>

          {/* View Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">View</h3>
            <div className="flex flex-col gap-3">
              <Link
                href="/operations/operational-planning/operations-calendar"
                className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Operations Calendar
              </Link>
              <Link
                href="/operations/operational-planning/control-panel"
                className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Control Panel
              </Link>
            </div>
          </div>
        </div>

        {/* Main Network Graph Visualization */}
        <div className="mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Activity Network Overview</h3>
              <p className="text-sm text-gray-600">Hover over nodes to see details • Click to open full information</p>
            </div>
            <div className="h-[700px] rounded-xl overflow-hidden border border-gray-200">
              <ActivityNetworkGraph
                activities={uniqueActivities}
                onActivityClick={setSelectedActivity}
                width={1200}
                height={700}
              />
            </div>
          </div>
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
