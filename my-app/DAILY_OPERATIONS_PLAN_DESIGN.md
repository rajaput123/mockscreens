# Daily Operations Plan - Design Documentation

## Overview

The **Daily Operations Plan** screen is a critical pre-execution planning interface for temple administrators. It provides a structured, scannable view of the day's operational plan before execution begins.

**Route:** `/operations/operational-planning/daily-operations-plan`

## Design Principles

### UX Philosophy
- **Calm & Authoritative**: Professional, operational tone suitable for enterprise use
- **High Readability**: Clear hierarchy, adequate spacing, minimal cognitive load
- **Structure-First**: Emphasis on organization and readiness over decoration
- **Audit-Friendly**: Clear status indicators, timestamps, and role-based ownership
- **Minimal Actions**: Focus on review and confirmation, not task creation

### Visual Design
- **Desktop-First**: Optimized for 1440px viewport
- **Enterprise SaaS**: Clean, professional aesthetic matching the application's design system
- **Amber/Gold Palette**: Consistent with temple management brand colors
- **Clear Hierarchy**: Typography scale, spacing system, and visual weight guide attention

## Component Structure

### 1. Sticky Top Context Bar

**Purpose:** Always-visible context and primary actions

**Elements:**
- **Temple Name**: Primary identifier (left-aligned)
- **Date Picker**: Calendar input with "Today" quick action
- **Day Type Badge**: Visual indicator (Normal Day / Festival / Special Day)
  - Normal: Subtle beige background
  - Festival: Amber/warning background
  - Special: Blue/info background
- **Plan Status Badge**: Current state (Draft / Finalized / Published)
  - Draft: Amber/warning
  - Finalized: Blue/info
  - Published: Green/success
- **Primary CTAs** (Admin/Ops Manager only):
  - "Save Draft" - Secondary button
  - "Finalize Plan" - Primary button (hidden when published)

**Behavior:**
- Sticky positioning below main header (100px from top)
- Read-only mode when status is "Published" or user lacks admin rights
- Status changes trigger appropriate state updates

### 2. Daily Timeline Structure

**Layout:** Vertical, collapsible time blocks

**Time Blocks:**
- **Morning** (05:00 - 12:00)
- **Afternoon** (12:00 - 17:00)
- **Evening** (17:00 - 22:00)

**Block Structure:**
Each time block contains:

1. **Block Header** (Collapsible)
   - Time range display
   - Pending items count badge (if any)
   - Expand/collapse icon

2. **Planned Rituals / Sevas** (Read-only reference)
   - Ritual name
   - Scheduled time
   - Type badge (Daily Ritual / Service / Regular / Spiritual)
   - Displayed as reference only (no editing)

3. **Operational Notes** (Editable)
   - Free-text textarea
   - Placeholder: "Add operational notes, dependencies, or special instructions..."
   - Per-block storage

4. **Dependencies & Constraints** (Read-only list)
   - System-generated or manually added
   - Bullet list format
   - Examples: "Kitchen must be ready by 06:00"

5. **Operational Checklist** (Interactive)
   - Checkbox items with status (Pending / Confirmed)
   - Role-based owner display (not individual names)
   - Toggleable by admin/ops manager
   - Common items:
     - Staff assigned
     - Priest availability confirmed
     - Kitchen readiness checked
     - Facilities ready
     - Crowd control planned

**Visual Design:**
- Card-based layout with subtle borders
- Expandable/collapsible sections
- Color-coded status indicators
- Clear typography hierarchy

### 3. Special Instructions Section

**Purpose:** High-visibility instructions for the operations team

**Content:**
- Free-text textarea (editable by admin)
- Labeled as "Visible to Operations Team"
- Placeholder: "Enter special instructions for VIP visits, festival-specific requirements, government directives, or trustee instructions..."

**Use Cases:**
- VIP visit notifications
- Festival-specific requirements
- Government or trustee directives
- Emergency protocols
- Special event coordination

### 4. Risk & Gaps Indicator

**Purpose:** System-generated alerts for incomplete planning

**Display Logic:**
- Only shown when risks/gaps exist
- Warning-style card (amber background)
- Informational, not blocking

**Alert Conditions:**
- Unconfirmed checklist items
- Missing staff assignments
- Unverified kitchen readiness
- Unplanned crowd control
- Missing dependencies

**Format:**
- Warning icon
- List of specific gaps
- Organized by time block

## User Actions & Permissions

### Admin / Operations Manager
- ✅ Edit operational notes
- ✅ Toggle checklist items
- ✅ Update special instructions
- ✅ Save as Draft
- ✅ Finalize Plan
- ✅ Change date
- ✅ Modify day type

### Other Roles (View-Only)
- ✅ View all information
- ✅ Expand/collapse blocks
- ❌ Cannot edit any content
- ❌ Cannot change status
- ❌ Cannot save or finalize

## State Management

### Plan Status Flow
```
Draft → Finalized → Published
```

**Draft:**
- Editable by admin
- Can be saved multiple times
- "Save Draft" button visible

**Finalized:**
- Locked for editing
- Ready for review
- "Finalize Plan" button hidden

**Published:**
- Read-only for all users
- Plan is active for execution
- No editing capabilities

### Data Structure

```typescript
interface TimeBlock {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  rituals: Ritual[];
  operationalNotes: string;
  dependencies: string[];
  checklist: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  label: string;
  status: 'pending' | 'confirmed';
  owner: string; // Role-based
}
```

## What This Screen Does NOT Do

As per requirements, this screen explicitly does NOT:
- ❌ Create tasks
- ❌ Assign tasks to individuals
- ❌ Edit inventory
- ❌ Create sevas
- ❌ Display financial data
- ❌ Track execution
- ❌ Manage task workflows

**Execution happens AFTER plan is finalized and published.**

## Technical Implementation

### Component Files
- `/app/operations/operational-planning/daily-operations-plan/page.tsx` - Page wrapper
- `/app/operations/operational-planning/components/DailyOperationsPlanView.tsx` - Main component

### Design System Integration
- Uses existing color palette (amber/gold theme)
- Follows typography scale
- Respects spacing system
- Implements animation utilities
- Consistent with ModuleLayout pattern

### Responsive Considerations
- Desktop-first (1440px optimal)
- Flexible layout for larger screens
- Maintains readability at smaller desktop sizes
- Mobile adaptation would require separate design

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly labels
- High contrast for status indicators
- Clear focus states for interactive elements

## Future Enhancements (Not in Current Scope)

- Print-friendly view
- Export to PDF
- Historical plan comparison
- Template-based plan creation
- Integration with execution tracking
- Real-time collaboration
- Mobile app version

## Design Handoff Notes

### Figma Specifications
- Component library alignment
- Spacing tokens (4px base unit)
- Color tokens from design system
- Typography scale
- Border radius (12px, 20px, 24px)
- Shadow system

### Developer Notes
- Sticky header requires proper z-index management
- State persistence needed for draft saves
- Date picker integration with calendar system
- Role-based permission checks required
- Checklist toggle should trigger validation
- Risk calculation runs on state changes

---

**Last Updated:** Implementation complete
**Status:** Ready for review and integration

