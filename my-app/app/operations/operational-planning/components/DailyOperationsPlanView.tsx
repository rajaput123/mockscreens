'use client';

import { useState, useEffect } from 'react';

interface TimeBlock {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  rituals: Array<{
    id: string;
    name: string;
    time: string;
    type: string;
  }>;
  operationalNotes: string;
  dependencies: string[];
  checklist: Array<{
    id: string;
    label: string;
    status: 'pending' | 'confirmed';
    owner: string;
  }>;
}

interface DailyOperationsPlanViewProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  planStatus: 'draft' | 'finalized' | 'published';
  onStatusChange: (status: 'draft' | 'finalized' | 'published') => void;
  dayType: 'normal' | 'festival' | 'special';
  onDayTypeChange: (type: 'normal' | 'festival' | 'special') => void;
  isAdmin: boolean;
  templeName: string;
}

export default function DailyOperationsPlanView({
  selectedDate,
  onDateChange,
  planStatus,
  onStatusChange,
  dayType,
  onDayTypeChange,
  isAdmin,
  templeName,
}: DailyOperationsPlanViewProps) {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set(['morning', 'afternoon', 'evening']));
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [operationalNotes, setOperationalNotes] = useState<Record<string, string>>({
    morning: '',
    afternoon: '',
    evening: '',
  });
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [carouselDirection, setCarouselDirection] = useState<'left' | 'right'>('right');

  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    {
      id: 'morning',
      label: 'Morning',
      startTime: '05:00',
      endTime: '12:00',
      rituals: [
        { id: '1', name: 'Morning Aarti', time: '06:00', type: 'Daily Ritual' },
        { id: '2', name: 'Prasad Distribution', time: '07:30', type: 'Service' },
        { id: '3', name: 'Darshan Hours', time: '08:00', type: 'Regular' },
      ],
      operationalNotes: '',
      dependencies: ['Kitchen must be ready by 06:00', 'Priest confirmed for Aarti'],
      checklist: [
        { id: '1', label: 'Staff assigned', status: 'confirmed', owner: 'Operations Manager' },
        { id: '2', label: 'Priest availability confirmed', status: 'confirmed', owner: 'Temple Administrator' },
        { id: '3', label: 'Kitchen readiness checked', status: 'pending', owner: 'Kitchen Manager' },
        { id: '4', label: 'Facilities ready', status: 'confirmed', owner: 'Facilities Manager' },
        { id: '5', label: 'Crowd control planned', status: 'pending', owner: 'Security Head' },
      ],
    },
    {
      id: 'afternoon',
      label: 'Afternoon',
      startTime: '12:00',
      endTime: '17:00',
      rituals: [
        { id: '4', name: 'Madhyana Aarti', time: '12:00', type: 'Daily Ritual' },
        { id: '5', name: 'Lunch Prasad', time: '13:00', type: 'Service' },
      ],
      operationalNotes: '',
      dependencies: ['Lunch preparation by 12:30'],
      checklist: [
        { id: '6', label: 'Staff assigned', status: 'confirmed', owner: 'Operations Manager' },
        { id: '7', label: 'Priest availability confirmed', status: 'confirmed', owner: 'Temple Administrator' },
        { id: '8', label: 'Kitchen readiness checked', status: 'confirmed', owner: 'Kitchen Manager' },
        { id: '9', label: 'Facilities ready', status: 'confirmed', owner: 'Facilities Manager' },
      ],
    },
    {
      id: 'evening',
      label: 'Evening',
      startTime: '17:00',
      endTime: '22:00',
      rituals: [
        { id: '6', name: 'Evening Aarti', time: '19:00', type: 'Daily Ritual' },
        { id: '7', name: 'Bhajan Session', time: '20:00', type: 'Spiritual' },
      ],
      operationalNotes: '',
      dependencies: ['Sound system check required', 'Evening prasad preparation'],
      checklist: [
        { id: '10', label: 'Staff assigned', status: 'pending', owner: 'Operations Manager' },
        { id: '11', label: 'Priest availability confirmed', status: 'confirmed', owner: 'Temple Administrator' },
        { id: '12', label: 'Kitchen readiness checked', status: 'pending', owner: 'Kitchen Manager' },
        { id: '13', label: 'Facilities ready', status: 'confirmed', owner: 'Facilities Manager' },
        { id: '14', label: 'Crowd control planned', status: 'pending', owner: 'Security Head' },
      ],
    },
  ]);

  const toggleBlock = (blockId: string) => {
    setExpandedBlocks(prev => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });
  };

  const updateChecklistStatus = (blockId: string, checklistId: string) => {
    setTimeBlocks(prev => prev.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          checklist: block.checklist.map(item => {
            if (item.id === checklistId) {
              return {
                ...item,
                status: item.status === 'pending' ? 'confirmed' : 'pending',
              };
            }
            return item;
          }),
        };
      }
      return block;
    }));
  };

  const updateOperationalNotes = (blockId: string, notes: string) => {
    setOperationalNotes(prev => ({ ...prev, [blockId]: notes }));
  };

  const handleSaveDraft = () => {
    onStatusChange('draft');
    // Save logic here
  };

  const handleFinalize = () => {
    if (isAdmin && planStatus !== 'published') {
      onStatusChange('finalized');
      // Show success message or notification
      alert('Plan has been finalized successfully!');
    }
  };

  const handlePublish = () => {
    if (isAdmin && planStatus === 'finalized') {
      onStatusChange('published');
      alert('Plan has been published and is now visible to the operations team!');
    }
  };

  const goToBlock = (index: number) => {
    if (index >= 0 && index < timeBlocks.length) {
      setCarouselDirection(index > activeBlockIndex ? 'right' : 'left');
      setActiveBlockIndex(index);
    }
  };

  const goToPreviousBlock = () => {
    setCarouselDirection('left');
    setActiveBlockIndex((prev) => (prev - 1 + timeBlocks.length) % timeBlocks.length);
  };

  const goToNextBlock = () => {
    setCarouselDirection('right');
    setActiveBlockIndex((prev) => (prev + 1) % timeBlocks.length);
  };

  // Auto-rotate carousel every 8 seconds (optional)
  useEffect(() => {
    if (planStatus === 'draft' && isAdmin) {
      const interval = setInterval(() => {
        goToNextBlock();
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [activeBlockIndex, planStatus, isAdmin]);

  const getRisksAndGaps = () => {
    const risks: string[] = [];
    timeBlocks.forEach(block => {
      const pendingItems = block.checklist.filter(item => item.status === 'pending');
      if (pendingItems.length > 0) {
        risks.push(`${block.label}: ${pendingItems.length} pending confirmation(s)`);
      }
    });
    return risks;
  };

  const risks = getRisksAndGaps();
  // Admins can always edit, except when plan is published (they can reopen it)
  // Non-admins can only view
  const isReadOnly = !isAdmin;

  const getDayTypeStyles = (type: string) => {
    switch (type) {
      case 'festival':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'special':
        return 'bg-amber-100 text-blue-800 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-amber-100 text-amber-800 border-green-300';
      case 'finalized':
        return 'bg-amber-100 text-blue-800 border-amber-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Sticky Top Context Bar */}
      <div className="sticky top-20 z-40 bg-white border border-gray-200 rounded-2xl shadow-lg p-6 animate-slide-down">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          {/* Left: Temple Name, Date, Badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <h2 className="text-2xl font-bold text-gray-900">{templeName}</h2>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  disabled={isReadOnly}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
                <button
                  onClick={() => onDateChange(new Date().toISOString().split('T')[0])}
                  disabled={isReadOnly}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Today
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Day Type Selector */}
              {isAdmin && planStatus !== 'published' ? (
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => onDayTypeChange('normal')}
                    className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                      dayType === 'normal'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => onDayTypeChange('festival')}
                    className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                      dayType === 'festival'
                        ? 'bg-amber-100 text-amber-800 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Festival
                  </button>
                  <button
                    onClick={() => onDayTypeChange('special')}
                    className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                      dayType === 'special'
                        ? 'bg-amber-100 text-blue-800 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Special
                  </button>
                </div>
              ) : (
                <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${getDayTypeStyles(dayType)}`}>
                  {dayType === 'normal' ? 'Normal Day' : dayType === 'festival' ? 'Festival' : 'Special Day'}
                </span>
              )}

              {/* Plan Status Badge */}
              <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border capitalize ${getStatusStyles(planStatus)}`}>
                {planStatus}
              </span>
            </div>
          </div>

          {/* Right: Primary CTAs */}
          {isAdmin && (
            <div className="flex items-center gap-3">
              {planStatus === 'published' && (
                <button
                  onClick={() => {
                    if (confirm('Reopen this plan for editing? It will change status back to Finalized.')) {
                      onStatusChange('finalized');
                    }
                  }}
                  className="px-6 py-2.5 border border-amber-300 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-all font-medium shadow-sm hover:shadow-md"
                >
                  Reopen for Editing
                </button>
              )}
              {planStatus !== 'published' && (
                <>
                  <button
                    onClick={handleSaveDraft}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-all font-medium shadow-sm hover:shadow-md"
                  >
                    Save Draft
                  </button>
                  {planStatus === 'draft' && (
                    <button
                      onClick={handleFinalize}
                      className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                    >
                      Finalize Plan
                    </button>
                  )}
                  {planStatus === 'finalized' && (
                    <>
                      <button
                        onClick={() => {
                          if (confirm('Change plan status back to Draft? This will allow further editing.')) {
                            onStatusChange('draft');
                          }
                        }}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-all font-medium shadow-sm hover:shadow-md"
                      >
                        Revert to Draft
                      </button>
                      <button
                        onClick={handlePublish}
                        className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                      >
                        Publish Plan
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Carousel Layout */}
      <div className="space-y-6">
        {/* Carousel Navigation */}
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousBlock}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all hover:scale-110 active:scale-95 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous Block"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center gap-2">
              {timeBlocks.map((block, index) => (
                <button
                  key={block.id}
                  onClick={() => goToBlock(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeBlockIndex === index
                      ? 'bg-amber-600 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-label={`Go to ${block.label} Block`}
                >
                  {block.label}
                </button>
              ))}
            </div>

            <button
              onClick={goToNextBlock}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all hover:scale-110 active:scale-95 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next Block"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {timeBlocks.map((_, index) => (
              <button
                key={index}
                onClick={() => goToBlock(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeBlockIndex === index
                    ? 'bg-amber-600 w-8 scale-110'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* SECTION 1: Daily Timeline Structure - Carousel */}
        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm min-h-[600px]">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${activeBlockIndex * 100}%)`,
            }}
          >
            {timeBlocks.map((block, index) => {
          const isExpanded = expandedBlocks.has(block.id);
          const pendingCount = block.checklist.filter(item => item.status === 'pending').length;

          return (
            <div
              key={block.id}
              className="w-full flex-shrink-0 bg-white overflow-hidden"
              style={{
                animation: index === activeBlockIndex 
                  ? carouselDirection === 'right' 
                    ? 'slideInFromRight 0.5s ease-out' 
                    : 'slideInFromLeft 0.5s ease-out'
                  : 'none',
              }}
            >
              {/* Block Header */}
              <button
                onClick={() => toggleBlock(block.id)}
                className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {block.label.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{block.label} Block</h3>
                    <p className="text-sm text-gray-600">{block.startTime} - {block.endTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {pendingCount > 0 && (
                    <span className="px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-800 text-xs font-semibold border border-yellow-300">
                      {pendingCount} pending
                    </span>
                  )}
                  {isExpanded ? (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </button>

              {/* Block Content */}
              {isExpanded && (
                <div className="p-6 space-y-6 animate-slide-down">
                  {/* Planned Rituals */}
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Planned Rituals / Sevas
                    </h4>
                    <div className="space-y-2">
                      {block.rituals.map((ritual) => (
                        <div
                          key={ritual.id}
                          className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-gray-900">{ritual.name}</span>
                              <span className="ml-3 text-sm text-gray-600">{ritual.time}</span>
                            </div>
                            <span className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 text-xs font-medium">
                              {ritual.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational Notes */}
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-3">Operational Notes</h4>
                    <textarea
                      value={operationalNotes[block.id] || ''}
                      onChange={(e) => updateOperationalNotes(block.id, e.target.value)}
                      disabled={isReadOnly}
                      placeholder="Add operational notes, dependencies, or special instructions for this time block..."
                      className="w-full min-h-[100px] px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y transition-all"
                    />
                  </div>

                  {/* Dependencies */}
                  {block.dependencies.length > 0 && (
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 mb-3">Dependencies & Constraints</h4>
                      <ul className="space-y-2 pl-6">
                        {block.dependencies.map((dep, idx) => (
                          <li key={idx} className="text-gray-700 list-disc">
                            {dep}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Operational Checklist */}
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-3">Operational Checklist</h4>
                    <div className="space-y-2">
                      {block.checklist.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                if (!isReadOnly) {
                                  updateChecklistStatus(block.id, item.id);
                                }
                              }}
                              disabled={isReadOnly}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                item.status === 'confirmed'
                                  ? 'bg-amber-600 border-green-600'
                                  : 'bg-white border-gray-400 hover:border-green-500'
                              } ${isReadOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110 active:scale-95'}`}
                            >
                              {item.status === 'confirmed' && (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            <span className={`font-medium ${
                              item.status === 'confirmed' ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {item.label}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">{item.owner}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
          </div>
        </div>

        {/* SECTION 3: Special Instructions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-fade-in-up">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Special Instructions</h3>
            <p className="text-sm text-gray-600 italic">Visible to Operations Team</p>
          </div>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            disabled={isReadOnly}
            placeholder="Enter special instructions for VIP visits, festival-specific requirements, government directives, or trustee instructions..."
            className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y transition-all"
          />
        </div>

        {/* SECTION 4: Risk & Gaps Indicator */}
        {risks.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 shadow-sm animate-fade-in-up">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-yellow-900 mb-2">Risk & Gaps Indicator</h4>
                <p className="text-yellow-800 mb-3">
                  The following items require attention before finalizing the plan:
                </p>
                <ul className="space-y-2 pl-6">
                  {risks.map((risk, idx) => (
                    <li key={idx} className="text-yellow-900 list-disc font-medium">
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
