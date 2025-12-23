'use client';

import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import PageHeader from './components/layout/PageHeader';
import Breadcrumbs from './components/layout/Breadcrumbs';
import CalendarPlanningZone from './components/dashboard/CalendarPlanningZone';
import DashboardCarousel from './components/dashboard/DashboardCarousel';
import WelcomeModal from './components/onboarding/WelcomeModal';
import HelpButton from './components/help/HelpButton';
import { useOnboarding } from './hooks/useOnboarding';
import { colors, spacing, typography, animations } from './design-system';

export default function Dashboard() {
  const { shouldShowOnboarding, markOnboardingComplete } = useOnboarding();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show modal automatically if onboarding should be shown (first visit)
    if (shouldShowOnboarding) {
      setShowModal(true);
    }
  }, [shouldShowOnboarding]);

  const handleOnboardingComplete = (skipFuture: boolean) => {
    markOnboardingComplete(skipFuture);
    setShowModal(false);
  };

  const currentDate = new Date();
  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const dateString = `${dayName}, ${monthName} ${day}, ${year}`;


  // Calendar Events
  const calendarEvents = [
    { time: '06:00', name: 'Morning Aarti', type: 'Daily Ritual', load: 'High' as const, duration: '60 minutes' },
    { time: '12:00', name: 'Madhyana Aarti', type: 'Daily Ritual', load: 'Medium' as const, duration: '45 minutes' },
    { time: '19:00', name: 'Evening Aarti', type: 'Daily Ritual', load: 'High' as const, duration: '60 minutes', conflict: true },
  ];

  // Financial Data
  const financialData = {
    daily: {
      revenue: 125000,
      expenses: 45000,
      net: 80000,
      donations: 98000,
      trend: 'up' as const,
    },
    monthly: {
      revenue: 1245000,
      expenses: 485000,
      net: 760000,
      donations: 320000,
      trend: 'up' as const,
    },
    yearly: {
      revenue: 15200000,
      expenses: 5820000,
      net: 9380000,
      donations: 3840000,
      trend: 'up' as const,
    },
  };

  const expenseCategories = [
    { name: 'Ritual Supplies', percentage: 33, amount: 14850 },
    { name: 'Staff Salaries', percentage: 44, amount: 19800 },
    { name: 'Facility Maintenance', percentage: 18, amount: 8100 },
    { name: 'Utilities', percentage: 5, amount: 2250 },
  ];

  // Announcements
  const announcements = [
    { text: 'Guru Purnima celebration will be held on July 20th. All devotees are welcome.' },
    { text: 'Temple will remain closed on August 15th for maintenance work.' },
    { text: 'New seva booking system is now available. Please use the online portal for bookings.' },
  ];

  // Today's Events
  const todayEvents = [
    { date: '', time: '06:00', name: 'Morning Aarti', type: 'Daily Ritual', load: 'High' as const },
    { date: '', time: '12:00', name: 'Madhyana Aarti', type: 'Daily Ritual', load: 'Medium' as const },
    { date: '', time: '19:00', name: 'Evening Aarti', type: 'Daily Ritual', load: 'High' as const },
  ];

  // Upcoming Events
  const upcomingEvents = [
    { date: 'Jul 20', time: '10:00', name: 'Guru Purnima Celebration', type: 'Major Festival', load: 'High' as const },
    { date: 'Jul 22', time: '18:00', name: 'Special Puja for Devotees', type: 'Special Event', load: 'Medium' as const },
    { date: 'Aug 2', time: '09:00', name: 'Nag Panchami', type: 'Major Festival', load: 'High' as const },
  ];

  // Alerts
  const alerts = [
    {
      id: '1',
      severity: 'critical' as const,
      title: 'Priest Unavailable',
      description: 'Pandit Vishwanath Joshi unavailable for Evening Aarti today at 19:00',
      actionLabel: 'Assign Alternative',
    },
    {
      id: '2',
      severity: 'warning' as const,
      title: 'High Crowd Expected',
      description: 'Guru Purnima on July 20 - expect 3x normal footfall. Additional manpower required.',
      actionLabel: 'View Details',
    },
    {
      id: '3',
      severity: 'info' as const,
      title: 'Donation Milestone',
      description: 'Monthly donation target of ₹25L achieved 15 days early',
      actionLabel: 'View Report',
    },
  ];

  // Task Stats
  const taskStats = {
    total: 5,
    pending: 2,
    active: 1,
    done: 1,
    overdue: 1,
  };

  // Tasks
  const tasks = [
    {
      id: '1',
      title: 'Prepare Monthly Financial Report',
      assignee: 'Finance Team',
      category: 'Finance',
      status: 'in-progress' as const,
      priority: 'high' as const,
      dueDate: 'Jul 20, 2025',
    },
    {
      id: '2',
      title: 'Schedule Guru Purnima Celebrations',
      assignee: 'Event Manager',
      category: 'Events',
      status: 'pending' as const,
      priority: 'high' as const,
      dueDate: 'Jul 18, 2025',
    },
    {
      id: '3',
      title: 'Update Temple Website Content',
      assignee: 'Content Team',
      category: 'Content',
      status: 'pending' as const,
      priority: 'medium' as const,
      dueDate: 'Jul 25, 2025',
    },
    {
      id: '4',
      title: 'Review Staff Attendance Records',
      assignee: 'HR Manager',
      category: 'HR',
      status: 'completed' as const,
      priority: 'medium' as const,
      dueDate: 'Jul 15, 2025',
    },
    {
      id: '5',
      title: 'Maintenance Check - Main Hall',
      assignee: 'Facilities Team',
      category: 'Facilities',
      status: 'overdue' as const,
      priority: 'high' as const,
      dueDate: 'Jul 10, 2025',
    },
  ];

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background.base }}
    >
      {showModal && (
        <WelcomeModal
          onClose={() => setShowModal(false)}
          onComplete={handleOnboardingComplete}
        />
      )}
      <Header />

      {/* Main Content */}
      <main 
        className="mx-auto"
        style={{ 
          maxWidth: spacing.containerMaxWidth,
          paddingLeft: spacing.contentPadding,
          paddingRight: spacing.contentPadding,
          paddingTop: spacing.contentPaddingY,
          paddingBottom: spacing.contentPaddingY,
        }}
      >
        <Breadcrumbs items={[{ label: 'Dashboard' }]} />
        <PageHeader dateString={dateString} />

        {/* Top Section: Calendar & Carousel */}
        <div 
          className={`grid grid-cols-12 gap-6 ${animations.fadeInUp}`}
          style={{ gap: spacing.lg }}
        >
          <CalendarPlanningZone events={calendarEvents} />
          <DashboardCarousel
            todayEvents={todayEvents}
            upcomingEvents={upcomingEvents}
            alerts={alerts}
            taskStats={taskStats}
            tasks={tasks}
            financialData={financialData}
            expenseCategories={expenseCategories}
            announcements={announcements}
          />
        </div>
      </main>
      <HelpButton context="dashboard" />
    </div>
  );
}
