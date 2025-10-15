# SEO Module - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SEO Tools Module                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                      User Interface Layer                     │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │                                                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │ │
│  │  │              │  │              │  │              │      │ │
│  │  │  Dashboard   │  │    Pages     │  │    Page      │      │ │
│  │  │    View      │  │    View      │  │   Detail     │      │ │
│  │  │              │  │              │  │    View      │      │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │ │
│  │         │                 │                  │              │ │
│  │  ┌──────┴───────┐  ┌──────┴───────┐                        │ │
│  │  │              │  │              │                        │ │
│  │  │Recommendations│  │   Settings   │                        │ │
│  │  │     View     │  │     View     │                        │ │
│  │  │              │  │              │                        │ │
│  │  └──────┬───────┘  └──────┬───────┘                        │ │
│  │         │                 │                                │ │
│  └─────────┼─────────────────┼────────────────────────────────┘ │
│            │                 │                                  │
│  ┌─────────┼─────────────────┼────────────────────────────────┐ │
│  │         │   State Layer   │                                │ │
│  ├─────────┼─────────────────┼────────────────────────────────┤ │
│  │         │                 │                                │ │
│  │    ┌────▼────┐       ┌────▼────┐       ┌──────────┐       │ │
│  │    │         │       │         │       │          │       │ │
│  │    │ Metrics │       │  Pages  │       │  Recom-  │       │ │
│  │    │  Store  │       │  Store  │       │mendations│       │ │
│  │    │         │       │         │       │  Store   │       │ │
│  │    └────┬────┘       └────┬────┘       └────┬─────┘       │ │
│  │         │                 │                 │             │ │
│  └─────────┼─────────────────┼─────────────────┼─────────────┘ │
│            │                 │                 │               │
│  ┌─────────┼─────────────────┼─────────────────┼─────────────┐ │
│  │         │  Service Layer  │                 │             │ │
│  ├─────────┼─────────────────┼─────────────────┼─────────────┤ │
│  │         │                 │                 │             │ │
│  │         └─────────────────┴─────────────────┘             │ │
│  │                           │                               │ │
│  │                    ┌──────▼──────┐                        │ │
│  │                    │             │                        │ │
│  │                    │ SEO Service │                        │ │
│  │                    │  (seo.ts)   │                        │ │
│  │                    │             │                        │ │
│  │                    └──────┬──────┘                        │ │
│  │                           │                               │ │
│  └───────────────────────────┼───────────────────────────────┘ │
│                              │                                 │
└──────────────────────────────┼─────────────────────────────────┘
                               │
                               │ HTTP/HTTPS
                               │
┌──────────────────────────────▼─────────────────────────────────┐
│                        Backend API                             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  /api/seo/metrics              → Get metrics                  │
│  /api/seo/pages                → List pages                   │
│  /api/seo/pages/:id/metrics    → Page details                 │
│  /api/seo/pages/:id/scan       → Scan page                    │
│  /api/seo/recommendations      → List recommendations         │
│  /api/seo/recommendations/:id/resolve → Resolve               │
│  /api/seo/connect              → Connect GSC                  │
│  /api/seo/disconnect           → Disconnect GSC               │
│  /api/seo/connection-status    → Check status                 │
│  /api/seo/scan                 → Full site scan               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                               │
                               │
┌──────────────────────────────▼─────────────────────────────────┐
│                  External Services & Database                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────┐    ┌─────────────────┐                 │
│  │                  │    │                 │                 │
│  │  Google Search   │    │    Database     │                 │
│  │    Console API   │    │   (MySQL/PG)    │                 │
│  │                  │    │                 │                 │
│  └──────────────────┘    └─────────────────┘                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
SeoLayout (Layout wrapper with navigation tabs)
│
├── DashboardView (/)
│   ├── MetricCards (4x)
│   ├── LineChart (Impressions & Clicks)
│   ├── ScatterChart (CTR vs Position)
│   └── QuickLinks
│
├── PagesView (/pages)
│   ├── SearchBar
│   ├── RefreshButton
│   └── DataTable
│       └── TableRow (clickable → navigate to PageDetail)
│
├── PageDetailView (/pages/:id)
│   ├── BackButton
│   ├── MetricCards (4x)
│   ├── PerformanceChart
│   ├── TopQueriesTable
│   ├── RecommendationsList
│   └── RescanButton
│
├── RecommendationsView (/recommendations)
│   ├── FilterPanel
│   │   ├── SeverityFilter
│   │   ├── StatusFilter
│   │   └── TypeFilter
│   ├── BulkSelectionBar
│   └── RecommendationCards
│       ├── SeverityBadge
│       ├── TypeBadge
│       ├── ExpandableDetails
│       └── ActionButtons
│
└── SettingsView (/settings)
    ├── GSCConnectionCard
    │   ├── ConnectionStatus
    │   ├── ConnectButton
    │   ├── SyncButton
    │   └── DisconnectButton
    ├── SiteScanCard
    │   ├── LastScanInfo
    │   └── StartScanButton
    └── DisconnectModal
```

## Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                      User Interaction                          │
└────────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                    Component Event Handler                     │
│  Example: @click="resolveRecommendation(id)"                  │
└────────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                       Store Action                             │
│  recommendationsStore.resolveRecommendation(id)                │
└────────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                      API Service Call                          │
│  seoService.resolveRecommendation(id)                          │
└────────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                      HTTP Request                              │
│  POST /api/seo/recommendations/:id/resolve                     │
└────────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                     Backend Processing                         │
│  - Validate request                                            │
│  - Update database                                             │
│  - Return response                                             │
└────────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                    Response Received                           │
│  { success: true, message: "Resolved" }                        │
└────────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                    Update Store State                          │
│  recommendation.status = 'resolved'                            │
│  recommendation.resolvedAt = new Date()                        │
└────────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                    Component Re-renders                        │
│  - Badge updates                                               │
│  - UI reflects new status                                      │
│  - Success notification shown                                  │
└────────────────────────────────────────────────────────────────┘
```

## Store Dependencies

```
┌──────────────────┐
│  seoMetrics.ts   │
│                  │
│  State:          │
│  - metrics       │
│  - chartData     │
│  - loading       │
│  - error         │
│                  │
│  Actions:        │
│  - fetchMetrics  │
│  - refreshMetrics│
└──────────────────┘

┌──────────────────┐
│   seoPages.ts    │
│                  │
│  State:          │
│  - pages         │
│  - currentPage   │
│  - searchQuery   │
│  - sortBy        │
│  - sortOrder     │
│                  │
│  Computed:       │
│  - filteredPages │
│                  │
│  Actions:        │
│  - fetchPages    │
│  - fetchPageMet. │
│  - rescanPage    │
│  - setSortBy     │
└──────────────────┘

┌────────────────────┐
│seoRecommendations.ts│
│                    │
│  State:            │
│  - recommendations │
│  - selectedIds     │
│  - severityFilter  │
│  - statusFilter    │
│  - typeFilter      │
│                    │
│  Computed:         │
│  - filteredRecom.. │
│  - openCount       │
│  - criticalCount   │
│                    │
│  Actions:          │
│  - fetchRecom..    │
│  - resolveRecom..  │
│  - bulkResolve     │
│  - toggleSelection │
│  - selectAll       │
│  - clearSelection  │
└────────────────────┘
```

## Routing Structure

```
/marketing/seo  (SeoLayout)
│
├── ""  (Index - DashboardView)
│   Route Name: SeoDashboard
│   Component: DashboardView.vue
│
├── "pages"  (PagesView)
│   Route Name: SeoPages
│   Component: PagesView.vue
│
├── "pages/:id"  (PageDetailView)
│   Route Name: SeoPageDetail
│   Component: PageDetailView.vue
│   Params: { id: number }
│
├── "recommendations"  (RecommendationsView)
│   Route Name: SeoRecommendations
│   Component: RecommendationsView.vue
│
└── "settings"  (SettingsView)
    Route Name: SeoSettings
    Component: SettingsView.vue

Legacy Redirect:
/marketing/seo-tools → /marketing/seo
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Stack                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Framework:       Vue 3 (Composition API)                  │
│  Language:        TypeScript                               │
│  State:           Pinia                                    │
│  Routing:         Vue Router                               │
│  Styling:         Tailwind CSS                             │
│  Charts:          Chart.js                                 │
│  HTTP:            Axios                                    │
│  Build:           Vite                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     Backend Stack                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Framework:       (Your choice - Laravel recommended)      │
│  Database:        MySQL / PostgreSQL                       │
│  API:             RESTful                                  │
│  Auth:            JWT Bearer Token                         │
│  OAuth:           Google OAuth 2.0                         │
│  Queue:           (For background jobs)                    │
│  Cache:           Redis (optional)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## File Size & Complexity

```
Component                Lines    Complexity   Purpose
─────────────────────────────────────────────────────────────
SeoLayout.vue            ~200     Low          Navigation wrapper
DashboardView.vue        ~400     Medium       Main dashboard
PagesView.vue            ~250     Low          Pages table
PageDetailView.vue       ~450     Medium       Page analysis
RecommendationsView.vue  ~600     High         Recommendations
SettingsView.vue         ~350     Medium       Configuration

seoMetrics.ts            ~80      Low          Metrics store
seoPages.ts              ~120     Medium       Pages store
seoRecommendations.ts    ~150     Medium       Recommendations store

seo.ts (service)         ~200     Low          API integration
─────────────────────────────────────────────────────────────
TOTAL                    ~2,800   Lines of Code
```

## Feature Matrix

```
Feature                  Dashboard  Pages  PageDetail  Recom  Settings
────────────────────────────────────────────────────────────────────
Metrics Display             ✅        ✅       ✅       ❌       ❌
Charts                      ✅        ❌       ✅       ❌       ❌
Search/Filter               ❌        ✅       ❌       ✅       ❌
Sorting                     ❌        ✅       ❌       ❌       ❌
Bulk Actions                ❌        ❌       ❌       ✅       ❌
OAuth Integration           ❌        ❌       ❌       ❌       ✅
Site Scanning               ❌        ❌       ✅       ❌       ✅
Recommendations Display     ❌        ❌       ✅       ✅       ❌
Quick Links                 ✅        ❌       ❌       ❌       ❌
Loading States              ✅        ✅       ✅       ✅       ✅
Empty States                ✅        ✅       ✅       ✅       ✅
Error Handling              ✅        ✅       ✅       ✅       ✅
Toast Notifications         ✅        ✅       ✅       ✅       ✅
Responsive Design           ✅        ✅       ✅       ✅       ✅
```

## Dependencies Graph

```
DashboardView
├── useSeoMetricsStore
├── useSeoRecommendationsStore
└── Chart.js

PagesView
└── useSeoPagesStore

PageDetailView
├── useSeoPagesStore
├── useSeoRecommendationsStore
└── Chart.js

RecommendationsView
└── useSeoRecommendationsStore

SettingsView
└── seoService (direct API calls)

All Stores
└── seoService
    └── api (axios instance)
```

## Performance Considerations

```
Optimization                Status    Implementation
──────────────────────────────────────────────────────────
Lazy Loading Routes         ✅        Dynamic imports in router
Computed Properties         ✅        Used for filtering/sorting
Code Splitting              ✅        Per-view components
Store Modularity            ✅        Separate stores by domain
API Request Caching         ⏳        Can be added (optional)
Chart Cleanup               ✅        Destroy on unmount
Debounced Search            ⏳        Can be added (optional)
Virtual Scrolling           ⏳        For large lists (optional)
```

## Security Measures

```
Security Layer              Implementation
────────────────────────────────────────────────
Authentication              ✅ JWT Bearer Token
Authorization               ✅ Route guards
Input Validation            ⏳ Backend responsibility
XSS Protection              ✅ Vue sanitizes by default
CSRF Protection             ⏳ Backend responsibility
Rate Limiting               ⏳ Backend responsibility
OAuth Token Encryption      ⏳ Backend responsibility
HTTPS                       ⏳ Infrastructure level
```

---

## Legend

- ✅ = Implemented
- ⏳ = Pending/Backend/Optional
- ❌ = Not applicable

---

*This architecture supports scalability, maintainability, and follows Vue 3 best practices.*



