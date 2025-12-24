'use client';

import { useState, DragEvent } from 'react';
import { Activity, DailyPlan } from '../operationalPlanningData';
import ActivityCard from './ActivityCard';

interface DailyPlanBuilderProps {
  plan: DailyPlan;
  onPlanUpdate?: (plan: DailyPlan) => void;
  onActivityClick?: (activity: Activity) => void;
}

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = String(i).padStart(2, '0');
  return `${hour}:00`;
});

export default function DailyPlanBuilder({
  plan,
  onPlanUpdate,
  onActivityClick,
}: DailyPlanBuilderProps) {
  const [draggedActivity, setDraggedActivity] = useState<Activity | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleDragStart = (e: DragEvent, activity: Activity) => {
    setDraggedActivity(activity);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('activityId', activity.id);
  };

  const handleDragOver = (e: DragEvent, timeSlot: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredSlot(timeSlot);
  };

  const handleDrop = (e: DragEvent, timeSlot: string) => {
    e.preventDefault();
    setHoveredSlot(null);

    if (!draggedActivity) return;

    const [hours, minutes] = timeSlot.split(':').map(Number);
    const startTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const endTime = `${String(hours + Math.ceil(draggedActivity.duration / 60)).padStart(2, '0')}:${String(minutes + (draggedActivity.duration % 60)).padStart(2, '0')}`;

    const updatedActivity: Activity = {
      ...draggedActivity,
      startTime,
      endTime,
    };

    const updatedActivities = plan.activities.map(a =>
      a.id === draggedActivity.id ? updatedActivity : a
    );

    const updatedPlan: DailyPlan = {
      ...plan,
      activities: updatedActivities,
      updatedAt: new Date().toISOString(),
    };

    onPlanUpdate?.(updatedPlan);
    setDraggedActivity(null);
  };

  const getActivitiesForSlot = (timeSlot: string) => {
    const [slotHour] = timeSlot.split(':').map(Number);
    return plan.activities.filter(activity => {
      const [activityHour] = activity.startTime.split(':').map(Number);
      return activityHour === slotHour;
    });
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Daily Plan Builder</h3>
        <p className="text-sm text-gray-600">Drag activities to time slots to schedule them</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Available Activities */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Available Activities</h4>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {plan.activities
                .filter(a => !a.startTime || a.startTime === '00:00')
                .map((activity) => (
                  <div
                    key={activity.id}
                    onClick={() => setSelectedActivity(activity)}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedActivity?.id === activity.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                  >
                    <ActivityCard
                      activity={activity}
                      size="small"
                      onDragStart={handleDragStart}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right: Time Slots Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Schedule for {new Date(plan.date).toLocaleDateString()}
              </h4>
            </div>

            {/* Time slots */}
            <div className="space-y-2 max-h-[700px] overflow-y-auto">
              {timeSlots.map((timeSlot) => {
                const slotActivities = getActivitiesForSlot(timeSlot);
                const isHovered = hoveredSlot === timeSlot;

                return (
                  <div
                    key={timeSlot}
                    onDragOver={(e) => handleDragOver(e, timeSlot)}
                    onDragLeave={() => setHoveredSlot(null)}
                    onDrop={(e) => handleDrop(e, timeSlot)}
                    className={`min-h-[80px] p-2 rounded-lg border-2 transition-all duration-200 ${
                      isHovered
                        ? 'border-purple-500 bg-amber-50 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Time label */}
                      <div className="w-16 flex-shrink-0">
                        <div className="font-semibold text-gray-700 text-sm">{timeSlot}</div>
                      </div>

                      {/* Activities */}
                      <div className="flex-1 flex flex-wrap gap-2">
                        {slotActivities.map((activity) => (
                          <div
                            key={activity.id}
                            onClick={() => {
                              setSelectedActivity(activity);
                              onActivityClick?.(activity);
                            }}
                            className="cursor-pointer"
                          >
                            <ActivityCard
                              activity={activity}
                              size="small"
                              onDragStart={handleDragStart}
                            />
                          </div>
                        ))}
                        {slotActivities.length === 0 && isHovered && (
                          <div className="flex items-center justify-center w-full h-16 border-2 border-dashed border-purple-400 rounded-lg bg-amber-50">
                            <span className="text-amber-600 font-medium text-sm">Drop here</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Activity Details */}
      {selectedActivity && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">{selectedActivity.name}</h4>
            <button
              onClick={() => setSelectedActivity(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600 mb-1">Description:</div>
              <div className="font-semibold text-gray-900">{selectedActivity.description}</div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Type:</div>
              <div className="font-semibold text-gray-900 capitalize">{selectedActivity.type}</div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Time:</div>
              <div className="font-semibold text-gray-900">
                {selectedActivity.startTime} - {selectedActivity.endTime}
              </div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Location:</div>
              <div className="font-semibold text-gray-900">{selectedActivity.location}</div>
            </div>
            {selectedActivity.resources.length > 0 && (
              <div className="md:col-span-2">
                <div className="text-gray-600 mb-1">Resources:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedActivity.resources.map((resource, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                    >
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


