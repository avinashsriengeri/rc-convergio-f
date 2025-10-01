# Analytics Module - Complete API Integration Mapping

## 📍 Page: `/marketing/analytics` (Analytics.vue)

---

## 🔄 **API Calls on Page Load**

When the Analytics page loads, it makes **3 parallel API calls**:

### 1. **GET `/api/analytics/modules`**
- **Trigger**: Automatic on page mount
- **Purpose**: Load available module tabs (Contacts, Deals, Campaigns, etc.)
- **Response**: Array of 12 modules with id, name, icon
- **UI Update**: Populates module tabs at bottom of page

### 2. **GET `/api/analytics/periods`**
- **Trigger**: Automatic on page mount
- **Purpose**: Load time period options (Week, Month, Quarter, Year)
- **Response**: Array of 4 periods with id, name, label
- **UI Update**: Populates period filter buttons

### 3. **GET `/api/analytics/dashboard?period=month`**
- **Trigger**: Automatic on page mount (default period: month)
- **Purpose**: Load summary metrics for all 12 modules
- **Response**: Object with metrics for contacts, deals, campaigns, ads, events, meetings, tasks, companies, forecast, lead_scoring, journeys, visitor_intent
- **UI Update**: Populates all 12 metric cards in the summary grid

---

## 🎯 **Period Filter Buttons** (Top Section)

### **Button: "This Week"**
- **API Call**: `GET /api/analytics/dashboard?period=week`
- **Trigger**: Click on "This Week" button
- **Response**: Updated metrics for all 12 modules for current week
- **UI Update**: Refreshes all 12 metric cards + reloads selected module tab data

### **Button: "This Month"** (Default)
- **API Call**: `GET /api/analytics/dashboard?period=month`
- **Trigger**: Click on "This Month" button OR page load
- **Response**: Updated metrics for all 12 modules for current month
- **UI Update**: Refreshes all 12 metric cards + reloads selected module tab data

### **Button: "This Quarter"**
- **API Call**: `GET /api/analytics/dashboard?period=quarter`
- **Trigger**: Click on "This Quarter" button
- **Response**: Updated metrics for all 12 modules for current quarter
- **UI Update**: Refreshes all 12 metric cards + reloads selected module tab data

### **Button: "This Year"**
- **API Call**: `GET /api/analytics/dashboard?period=year`
- **Trigger**: Click on "This Year" button
- **Response**: Updated metrics for all 12 modules for current year
- **UI Update**: Refreshes all 12 metric cards + reloads selected module tab data

---

## 📊 **Summary Grid Cards** (12 Cards)

These cards display data from `/api/analytics/dashboard` response:

### **1. Contacts Card**
- **Data Source**: `dashboardData.contacts` from dashboard API
- **Displays**: Total contacts, new contacts, growth %
- **No Direct API**: Uses dashboard API data

### **2. Deals Card**
- **Data Source**: `dashboardData.deals` from dashboard API
- **Displays**: Total deals, deal value, growth %
- **No Direct API**: Uses dashboard API data

### **3. Campaigns Card**
- **Data Source**: `dashboardData.campaigns` from dashboard API
- **Displays**: Total campaigns, active campaigns, growth %
- **No Direct API**: Uses dashboard API data

### **4. Ads Card**
- **Data Source**: `dashboardData.ads` from dashboard API
- **Displays**: Total ads, spend amount, growth %
- **No Direct API**: Uses dashboard API data

### **5. Events Card**
- **Data Source**: `dashboardData.events` from dashboard API
- **Displays**: Total events, attendees, growth %
- **No Direct API**: Uses dashboard API data

### **6. Meetings Card**
- **Data Source**: `dashboardData.meetings` from dashboard API
- **Displays**: Total meetings, scheduled, growth %
- **No Direct API**: Uses dashboard API data

### **7. Tasks Card**
- **Data Source**: `dashboardData.tasks` from dashboard API
- **Displays**: Total tasks, completed, growth %
- **No Direct API**: Uses dashboard API data

### **8. Companies Card**
- **Data Source**: `dashboardData.companies` from dashboard API
- **Displays**: Total companies, new companies, growth %
- **No Direct API**: Uses dashboard API data

### **9. Forecast Card**
- **Data Source**: `dashboardData.forecast` from dashboard API
- **Displays**: Projected revenue, accuracy %, growth %
- **No Direct API**: Uses dashboard API data

### **10. Lead Scoring Card**
- **Data Source**: `dashboardData.lead_scoring` from dashboard API
- **Displays**: Total leads, qualified leads, growth %
- **No Direct API**: Uses dashboard API data

### **11. Journeys Card**
- **Data Source**: `dashboardData.journeys` from dashboard API
- **Displays**: Total journeys, participants, growth %
- **No Direct API**: Uses dashboard API data

### **12. Visitor Intent Card**
- **Data Source**: `dashboardData.visitor_intent` from dashboard API
- **Displays**: Total visitors, high intent visitors, growth %
- **No Direct API**: Uses dashboard API data

---

## 📑 **Module Tab Buttons** (Bottom Section)

Each tab triggers a specific module API call when clicked:

### **Tab: "Contacts"** (Default selected)
- **API Call**: `GET /api/analytics/contacts?period=month`
- **Trigger**: Click on "Contacts" tab OR page load
- **Response**: Detailed contacts analytics with summary, chart_data, metrics
- **UI Update**: Shows contacts-specific metrics in module content area

### **Tab: "Deals"**
- **API Call**: `GET /api/analytics/deals?period=month`
- **Trigger**: Click on "Deals" tab
- **Response**: Detailed deals analytics with total_value, avg_deal_size, win_rate
- **UI Update**: Shows deals-specific metrics in module content area

### **Tab: "Campaigns"**
- **API Call**: `GET /api/analytics/campaigns?period=month`
- **Trigger**: Click on "Campaigns" tab
- **Response**: Detailed campaigns analytics with open_rate, click_rate, conversion_rate
- **UI Update**: Shows campaigns-specific metrics in module content area

### **Tab: "Ads"**
- **API Call**: `GET /api/analytics/ads?period=month`
- **Trigger**: Click on "Ads" tab
- **Response**: Detailed ads analytics with spend, impressions, clicks, ctr
- **UI Update**: Shows ads-specific metrics in module content area

### **Tab: "Events"**
- **API Call**: `GET /api/analytics/events?period=month`
- **Trigger**: Click on "Events" tab
- **Response**: Detailed events analytics with attendees, rsvp_rate, attendance_rate
- **UI Update**: Shows events-specific metrics in module content area

### **Tab: "Meetings"**
- **API Call**: `GET /api/analytics/meetings?period=month`
- **Trigger**: Click on "Meetings" tab
- **Response**: Detailed meetings analytics with scheduled, completed, avg_duration
- **UI Update**: Shows meetings-specific metrics in module content area

### **Tab: "Tasks"**
- **API Call**: `GET /api/analytics/tasks?period=month`
- **Trigger**: Click on "Tasks" tab
- **Response**: Detailed tasks analytics with completed, pending, completion_rate
- **UI Update**: Shows tasks-specific metrics in module content area

### **Tab: "Companies"**
- **API Call**: `GET /api/analytics/companies?period=month`
- **Trigger**: Click on "Companies" tab
- **Response**: Detailed companies analytics with new_companies, active, converted
- **UI Update**: Shows companies-specific metrics in module content area

### **Tab: "Forecast"**
- **API Call**: `GET /api/analytics/forecast?period=month`
- **Trigger**: Click on "Forecast" tab
- **Response**: Detailed forecast analytics with probability_weighted, accuracy, active_deals
- **UI Update**: Shows forecast-specific metrics in module content area

### **Tab: "Lead Scoring"**
- **API Call**: `GET /api/analytics/lead-scoring?period=month`
- **Trigger**: Click on "Lead Scoring" tab
- **Response**: Detailed lead scoring analytics with qualified, avg_score, high_score
- **UI Update**: Shows lead scoring-specific metrics in module content area

### **Tab: "Journeys"**
- **API Call**: `GET /api/analytics/journeys?period=month`
- **Trigger**: Click on "Journeys" tab
- **Response**: Detailed journeys analytics with active, completed, participants
- **UI Update**: Shows journeys-specific metrics in module content area

### **Tab: "Visitor Intent"**
- **API Call**: `GET /api/analytics/visitor-intent?period=month`
- **Trigger**: Click on "Visitor Intent" tab
- **Response**: Detailed visitor intent analytics with high_intent, medium_intent, low_intent
- **UI Update**: Shows visitor intent-specific metrics in module content area

---

## 🔄 **Combined Actions**

### **Changing Period While Viewing a Module Tab**

**Example**: User is on "Contacts" tab and clicks "This Week"

1. **API Call 1**: `GET /api/analytics/dashboard?period=week`
   - Updates all 12 summary cards
   
2. **API Call 2**: `GET /api/analytics/contacts?period=week`
   - Updates the Contacts module detail view

**Result**: Both dashboard and module data refresh with new period

---

## 📊 **Data Flow Diagram**

```
Page Load
    ├─→ GET /api/analytics/modules → [Contacts, Deals, ...]
    ├─→ GET /api/analytics/periods → [Week, Month, Quarter, Year]
    └─→ GET /api/analytics/dashboard?period=month → {contacts: {...}, deals: {...}, ...}
            ├─→ Contacts Card (1247, +12.5%)
            ├─→ Deals Card (156, +8.3%)
            ├─→ Campaigns Card (45, +15.2%)
            └─→ ... (all 12 cards)

User Clicks "This Week" Button
    ├─→ GET /api/analytics/dashboard?period=week → Updates all 12 cards
    └─→ GET /api/analytics/contacts?period=week → Updates module view

User Clicks "Deals" Tab
    └─→ GET /api/analytics/deals?period=week → Shows deals details
```

---

## 🎯 **API Endpoints Summary**

### **Core Configuration APIs (3)**
1. `GET /api/analytics/modules` - Load available modules
2. `GET /api/analytics/periods` - Load time periods
3. `GET /api/analytics/dashboard?period={period}` - Load all metrics

### **Module-Specific APIs (12)**
4. `GET /api/analytics/contacts?period={period}`
5. `GET /api/analytics/companies?period={period}`
6. `GET /api/analytics/deals?period={period}`
7. `GET /api/analytics/campaigns?period={period}`
8. `GET /api/analytics/ads?period={period}`
9. `GET /api/analytics/events?period={period}`
10. `GET /api/analytics/meetings?period={period}`
11. `GET /api/analytics/tasks?period={period}`
12. `GET /api/analytics/forecast?period={period}`
13. `GET /api/analytics/lead-scoring?period={period}`
14. `GET /api/analytics/journeys?period={period}`
15. `GET /api/analytics/visitor-intent?period={period}`

### **Total Active APIs: 15**

---

## 🔧 **API Integration Status**

| API Endpoint | Status | Trigger | UI Element |
|-------------|--------|---------|------------|
| `/api/analytics/modules` | ✅ Integrated | Page load | Module tabs |
| `/api/analytics/periods` | ✅ Integrated | Page load | Period buttons |
| `/api/analytics/dashboard` | ✅ Integrated | Page load + period change | 12 metric cards |
| `/api/analytics/contacts` | ✅ Integrated | Contacts tab click | Module detail view |
| `/api/analytics/companies` | ✅ Integrated | Companies tab click | Module detail view |
| `/api/analytics/deals` | ✅ Integrated | Deals tab click | Module detail view |
| `/api/analytics/campaigns` | ✅ Integrated | Campaigns tab click | Module detail view |
| `/api/analytics/ads` | ✅ Integrated | Ads tab click | Module detail view |
| `/api/analytics/events` | ✅ Integrated | Events tab click | Module detail view |
| `/api/analytics/meetings` | ✅ Integrated | Meetings tab click | Module detail view |
| `/api/analytics/tasks` | ✅ Integrated | Tasks tab click | Module detail view |
| `/api/analytics/forecast` | ✅ Integrated | Forecast tab click | Module detail view |
| `/api/analytics/lead-scoring` | ✅ Integrated | Lead Scoring tab click | Module detail view |
| `/api/analytics/journeys` | ✅ Integrated | Journeys tab click | Module detail view |
| `/api/analytics/visitor-intent` | ✅ Integrated | Visitor Intent tab click | Module detail view |

---

## 📝 **Future API Integrations** (Not Yet Implemented in UI)

These APIs are defined in `api.js` but not yet wired to UI:

| API Endpoint | Purpose | UI Needed |
|-------------|---------|-----------|
| `/api/analytics/export` | Export data as CSV/JSON | Export button |
| `/api/analytics/reports` | Generate PDF reports | Generate Report button |
| `/api/analytics/schedule-report` | Schedule recurring reports | Schedule modal |
| `/api/analytics/scheduled-reports` | List scheduled reports | Scheduled reports table |
| `/api/analytics/scheduled-reports/{id}` (DELETE) | Delete scheduled report | Delete button in table |
| `/api/tracking/intent` | Visitor intent tracking data | Visitor Intent tab (enhanced) |
| `/api/tracking/analytics` | Tracking analytics | Analytics visualization |
| `/api/tracking/actions` | User actions tracking | Action breakdown chart |
| `/api/tracking/intent-levels` | Intent level definitions | Intent filter |
| `/api/tracking/visitor-intent-analytics` | Detailed visitor analytics | Enhanced visitor view |

---

## 🎨 **UI to API Mapping**

```
Analytics Page (Analytics.vue)
│
├─ Header
│  ├─ "This Week" Button → GET /api/analytics/dashboard?period=week
│  ├─ "This Month" Button → GET /api/analytics/dashboard?period=month
│  ├─ "This Quarter" Button → GET /api/analytics/dashboard?period=quarter
│  └─ "This Year" Button → GET /api/analytics/dashboard?period=year
│
├─ Summary Grid (12 Cards)
│  └─ All cards use data from: GET /api/analytics/dashboard
│
└─ Module Tabs Section
   ├─ Tab: Contacts → GET /api/analytics/contacts
   ├─ Tab: Deals → GET /api/analytics/deals
   ├─ Tab: Campaigns → GET /api/analytics/campaigns
   ├─ Tab: Ads → GET /api/analytics/ads
   ├─ Tab: Events → GET /api/analytics/events
   ├─ Tab: Meetings → GET /api/analytics/meetings
   ├─ Tab: Tasks → GET /api/analytics/tasks
   ├─ Tab: Companies → GET /api/analytics/companies
   ├─ Tab: Forecast → GET /api/analytics/forecast
   ├─ Tab: Lead Scoring → GET /api/analytics/lead-scoring
   ├─ Tab: Journeys → GET /api/analytics/journeys
   └─ Tab: Visitor Intent → GET /api/analytics/visitor-intent
```

---

## ✅ **Integration Complete**

All 15 core Analytics APIs are now fully integrated and working! 🎉

- **Backend APIs**: All 15 endpoints created in `routes/api.php`
- **Frontend Service**: All endpoints integrated in `api.js` and `analytics.ts`
- **UI Components**: All existing UI elements properly wired to APIs
- **Error Handling**: Fallback data ensures no crashes
- **Loading States**: Spinners show during API calls
- **Period Filtering**: Works across all modules
- **Module Switching**: Smooth transitions between tabs

**No UI changes needed** - Everything already works! 🚀

