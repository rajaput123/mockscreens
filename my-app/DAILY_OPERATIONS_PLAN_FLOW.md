# Daily Operations Plan - Flow & Usage Guide

## 🎯 Purpose & Context

**When is this screen used?**
- **BEFORE** the day starts (typically early morning)
- **BEFORE** execution begins
- To **PLAN** and **REVIEW** what will happen during the day
- To ensure **READINESS** before operations start

**Think of it like:** A daily briefing document that temple administrators create in the morning to plan the entire day's operations.

---

## 📊 Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    MORNING (Before Day Starts)              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Open Daily Operations Plan Screen                 │
│  ────────────────────────────────────────────────────────   │
│  • Admin opens: /operations/operational-planning/          │
│    daily-operations-plan                                    │
│  • Screen shows today's date by default                     │
│  • Plan status: "Draft" (if new) or "Finalized" (if exists) │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Review Top Context Bar                             │
│  ────────────────────────────────────────────────────────   │
│  ✓ Temple Name: "Shri Krishna Temple"                       │
│  ✓ Date: Today's date (can change)                          │
│  ✓ Day Type: Normal Day / Festival / Special Day            │
│  ✓ Status: Draft / Finalized / Published                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Review Time Blocks (Morning/Afternoon/Evening)     │
│  ────────────────────────────────────────────────────────   │
│  For EACH time block, admin sees:                           │
│                                                              │
│  ┌────────────────────────────────────────────┐            │
│  │ Morning Block (05:00 - 12:00)              │            │
│  │ ────────────────────────────────────────── │            │
│  │ 1. Planned Rituals (READ-ONLY)             │            │
│  │    • Morning Aarti at 06:00                │            │
│  │    • Prasad Distribution at 07:30          │            │
│  │                                            │            │
│  │ 2. Operational Notes (EDITABLE)           │            │
│  │    [Textarea for notes...]                 │            │
│  │                                            │            │
│  │ 3. Dependencies (READ-ONLY)               │            │
│  │    • Kitchen must be ready by 06:00        │            │
│  │                                            │            │
│  │ 4. Checklist (INTERACTIVE)                 │            │
│  │    ☑ Staff assigned          [Ops Manager]│            │
│  │    ☑ Priest confirmed        [Admin]       │            │
│  │    ☐ Kitchen ready           [Kitchen Mgr]│            │
│  │    ☑ Facilities ready        [Facilities] │            │
│  │    ☐ Crowd control planned   [Security]   │            │
│  └────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Add Special Instructions (if needed)               │
│  ────────────────────────────────────────────────────────   │
│  [Large textarea]                                            │
│  "VIP visit expected at 10:00 AM"                           │
│  "Special prasad required for festival"                      │
│  "Government inspection scheduled"                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Review Risk & Gaps (if any)                        │
│  ────────────────────────────────────────────────────────   │
│  ⚠️  Warning Card:                                           │
│  "Morning: 2 pending confirmations"                          │
│  "Evening: 1 pending confirmation"                           │
│                                                              │
│  (This appears ONLY if checklist items are pending)          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 6: Take Action                                        │
│  ────────────────────────────────────────────────────────   │
│  Option A: Save as Draft                                     │
│  ────────────────────────                                   │
│  • Click "Save Draft" button                                │
│  • Plan saved but not finalized                             │
│  • Can come back and edit later                              │
│  • Status remains "Draft"                                   │
│                                                              │
│  Option B: Finalize Plan                                     │
│  ────────────────────────                                   │
│  • Click "Finalize Plan" button                             │
│  • Plan is locked for editing                               │
│  • Status changes to "Finalized"                            │
│  • Ready for operations team to view                        │
│  • Can be published for execution                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DURING THE DAY                           │
│  ────────────────────────────────────────────────────────   │
│  • Operations team views the finalized plan                 │
│  • They execute according to the plan                       │
│  • This screen is READ-ONLY during execution                │
│  • No editing allowed once published                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Detailed User Flow

### Scenario 1: Creating a New Daily Plan

```
1. Admin logs in → Navigates to Operations → Operations Control
2. Clicks "Daily Operations Plan"
3. Screen opens with today's date
4. Sees empty or template plan
5. Reviews each time block:
   - Morning: Sees scheduled rituals (from seva system)
   - Checks if all checklist items are confirmed
   - Adds operational notes if needed
6. Repeats for Afternoon and Evening blocks
7. Adds special instructions (if any)
8. Reviews risk & gaps indicator
9. If everything looks good:
   → Clicks "Finalize Plan"
10. Plan is now locked and ready for operations team
```

### Scenario 2: Reviewing an Existing Plan

```
1. Admin opens Daily Operations Plan
2. Changes date to view a different day
3. Sees existing plan (if finalized/published)
4. If status is "Draft":
   - Can edit notes
   - Can toggle checklist items
   - Can save changes
5. If status is "Finalized" or "Published":
   - View-only mode
   - Cannot make changes
   - Can only review
```

### Scenario 3: Operations Team Viewing Plan

```
1. Operations staff member opens Daily Operations Plan
2. Sees finalized/published plan
3. Reviews:
   - What rituals are scheduled
   - What checklist items need attention
   - Special instructions
   - Dependencies
4. Uses this as reference during execution
5. Cannot edit anything (read-only)
```

---

## 🎛️ Interactive Elements Explained

### 1. **Date Picker**
- **What it does:** Lets you select which day's plan to view/edit
- **When to use:** To plan for future days or review past days
- **"Today" button:** Quick way to jump to today's date

### 2. **Day Type Badge**
- **Normal Day:** Regular daily operations
- **Festival:** Special festival day (different color)
- **Special Day:** Other special occasions
- **Why it matters:** Affects what rituals might be scheduled

### 3. **Plan Status Badge**
- **Draft:** Still being edited, can be changed
- **Finalized:** Locked, ready for review
- **Published:** Active, being executed (read-only)

### 4. **Time Block Expand/Collapse**
- **Click header:** Expands or collapses the block
- **Why:** To focus on one time period at a time
- **Default:** All blocks expanded

### 5. **Checklist Items**
- **Checkbox:** Click to toggle between Pending/Confirmed
- **Owner:** Shows role responsible (not person's name)
- **Why:** To track readiness before day starts
- **Example:** "Kitchen readiness checked" - Kitchen Manager

### 6. **Operational Notes**
- **Textarea:** Free-form text input
- **What to write:** Special instructions, reminders, notes
- **Per-block:** Each time block has its own notes

### 7. **Special Instructions**
- **Separate section:** High-visibility instructions
- **Who sees it:** Operations team (labeled as such)
- **What to write:** VIP visits, special requirements, directives

### 8. **Risk & Gaps Indicator**
- **Auto-generated:** Appears when checklist items are pending
- **Purpose:** Alert admin to incomplete planning
- **Not blocking:** You can still finalize, but should review

---

## 📋 Step-by-Step Usage Example

### Morning Routine (Admin)

**7:00 AM - Planning Phase**

1. **Open the screen**
   ```
   Navigate: Operations → Operations Control → Daily Operations Plan
   ```

2. **Check today's date**
   ```
   Verify date is correct (should default to today)
   ```

3. **Review Morning Block**
   ```
   - See: Morning Aarti at 06:00 (already scheduled)
   - Check: All checklist items confirmed?
   - Add note: "Extra prasad needed for festival"
   ```

4. **Review Afternoon Block**
   ```
   - See: Madhyana Aarti at 12:00
   - Check: Kitchen confirmed for lunch?
   - Add note: "VIP lunch at 1:00 PM"
   ```

5. **Review Evening Block**
   ```
   - See: Evening Aarti at 19:00
   - Check: Staff assigned?
   - Notice: Crowd control not planned yet
   ```

6. **Add Special Instructions**
   ```
   "VIP delegation visiting at 10:00 AM. 
   Special darshan arrangements required.
   Government inspection at 3:00 PM."
   ```

7. **Check Risk & Gaps**
   ```
   ⚠️ Warning shows:
   - Evening: 2 pending confirmations
   ```

8. **Take Action**
   ```
   Option A: Contact Security Head → Confirm crowd control
   Option B: Save as Draft → Come back later
   Option C: Finalize Plan → Lock it in
   ```

9. **Finalize**
   ```
   Click "Finalize Plan"
   → Status changes to "Finalized"
   → Plan is now locked
   → Operations team can view it
   ```

---

## 🔗 How It Fits in the Overall Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPLETE OPERATIONS FLOW                  │
└─────────────────────────────────────────────────────────────┘

1. PLANNING PHASE (This Screen)
   ────────────────────────────
   Daily Operations Plan Screen
   ↓
   Admin creates/reviews plan
   ↓
   Finalizes plan
   ↓

2. EXECUTION PHASE (Other Screens)
   ───────────────────────────────
   Operations Control Panel
   ↓
   Operations team executes plan
   ↓
   Real-time monitoring
   ↓

3. TRACKING PHASE (Other Screens)
   ───────────────────────────────
   Task Board
   ↓
   Track completion
   ↓
   Record issues
```

**Key Point:** This screen is ONLY for planning. Execution happens elsewhere.

---

## ❓ Common Questions

### Q: Can I create tasks here?
**A:** No. This screen is for planning only. Tasks are created in the Task Board.

### Q: Can I assign people here?
**A:** No. You assign roles (like "Operations Manager"), not specific people.

### Q: What if I see pending checklist items?
**A:** You should confirm them before finalizing, but it's not required. The system just warns you.

### Q: Can I edit after finalizing?
**A:** No. Once finalized, it's locked. You'd need to create a new plan or modify before finalizing.

### Q: What's the difference between "Finalized" and "Published"?
**A:** 
- **Finalized:** Plan is complete and locked, ready for review
- **Published:** Plan is active and being executed (read-only for everyone)

### Q: Where do the rituals come from?
**A:** They're pulled from the Seva Planning system. This screen just shows them as reference.

### Q: Can operations staff edit?
**A:** No. Only Admin and Operations Manager can edit. Others have view-only access.

---

## 🎯 Key Takeaways

1. **This is a PLANNING screen** - Used BEFORE execution
2. **Time-based structure** - Organized by Morning/Afternoon/Evening
3. **Checklist-driven** - Track readiness before finalizing
4. **Role-based ownership** - Assigns responsibility by role, not person
5. **Read-only rituals** - Rituals come from seva system, just displayed here
6. **Status-driven workflow** - Draft → Finalized → Published
7. **Permission-based** - Admin can edit, others can only view

---

## 🚀 Quick Start Guide

**For First-Time Users:**

1. Open the screen
2. Look at the top context bar (temple name, date, status)
3. Expand each time block (Morning, Afternoon, Evening)
4. Review the checklist items
5. Toggle any pending items to "confirmed" if ready
6. Add any operational notes
7. Add special instructions if needed
8. Review risk & gaps
9. Click "Finalize Plan" when ready

**That's it!** The plan is now ready for the operations team.

---

**Need more help?** Check the design documentation or ask specific questions about any part of the flow!

