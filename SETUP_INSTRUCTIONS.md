# SEO Module - Quick Setup Instructions

## 🚀 Quick Start

### Step 1: Create Environment File

Create a new file named `.env` in your project root (same directory as `package.json`):

```bash
# Windows
echo VITE_API_BASE_URL=http://localhost:8000/api > .env

# Mac/Linux
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env
```

**Or manually create `.env` file with this content:**
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Step 2: Restart Dev Server

Stop your current dev server (Ctrl+C) and restart it:

```bash
npm run dev
```

### Step 3: Verify Setup

1. Open your browser to `http://localhost:5173/marketing/seo`
2. Open browser DevTools (F12)
3. Go to Network tab
4. Refresh the page
5. Check that API calls go to `http://localhost:8000/api/seo/...` (not localhost:5173)

---

## ✅ What Was Fixed

### Issue 1: Wrong API URL
- **Before**: API calls went to `http://localhost:5173/api/...` ❌
- **After**: API calls go to `http://localhost:8000/api/...` ✅

### Issue 2: Backend Response Handling
- **Before**: Crashed if backend returned `{ data: [...] }` ❌
- **After**: Handles both array and object responses ✅

---

## 📋 Files Changed

Only 3 store files were modified - **no other modules affected**:

1. ✅ `src/stores/seoMetrics.ts`
2. ✅ `src/stores/seoPages.ts`
3. ✅ `src/stores/seoRecommendations.ts`

**What was NOT changed:**
- ❌ No changes to existing API integrations
- ❌ No changes to other modules
- ❌ No changes to routes
- ❌ No breaking changes

---

## 🔍 Troubleshooting

### Problem: Still getting 404 errors

**Solution:**
1. Make sure `.env` file exists in project root
2. Check that it contains: `VITE_API_BASE_URL=http://localhost:8000/api`
3. Restart your dev server
4. Clear browser cache
5. Verify backend is running on port 8000

### Problem: "filter is not a function" error

**Solution:**
This was fixed! If you still see it:
1. Make sure you pulled the latest changes
2. Check that stores were updated
3. Clear browser cache
4. Hard refresh (Ctrl+Shift+R)

### Problem: Data not displaying

**Solution:**
1. Check browser console for errors
2. Verify backend API is running
3. Test API endpoint directly: `http://localhost:8000/api/seo/metrics?days=30`
4. Check backend response format matches specification

---

## 🎯 Expected Behavior

### API Calls
```
GET http://localhost:8000/api/seo/metrics?days=30
GET http://localhost:8000/api/seo/pages
GET http://localhost:8000/api/seo/recommendations
POST http://localhost:8000/api/seo/recommendations/1/resolve
```

### Backend Response Formats (Both Supported)

**Option 1: Direct Array**
```json
[
  { "id": 1, "title": "Issue 1" },
  { "id": 2, "title": "Issue 2" }
]
```

**Option 2: Wrapped in Data**
```json
{
  "data": [
    { "id": 1, "title": "Issue 1" },
    { "id": 2, "title": "Issue 2" }
  ]
}
```

Both formats will work correctly! ✅

---

## 📝 Environment Variables

### Development (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Production (.env.production)
```env
VITE_API_BASE_URL=https://api.yourcompany.com/api
```

### Important Notes
- ⚠️ Environment variables must start with `VITE_` prefix
- ⚠️ Changes require dev server restart
- ⚠️ `.env` is gitignored (create your own copy)

---

## ✅ Testing Checklist

After setup:
- [ ] `.env` file created
- [ ] Dev server restarted
- [ ] Navigate to `/marketing/seo`
- [ ] Open browser DevTools → Network tab
- [ ] Check API calls go to `localhost:8000` (not 5173)
- [ ] No console errors
- [ ] Dashboard loads without crashes
- [ ] Can navigate between views

---

## 🆘 Need Help?

1. **Check logs**: Look at browser console (F12)
2. **Check network**: DevTools → Network tab
3. **Check backend**: Is it running on port 8000?
4. **Check env**: Does `.env` file exist with correct content?
5. **Restart**: Try restarting dev server

---

## 📚 Documentation

For more details:
- `SEO_MODULE_BUGFIXES.md` - Complete technical details of fixes
- `SEO_MODULE_IMPLEMENTATION.md` - Full implementation guide
- `SEO_API_SPECIFICATION.md` - Backend API requirements

---

**That's it! Your SEO module is now ready to connect to the backend API.** 🎉



