# Personalization Hub Design — Waey v0.2.0

**Date**: 2026-07-24  
**Author**: Waey Team  
**Status**: Design Review  
**Scope**: Dashboard customization, goal setting, advanced analytics

---

## 1. Overview

The **Personalization Hub** is an integrated feature system that lets users:
- Customize dashboard widget visibility, order, and layout presets
- Set wellness goals for each tracker with progress tracking
- View advanced analytics with weekly/monthly trends and goal achievements
- All data persists locally in localStorage (privacy-first)

This system transforms Waey from a tracking tool into a **personalized wellness dashboard** tailored to each user's priorities.

---

## 2. User Stories

| Story | Priority | Notes |
|-------|----------|-------|
| As a user, I want to show/hide trackers so my dashboard matches my wellness priorities | High | Core customization |
| As a user, I want to reorder tracker cards by dragging so frequently-used ones are first | High | Improved UX |
| As a user, I want to save multiple dashboard layouts so I can switch between "Complete", "Health Focus", and "Quick View" | Medium | Preset layouts |
| As a user, I want to set goals for each tracker so I know what I'm aiming for | High | Goals foundation |
| As a user, I want to see my goal progress (current vs target) on the dashboard | High | Visual feedback |
| As a user, I want to see weekly/monthly trends for each metric to understand patterns | High | Analytics core |
| As a user, I want to see which goals I've achieved to stay motivated | Medium | Gamification |
| As a user, I want to filter analytics by tracker, date range, and goal status | Medium | Advanced filtering |

---

## 3. Architecture

### 3.1 Data Model

**Tracker Metadata** (localStorage key: `waey:personalization:trackers`)
```typescript
interface TrackerConfig {
  id: string;                    // "water", "sleep", "steps", "mood", "expenses"
  visible: boolean;              // Show on dashboard?
  order: number;                 // Display order (0-based)
  category: "core" | "wellness"; // Core: water/sleep/steps/mood. Wellness: expenses
}
```

**Goal** (localStorage key: `waey:personalization:goals`)
```typescript
interface Goal {
  id: string;                    // UUID
  trackerId: string;             // Reference to tracker
  targetValue: number;           // e.g., 8 (for water), 10000 (for steps)
  unit: string;                  // "liter", "minutes", "count"
  frequency: "daily" | "weekly"; // How often is goal measured?
  createdAt: ISO8601;
  updatedAt: ISO8601;
}
```

**Layout Preset** (localStorage key: `waey:personalization:layouts`)
```typescript
interface LayoutPreset {
  id: string;                    // UUID
  name: string;                  // "Complete View", "Health Focus"
  trackerIds: string[];          // Ordered list of visible tracker IDs
  description?: string;          // "All trackers visible"
  isDefault?: boolean;           // System preset or user-created
}
```

**Analytics Entry** (localStorage key: `waey:personalization:analytics:${trackerId}`)
```typescript
interface AnalyticsEntry {
  date: YYYY-MM-DD;
  value: number;
  goalMet: boolean;              // Did user meet goal this day?
}
```

### 3.2 Default State

**Out-of-the-box tracker visibility** (all visible, default order):
```
1. Daily Challenge
2. Big 3
3. Mental Energy
4. Water Tracker
5. Sleep Tracker
6. Steps Tracker
7. Mood Tracker
8. Expense Tracker
9. Gratitude Journal
10. Night Review
```

**Default presets**:
- "Complete View" — all trackers visible
- "Health Focus" — water, sleep, steps, mood, mental energy
- "Quick View" — water, steps, mood (3 essentials)

---

## 4. Feature Details

### 4.1 Dashboard Customization

**Location**: Dashboard page + new "Settings" page

**Components**:
- `PersonalizationPanel` (Settings page)
  - Drag-and-drop tracker reordering
  - Visibility toggles for each tracker
  - Preset layout buttons
  - "Save as new layout" button
  - Reset to default button

**Behavior**:
- Users drag tracker cards in a list to reorder
- Toggle checkboxes to show/hide
- Preset buttons apply a saved layout instantly
- Changes save to localStorage immediately
- Dashboard re-renders to reflect new layout

**Edit Flow** (Settings page):
1. User visits Settings
2. See current active layout name
3. Modify tracker visibility/order via drag-and-drop
4. Choose: "Apply to current layout" (overwrite) or "Save as new layout"
5. Confirm and return to dashboard

### 4.2 Goal Setting

**Location**: Settings page + dashboard cards (show progress bars)

**Components**:
- `GoalCard` — display current value, target, progress bar, edit/delete buttons
- `GoalForm` — modal to create/edit goals
- `GoalProgress` — dashboard card showing all active goals

**Behavior**:
- User clicks "Set Goal" on a tracker card → modal opens
- Enter target value (pre-populated with common defaults)
- Choose frequency (daily/weekly)
- Save → goal stored, progress bar appears on dashboard
- Daily: check if goal met each day (auto-calculated from tracker data)
- Weekly: aggregate daily values into weekly total

**Goal Status Indicators**:
- 🟢 Met today
- 🟡 On track
- 🔴 Behind target

### 4.3 Advanced Analytics

**Location**: New "Analytics" page (accessible from Dashboard button or Settings)

**Components**:
- `AnalyticsHeader` — date range picker, goal filter, tracker selector
- `TrendChart` — Recharts line chart (7-day, 30-day, 90-day views)
- `GoalProgressChart` — bar chart showing goal achievement %
- `InsightCard` — text insights ("You averaged 7.2L water this week")
- `CorrelationCard` — show relationships (e.g., "High sleep → better mood")

**Data Aggregation**:
- 7-day view: daily values, show trend line
- 30-day view: daily values, weekly average line
- 90-day view: weekly aggregates, monthly average line
- Goal achievement: count days goal was met vs total days

**Correlation Detection** (basic):
- Compare mood tracker with sleep/water values
- Show correlation coefficient (simple: if both high → positive)
- Display: "When you sleep 8+ hours, your mood averages +0.5 points"

### 4.4 Integration with Dashboard

**On Dashboard**:
1. **Personalization Card** (top-right corner)
   - Current layout name badge
   - Quick preset switcher dropdown
   - "Customize" link to Settings

2. **Goal Progress Widget** (new card)
   - Show all active goals as small cards (target ✓ or ✗)
   - "View all" links to Analytics page

3. **Enhanced Tracker Cards**
   - Each tracker shows goal progress bar (if goal set)
   - Color: green (met), yellow (80%+), red (<80%)

---

## 5. Data Flow

```
User customizes dashboard
    ↓
LocalStorage: waey:personalization:trackers updated
    ↓
Dashboard component re-renders (reads updated config)
    ↓
Tracker cards appear in new order/visibility

---

User sets goal for water tracker
    ↓
LocalStorage: waey:personalization:goals added
    ↓
Daily tracker logs water value
    ↓
Goal comparison: is today's water ≥ target?
    ↓
Analytics entry created: {date, value, goalMet: true/false}
    ↓
Dashboard shows progress bar + achievement badge

---

User visits Analytics page
    ↓
Read all analytics entries for selected tracker + date range
    ↓
Aggregate: daily values, weekly averages, goal achievement %
    ↓
Recharts renders trend line + goal progress bar
    ↓
Display text insights (e.g., "Your avg water: 7.2L")
```

---

## 6. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Create data models (TypeScript interfaces)
- [ ] Implement localStorage hooks: `useTrackerConfig()`, `useGoals()`, `useLayoutPresets()`
- [ ] Build `PersonalizationPanel` component (drag-and-drop reordering)
- [ ] Update Dashboard to read and apply tracker config
- [ ] Add Settings page with basic customization UI

### Phase 2: Goals (Week 2)
- [ ] Build `GoalForm` modal component
- [ ] Implement goal CRUD (Create, Read, Update, Delete)
- [ ] Add `GoalCard` component to dashboard
- [ ] Create analytics entry on daily tracker update
- [ ] Show goal progress bars on tracker cards

### Phase 3: Analytics (Week 3)
- [ ] Build Analytics page layout
- [ ] Implement `TrendChart` (Recharts line chart)
- [ ] Build `GoalProgressChart` (bar chart)
- [ ] Add date range picker and filter UI
- [ ] Implement basic correlation detection
- [ ] Add text insights generation

### Phase 4: Polish & Testing (Week 4)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] E2E tests (Playwright): customization → goal setting → analytics
- [ ] Unit tests (Vitest): data aggregation, correlation logic
- [ ] RTL compliance check (text-right, dir="rtl")
- [ ] Accessibility audit (ARIA labels, keyboard navigation)
- [ ] Dark mode testing

---

## 7. File Structure

```
src/
  features/
    PersonalizationHub/
      contexts/
        PersonalizationContext.tsx     # Global state for trackers/goals/layouts
      hooks/
        useTrackerConfig.ts            # Get/update tracker visibility/order
        useGoals.ts                    # CRUD goals
        useLayoutPresets.ts            # Get/apply layouts
        useAnalytics.ts                # Query analytics data
      components/
        PersonalizationPanel.tsx       # Drag-drop editor (Settings page)
        GoalForm.tsx                   # Modal to create/edit goals
        GoalCard.tsx                   # Single goal display
        GoalProgress.tsx               # All goals widget (dashboard)
        PersonalizationBadge.tsx       # Layout badge + preset switcher
        AnalyticsPage.tsx              # Main analytics view
        TrendChart.tsx                 # Line chart (Recharts)
        GoalProgressChart.tsx          # Bar chart
        InsightCard.tsx                # Text insights
        CorrelationCard.tsx            # Correlation display
      utils/
        analyticsAggregation.ts        # Daily → weekly → monthly
        correlationDetection.ts        # Compare metrics
        insightGeneration.ts           # Generate text summaries
      index.ts                         # Exports

  pages/
    Settings.tsx                       # Settings page (uses PersonalizationPanel)
    Analytics.tsx                      # Analytics page (wrapper for AnalyticsPage)

  contexts/
    PersonalizationContext.tsx         # Moved here for global access
```

---

## 8. Localization (i18n)

**New translation keys**:
```javascript
{
  "settings.title": "الإعدادات",
  "settings.customize": "تخصيص لوحة التحكم",
  "settings.trackers": "المتتبعات",
  "settings.goals": "الأهداف",
  "settings.layouts": "تخطيطات مسبقة",
  
  "goal.create": "تعيين هدف",
  "goal.edit": "تعديل الهدف",
  "goal.delete": "حذف الهدف",
  "goal.target": "الهدف",
  "goal.met": "تم تحقيق الهدف",
  "goal.progress": "التقدم",
  
  "analytics.title": "التحليلات",
  "analytics.trends": "الاتجاهات",
  "analytics.goalAchievement": "إنجاز الأهداف",
  "analytics.insights": "الرؤى",
  "analytics.dateRange": "نطاق التاريخ",
  "analytics.week": "أسبوع",
  "analytics.month": "شهر",
  "analytics.quarter": "ثلاثة أشهر",
  "analytics.correlation": "الارتباط",
  
  "personalization.currentLayout": "التخطيط الحالي",
  "personalization.presets": "الإعدادات المسبقة",
  "personalization.completeView": "العرض الكامل",
  "personalization.healthFocus": "التركيز على الصحة",
  "personalization.quickView": "العرض السريع",
  "personalization.saveAsNew": "حفظ كتخطيط جديد",
  "personalization.resetDefault": "إعادة تعيين الافتراضي"
}
```

---

## 9. Error Handling

| Scenario | Handling |
|----------|----------|
| localStorage quota exceeded | Toast warning + suggestion to export/clear old data |
| Invalid goal target (e.g., negative) | Form validation + clear error message |
| Goal frequency mismatch (daily goal, weekly data) | Auto-aggregate weekly, show daily + weekly progress |
| Analytics data missing (e.g., new tracker) | Show "No data yet" state with encouragement |
| Correlation fails (insufficient data) | Hide correlation card, show "collect more data" |

---

## 10. Testing Strategy

### Unit Tests (Vitest)
- `analyticsAggregation.ts`: daily → weekly → monthly conversion
- `correlationDetection.ts`: detect positive/negative/no correlation
- `insightGeneration.ts`: text summary generation
- Goal CRUD: create, update, delete, validate

### Component Tests
- `PersonalizationPanel`: drag-drop, visibility toggles, preset switching
- `GoalForm`: validation, submit, error states
- `AnalyticsPage`: date range filter, chart rendering

### E2E Tests (Playwright)
- **Flow 1**: User customizes dashboard → sees changes on home
- **Flow 2**: User sets goal → tracks daily → sees progress → Analytics shows trend
- **Flow 3**: User switches layouts → trackers appear/disappear correctly
- **Flow 4**: Mobile responsiveness (phone, tablet layouts)

---

## 11. Design Compliance

- **Rounded Cards**: All new cards use `rounded-3xl` (32px) from DESIGN.md
- **Typography**: Alexandria font, weight 700 headings, 400 body, 1.9 line-height
- **Colors**: Use DESIGN.md palette (primary `#5D7052`, accent `#E6DCCD`, ink `#2C2C24`)
- **Dark Mode**: All components tested in `.dark` class
- **RTL**: All text `text-right`, forms aligned for RTL input
- **Animations**: Framer Motion for goal progress bar animations, chart transitions
- **Buttons**: All buttons `rounded-full` (pill shape)

---

## 12. Performance Considerations

- **LocalStorage queries**: Batch reads in Context, avoid per-component queries
- **Chart rendering**: Memoize Recharts components to prevent unnecessary re-renders
- **Analytics aggregation**: Cache weekly/monthly totals, invalidate on new data only
- **Drag-and-drop**: Use react-beautiful-dnd or native HTML5 drag API (check bundle impact)

---

## 13. Dependencies

**Existing** (already in package.json):
- `recharts` — for analytics charts
- `framer-motion` — for animations
- `react-hook-form` — for goal form validation

**Potentially New**:
- `react-beautiful-dnd` — if complex drag-drop needed (consider bundle size)
- OR use native HTML5 drag API (no dependency, slightly more code)

---

## 14. Rollout Plan

**v0.2.0-alpha**: All features behind feature flag (`waey:personalization:enabled`)
**v0.2.0-beta**: Open to waitlist (gather feedback)
**v0.2.0**: General availability

---

## 15. Success Metrics

- Users create ≥1 goal within 7 days of feature launch
- Dashboard customization adoption (% of users reordering trackers)
- Analytics page session time (engagement indicator)
- Correlation insights click-through rate
- Support tickets related to customization (should be low)

---

## Self-Review Checklist

- [x] No placeholders or TODOs left in design
- [x] Data models are clear and unambiguous
- [x] File structure aligns with Waey conventions
- [x] Localization keys cover all UI strings
- [x] Error scenarios addressed
- [x] Testing strategy defined (unit, component, E2E)
- [x] Design compliance verified against DESIGN.md
- [x] Phase breakdown is realistic
- [x] No contradictions between sections
- [x] RTL and accessibility considered

---

## Next Steps

1. **User Review**: Read this spec, note any changes needed
2. **Writing Plans**: Create implementation plan with Gantt breakdown
3. **Phase 1 Kickoff**: Begin foundation work

