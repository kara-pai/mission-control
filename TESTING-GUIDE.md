# PowerAI Dashboard — Testing Guide

## Quick Test (2 minutes)

### 1. Load Dashboard
```
https://kara-pai.github.io/mission-control/
```
**Expected:** Page loads with dark theme, sticky header, purple/amber colors

### 2. Check Header
- **Left:** ⚡ PowerAI logo (gradient)
- **Center:** 9 tab buttons (📊 Overview, 📊 Org Chart, 🧠 Agents, etc.)
- **Right:** Search bar, "Live" indicator (pulsing dot), 🔄 Refresh button

### 3. Check Left Rail
- 8 icons (📊🏢🧠🧾📅🧩📚📝)
- Click any icon → Tab switches instantly
- Icons highlight when active

## Full Test Flow (10 minutes)

### Tab 1: Overview
- [ ] Greeting shows time-based message (Good morning/afternoon/evening)
- [ ] Date displays correctly
- [ ] 5 metric cards show:
  - Active Agents: 13
  - Idle Agents: 4  
  - Tasks Today: 7 (or real count)
  - Tokens Used: 5.2M (or real)
  - Cost Today: $10.06 (or real)
- [ ] Org hierarchy card visible (Leadership section)
- [ ] C-Suite chiefs displayed (Elon, Gary, Warren)
- [ ] Focus stack appears below
- [ ] Activity feed shows entries

**Flow:** LOAD → VERIFY METRICS → CHECK ORG DISPLAY → ✅

### Tab 2: Org Chart
- [ ] CEO level visible at top (👑 Louis / Marcelo)
- [ ] COO level (🧠 Muddy) below CEO
- [ ] 3 chiefs visible side-by-side (Elon, Gary, Warren)
- [ ] Departments shown under each chief
- [ ] All 25 agents listed with names
- [ ] Status pills colored correctly (🟢 Active, 🟡 Idle, 🟠 Scaffolded)
- [ ] Hover effects work (glow + lift)
- [ ] Mobile: Layout stacks vertically (responsive)

**Flow:** CLICK ORG CHART TAB → VERIFY HIERARCHY → TEST HOVER → TEST RESIZE → ✅

### Tab 3: Agents
- [ ] 8 department columns visible
- [ ] Agent cards display in grid
- [ ] Each card shows:
  - Name (e.g., "Anvil")
  - Role (e.g., "Backend Engineer")
  - Model tags (e.g., "Codex 5.3", "Opus 4.6")
  - Status pill (colored)
  - "Last run" timestamp
- [ ] Action buttons work (Assign, Toggle)
- [ ] Hover effect on cards

**Flow:** CLICK AGENTS TAB → VERIFY CARDS → SCROLL THROUGH DEPARTMENTS → ✅

### Tab 4: Tasks
- [ ] Metric strip at top (Active, Idle, Total Sessions)
- [ ] Add task form with name + agent fields
- [ ] "Create Task" button
- [ ] Active sessions list below
- [ ] Add a test task → verify it appears
- [ ] Refresh page → task persists (localStorage)

**Flow:** ADD TASK → VERIFY DISPLAY → RELOAD PAGE → TASK STILL THERE → ✅

### Tab 5: Standup
- [ ] 3 form fields visible:
  - What shipped yesterday?
  - What's the plan today?
  - Blockers / asks?
- [ ] "Save Standup" button
- [ ] Past standups timeline below
- [ ] Add standup → appears in timeline
- [ ] Multiple standups show with dates

**Flow:** FILL FORM → SAVE → VERIFY IN TIMELINE → ADD ANOTHER → ✅

### Tab 6: Workspaces
- [ ] Add workspace form (name, path)
- [ ] "Add Workspace" button
- [ ] Workspace registry displays below
- [ ] Cards show name + path + updated time
- [ ] Add 2 workspaces → grid displays correctly

**Flow:** ADD WORKSPACE → VERIFY CARD → ADD ANOTHER → RESPONSIVE GRID → ✅

### Tab 7: Docs
- [ ] Left sidebar with doc list
- [ ] Right side: editor textarea
- [ ] Create doc form (title field)
- [ ] "New Doc" button
- [ ] Create a doc → appears in sidebar
- [ ] Click doc → loads in editor
- [ ] Edit text → auto-saves
- [ ] "Saved at HH:MM" indicator appears

**Flow:** CREATE DOC → SELECT → EDIT → AUTO-SAVE → VERIFY PERSISTENCE → ✅

### Tab 8: Logs
- [ ] Add log form (title, details, tags)
- [ ] "Log Entry" button
- [ ] Log list displays below
- [ ] Entries show title, details, tags, date
- [ ] Add multiple logs → newest first
- [ ] Reload → logs persist

**Flow:** ADD LOG → ADD ANOTHER → VERIFY ORDER → RELOAD → PERSIST → ✅

### Tab 9: CRM
- [ ] 4 KPI metrics: Contacts, Deals, Pipeline, Conversion Rate
- [ ] Add Contact form (name, email)
- [ ] Add Deal form (name, amount)
- [ ] Contact list displays cards
- [ ] Deal list displays cards
- [ ] Add contact → appears in list + metric updates
- [ ] Add deal → metric calculations update

**Flow:** ADD CONTACT → VERIFY METRIC → ADD DEAL → VERIFY PIPELINE → ✅

## Real-Time Integration Test

### API Connection
```bash
# Terminal: Check if API is running
curl http://localhost:6000/api/dashboard
```

**Expected:** JSON response with:
- `timestamp`: Current ISO time
- `usage`: Token counts, models
- `agents`: All 25 agents with status
- `metrics`: Active count, tokens, cost

### Dashboard Real-Time Updates
- [ ] Open dashboard
- [ ] Navigate to Overview tab
- [ ] Watch metrics (should update every 5 seconds)
- [ ] Check "Live" indicator (pulsing dot in header)
- [ ] Verify active agent count matches real data

**Flow:** OPEN DASHBOARD → OBSERVE LIVE INDICATOR → WAIT 5 SECONDS → METRICS UPDATE → ✅

## Data Persistence Test

### localStorage Persistence
```javascript
// In browser console (F12)
localStorage.getItem('powerai_focus')
localStorage.getItem('powerai_tasks')
localStorage.getItem('powerai_crm_contacts')
```

**Expected:** Returns JSON data (not null)

### Full Reload Test
1. Add data in multiple tabs (focus, task, contact, workspace)
2. Press Ctrl+Shift+R (hard refresh)
3. Verify all data still present

**Flow:** ADD DATA → RELOAD → VERIFY PERSISTENCE → ✅

## Performance Test

### Page Load
- [ ] Page loads in < 1 second
- [ ] No 404 errors in console
- [ ] No JavaScript errors in console (F12 → Console)
- [ ] All images/fonts load (check Network tab)

### Responsiveness
- [ ] Desktop (1920px): Full layout, all 9 tabs visible
- [ ] Tablet (768px): Grid wraps, rail collapses
- [ ] Mobile (375px): Single column, hamburger nav (if implemented)

### Interactions
- [ ] Tab switching: < 100ms
- [ ] Form submission: Instant (localStorage)
- [ ] API polling: 5-second interval visible

**Flow:** RESIZE WINDOW → TEST AT 3 BREAKPOINTS → VERIFY PERFORMANCE → ✅

## Browser Console Test

### Check for Errors
```javascript
// Run in Console (F12)
window.openClawClient // Should exist
StorageManager // Should exist
sampleAgents() // Should return object with 25 agents
state // Should have all properties
```

**Expected:** No errors, all objects defined

## Visual Test

### Colors & Contrast
- [ ] Dark background (#050508) visible
- [ ] Text readable on dark background
- [ ] Purple accents (#8B5CF6) visible
- [ ] Amber highlights (#F5B301) visible
- [ ] Status colors distinct (🟢 green, 🟡 yellow, etc.)

### Animations
- [ ] Hover on card → lift effect + glow
- [ ] Tab switch → fade-in animation
- [ ] Live indicator → pulsing animation
- [ ] Smooth transitions (not jerky)

### Typography
- [ ] Fonts load correctly (Inter)
- [ ] Proper font weights (bold headers, regular text)
- [ ] Spacing/margins look balanced

**Flow:** LOAD PAGE → HOVER CARD → SWITCH TAB → CHECK ANIMATIONS → ✅

## Success Criteria

### All Tests Pass When:
✅ All 9 tabs functional  
✅ 25 agents display correctly  
✅ Real-time metrics update every 5 seconds  
✅ Data persists after page reload  
✅ No JavaScript errors in console  
✅ Page loads in < 1 second  
✅ Responsive on mobile/tablet/desktop  
✅ All forms save data to localStorage  
✅ Org chart displays full hierarchy  
✅ Visual design matches Muddy-OS inspiration  

## Troubleshooting

### Page won't load
- **Check:** Browser console (F12)
- **Fix:** Clear cache (Ctrl+Shift+Delete) and reload

### Metrics show 0
- **Check:** Is OpenClaw API running? (`curl http://localhost:6000/api/dashboard`)
- **Fix:** Start API: `node scripts/openclaw-integration.js`

### Data doesn't persist
- **Check:** Is localStorage enabled? (Some browsers block it in private mode)
- **Fix:** Try in normal mode, not private/incognito

### Tab switches don't work
- **Check:** JavaScript enabled in browser
- **Fix:** Check console for errors, reload page

### Real-time updates don't work
- **Check:** API server running
- **Check:** Console shows `🔄 OpenClaw real-time polling started`
- **Fix:** Restart API server

## Test Checklist (Quick Reference)

```
ARCHITECTURE
  [ ] Page loads
  [ ] Header sticky
  [ ] Left rail visible
  [ ] All 9 tabs present

TAB TESTS
  [ ] Overview - metrics display
  [ ] Org Chart - hierarchy shows
  [ ] Agents - 25 agents visible
  [ ] Tasks - form works
  [ ] Standup - timeline works
  [ ] Workspaces - registry works
  [ ] Docs - editor works
  [ ] Logs - log entries work
  [ ] CRM - metrics update

REAL-TIME
  [ ] API responds (curl test)
  [ ] Metrics update every 5s
  [ ] Live indicator pulses

PERSISTENCE
  [ ] Add task → reload → persists
  [ ] Add contact → reload → persists
  [ ] Add workspace → reload → persists

VISUAL
  [ ] Colors visible
  [ ] Fonts load
  [ ] Hover effects work
  [ ] Mobile responsive

PERFORMANCE
  [ ] Page load < 1s
  [ ] No console errors
  [ ] Interactions instant

RESULT: ✅ PASS / ❌ FAIL
```

---

**Status: Ready to Test** 🧪  
**Dashboard:** https://kara-pai.github.io/mission-control/  
**Estimated Test Time:** 15 minutes (full flow)
