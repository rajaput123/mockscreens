'use client';

import { useState, useEffect, useMemo } from 'react';
import { colors, spacing, typography, getLoadColor, getStatusColor, getPriorityColor, getSeverityColor, getSeverityBg } from '../../design-system';
import EventsSnapshot from './EventsSnapshot';
import AlertsNotifications from '../notifications/AlertsNotifications';
import TaskManagement from './TaskManagement';
import FinancialSummary from './FinancialSummary';
import Announcements from '../notifications/Announcements';

interface DashboardCarouselProps {
  todayEvents: any[];
  upcomingEvents: any[];
  alerts: any[];
  taskStats: any;
  tasks: any[];
  financialData?: any;
  expenseCategories?: any[];
  announcements?: any[];
}

export default function DashboardCarousel({
  todayEvents,
  upcomingEvents,
  alerts,
  taskStats,
  tasks,
  financialData,
  expenseCategories,
  announcements,
}: DashboardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'right' | 'left'>('right');

  const carouselItems = useMemo(() => [
    {
      id: 'events',
      title: 'Events Snapshot',
      component: 'events',
    },
    {
      id: 'tasks',
      title: 'Task Management',
      component: 'tasks',
    },
    {
      id: 'alerts',
      title: 'Alerts & Notifications',
      component: 'alerts',
    },
    ...(financialData && expenseCategories ? [{
      id: 'financial',
      title: 'Financial Summary',
      component: 'financial',
    }] : []),
    ...(announcements ? [{
      id: 'announcements',
      title: 'Announcements',
      component: 'announcements',
    }] : []),
  ], [financialData, expenseCategories, announcements]);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection('right');
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 'right' : 'left');
    setActiveIndex(index);
  };

  const goToPrevious = () => {
    setDirection('left');
    setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToNext = () => {
    setDirection('right');
    setActiveIndex((prev) => (prev + 1) % carouselItems.length);
  };

  return (
    <section className="col-span-5">
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm overflow-hidden">
        {/* Header with Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <h2 
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              lineHeight: typography.sectionHeader.lineHeight,
            }}
          >
            {carouselItems[activeIndex].title}
          </h2>
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Previous"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeIndex
                      ? 'w-8 h-2'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  style={{
                    ...(index === activeIndex && { backgroundColor: colors.primary.base }),
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            {/* Next Button */}
            <button
              onClick={goToNext}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Next"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="relative overflow-hidden" style={{ minHeight: '500px' }}>
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
          >
            {carouselItems.map((item, index) => (
              <div
                key={item.id}
                className="w-full flex-shrink-0 px-2"
                style={{
                  animation: index === activeIndex 
                    ? direction === 'right' 
                      ? 'slideInFromRight 0.5s ease-out' 
                      : 'slideInFromLeft 0.5s ease-out'
                    : 'none',
                }}
              >
                {item.component === 'events' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <div></div>
                      <button
                        onClick={() => {
                          // Handle calendar view action
                          console.log('View Calendar clicked');
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors hover:opacity-90"
                        style={{
                          backgroundColor: colors.primary.base,
                          color: colors.text.inverse,
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          fontWeight: 500,
                        }}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        View Calendar
                      </button>
                    </div>
                    <div>
                      <h3 
                        className="mb-3"
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          fontWeight: 600,
                        }}
                      >
                        Today's Events
                      </h3>
                        <div className="space-y-3">
                          {todayEvents.map((event, idx) => (
                            <div
                              key={idx}
                              className="p-3 border border-gray-200 rounded-3xl transition-colors"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = colors.primary.base;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = colors.border;
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span 
                                      style={{
                                        fontFamily: typography.body.fontFamily,
                                        fontSize: typography.body.fontSize,
                                        fontWeight: 600,
                                      }}
                                    >
                                      {event.time}
                                    </span>
                                    <span 
                                      style={{
                                        fontFamily: typography.body.fontFamily,
                                        fontSize: typography.body.fontSize,
                                        fontWeight: typography.body.fontWeight,
                                      }}
                                    >
                                      {event.name}
                                    </span>
                                  </div>
                                  <div 
                                    className="flex items-center gap-2"
                                    style={{
                                      fontFamily: typography.bodySmall.fontFamily,
                                      fontSize: typography.bodySmall.fontSize,
                                      color: colors.text.muted,
                                    }}
                                  >
                                    <span>{event.type}</span>
                                  </div>
                                </div>
                                <span 
                                  className="px-2 py-1 rounded text-xs font-medium text-white"
                                  style={{
                                    backgroundColor: getLoadColor(event.load),
                                  }}
                                >
                                  {event.load}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 
                          className="mb-3"
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            fontWeight: 600,
                          }}
                        >
                          Upcoming Events
                        </h3>
                        <div className="space-y-3">
                          {upcomingEvents.map((event, idx) => (
                            <div
                              key={idx}
                              className="p-3 border border-gray-200 rounded-3xl transition-colors"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = colors.primary.base;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = colors.border;
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span 
                                      style={{
                                        fontFamily: typography.bodySmall.fontFamily,
                                        fontSize: typography.bodySmall.fontSize,
                                        color: colors.text.muted,
                                      }}
                                    >
                                      {event.date}
                                    </span>
                                    <span 
                                      style={{
                                        fontFamily: typography.bodySmall.fontFamily,
                                        fontSize: typography.bodySmall.fontSize,
                                        color: colors.text.muted,
                                      }}
                                    >
                                      {event.time}
                                    </span>
                                  </div>
                                  <div 
                                    style={{
                                      fontFamily: typography.body.fontFamily,
                                      fontSize: typography.body.fontSize,
                                      fontWeight: typography.body.fontWeight,
                                    }}
                                  >
                                    {event.name}
                                  </div>
                                  <div 
                                    className="mt-1"
                                    style={{
                                      fontFamily: typography.bodySmall.fontFamily,
                                      fontSize: typography.bodySmall.fontSize,
                                      color: colors.text.muted,
                                    }}
                                  >
                                    {event.type}
                                  </div>
                                </div>
                                <span 
                                  className="px-2 py-1 rounded text-xs font-medium text-white"
                                  style={{
                                    backgroundColor: getLoadColor(event.load),
                                  }}
                                >
                                  {event.load}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                )}
                {item.component === 'tasks' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div></div>
                      <button
                        onClick={() => {
                          // Handle add task action
                          console.log('Add Task clicked');
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors hover:opacity-90"
                        style={{
                          backgroundColor: colors.primary.base,
                          color: colors.text.inverse,
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          fontWeight: 500,
                        }}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Task
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-2 mb-6">
                      <div className="text-center p-2 border border-gray-200 rounded">
                        <div 
                          style={{
                            fontFamily: typography.kpi.fontFamily,
                            fontSize: typography.kpi.fontSize,
                            fontWeight: typography.kpi.fontWeight,
                          }}
                        >
                          {taskStats.total}
                        </div>
                        <div 
                          className="text-xs mt-1"
                          style={{
                            fontFamily: typography.bodySmall.fontFamily,
                            fontSize: '12px',
                            color: colors.text.muted,
                          }}
                        >
                          Total
                        </div>
                      </div>
                      <div className="text-center p-2 border border-gray-200 rounded">
                        <div 
                          style={{
                            fontFamily: typography.kpi.fontFamily,
                            fontSize: typography.kpi.fontSize,
                            fontWeight: typography.kpi.fontWeight,
                            color: colors.warning.base,
                          }}
                        >
                          {taskStats.pending}
                        </div>
                        <div 
                          className="text-xs mt-1"
                          style={{
                            fontFamily: typography.bodySmall.fontFamily,
                            fontSize: '12px',
                            color: colors.text.muted,
                          }}
                        >
                          Pending
                        </div>
                      </div>
                      <div className="text-center p-2 border border-gray-200 rounded">
                        <div 
                          style={{
                            fontFamily: typography.kpi.fontFamily,
                            fontSize: typography.kpi.fontSize,
                            fontWeight: typography.kpi.fontWeight,
                            color: colors.info.base,
                          }}
                        >
                          {taskStats.active}
                        </div>
                        <div 
                          className="text-xs mt-1"
                          style={{
                            fontFamily: typography.bodySmall.fontFamily,
                            fontSize: '12px',
                            color: colors.text.muted,
                          }}
                        >
                          Active
                        </div>
                      </div>
                      <div className="text-center p-2 border border-gray-200 rounded">
                        <div 
                          style={{
                            fontFamily: typography.kpi.fontFamily,
                            fontSize: typography.kpi.fontSize,
                            fontWeight: typography.kpi.fontWeight,
                            color: colors.success.base,
                          }}
                        >
                          {taskStats.done}
                        </div>
                        <div 
                          className="text-xs mt-1"
                          style={{
                            fontFamily: typography.bodySmall.fontFamily,
                            fontSize: '12px',
                            color: colors.text.muted,
                          }}
                        >
                          Done
                        </div>
                      </div>
                      <div className="text-center p-2 border border-gray-200 rounded">
                        <div 
                          style={{
                            fontFamily: typography.kpi.fontFamily,
                            fontSize: typography.kpi.fontSize,
                            fontWeight: typography.kpi.fontWeight,
                            color: colors.error.base,
                          }}
                        >
                          {taskStats.overdue}
                        </div>
                        <div 
                          className="text-xs mt-1"
                          style={{
                            fontFamily: typography.bodySmall.fontFamily,
                            fontSize: '12px',
                            color: colors.text.muted,
                          }}
                        >
                          Overdue
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-4 border border-gray-200 rounded-3xl transition-colors"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = colors.primary.base;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = colors.border;
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div 
                              className="flex-1"
                              style={{
                                fontFamily: typography.body.fontFamily,
                                fontSize: typography.body.fontSize,
                                fontWeight: 600,
                              }}
                            >
                              {task.title}
                            </div>
                            <div className="flex items-center gap-2">
                              <span 
                                className="px-2 py-1 rounded text-xs font-medium text-white capitalize"
                                style={{
                                  backgroundColor: getStatusColor(task.status),
                                }}
                              >
                                {task.status === 'in-progress' ? 'In Progress' : task.status}
                              </span>
                              <span 
                                className="px-2 py-1 rounded text-xs font-medium text-white capitalize"
                                style={{
                                  backgroundColor: getPriorityColor(task.priority),
                                }}
                              >
                                {task.priority}
                              </span>
                            </div>
                          </div>
                          <div 
                            className="mb-2"
                            style={{
                              fontFamily: typography.bodySmall.fontFamily,
                              fontSize: typography.bodySmall.fontSize,
                              color: colors.text.muted,
                            }}
                          >
                            {task.assignee} • {task.category}
                          </div>
                          <div 
                            style={{
                              fontFamily: typography.bodySmall.fontFamily,
                              fontSize: typography.bodySmall.fontSize,
                              color: colors.text.muted,
                            }}
                          >
                            Due: {task.dueDate}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {item.component === 'alerts' && (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-4 rounded-3xl border-l-4 transition-all duration-200 hover:shadow-md"
                        style={{
                          borderLeftColor: getSeverityColor(alert.severity),
                          backgroundColor: getSeverityBg(alert.severity),
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div 
                            className="font-semibold capitalize"
                            style={{
                              fontFamily: typography.body.fontFamily,
                              fontSize: typography.body.fontSize,
                              fontWeight: 600,
                              color: getSeverityColor(alert.severity),
                            }}
                          >
                            {alert.severity}
                          </div>
                          {alert.actionLabel && (
                            <button 
                              className="text-xs font-medium hover:underline"
                              style={{
                                color: getSeverityColor(alert.severity),
                              }}
                            >
                              {alert.actionLabel}
                            </button>
                          )}
                        </div>
                        <div 
                          className="mb-1"
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            fontWeight: 600,
                          }}
                        >
                          {alert.title}
                        </div>
                        <div 
                          style={{
                            fontFamily: typography.bodySmall.fontFamily,
                            fontSize: typography.bodySmall.fontSize,
                            color: colors.text.muted,
                          }}
                        >
                          {alert.description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {item.component === 'financial' && financialData && expenseCategories && (
                  <div>
                    <FinancialSummary 
                      financialData={financialData}
                      expenseCategories={expenseCategories}
                    />
                  </div>
                )}
                {item.component === 'announcements' && announcements && (
                  <div>
                    <Announcements announcements={announcements} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
