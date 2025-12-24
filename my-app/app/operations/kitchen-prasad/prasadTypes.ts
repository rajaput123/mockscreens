/**
 * Prasad Category System
 * 
 * Core principle: Prasad is classified by ENTITLEMENT, not payment alone.
 * This ensures correct accounting, inventory tracking, and operational clarity.
 */

export enum PRASAD_CATEGORY {
  ANNADAN = 'ANNADAN',
  COUNTER_PAID = 'COUNTER_PAID',
  SEVA_PRASAD_PAID = 'SEVA_PRASAD_PAID',
  SEVA_PRASAD_FREE = 'SEVA_PRASAD_FREE',
}

export enum DISTRIBUTION_POINT {
  ANNADAN_HALL = 'ANNADAN_HALL',
  COUNTER = 'COUNTER',
  SEVA_AREA = 'SEVA_AREA',
}

export interface CategoryMetadata {
  id: PRASAD_CATEGORY;
  label: string;
  description: string;
  icon: string;
  color: {
    bg: string;
    text: string;
    border: string;
  };
  accounting: {
    type: 'REVENUE' | 'EXPENSE' | 'PART_OF_SEVA_REVENUE';
    description: string;
  };
  distribution: {
    flow: string;
    requiresToken: boolean;
    requiresReceipt: boolean;
    trackingMethod: 'COUNT_ONLY' | 'UNIT_BASED' | 'SEVA_BASED';
  };
  requirements: {
    sevaLinkRequired: boolean;
    counterRequired: boolean;
    batchTracking: boolean;
    perUnitTracking: boolean;
  };
  ui: {
    shortLabel: string;
    tooltip: string;
  };
}

export const PRASAD_CATEGORY_METADATA: Record<PRASAD_CATEGORY, CategoryMetadata> = {
  [PRASAD_CATEGORY.ANNADAN]: {
    id: PRASAD_CATEGORY.ANNADAN,
    label: 'Annadan Prasad',
    description: 'Free community food distributed as seva/charity. No booking, no payment, no per-unit tracking.',
    icon: '🆓',
    color: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    accounting: {
      type: 'EXPENSE',
      description: 'Recorded as expense in finance module',
    },
    distribution: {
      flow: 'Devotee → Annadan Hall → Served (no token, no receipt)',
      requiresToken: false,
      requiresReceipt: false,
      trackingMethod: 'COUNT_ONLY',
    },
    requirements: {
      sevaLinkRequired: false,
      counterRequired: false,
      batchTracking: false,
      perUnitTracking: false,
    },
    ui: {
      shortLabel: 'Annadan',
      tooltip: 'Free community food - Expense',
    },
  },
  [PRASAD_CATEGORY.COUNTER_PAID]: {
    id: PRASAD_CATEGORY.COUNTER_PAID,
    label: 'Counter Paid Prasad',
    description: 'Prasad sold directly at counter. Unit-based inventory, batch tracking required.',
    icon: '💰',
    color: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
    accounting: {
      type: 'REVENUE',
      description: 'Recorded as revenue in finance module',
    },
    distribution: {
      flow: 'Devotee → Counter → Pay → Receipt/Token → Collect Prasad',
      requiresToken: true,
      requiresReceipt: true,
      trackingMethod: 'UNIT_BASED',
    },
    requirements: {
      sevaLinkRequired: false,
      counterRequired: true,
      batchTracking: true,
      perUnitTracking: true,
    },
    ui: {
      shortLabel: 'Counter Paid',
      tooltip: 'Sold at counter - Revenue',
    },
  },
  [PRASAD_CATEGORY.SEVA_PRASAD_PAID]: {
    id: PRASAD_CATEGORY.SEVA_PRASAD_PAID,
    label: 'Seva Prasad (Paid)',
    description: 'Prasad given after a paid seva. Quantity based on seva count. Part of seva revenue.',
    icon: '🕉️',
    color: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
    accounting: {
      type: 'PART_OF_SEVA_REVENUE',
      description: 'Included in seva revenue, not separate revenue',
    },
    distribution: {
      flow: 'Devotee → Pooja → Seva Token/Name Call → Collect Prasad',
      requiresToken: true,
      requiresReceipt: false,
      trackingMethod: 'SEVA_BASED',
    },
    requirements: {
      sevaLinkRequired: true,
      counterRequired: false,
      batchTracking: false,
      perUnitTracking: true,
    },
    ui: {
      shortLabel: 'Seva Prasad (Paid)',
      tooltip: 'Given after paid seva - Part of seva revenue',
    },
  },
  [PRASAD_CATEGORY.SEVA_PRASAD_FREE]: {
    id: PRASAD_CATEGORY.SEVA_PRASAD_FREE,
    label: 'Seva Prasad (Free)',
    description: 'Prasad given after free/general seva. Limited, tradition-based distribution. No payment.',
    icon: '🙏',
    color: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
    accounting: {
      type: 'EXPENSE',
      description: 'Recorded as expense in finance module',
    },
    distribution: {
      flow: 'Devotee → Pooja → Seva Token/Name Call → Collect Prasad',
      requiresToken: true,
      requiresReceipt: false,
      trackingMethod: 'SEVA_BASED',
    },
    requirements: {
      sevaLinkRequired: true,
      counterRequired: false,
      batchTracking: false,
      perUnitTracking: true,
    },
    ui: {
      shortLabel: 'Seva Prasad (Free)',
      tooltip: 'Given after free seva - Expense',
    },
  },
};

/**
 * Get category metadata
 */
export function getCategoryMetadata(category: PRASAD_CATEGORY): CategoryMetadata {
  return PRASAD_CATEGORY_METADATA[category];
}

/**
 * Get all categories
 */
export function getAllCategories(): PRASAD_CATEGORY[] {
  return Object.values(PRASAD_CATEGORY);
}

/**
 * Get categories that require seva linking
 */
export function getSevaLinkedCategories(): PRASAD_CATEGORY[] {
  return [PRASAD_CATEGORY.SEVA_PRASAD_PAID, PRASAD_CATEGORY.SEVA_PRASAD_FREE];
}

/**
 * Get categories that require counter
 */
export function getCounterCategories(): PRASAD_CATEGORY[] {
  return [PRASAD_CATEGORY.COUNTER_PAID];
}

/**
 * Validate if category can be used with distribution point
 */
export function isValidCategoryDistributionPoint(
  category: PRASAD_CATEGORY,
  distributionPoint: DISTRIBUTION_POINT
): boolean {
  const metadata = getCategoryMetadata(category);
  
  switch (distributionPoint) {
    case DISTRIBUTION_POINT.ANNADAN_HALL:
      return category === PRASAD_CATEGORY.ANNADAN;
    case DISTRIBUTION_POINT.COUNTER:
      return category === PRASAD_CATEGORY.COUNTER_PAID;
    case DISTRIBUTION_POINT.SEVA_AREA:
      return category === PRASAD_CATEGORY.SEVA_PRASAD_PAID || 
             category === PRASAD_CATEGORY.SEVA_PRASAD_FREE;
    default:
      return false;
  }
}

