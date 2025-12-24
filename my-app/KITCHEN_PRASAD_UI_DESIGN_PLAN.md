# Kitchen & Prasad Operations - UI/UX Design Plan

## 🎨 Design Philosophy
- **Modern & Clean**: Minimal design with subtle gradients and shadows
- **Functional First**: Easy to use for daily kitchen operations
- **Visual Hierarchy**: Clear sections and information architecture
- **Consistent**: Matches existing Temple Management and Seva Management design patterns
- **Responsive**: Desktop-first, mobile-friendly
- **MINIMAL SCROLLING**: All content fits within viewport, use tabs, modals, and compact layouts

---

## 📐 Overall Structure

### 1. **Main Dashboard** (`/operations/kitchen-prasad/page.tsx`)

#### Layout (FITS IN VIEWPORT - NO SCROLLING):
```
┌─────────────────────────────────────────────────────────┐
│  Header: Kitchen & Prasad Operations                    │
│  [+ Plan Menu] [+ Prepare] Quick Actions (top-right)   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐               │
│  │ Card │  │ Card │  │ Card │  │ Card │  (4 Stat Cards)│
│  └──────┘  └──────┘  └──────┘  └──────┘               │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  TABS: [Today] [This Week] [Upcoming]            │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  Compact Table View (max 5-6 rows visible)       │  │
│  │  ┌──────┬──────┬──────┬──────┬──────┬──────┐    │  │
│  │  │ Time │Menu  │Temple│Items │Status│Action│    │  │
│  │  ├──────┼──────┼──────┼──────┼──────┼──────┤    │  │
│  │  │ 08:00│Break │T1    │  5   │Ready │[✓]   │    │  │
│  │  │ 12:00│Lunch │T1    │  8   │Prep  │[→]   │    │  │
│  │  │ 18:00│Dinner│T2    │  6   │Sched │[→]   │    │  │
│  │  └──────┴──────┴──────┴──────┴──────┴──────┘    │  │
│  │  [View All →] (if more than 5 rows)            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Stat Cards (4 cards, no background colors):
1. **Today's Menus** - Number of menus scheduled for today
2. **Items Prepared** - Total items prepared today
3. **Items Distributed** - Total items distributed today
4. **Pending Tasks** - Number of pending preparation tasks

#### Design Elements:
- **NO SCROLLING**: Everything fits in viewport height
- White cards with border and shadow
- Hover animations (scale, shadow increase)
- Icon + number + description layout
- Gradient icons (blue, green, amber, purple)
- **Tabbed interface** for different time views
- **Compact table** showing only essential info (max 5-6 rows)
- "View All" link opens modal/separate page if needed

---

### 2. **Plan Prasad Menu** (`/operations/kitchen-prasad/plan-prasad-menu/page.tsx`)

#### Layout (COMPACT - NO SCROLLING):
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs                                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Header: Plan Prasad Menu                         │  │
│  │  [+ Create New Menu] [Filter: All ▼] (top-right) │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  TABS: [Today] [This Week] [All]                 │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  Compact Grid (2 rows x 3 columns = 6 cards max) │  │
│  │  ┌──────┐  ┌──────┐  ┌──────┐                   │  │
│  │  │Menu 1│  │Menu 2│  │Menu 3│                   │  │
│  │  └──────┘  └──────┘  └──────┘                   │  │
│  │  ┌──────┐  ┌──────┐  ┌──────┐                   │  │
│  │  │Menu 4│  │Menu 5│  │Menu 6│                   │  │
│  │  └──────┘  └──────┘  └──────┘                   │  │
│  │  [View All →] (if more than 6 menus)              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Menu Card Design (COMPACT):
- **Smaller cards**: Reduced padding (p-4 instead of p-6)
- White background, rounded corners
- **Single line header**: Menu name + date (compact)
- **Inline badges**: Status and item count on same line
- **Icon buttons**: Edit/Delete as icons only (no text)
- Hover effect: shadow increase, slight lift
- **Click card** to open details modal

#### Create/Edit Menu Modal (TABBED FORM):
- **Modal Size**: Large (max-width: 900px, max-height: 90vh)
- **TABS inside modal**: [Basic Info] [Menu Items] [Schedule] [Notes]
- **Each tab fits in viewport** - no scrolling within modal
- **Sticky footer**: Save/Cancel buttons always visible
- **Form Style**: 
  - Compact inputs (smaller padding)
  - Inline fields where possible
  - Collapsible sections for menu items
  - Add item button opens small inline form

---

### 3. **Prepare & Distribute Prasad** (`/operations/kitchen-prasad/prepare-prasad/page.tsx`)

#### Layout (SPLIT VIEW - NO SCROLLING):
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs                                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Header: Prepare & Distribute Prasad             │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────┐  ┌──────────────────────────────────┐  │
│  │  Menus    │  │  Selected Menu Details            │  │
│  │  (Compact)│  │  (Main Panel)                     │  │
│  │           │  │                                   │  │
│  │ [Menu 1]  │  │  Menu: Breakfast - Temple 1       │  │
│  │ [Menu 2]  │  │  Time: 08:00 | Status: In Progress│  │
│  │ [Menu 3]  │  │  ────────────────────────────────│  │
│  │           │  │  Items (Compact List - max 5-6)   │  │
│  │           │  │  ☑ Rice (50kg)                    │  │
│  │           │  │  ☑ Dal (20kg)                     │  │
│  │           │  │  ☐ Vegetables (15kg)              │  │
│  │           │  │  ☐ Sweets (10kg)                   │  │
│  │           │  │  ────────────────────────────────│  │
│  │           │  │  Progress: ████████░░ 75%        │  │
│  │           │  │  [✓ Mark Prepared] [✓ Distribute]│  │
│  └───────────┘  └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Design Elements:
- **Left Sidebar**: **Compact list** (max 5-6 menus visible)
  - **No scrolling** - if more menus, show "View All" button
  - Active menu highlighted (amber border)
  - **Single line per menu**: Name + time + progress dot
  - Click to select and view details
  
- **Main Panel**: **Fits in viewport**
  - **Compact header**: Menu name, time, status (single line)
  - **Compact items list**: Max 5-6 items visible
  - **Collapsible items**: If more items, show "[+ 3 more items]"
  - **Inline progress bar**: Single line with percentage
  - **Action buttons**: Inline, compact (icon + text)
  - **No scrolling** - all fits in viewport height

---

### 4. **Prasad Menu Management** (`/operations/kitchen-prasad/prasad-menu/page.tsx`)

#### Layout (COMPACT TABLE - NO SCROLLING):
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs                                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Header: Prasad Menu Management                  │  │
│  │  [+ Create] [Export] [Filter: All ▼] [Search]   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  TABS: [All] [Active] [Draft] [Completed]        │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  Compact Table (max 8-10 rows visible)           │  │
│  │  ┌──────┬──────┬──────┬──────┬──────┬──────┐    │  │
│  │  │ Menu │ Date │Temple│Items │Status│Actions│    │  │
│  │  ├──────┼──────┼──────┼──────┼──────┼──────┤    │  │
│  │  │ ...  │ ...  │ ...  │ ...  │ ...  │ ...  │    │  │
│  │  │ ...  │ ...  │ ...  │ ...  │ ...  │ ...  │    │  │
│  │  │ ...  │ ...  │ ...  │ ...  │ ...  │ ...  │    │  │
│  │  └──────┴──────┴──────┴──────┴──────┴──────┘    │  │
│  │  [1] [2] [3] ... [Next →] (Pagination)          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Table Design (COMPACT):
- **Compact rows**: Reduced padding (py-2 instead of py-4)
- **Smaller font**: text-sm for table content
- **Icon-only actions**: Edit/Delete as icons (hover shows tooltip)
- **Sticky header**: Table header stays visible
- **Max 8-10 rows visible** - fits in viewport
- **Pagination**: Shows page numbers, not infinite scroll
- Sortable columns
- Status badges (color-coded, compact)
- Row hover: subtle background change
- **Click row** to open details modal (instead of separate page)

---

### 5. **Kitchen Schedule** (`/operations/kitchen-prasad/kitchen-schedule/page.tsx`)

#### Layout (COMPACT CALENDAR - NO SCROLLING):
```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumbs                                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Header: Kitchen Schedule                        │  │
│  │  [Today] [Week] [Month] [←] [→] (Navigation)     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Compact Week View (FITS IN VIEWPORT)            │  │
│  │  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐   │  │
│  │  │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │ Sun │   │  │
│  │  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤   │  │
│  │  │08:00│08:00│08:00│08:00│08:00│08:00│08:00│   │  │
│  │  │Break│Break│Break│Break│Break│Break│Break│   │  │
│  │  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤   │  │
│  │  │12:00│12:00│12:00│12:00│12:00│12:00│12:00│   │  │
│  │  │Lunch│Lunch│Lunch│Lunch│Lunch│Lunch│Lunch│   │  │
│  │  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤   │  │
│  │  │18:00│18:00│18:00│18:00│18:00│18:00│18:00│   │  │
│  │  │Dinner│Dinner│Dinner│Dinner│Dinner│Dinner│Dinner│ │
│  │  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘   │  │
│  │  [Click cell to view/edit menu]                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Design Elements:
- **Compact Week View**: 
  - **Single week visible** - fits in viewport
  - **Compact cells**: Time + meal type (abbreviated)
  - **Color-coded**: Breakfast (blue), Lunch (amber), Dinner (purple)
  - **Click cell** to open menu details modal
  - **Navigation arrows**: [←] [→] to change weeks (no scrolling)
  - **No vertical scrolling** - all fits in viewport
  
- **Alternative: Timeline View** (if user prefers):
  - **Horizontal timeline** (not vertical)
  - **Single day view** with time slots
  - **Compact menu cards** in timeline
  - **Fits in viewport** - no scrolling

---

## 🎨 Color Scheme & Styling

### Colors:
- **Primary**: Amber-600 (matches existing design)
- **Success**: Green-600 (completed/prepared)
- **Warning**: Orange-600 (in-progress)
- **Danger**: Red-600 (overdue/cancelled)
- **Info**: Blue-600 (scheduled/pending)
- **Background**: White cards with gray-200 borders
- **Text**: Gray-900 (primary), Gray-600 (secondary)

### Typography:
- **Headers**: font-semibold, text-lg/xl
- **Body**: font-medium, text-sm/base
- **Labels**: font-medium, text-sm, text-gray-700

### Spacing:
- **Card Padding**: p-6
- **Section Gap**: gap-6
- **Grid Gap**: gap-4 or gap-6

### Shadows & Effects:
- **Cards**: shadow-sm, hover:shadow-lg
- **Buttons**: shadow-sm, hover:shadow-md
- **Hover**: transform hover:-translate-y-1
- **Transitions**: transition-all duration-300

---

## 📱 Component Patterns

### Buttons:
- **Primary**: bg-amber-600, hover:bg-amber-700
- **Secondary**: bg-gray-100, hover:bg-gray-200
- **Success**: bg-green-600, hover:bg-green-700
- **Danger**: bg-red-600, hover:bg-red-700
- All with rounded-lg, padding, and transitions

### Badges:
- **Status Badges**: Rounded-full, small padding
- Color-coded backgrounds (green-100, amber-100, red-100)
- Matching text colors

### Inputs:
- **Form Inputs**: border-gray-300, focus:ring-2 focus:ring-amber-500
- **Selects**: Same styling as inputs
- **Textareas**: Same styling, min-height

### Modals:
- **Overlay**: bg-black/50 backdrop-blur-sm
- **Modal**: bg-white, rounded-2xl, max-width constraints
- **Header**: border-b, padding
- **Footer**: Sticky, border-t, action buttons

---

## 🔄 User Flows

### Flow 1: Create a Menu
1. Dashboard → "Plan Prasad Menu" → "+ Create Menu"
2. Modal opens → Fill form sections
3. Add menu items → Set schedule
4. Save → Returns to menu list

### Flow 2: Prepare Prasad
1. Dashboard → "Prepare & Distribute Prasad"
2. Select menu from sidebar
3. Check items as prepared
4. Mark "Prepared" → Update status
5. Mark "Distributed" → Complete

### Flow 3: View Schedule
1. Dashboard → "Kitchen Schedule"
2. View calendar/timeline
3. Click menu → View details
4. Edit if needed

---

## ✨ Modern UI Features

1. **Animations**:
   - Card hover effects
   - Button scale on hover
   - Smooth transitions
   - Loading states

2. **Visual Feedback**:
   - Progress bars
   - Status indicators
   - Toast notifications (future)
   - Success/error states

3. **Responsive Design**:
   - Grid adapts to screen size
   - Mobile-friendly modals
   - Stacked layout on small screens

4. **Accessibility**:
   - Clear labels
   - Keyboard navigation
   - ARIA attributes
   - Color contrast compliance

---

## 📊 Data Visualization

### Charts (if needed):
- **Preparation Progress**: Circular progress or bar chart
- **Distribution Trends**: Line chart (items distributed over time)
- **Menu Popularity**: Bar chart (most common items)
- Use `recharts` library (already in project)

---

## 🎯 Key Design Principles Applied

1. **Consistency**: Matches existing Temple/Seva Management design
2. **Clarity**: Clear labels, sections, and actions
3. **Efficiency**: Quick actions, shortcuts, bulk operations
4. **Feedback**: Visual status, progress indicators
5. **Modern**: Gradients, shadows, smooth animations
6. **Professional**: Clean, enterprise-grade appearance

---

## 📝 Implementation Notes

- Use Tailwind CSS for all styling
- Follow existing component patterns
- Implement local storage for data persistence
- Add static sample data for demonstration
- Ensure all modals are accessible and keyboard-friendly
- Add loading states for async operations
- Implement error handling and validation

## 🚫 MINIMAL SCROLLING RULES

### Key Principles:
1. **Viewport Height**: All main content must fit within viewport (100vh - header - footer)
2. **Tabs Instead of Pages**: Use tabs to switch views instead of scrolling
3. **Modals for Details**: Click items to open modals, don't navigate to new pages
4. **Compact Tables**: Max 8-10 rows visible, use pagination
5. **Collapsible Sections**: Use accordions/collapsible for optional details
6. **Sticky Headers/Footers**: Keep navigation and actions always visible
7. **Horizontal Layouts**: Prefer side-by-side layouts over vertical stacking
8. **Summary Views**: Show summaries with "View More" links to modals
9. **Limit Grid Items**: Show max 6-8 items in grids, add "View All" button
10. **Inline Forms**: Use inline forms in modals with tabs, not long scrolling forms

### Layout Constraints:
- **Dashboard**: Max height = viewport - 200px (header + padding)
- **Tables**: Max 8-10 rows visible, pagination required
- **Grids**: Max 2 rows x 3 columns = 6 items visible
- **Modals**: Max height = 90vh, use tabs inside if needed
- **Sidebars**: Max 5-6 items visible, compact design
- **Cards**: Reduced padding (p-4 instead of p-6), compact text

---

This design plan ensures a modern, functional, and consistent UI/UX for Kitchen & Prasad Operations that integrates seamlessly with the existing admin system.

