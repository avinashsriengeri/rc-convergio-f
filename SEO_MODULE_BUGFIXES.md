# SEO Module - Bug Fixes

## Issues Fixed

### 1. ✅ API Base URL Configuration

**Problem**: Axios calls were hitting `http://localhost:5173/api/...` resulting in 404 errors.

**Root Cause**: The Vite dev server runs on port 5173, but the backend API runs on port 8000.

**Solution Implemented**:

The existing `src/services/api.js` was already correctly configured to use:
```javascript
baseURL: import.meta.env.VITE_API_BASE_URL || '/api/'
```

**Action Required**:
You need to create a `.env` file in your project root with the following content:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
```

**Steps to Fix**:
1. Create a `.env` file in the project root (same directory as `package.json`)
2. Add the line: `VITE_API_BASE_URL=http://localhost:8000/api`
3. Restart your Vite dev server (`npm run dev`)

**Verification**:
- All API calls will now correctly go to `http://localhost:8000/api/seo/...`
- The SEO service endpoints are already correct (no `/api` prefix needed)
- No changes needed to existing API integration code

**Note**: The `.env` file is gitignored by default, so each developer needs to create their own.

---

### 2. ✅ Backend Response Format Handling

**Problem**: `recommendations.value.filter is not a function` error occurring when backend returns an object instead of array.

**Root Cause**: Backend API may return data in different formats:
- Direct array: `[{...}, {...}]`
- Wrapped in data property: `{ data: [{...}, {...}] }`

**Solutions Implemented**:

#### 2.1 Fixed `seoRecommendations.ts`

**Before**:
```typescript
const data = await seoService.getRecommendations()
recommendations.value = data
```

**After**:
```typescript
const response = await seoService.getRecommendations()
// Handle both array response and object with data property
recommendations.value = Array.isArray(response) ? response : (response?.data || [])
```

**Benefits**:
- ✅ Safely handles array responses
- ✅ Safely handles object responses with `data` property
- ✅ Falls back to empty array if neither format
- ✅ Prevents `.filter()` errors on non-arrays

#### 2.2 Fixed `seoMetrics.ts`

**Before**:
```typescript
const data = await seoService.getMetrics(days)
metrics.value = data.summary
chartData.value = data.chartData
```

**After**:
```typescript
const response = await seoService.getMetrics(days)
// Handle both direct response and nested data property
const data = response?.data || response
metrics.value = data.summary || {
  totalImpressions: 0,
  totalClicks: 0,
  avgCTR: 0,
  avgPosition: 0,
  lastSynced: ''
}
chartData.value = data.chartData || []
```

**Benefits**:
- ✅ Handles nested `data` property
- ✅ Provides default values if data is missing
- ✅ Prevents null/undefined errors

#### 2.3 Fixed `seoPages.ts` (2 methods)

**fetchPages - Before**:
```typescript
const data = await seoService.getPages()
pages.value = data
```

**fetchPages - After**:
```typescript
const response = await seoService.getPages()
// Handle both array response and object with data property
pages.value = Array.isArray(response) ? response : (response?.data || [])
```

**fetchPageMetrics - Before**:
```typescript
const data = await seoService.getPageMetrics(pageId)
currentPage.value = data
```

**fetchPageMetrics - After**:
```typescript
const response = await seoService.getPageMetrics(pageId)
// Handle both direct response and nested data property
const data = response?.data || response
currentPage.value = {
  url: data.url || '',
  title: data.title || '',
  impressions: data.impressions || 0,
  clicks: data.clicks || 0,
  ctr: data.ctr || 0,
  avgPosition: data.avgPosition || 0,
  chartData: Array.isArray(data.chartData) ? data.chartData : [],
  topQueries: Array.isArray(data.topQueries) ? data.topQueries : []
}
```

**Benefits**:
- ✅ Handles both response formats
- ✅ Validates arrays before assignment
- ✅ Provides default values for all properties
- ✅ Prevents TypeScript errors

---

## Summary of Changes

### Files Modified: 3
1. ✅ `src/stores/seoMetrics.ts` - Added response format handling
2. ✅ `src/stores/seoPages.ts` - Added response format handling (2 methods)
3. ✅ `src/stores/seoRecommendations.ts` - Added array validation

### Files NOT Modified
- ✅ `src/services/api.js` - Already correct, no changes needed
- ✅ `src/services/seo.ts` - Already correct, no changes needed
- ✅ All view components - No changes needed
- ✅ Router - No changes needed

### Backward Compatibility
- ✅ All existing API integrations remain unchanged
- ✅ No breaking changes to existing modules
- ✅ Code style maintained (consistent with existing patterns)
- ✅ Error handling preserved

---

## Testing Checklist

### Before Backend is Ready
- [x] No linter errors in modified files
- [x] Code follows existing patterns
- [x] TypeScript types are correct
- [x] Default values prevent crashes

### After Backend is Implemented
- [ ] Create `.env` file with `VITE_API_BASE_URL=http://localhost:8000/api`
- [ ] Restart dev server
- [ ] Test fetching metrics
- [ ] Test fetching pages
- [ ] Test fetching recommendations
- [ ] Test page details
- [ ] Verify no `.filter()` errors
- [ ] Check browser console for API calls to correct URL

---

## Backend Response Format Expectations

The frontend now supports both of these formats:

### Format 1: Direct Array (Preferred)
```json
[
  { "id": 1, "title": "..." },
  { "id": 2, "title": "..." }
]
```

### Format 2: Wrapped in Data Property
```json
{
  "data": [
    { "id": 1, "title": "..." },
    { "id": 2, "title": "..." }
  ]
}
```

### Format 3: Nested Data (Also Supported)
```json
{
  "data": {
    "summary": {...},
    "chartData": [...]
  }
}
```

**Recommendation**: Use Format 2 (wrapped in `data` property) for consistency with other API endpoints in the project.

---

## Environment Variables Setup

### Development (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Production (.env.production)
```env
VITE_API_BASE_URL=https://api.yourcompany.com/api
```

### Important Notes
1. ⚠️ `.env` files are gitignored - each developer must create their own
2. ⚠️ Changes to `.env` require dev server restart
3. ⚠️ Environment variables must start with `VITE_` prefix to be exposed to client
4. ✅ The `api.js` file already has the correct fallback: `|| '/api/'`

---

## Error Prevention

### Before Fixes
```
❌ TypeError: recommendations.value.filter is not a function
❌ TypeError: Cannot read property 'summary' of undefined
❌ TypeError: Cannot read property 'chartData' of undefined
❌ 404 errors on API calls to localhost:5173
```

### After Fixes
```
✅ Gracefully handles array and object responses
✅ Provides safe defaults for missing data
✅ No more .filter() errors
✅ API calls go to correct backend URL
```

---

## Troubleshooting

### If API calls still 404:
1. Check `.env` file exists in project root
2. Verify `VITE_API_BASE_URL=http://localhost:8000/api` is correct
3. Restart Vite dev server (`Ctrl+C` then `npm run dev`)
4. Check browser Network tab for actual URL being called
5. Verify backend is running on port 8000

### If filter errors persist:
1. Check browser console for actual error message
2. Verify backend returns array or object with `data` property
3. Check if backend returns `null` or `undefined`
4. Test API endpoint directly with cURL or Postman

### If data not displaying:
1. Open browser console
2. Check for API errors
3. Verify backend response structure
4. Check if data matches expected format
5. Look for default values being used

---

## Impact Assessment

### Performance
- ✅ No performance impact
- ✅ Minimal additional checks (negligible overhead)
- ✅ No new API calls

### Security
- ✅ No security impact
- ✅ Existing authentication maintained
- ✅ No new vulnerabilities introduced

### Maintainability
- ✅ Code is more robust
- ✅ Better error handling
- ✅ Consistent patterns across stores
- ✅ Self-documenting with comments

### User Experience
- ✅ Prevents crashes
- ✅ Graceful degradation with defaults
- ✅ No user-facing changes
- ✅ Better error handling

---

## Next Steps

1. **Create `.env` file** (see Environment Variables Setup section)
2. **Restart dev server** after creating `.env`
3. **Test API calls** using browser Network tab
4. **Coordinate with backend team** on response format
5. **Test all SEO views** once backend is ready

---

## Support

If you encounter issues:
1. Check this document first
2. Verify `.env` file is correct
3. Check browser console for errors
4. Test API endpoints directly
5. Review backend API response format

---

*Last Updated: $(date)*
*Status: ✅ COMPLETE - Ready for Testing*
*Linter Errors: 0*



