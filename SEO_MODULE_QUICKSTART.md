# SEO Module - Quick Start Guide

## For Frontend Developers

### Getting Started

1. **Navigate to the SEO module**:
   ```
   http://localhost:5173/marketing/seo
   ```

2. **Available routes**:
   - `/marketing/seo` - Dashboard (default)
   - `/marketing/seo/pages` - Pages list
   - `/marketing/seo/pages/:id` - Page details
   - `/marketing/seo/recommendations` - Recommendations
   - `/marketing/seo/settings` - Settings

### Using the Stores

#### Get Metrics Data
```vue
<script setup>
import { onMounted } from 'vue'
import { useSeoMetricsStore } from '@/stores/seoMetrics'

const metricsStore = useSeoMetricsStore()

onMounted(async () => {
  await metricsStore.fetchMetrics(30) // Last 30 days
})
</script>

<template>
  <div>
    <p>Total Clicks: {{ metricsStore.metrics.totalClicks }}</p>
    <p>Total Impressions: {{ metricsStore.metrics.totalImpressions }}</p>
  </div>
</template>
```

#### Get Pages Data
```vue
<script setup>
import { onMounted } from 'vue'
import { useSeoPagesStore } from '@/stores/seoPages'

const pagesStore = useSeoPagesStore()

onMounted(async () => {
  await pagesStore.fetchPages()
})
</script>

<template>
  <div>
    <input v-model="pagesStore.searchQuery" placeholder="Search pages..." />
    <div v-for="page in pagesStore.filteredPages" :key="page.id">
      {{ page.url }}
    </div>
  </div>
</template>
```

#### Get Recommendations
```vue
<script setup>
import { onMounted } from 'vue'
import { useSeoRecommendationsStore } from '@/stores/seoRecommendations'

const recommendationsStore = useSeoRecommendationsStore()

onMounted(async () => {
  await recommendationsStore.fetchRecommendations()
})

const resolveRecommendation = async (id) => {
  await recommendationsStore.resolveRecommendation(id)
}
</script>

<template>
  <div>
    <!-- Filters -->
    <select v-model="recommendationsStore.severityFilter">
      <option value="all">All Severities</option>
      <option value="critical">Critical</option>
      <option value="high">High</option>
    </select>

    <!-- Recommendations List -->
    <div v-for="rec in recommendationsStore.filteredRecommendations" :key="rec.id">
      <h3>{{ rec.title }}</h3>
      <button @click="resolveRecommendation(rec.id)">Resolve</button>
    </div>
  </div>
</template>
```

### API Service Usage

```javascript
import { seoService } from '@/services/seo'

// Get metrics
const metrics = await seoService.getMetrics(30)

// Get pages
const pages = await seoService.getPages()

// Get page metrics
const pageMetrics = await seoService.getPageMetrics(1)

// Scan page
await seoService.scanPage(1)

// Get recommendations
const recommendations = await seoService.getRecommendations()

// Resolve recommendation
await seoService.resolveRecommendation(1)

// Connect GSC
const { authUrl } = await seoService.connectGSC()
window.location.href = authUrl

// Full site scan
await seoService.fullSiteScan()
```

### Creating Charts

```vue
<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useSeoMetricsStore } from '@/stores/seoMetrics'
import Chart from 'chart.js/auto'

const metricsStore = useSeoMetricsStore()
const chartCanvas = ref(null)
let chart = null

const createChart = () => {
  if (!chartCanvas.value || metricsStore.chartData.length === 0) return

  if (chart) chart.destroy()

  const ctx = chartCanvas.value.getContext('2d')
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: metricsStore.chartData.map(d => d.date),
      datasets: [{
        label: 'Impressions',
        data: metricsStore.chartData.map(d => d.impressions),
        borderColor: 'rgb(59, 130, 246)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
}

watch(() => metricsStore.chartData, async () => {
  await nextTick()
  createChart()
}, { deep: true })

onMounted(async () => {
  await metricsStore.fetchMetrics(30)
  await nextTick()
  createChart()
})
</script>

<template>
  <div class="h-64">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>
```

## For Backend Developers

### Minimum Required Endpoints

1. **GET /api/seo/metrics?days=30**
   - Returns: `{ summary, chartData }`

2. **GET /api/seo/pages**
   - Returns: Array of pages with metrics

3. **GET /api/seo/pages/:id/metrics**
   - Returns: Page details with chart data and top queries

4. **GET /api/seo/recommendations**
   - Returns: Array of recommendations

5. **POST /api/seo/recommendations/:id/resolve**
   - Marks recommendation as resolved

6. **POST /api/seo/connect**
   - Initiates GSC OAuth flow
   - Returns: `{ authUrl }`

7. **GET /api/seo/connection-status**
   - Returns: Connection status and last sync info

8. **POST /api/seo/scan**
   - Starts full site scan

### Sample Mock Data

For testing, you can use this mock data structure:

```javascript
// Metrics
{
  "summary": {
    "totalImpressions": 45678,
    "totalClicks": 1234,
    "avgCTR": 0.027,
    "avgPosition": 8.4,
    "lastSynced": "2024-01-15T10:30:00Z"
  },
  "chartData": [
    {
      "date": "2024-01-01",
      "impressions": 1200,
      "clicks": 45,
      "ctr": 0.0375,
      "position": 8.2
    }
  ]
}

// Pages
[
  {
    "id": 1,
    "url": "/features/crm",
    "title": "CRM Features",
    "impressions": 8234,
    "clicks": 456,
    "ctr": 0.055,
    "avgPosition": 4.2,
    "recommendationsCount": 3,
    "lastScanned": "2024-01-15T08:00:00Z"
  }
]

// Recommendations
[
  {
    "id": 1,
    "pageId": 1,
    "pageUrl": "/product-page",
    "type": "title",
    "severity": "high",
    "status": "open",
    "title": "Improve title tag",
    "description": "Title is too short",
    "impact": "Could increase CTR by 50%",
    "howToFix": "Add keywords and benefits",
    "createdAt": "2024-01-10T12:00:00Z",
    "resolvedAt": null
  }
]
```

## Common Tasks

### Adding a New View

1. Create component in `src/views/marketing/seo/`
2. Add route to `src/router.js` under `/marketing/seo` children
3. Add navigation link in `SeoLayout.vue`
4. Create or use existing store for data management

### Adding a New Filter

1. Add filter state to store:
```typescript
const myFilter = ref<string>('all')
```

2. Update computed filtered data:
```typescript
const filteredData = computed(() => {
  let filtered = [...data.value]
  if (myFilter.value !== 'all') {
    filtered = filtered.filter(item => item.field === myFilter.value)
  }
  return filtered
})
```

3. Add UI control:
```vue
<select v-model="store.myFilter">
  <option value="all">All</option>
  <option value="option1">Option 1</option>
</select>
```

### Adding a New Metric Card

```vue
<div class="bg-white overflow-hidden shadow rounded-lg">
  <div class="p-5">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
          <!-- Icon SVG -->
        </div>
      </div>
      <div class="ml-5 w-0 flex-1">
        <dl>
          <dt class="text-sm font-medium text-gray-500 truncate">
            Metric Name
          </dt>
          <dd class="text-2xl font-semibold text-gray-900">
            {{ metricValue }}
          </dd>
        </dl>
      </div>
    </div>
  </div>
</div>
```

## Testing

### Manual Testing Checklist

- [ ] Navigate to all routes
- [ ] Test search functionality
- [ ] Test sorting in tables
- [ ] Test filters
- [ ] Test bulk actions
- [ ] Test API error handling
- [ ] Test loading states
- [ ] Test empty states
- [ ] Check responsive design on mobile
- [ ] Verify charts render correctly

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Charts Not Rendering
- Ensure Chart.js is imported: `import Chart from 'chart.js/auto'`
- Check canvas ref is properly set
- Verify data is loaded before chart creation
- Use `nextTick()` before creating chart

### Store Data Not Updating
- Check if action is being called
- Verify API endpoint is correct
- Check for errors in console
- Ensure store is imported and initialized

### Routes Not Working
- Check router.js configuration
- Verify component import paths
- Check meta.requiresAuth setting
- Clear browser cache

### Styling Issues
- Run `npm run dev` to rebuild
- Check Tailwind classes are correct
- Verify responsive breakpoints
- Check for CSS conflicts

## Useful Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint
```

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Getting Help

- Check implementation docs: `SEO_MODULE_IMPLEMENTATION.md`
- Check API spec: `SEO_API_SPECIFICATION.md`
- Search existing issues
- Ask in team Slack channel
- Create detailed bug report with steps to reproduce

## Tips & Best Practices

1. **Always handle loading states**:
```vue
<div v-if="loading">Loading...</div>
<div v-else-if="error">Error: {{ error }}</div>
<div v-else>{{ data }}</div>
```

2. **Use try-catch for async operations**:
```javascript
try {
  await store.fetchData()
  showSuccess('Data loaded')
} catch (error) {
  showError('Failed to load data')
}
```

3. **Provide feedback for user actions**:
```javascript
showSuccess('Recommendation resolved')
showError('Failed to resolve recommendation')
```

4. **Clean up on unmount**:
```javascript
onUnmounted(() => {
  if (chart) chart.destroy()
})
```

5. **Use computed properties for derived data**:
```javascript
const sortedData = computed(() => 
  [...data.value].sort((a, b) => a.value - b.value)
)
```

## Next Steps

1. Review the implementation documentation
2. Set up your development environment
3. Test all features locally
4. Review API specification with backend team
5. Start implementing additional features

Happy coding! 🚀



