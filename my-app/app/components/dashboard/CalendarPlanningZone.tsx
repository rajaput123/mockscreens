'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { colors, spacing, typography, getLoadColor } from '../../design-system';

interface CalendarEvent {
  time: string;
  name: string;
  type: string;
  load: 'High' | 'Medium' | 'Low';
  duration?: string;
  conflict?: boolean;
}

interface CalendarPlanningZoneProps {
  events: CalendarEvent[];
}

interface CalendarData {
  temple: CalendarEvent[];
  priest: CalendarEvent[];
  executive: CalendarEvent[];
}

export default function CalendarPlanningZone({ events }: CalendarPlanningZoneProps) {
  const [calendarType, setCalendarType] = useState('Temple Calendar');
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Get today's date - compute once per render
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  
  // Memoize isCurrentMonth to ensure stable dependency
  const isCurrentMonth = useMemo(() => {
    return currentDate.getMonth() === todayMonth && currentDate.getFullYear() === todayYear;
  }, [currentDate.getMonth(), currentDate.getFullYear(), todayMonth, todayYear]);
  
  const [selectedDay, setSelectedDay] = useState<number | null>(isCurrentMonth ? todayDate : null);

  // Click outside handler - reset to today if in current month
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        // Reset to today if in current month, otherwise clear selection
        if (isCurrentMonth) {
          setSelectedDay(todayDate);
        } else {
          setSelectedDay(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCurrentMonth, todayDate]);

  // Different events for each calendar type
  const calendarData: CalendarData = {
    temple: events, // Default temple events
    priest: [
      { time: '05:00', name: 'Morning Puja', type: 'Priest Ritual', load: 'High' as const, duration: '90 minutes' },
      { time: '11:00', name: 'Midday Abhishekam', type: 'Priest Ritual', load: 'Medium' as const, duration: '60 minutes' },
      { time: '18:00', name: 'Evening Puja', type: 'Priest Ritual', load: 'High' as const, duration: '90 minutes' },
      { time: '20:00', name: 'Night Aarti', type: 'Priest Ritual', load: 'Low' as const, duration: '30 minutes' },
    ],
    executive: [
      { time: '09:00', name: 'Executive Meeting', type: 'Administrative', load: 'Medium' as const, duration: '120 minutes' },
      { time: '14:00', name: 'Trustee Review', type: 'Administrative', load: 'High' as const, duration: '90 minutes' },
      { time: '16:00', name: 'Financial Planning', type: 'Administrative', load: 'Medium' as const, duration: '60 minutes' },
      { time: '17:00', name: 'Operations Review', type: 'Administrative', load: 'Low' as const, duration: '45 minutes' },
    ],
  };

  // Get current calendar events based on selected type
  const getCurrentEvents = () => {
    switch (calendarType) {
      case 'Shri Gurugal':
        return calendarData.priest;
      case 'Temple Executive':
        return calendarData.executive;
      default:
        return calendarData.temple;
    }
  };

  // Check if events are available for the selected day
  const getEventsForSelectedDay = () => {
    if (selectedDay === null) return [];
    
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
    const isSelectedDayToday = 
      selectedDay === todayDate &&
      currentDate.getMonth() === todayMonth &&
      currentDate.getFullYear() === todayYear;
    
    // Check if the selected day has events
    // For now, we'll show events for:
    // 1. Today (always has events)
    // 2. Days that are 1st, 15th (monthly events)
    // 3. Sundays (special events)
    const dayOfWeek = selectedDate.getDay();
    const isFirstOfMonth = selectedDay === 1;
    const isFifteenthOfMonth = selectedDay === 15;
    const isSunday = dayOfWeek === 0;
    const isTenthDay = selectedDay % 10 === 0; // Every 10th day for special seva
    
    // Show events if it's today, or if it's a special day
    if (isSelectedDayToday || isFirstOfMonth || isFifteenthOfMonth || isSunday || isTenthDay) {
      return getCurrentEvents();
    }
    
    // No events for this day
    return [];
  };

  const currentEvents = getCurrentEvents();
  const selectedDayEvents = getEventsForSelectedDay();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(currentDate);
    if (direction === 'today') {
      const now = new Date();
      setCurrentDate(now);
      // Select today's date when clicking "Today"
      setSelectedDay(now.getDate());
    } else if (direction === 'prev') {
      if (viewMode === 'month') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (viewMode === 'year') {
        newDate.setFullYear(newDate.getFullYear() - 1);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      setCurrentDate(newDate);
      // Only auto-select today if navigating to current month AND no date is currently selected
      const isNewDateCurrentMonth = newDate.getMonth() === todayMonth && newDate.getFullYear() === todayYear;
      if (selectedDay === null && isNewDateCurrentMonth) {
        setSelectedDay(todayDate);
      } else if (!isNewDateCurrentMonth) {
        // Clear selection if navigating away from current month
        setSelectedDay(null);
      }
    } else {
      if (viewMode === 'month') {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (viewMode === 'year') {
        newDate.setFullYear(newDate.getFullYear() + 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      setCurrentDate(newDate);
      // Only auto-select today if navigating to current month AND no date is currently selected
      const isNewDateCurrentMonth = newDate.getMonth() === todayMonth && newDate.getFullYear() === todayYear;
      if (selectedDay === null && isNewDateCurrentMonth) {
        setSelectedDay(todayDate);
      } else if (!isNewDateCurrentMonth) {
        // Clear selection if navigating away from current month
        setSelectedDay(null);
      }
    }
  };

  // Only clear selection when view mode changes to non-month view
  useEffect(() => {
    if (viewMode !== 'month') {
      setSelectedDay(null);
    }
  }, [viewMode]);

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const isToday = (day: number) => {
      return (
        day === todayDate &&
        currentDate.getMonth() === todayMonth &&
        currentDate.getFullYear() === todayYear
      );
    };

    const days = [];
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    const getCalendarLabel = () => {
      switch (calendarType) {
        case 'Shri Gurugal':
          return 'Days with priest rituals';
        case 'Temple Executive':
          return 'Days with executive meetings';
        default:
          return 'Days with scheduled events';
      }
    };

    return (
      <div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold" style={{ fontFamily: typography.sectionHeader.fontFamily }}>
              {monthName}
            </div>
            <div 
              className="text-sm px-3 py-1 rounded-xl"
              style={{
                fontFamily: typography.bodySmall.fontFamily,
                backgroundColor: calendarType === 'Temple Calendar' ? colors.calendar.temple.bg : calendarType === 'Shri Gurugal' ? colors.calendar.gurugal.bg : colors.calendar.executive.bg,
                color: calendarType === 'Temple Calendar' ? colors.calendar.temple.text : calendarType === 'Shri Gurugal' ? colors.calendar.gurugal.text : colors.calendar.executive.text,
              }}
            >
              {calendarType}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div
                key={day}
                className="text-center py-2 text-sm font-medium"
                style={{
                  fontFamily: typography.bodySmall.fontFamily,
                  color: colors.text.muted,
                }}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isDaySelected = selectedDay === day;
              const isDayToday = day !== null ? isToday(day) : false;
              // Today should always be highlighted (with border), selected day gets background
              const isTodayAndNotSelected = isDayToday && !isDaySelected;
              const classNameForDay = day === null
                ? 'text-transparent cursor-default'
                : isDaySelected
                ? 'text-white font-semibold'
                : isDayToday
                ? 'font-semibold'
                : 'hover:bg-gray-100';
              
              return (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  if (day !== null) {
                    // Select the clicked day (don't deselect if clicking same day - let click outside handle that)
                    setSelectedDay(day);
                  }
                }}
                onMouseDown={(e) => {
                  // Prevent text selection when clicking
                  e.preventDefault();
                }}
                className={`aspect-square flex items-center justify-center text-sm rounded cursor-pointer transition-all duration-200 ${classNameForDay}`}
                style={{
                  fontFamily: typography.bodySmall.fontFamily,
                  // Selected day gets primary background
                  ...(isDaySelected && { 
                    backgroundColor: colors.primary.base,
                    transform: 'scale(1.05)',
                    color: 'white',
                  }),
                  // Today (when not selected) gets a border to always show it's today
                  ...(isTodayAndNotSelected && { 
                    border: `2px solid ${colors.primary.base}`,
                    color: colors.primary.base,
                  }),
                }}
              >
                {day}
              </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.primary.dark }}></div>
          <span 
            className="text-sm"
            style={{
              fontFamily: typography.bodySmall.fontFamily,
              color: colors.text.muted,
            }}
          >
            {getCalendarLabel()}
          </span>
        </div>
        {/* Show events only when a day is clicked and events are available for that day */}
        {selectedDay !== null && selectedDayEvents.length > 0 && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div 
                className="text-sm font-semibold"
                style={{
                  fontFamily: typography.bodySmall.fontFamily,
                  fontWeight: 600,
                }}
              >
                {currentDate.toLocaleDateString('en-US', { month: 'long' })} {selectedDay} Schedule ({calendarType})
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
                aria-label="Close"
                style={{
                  color: colors.text.muted,
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {selectedDayEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-3xl transition-colors"
                style={{
                  ...(selectedDay !== null && {
                    '--hover-border-color': colors.primary.base,
                  } as React.CSSProperties),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primary.base;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                }}
              >
                <div 
                  className="font-medium"
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 600,
                    minWidth: '60px',
                  }}
                >
                  {event.time}
                </div>
                <div className="flex-1">
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
            ))}
          </div>
        )}
        {/* Show message when day is selected but no events available */}
        {selectedDay !== null && selectedDayEvents.length === 0 && (
          <div className="mt-6 p-4 border border-gray-200 rounded-3xl bg-gray-50 relative">
            <button
              onClick={() => setSelectedDay(null)}
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-300 transition-colors"
              aria-label="Close"
              style={{
                color: colors.text.muted,
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div 
              className="text-sm text-center"
              style={{
                fontFamily: typography.bodySmall.fontFamily,
                color: colors.text.muted,
              }}
            >
              No events scheduled for {currentDate.toLocaleDateString('en-US', { month: 'long' })} {selectedDay}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDayView = () => {
    return (
      <div className="space-y-3">
        {currentEvents.map((event, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-4 border rounded-3xl transition-colors ${
              event.conflict ? 'bg-red-50 border-red-300' : 'border-gray-200'
            }`}
            onMouseEnter={(e) => {
              if (!event.conflict) {
                e.currentTarget.style.borderColor = colors.primary.base;
              }
            }}
            onMouseLeave={(e) => {
              if (!event.conflict) {
                e.currentTarget.style.borderColor = colors.border;
              }
            }}
          >
            <div 
              className="font-medium"
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                fontWeight: 600,
                minWidth: '60px',
              }}
            >
              {event.time}
            </div>
            <div className="flex-1">
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
                className="mt-1 flex items-center gap-3"
                style={{
                  fontFamily: typography.bodySmall.fontFamily,
                  fontSize: typography.bodySmall.fontSize,
                  color: colors.text.muted,
                }}
              >
                <span>{event.type}</span>
                {event.duration && <span>• {event.duration}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {event.conflict && (
                <span 
                  className="px-2 py-1 rounded text-xs font-medium text-white bg-red-600"
                >
                  Conflict
                </span>
              )}
              <span 
                className="px-2 py-1 rounded text-xs font-medium text-white"
                style={{
                  backgroundColor: getLoadColor(event.load),
                }}
              >
                {event.load} Load
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderYearView = () => {
    const year = currentDate.getFullYear();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const today = new Date();

    // Get label based on calendar type
    const getCalendarLabel = () => {
      switch (calendarType) {
        case 'Shri Gurugal':
          return 'Priest Rituals';
        case 'Temple Executive':
          return 'Executive Events';
        default:
          return 'Regular rituals';
      }
    };

    const renderMiniCalendar = (monthIndex: number) => {
      const monthDate = new Date(year, monthIndex, 1);
      const daysInMonth = getDaysInMonth(monthDate);
      const firstDay = getFirstDayOfMonth(monthDate);
      
      const days = [];
      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
      }

      const isTodayInMonth = (day: number) => {
        return (
          day === todayDate &&
          monthIndex === todayMonth &&
          year === todayYear
        );
      };

      return (
        <div key={monthIndex} className="border border-gray-200 rounded-3xl p-3 bg-white">
          <div 
            className="text-sm font-semibold mb-2 text-center"
            style={{
              fontFamily: typography.bodySmall.fontFamily,
              fontWeight: 600,
            }}
          >
            {months[monthIndex]}
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <div
                key={idx}
                className="text-center text-xs py-1"
                style={{
                  fontFamily: typography.bodySmall.fontFamily,
                  color: colors.text.muted,
                  fontSize: '10px',
                }}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`aspect-square flex items-center justify-center text-xs rounded ${
                  day === null
                    ? 'text-transparent'
                    : day !== null && isTodayInMonth(day)
                    ? 'text-white font-semibold'
                    : 'hover:bg-gray-100'
                }`}
                style={{
                  fontFamily: typography.bodySmall.fontFamily,
                  fontSize: '10px',
                  ...(day !== null && isTodayInMonth(day) && { backgroundColor: colors.primary.base }),
                }}
              >
                {day}
              </div>
            ))}
          </div>
          <div 
            className="mt-2 text-xs text-center"
            style={{
              fontFamily: typography.bodySmall.fontFamily,
              color: colors.text.muted,
              fontSize: '10px',
            }}
          >
            {getCalendarLabel()}
          </div>
        </div>
      );
    };

    const getYearTitle = () => {
      switch (calendarType) {
        case 'Shri Gurugal':
          return `${year} Priest Ritual Calendar`;
        case 'Temple Executive':
          return `${year} Executive Event Calendar`;
        default:
          return `${year} Festival & Event Calendar`;
      }
    };

    const getYearSummary = () => {
      switch (calendarType) {
        case 'Shri Gurugal':
          return 'Daily priest rituals scheduled';
        case 'Temple Executive':
          return '12 executive meetings planned';
        default:
          return '6 major festivals scheduled';
      }
    };

    return (
      <div>
        <div 
          className="mb-4 text-lg font-semibold"
          style={{
            fontFamily: typography.sectionHeader.fontFamily,
          }}
        >
          {getYearTitle()}
        </div>
        <div 
          className="mb-4 text-sm"
          style={{
            fontFamily: typography.bodySmall.fontFamily,
            color: colors.text.muted,
          }}
        >
          {getYearSummary()}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {months.map((_, index) => renderMiniCalendar(index))}
        </div>
      </div>
    );
  };

  return (
    <section className="col-span-7">
      <div ref={calendarRef} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
        <h2 
          style={{
            fontFamily: typography.sectionHeader.fontFamily,
            fontSize: typography.sectionHeader.fontSize,
            fontWeight: typography.sectionHeader.fontWeight,
            lineHeight: typography.sectionHeader.lineHeight,
          }}
        >
          Calendar & Planning
        </h2>
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-1">
          <button
            onClick={() => {
              setViewMode('day');
              setSelectedDay(null); // Clear selection when changing view mode
            }}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              viewMode === 'day'
                ? 'text-white'
                : 'text-gray-600'
            }`}
            style={{
              fontFamily: typography.bodySmall.fontFamily,
              ...(viewMode === 'day' ? { backgroundColor: colors.primary.base } : {}),
            }}
            onMouseEnter={(e) => {
              if (viewMode !== 'day') {
                e.currentTarget.style.color = colors.primary.base;
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== 'day') {
                e.currentTarget.style.color = '';
              }
            }}
          >
            Day
          </button>
          <button
            onClick={() => {
              setViewMode('month');
              setSelectedDay(null); // Clear selection when changing view mode
            }}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              viewMode === 'month'
                ? 'text-white'
                : 'text-gray-600'
            }`}
            style={{
              fontFamily: typography.bodySmall.fontFamily,
              ...(viewMode === 'month' ? { backgroundColor: colors.primary.base } : {}),
            }}
            onMouseEnter={(e) => {
              if (viewMode !== 'month') {
                e.currentTarget.style.color = colors.primary.base;
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== 'month') {
                e.currentTarget.style.color = '';
              }
            }}
          >
            Month
          </button>
          <button
            onClick={() => {
              setViewMode('year');
              setSelectedDay(null); // Clear selection when changing view mode
            }}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              viewMode === 'year'
                ? 'text-white'
                : 'text-gray-600'
            }`}
            style={{
              fontFamily: typography.bodySmall.fontFamily,
              ...(viewMode === 'year' ? { backgroundColor: colors.primary.base } : {}),
            }}
            onMouseEnter={(e) => {
              if (viewMode !== 'year') {
                e.currentTarget.style.color = colors.primary.base;
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== 'year') {
                e.currentTarget.style.color = '';
              }
            }}
          >
            Year
          </button>
        </div>
        </div>

      {/* Calendar Type Selector */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => {
            setCalendarType('Temple Calendar');
            setSelectedDay(null); // Clear selection when changing calendar type
          }}
          className={`px-4 py-2 text-sm rounded-xl transition-colors ${
            calendarType === 'Temple Calendar'
              ? 'text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={{
            fontFamily: typography.bodySmall.fontFamily,
            ...(calendarType === 'Temple Calendar' ? { backgroundColor: colors.primary.base } : {}),
          }}
        >
          Temple Calendar
        </button>
        <button
          onClick={() => {
            setCalendarType('Shri Gurugal');
            setSelectedDay(null); // Clear selection when changing calendar type
          }}
          className={`px-4 py-2 text-sm rounded-xl transition-colors ${
            calendarType === 'Shri Gurugal'
              ? 'text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={{
            fontFamily: typography.bodySmall.fontFamily,
            ...(calendarType === 'Shri Gurugal' ? { backgroundColor: colors.primary.base } : {}),
          }}
        >
          Shri Gurugal
        </button>
        <button
          onClick={() => {
            setCalendarType('Temple Executive');
            setSelectedDay(null); // Clear selection when changing calendar type
          }}
          className={`px-4 py-2 text-sm rounded-xl transition-colors ${
            calendarType === 'Temple Executive'
              ? 'text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={{
            fontFamily: typography.bodySmall.fontFamily,
            ...(calendarType === 'Temple Executive' ? { backgroundColor: colors.primary.base } : {}),
          }}
        >
          Temple Executive
        </button>
        <button
          onClick={() => {
            // Handle button action
            console.log('Calendar action clicked');
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-colors hover:opacity-90 ml-auto"
          style={{
            backgroundColor: colors.primary.base,
            color: colors.text.inverse,
            fontFamily: typography.bodySmall.fontFamily,
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Event
        </button>
      </div>

      {/* Date Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDate('prev')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            style={{
              fontFamily: typography.bodySmall.fontFamily,
            }}
            aria-label="Previous"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => navigateDate('today')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            style={{
              fontFamily: typography.bodySmall.fontFamily,
            }}
          >
            Today
          </button>
          <button
            onClick={() => navigateDate('next')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            style={{
              fontFamily: typography.bodySmall.fontFamily,
            }}
            aria-label="Next"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="p-4 bg-gray-50 rounded-3xl">
        {viewMode === 'month' 
          ? renderMonthView() 
          : viewMode === 'year' 
          ? renderYearView() 
          : renderDayView()}
      </div>

      {/* Events List for Day View */}
      {viewMode === 'day' && (
        <div className="mt-4">
          <div 
            className="mb-3 font-medium"
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
          >
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          {currentEvents.length > 0 ? (
            <div className="space-y-2">
              {currentEvents.map((event, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-3xl transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.primary.base;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                >
                  <div className="flex items-center gap-2">
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
                      }}
                    >
                      {event.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="text-gray-500 py-4"
              style={{
                fontFamily: typography.bodySmall.fontFamily,
                fontSize: typography.bodySmall.fontSize,
              }}
            >
              No events scheduled
            </div>
          )}
        </div>
      )}
      </div>
    </section>
  );
}
