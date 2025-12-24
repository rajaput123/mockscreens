import { Seva } from '../ritual-seva-booking/sevaData';
import { getAllSevas } from '../ritual-seva-booking/sevaData';
import { PRASAD_CATEGORY } from './prasadTypes';
import { KitchenPlan, SevaPrasadLink } from './prasadData';

/**
 * Kitchen Planning Utilities
 * Integration with Seva booking system for prasad planning
 */

/**
 * Get sevas scheduled for a specific date
 */
export function getSevasByDate(date: string): Seva[] {
  const allSevas = getAllSevas();
  const targetDate = new Date(date);
  const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
  
  return allSevas.filter(seva => {
    // Filter by active status
    if (seva.status !== 'active') return false;
    
    // Check if seva has timing blocks for this date
    return seva.timingBlocks.some(block => {
      // Check effective date range
      const effectiveFrom = new Date(block.effectiveFromDate);
      const effectiveTill = block.effectiveTillDate ? new Date(block.effectiveTillDate) : null;
      
      if (targetDate < effectiveFrom) return false;
      if (effectiveTill && targetDate > effectiveTill) return false;
      
      // Check if day is applicable
      return block.applicableDays.includes(dayName);
    });
  });
}

/**
 * Get sevas scheduled at a specific time slot
 */
export function getSevasByTime(date: string, time: string): Seva[] {
  const sevas = getSevasByDate(date);
  const [targetHour, targetMinute] = time.split(':').map(Number);
  const targetMinutes = targetHour * 60 + targetMinute;
  
  return sevas.filter(seva => {
    return seva.timingBlocks.some(block => {
      const [startHour, startMinute] = block.startTime.split(':').map(Number);
      const [endHour, endMinute] = block.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      
      return targetMinutes >= startMinutes && targetMinutes <= endMinutes;
    });
  });
}

/**
 * Calculate prasad quantity needed based on seva booking count
 * @param seva - The seva object
 * @param bookingCount - Number of bookings for this seva
 * @param prasadPerBooking - Quantity of prasad per booking (default: 1 unit per booking)
 * @returns Calculated quantity needed
 */
export function calculateSevaPrasadQuantity(
  seva: Seva,
  bookingCount: number,
  prasadPerBooking: number = 1
): number {
  // Basic calculation: booking count * prasad per booking
  // Can be enhanced with seva-specific multipliers or rules
  return bookingCount * prasadPerBooking;
}

/**
 * Create seva prasad link
 */
export function createSevaPrasadLink(
  seva: Seva,
  bookingCount: number,
  prasadPerBooking: number = 1
): SevaPrasadLink {
  return {
    sevaId: seva.id,
    sevaName: seva.name,
    bookingCount,
    expectedQuantity: calculateSevaPrasadQuantity(seva, bookingCount, prasadPerBooking),
    distributedQuantity: 0,
  };
}

/**
 * Link seva to prasad plan
 */
export function linkSevaToPrasad(
  sevaId: string,
  planId: string,
  bookingCount: number,
  plans: KitchenPlan[]
): KitchenPlan | null {
  const plan = plans.find(p => p.id === planId);
  if (!plan) return null;
  
  // Verify plan category supports seva linking
  if (plan.category !== PRASAD_CATEGORY.SEVA_PRASAD_PAID && 
      plan.category !== PRASAD_CATEGORY.SEVA_PRASAD_FREE) {
    throw new Error('Cannot link seva to non-seva prasad category');
  }
  
  const seva = getAllSevas().find(s => s.id === sevaId);
  if (!seva) return null;
  
  const link = createSevaPrasadLink(seva, bookingCount);
  
  if (!plan.sevaLinks) {
    plan.sevaLinks = [];
  }
  
  // Check if link already exists
  const existingIndex = plan.sevaLinks.findIndex(l => l.sevaId === sevaId);
  if (existingIndex >= 0) {
    plan.sevaLinks[existingIndex] = link;
  } else {
    plan.sevaLinks.push(link);
  }
  
  return plan;
}

/**
 * Get total expected prasad quantity from seva links
 */
export function getTotalSevaPrasadQuantity(plan: KitchenPlan): number {
  if (!plan.sevaLinks || plan.sevaLinks.length === 0) return 0;
  return plan.sevaLinks.reduce((total, link) => total + link.expectedQuantity, 0);
}

/**
 * Estimate prasad quantities for a date based on seva schedule
 * Returns suggested quantities per item type
 */
export interface SuggestedPrasadQuantity {
  sevaId: string;
  sevaName: string;
  category: PRASAD_CATEGORY;
  suggestedItems: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
}

export function estimatePrasadFromSevas(date: string): SuggestedPrasadQuantity[] {
  const sevas = getSevasByDate(date);
  const suggestions: SuggestedPrasadQuantity[] = [];
  
  sevas.forEach(seva => {
    const bookingCount = seva.bookingSlots || 0;
    if (bookingCount === 0) return;
    
    const category = seva.isFree 
      ? PRASAD_CATEGORY.SEVA_PRASAD_FREE 
      : PRASAD_CATEGORY.SEVA_PRASAD_PAID;
    
    // Default prasad items for seva (can be customized)
    const defaultItems = [
      { name: 'Kumkum Prasad', quantity: bookingCount * 0.1, unit: 'kg' },
      { name: 'Laddu', quantity: bookingCount * 0.2, unit: 'kg' },
    ];
    
    suggestions.push({
      sevaId: seva.id,
      sevaName: seva.name,
      category,
      suggestedItems: defaultItems,
    });
  });
  
  return suggestions;
}

/**
 * Get sevas that can be linked to a prasad plan
 */
export function getLinkableSevas(plan: KitchenPlan, date: string): Seva[] {
  const sevas = getSevasByDate(date);
  
  // Filter by temple
  const templeSevas = sevas.filter(s => s.templeId === plan.templeId);
  
  // Filter by payment type if needed
  if (plan.category === PRASAD_CATEGORY.SEVA_PRASAD_PAID) {
    return templeSevas.filter(s => !s.isFree);
  } else if (plan.category === PRASAD_CATEGORY.SEVA_PRASAD_FREE) {
    return templeSevas.filter(s => s.isFree);
  }
  
  return templeSevas;
}

/**
 * Calculate total prasad quantities needed for a date by category
 */
export interface CategoryQuantities {
  category: PRASAD_CATEGORY;
  totalQuantity: number;
  itemBreakdown: Array<{
    itemName: string;
    quantity: number;
    unit: string;
  }>;
}

export function calculateDailyPrasadQuantities(date: string, templeId: string): CategoryQuantities[] {
  const results: CategoryQuantities[] = [];
  const sevas = getSevasByDate(date).filter(s => s.templeId === templeId);
  
  // Calculate seva prasad (paid)
  const paidSevas = sevas.filter(s => !s.isFree);
  if (paidSevas.length > 0) {
    const paidItems: Array<{ itemName: string; quantity: number; unit: string }> = [];
    let totalPaid = 0;
    
    paidSevas.forEach(seva => {
      const count = seva.bookingSlots || 0;
      paidItems.push({
        itemName: `${seva.name} Prasad`,
        quantity: count * 0.2, // 0.2kg per booking
        unit: 'kg',
      });
      totalPaid += count * 0.2;
    });
    
    results.push({
      category: PRASAD_CATEGORY.SEVA_PRASAD_PAID,
      totalQuantity: totalPaid,
      itemBreakdown: paidItems,
    });
  }
  
  // Calculate seva prasad (free)
  const freeSevas = sevas.filter(s => s.isFree);
  if (freeSevas.length > 0) {
    const freeItems: Array<{ itemName: string; quantity: number; unit: string }> = [];
    let totalFree = 0;
    
    freeSevas.forEach(seva => {
      const count = seva.bookingSlots || 0;
      freeItems.push({
        itemName: `${seva.name} Prasad`,
        quantity: count * 0.15, // 0.15kg per booking for free seva
        unit: 'kg',
      });
      totalFree += count * 0.15;
    });
    
    results.push({
      category: PRASAD_CATEGORY.SEVA_PRASAD_FREE,
      totalQuantity: totalFree,
      itemBreakdown: freeItems,
    });
  }
  
  return results;
}

/**
 * Validate seva link compatibility with plan category
 */
export function validateSevaLink(plan: KitchenPlan, seva: Seva): boolean {
  if (plan.category === PRASAD_CATEGORY.SEVA_PRASAD_PAID) {
    return !seva.isFree;
  } else if (plan.category === PRASAD_CATEGORY.SEVA_PRASAD_FREE) {
    return seva.isFree;
  }
  return false;
}

