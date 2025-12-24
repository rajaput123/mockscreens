'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../components/layout/ModuleLayout';
import HelpButton from '../../components/help/HelpButton';
import { 
  getAllKitchenPlans, 
  getTodayPlans, 
  KitchenPlan 
} from './prasadData';
import { getAllTemples } from '../temple-management/templeData';
import { PRASAD_CATEGORY, PRASAD_CATEGORY_METADATA, DISTRIBUTION_POINT } from './prasadTypes';
import { getSevasByDate } from './kitchenPlanning';
import Link from 'next/link';
import { DISTRIBUTION_POINT as DP } from './prasadTypes';

export default function KitchenPrasadDashboard() {
  const [plans, setPlans] = useState<KitchenPlan[]>([]);
  const [temples, setTemples] = useState<Array<{ id: string; name: string; deity?: string }>>([]);
  const [todaySevas, setTodaySevas] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allPlans = getAllKitchenPlans();
    setPlans(allPlans);
    
    const allTemples = getAllTemples();
    setTemples(allTemples.map(t => ({ id: t.id, name: t.name, deity: t.deity })));
    
    // Load today's sevas for integration
    const today = new Date().toISOString().split('T')[0];
    const sevas = getSevasByDate(today);
    setTodaySevas(sevas);
  };

  const todayPlans = getTodayPlans();
  
  // Group plans by category
  const annadanPlans = todayPlans.filter(p => p.category === PRASAD_CATEGORY.ANNADAN);
  const counterPaidPlans = todayPlans.filter(p => p.category === PRASAD_CATEGORY.COUNTER_PAID);
  const sevaPaidPlans = todayPlans.filter(p => p.category === PRASAD_CATEGORY.SEVA_PRASAD_PAID);
  const sevaFreePlans = todayPlans.filter(p => p.category === PRASAD_CATEGORY.SEVA_PRASAD_FREE);
  
  // Group by meal type (for annadan)
  const breakfastPlans = todayPlans.filter(p => p.mealType === 'breakfast');
  const lunchPlans = todayPlans.filter(p => p.mealType === 'lunch');
  const dinnerPlans = todayPlans.filter(p => p.mealType === 'dinner');

  const getStatusColor = (status: KitchenPlan['status']) => {
    switch (status) {
      case 'completed':
      case 'distributed':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'prepared':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'distributing':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'in-progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'scheduled':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTempleName = (templeId: string) => {
    const temple = temples.find(t => t.id === templeId);
    return temple?.deity || temple?.name || templeId;
  };

  const getDistributionPointLabel = (point: DISTRIBUTION_POINT) => {
    switch (point) {
      case DISTRIBUTION_POINT.ANNADAN_HALL:
        return 'Annadan Hall';
      case DISTRIBUTION_POINT.COUNTER:
        return 'Counter';
      case DISTRIBUTION_POINT.SEVA_AREA:
        return 'Seva Area';
      default:
        return point;
    }
  };

  return (
    <ModuleLayout
      title="Kitchen & Prasad Operations"
      description="Manage prasad preparation and distribution across all categories"
    >
      {/* Action Buttons */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href="/operations/kitchen-prasad/kitchen-planning"
            className="bg-amber-600 text-white px-8 py-3 rounded-2xl font-sans text-base font-semibold hover:bg-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 no-underline flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            + Create New Plan
          </Link>
          <Link
            href="/operations/kitchen-prasad/distribution/counter-distribution"
            className="px-6 py-3 rounded-2xl font-sans text-base font-medium transition-all duration-200 transform hover:scale-105 no-underline border-2 border-green-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
          >
            Counter Distribution
          </Link>
          <Link
            href="/operations/kitchen-prasad/distribution/seva-distribution"
            className="px-6 py-3 rounded-2xl font-sans text-base font-medium transition-all duration-200 transform hover:scale-105 no-underline border-2 border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
          >
            Seva Distribution
          </Link>
          <Link
            href="/operations/kitchen-prasad/distribution/annadan-distribution"
            className="px-6 py-3 rounded-2xl font-sans text-base font-medium transition-all duration-200 transform hover:scale-105 no-underline border-2 border-red-600 text-red-600 hover:bg-red-50 cursor-pointer"
          >
            Annadan Distribution
          </Link>
          <Link
            href="/operations/kitchen-prasad/prepare-prasad"
            className="px-6 py-3 rounded-2xl font-sans text-base font-medium transition-all duration-200 transform hover:scale-105 no-underline border-2 border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
          >
            Prepare Prasad
          </Link>
          <Link
            href="/operations/kitchen-prasad/kitchen-planning"
            className="px-6 py-3 rounded-2xl font-sans text-base font-medium transition-all duration-200 transform hover:scale-105 no-underline border-2 border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
          >
            Plan Kitchen
          </Link>
          <Link
            href="/operations/kitchen-prasad/kitchen-schedule"
            className="px-6 py-3 rounded-2xl font-sans text-base font-medium transition-all duration-200 transform hover:scale-105 no-underline border-2 border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
          >
            Kitchen Schedule
          </Link>
          <Link
            href="/operations/kitchen-prasad/prasad-menu"
            className="px-6 py-3 rounded-2xl font-sans text-base font-medium transition-all duration-200 transform hover:scale-105 no-underline border-2 border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
          >
            Menu Management
          </Link>
        </div>
      </div>

      {/* Four Category Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Prasad by Category</h3>
          <Link
            href="/operations/kitchen-prasad/kitchen-planning"
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Plan
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Annadan */}
          {PRASAD_CATEGORY_METADATA[PRASAD_CATEGORY.ANNADAN] && (() => {
            const metadata = PRASAD_CATEGORY_METADATA[PRASAD_CATEGORY.ANNADAN];
            return (
              <div className={`${metadata.color.bg} border-2 ${metadata.color.border} rounded-xl p-5`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{metadata.icon}</span>
                  <h4 className={`font-semibold ${metadata.color.text}`}>{metadata.ui.shortLabel}</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Plans:</span>
                    <span className={`font-semibold ${metadata.color.text}`}>{annadanPlans.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Distribution:</span>
                    <span className={`font-medium ${metadata.color.text}`}>
                      {getDistributionPointLabel(DISTRIBUTION_POINT.ANNADAN_HALL)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tracking:</span>
                    <span className={`font-medium ${metadata.color.text}`}>Count Only</span>
                  </div>
                  <Link
                    href={`/operations/kitchen-prasad/kitchen-planning?category=${PRASAD_CATEGORY.ANNADAN}`}
                    className="block mt-3 text-xs text-center font-medium px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg transition-colors"
                  >
                    + Add Plan
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* Counter Paid */}
          {PRASAD_CATEGORY_METADATA[PRASAD_CATEGORY.COUNTER_PAID] && (() => {
            const metadata = PRASAD_CATEGORY_METADATA[PRASAD_CATEGORY.COUNTER_PAID];
            return (
              <div className={`${metadata.color.bg} border-2 ${metadata.color.border} rounded-xl p-5`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{metadata.icon}</span>
                  <h4 className={`font-semibold ${metadata.color.text}`}>{metadata.ui.shortLabel}</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Plans:</span>
                    <span className={`font-semibold ${metadata.color.text}`}>{counterPaidPlans.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Distribution:</span>
                    <span className={`font-medium ${metadata.color.text}`}>
                      {getDistributionPointLabel(DISTRIBUTION_POINT.COUNTER)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tracking:</span>
                    <span className={`font-medium ${metadata.color.text}`}>Batch-based</span>
                  </div>
                  <Link
                    href={`/operations/kitchen-prasad/kitchen-planning?category=${PRASAD_CATEGORY.COUNTER_PAID}`}
                    className="block mt-3 text-xs text-center font-medium px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg transition-colors"
                  >
                    + Add Plan
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* Seva Prasad Paid */}
          {PRASAD_CATEGORY_METADATA[PRASAD_CATEGORY.SEVA_PRASAD_PAID] && (() => {
            const metadata = PRASAD_CATEGORY_METADATA[PRASAD_CATEGORY.SEVA_PRASAD_PAID];
            return (
              <div className={`${metadata.color.bg} border-2 ${metadata.color.border} rounded-xl p-5`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{metadata.icon}</span>
                  <h4 className={`font-semibold ${metadata.color.text}`}>{metadata.ui.shortLabel}</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Plans:</span>
                    <span className={`font-semibold ${metadata.color.text}`}>{sevaPaidPlans.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Distribution:</span>
                    <span className={`font-medium ${metadata.color.text}`}>
                      {getDistributionPointLabel(DISTRIBUTION_POINT.SEVA_AREA)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tracking:</span>
                    <span className={`font-medium ${metadata.color.text}`}>Seva-based</span>
                  </div>
                  <Link
                    href={`/operations/kitchen-prasad/kitchen-planning?category=${PRASAD_CATEGORY.SEVA_PRASAD_PAID}`}
                    className="block mt-3 text-xs text-center font-medium px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg transition-colors"
                  >
                    + Add Plan
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* Seva Prasad Free */}
          {PRASAD_CATEGORY_METADATA[PRASAD_CATEGORY.SEVA_PRASAD_FREE] && (() => {
            const metadata = PRASAD_CATEGORY_METADATA[PRASAD_CATEGORY.SEVA_PRASAD_FREE];
            return (
              <div className={`${metadata.color.bg} border-2 ${metadata.color.border} rounded-xl p-5`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{metadata.icon}</span>
                  <h4 className={`font-semibold ${metadata.color.text}`}>{metadata.ui.shortLabel}</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Plans:</span>
                    <span className={`font-semibold ${metadata.color.text}`}>{sevaFreePlans.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Distribution:</span>
                    <span className={`font-medium ${metadata.color.text}`}>
                      {getDistributionPointLabel(DISTRIBUTION_POINT.SEVA_AREA)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tracking:</span>
                    <span className={`font-medium ${metadata.color.text}`}>Seva-based</span>
                  </div>
                  <Link
                    href={`/operations/kitchen-prasad/kitchen-planning?category=${PRASAD_CATEGORY.SEVA_PRASAD_FREE}`}
                    className="block mt-3 text-xs text-center font-medium px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg transition-colors"
                  >
                    + Add Plan
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Today's Schedule Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Preparation Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Breakfast */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-amber-900">Breakfast</h4>
                <p className="text-xs text-amber-700">08:00 AM</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Plans:</span>
                <span className="font-semibold text-amber-700">{breakfastPlans.length}</span>
              </div>
              <Link 
                href="/operations/kitchen-prasad/prepare-prasad?mealType=breakfast"
                className="block mt-3 text-sm text-amber-700 hover:text-amber-900 font-medium"
              >
                → View Breakfast Plans
              </Link>
            </div>
          </div>

          {/* Lunch */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-amber-900">Lunch</h4>
                <p className="text-xs text-amber-700">12:00 PM</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Plans:</span>
                <span className="font-semibold text-amber-700">{lunchPlans.length}</span>
              </div>
              <Link 
                href="/operations/kitchen-prasad/prepare-prasad?mealType=lunch"
                className="block mt-3 text-sm text-amber-700 hover:text-amber-900 font-medium"
              >
                → View Lunch Plans
              </Link>
            </div>
          </div>

          {/* Dinner */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-amber-900">Dinner</h4>
                <p className="text-xs text-amber-700">06:00 PM</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Plans:</span>
                <span className="font-semibold text-amber-700">{dinnerPlans.length}</span>
              </div>
              <Link 
                href="/operations/kitchen-prasad/prepare-prasad?mealType=dinner"
                className="block mt-3 text-sm text-amber-700 hover:text-amber-900 font-medium"
              >
                → View Dinner Plans
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Seva Schedule Integration */}
      {todaySevas.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Seva Schedule</h3>
          <p className="text-sm text-gray-600 mb-4">
            Sevas with prasad distribution are automatically linked to kitchen plans
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {todaySevas.slice(0, 6).map(seva => (
              <div
                key={seva.id}
                className="p-3 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors"
              >
                <div className="font-medium text-gray-900">{seva.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {seva.timingBlocks?.[0]?.startTime} - {seva.timingBlocks?.[0]?.endTime}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Bookings: {seva.bookingSlots || 0} | {seva.isFree ? 'Free' : 'Paid'}
                </div>
                {sevaPaidPlans.some(p => p.sevaLinks?.some(l => l.sevaId === seva.id)) || 
                 sevaFreePlans.some(p => p.sevaLinks?.some(l => l.sevaId === seva.id)) ? (
                  <div className="mt-2 text-xs text-amber-600 font-medium">✓ Linked to prasad plan</div>
                ) : (
                  <div className="mt-2 text-xs text-amber-600">⚠ Not linked yet</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Plans List */}
      {todayPlans.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Kitchen Plans</h3>
          <div className="space-y-3">
            {todayPlans.map(plan => {
              const metadata = PRASAD_CATEGORY_METADATA[plan.category];
              return (
                <Link
                  key={plan.id}
                  href={`/operations/kitchen-prasad/prepare-prasad?plan=${plan.id}`}
                  className="block p-4 rounded-lg border-2 border-gray-200 hover:border-amber-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                        {plan.status}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{plan.name}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <span className={`${metadata.color.text} font-medium`}>
                            {metadata.ui.shortLabel}
                          </span>
                          <span>•</span>
                          <span>{getDistributionPointLabel(plan.distributionPoint)}</span>
                          {plan.mealType && (
                            <>
                              <span>•</span>
                              <span>{plan.mealType.charAt(0).toUpperCase() + plan.mealType.slice(1)}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{plan.startTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{plan.items.length} items</div>
                      <div className="text-xs text-gray-500">
                        {plan.items.filter(i => i.status === 'prepared').length} prepared
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {todayPlans.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg mb-2">No kitchen plans scheduled for today</p>
            <Link
              href="/operations/kitchen-prasad/kitchen-planning"
              className="inline-block mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Plan Kitchen
            </Link>
          </div>
        </div>
      )}

      <HelpButton module="kitchen-prasad" />
    </ModuleLayout>
  );
}
