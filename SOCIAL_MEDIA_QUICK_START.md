# Social Media Module - Quick Start Guide

## ✅ What's Been Built

A complete **Social Media Management Tool** inside the **Marketing Module** with:

### ✨ Features
1. **Post Scheduling & Publishing** - Create, edit, schedule posts across platforms
2. **Account Management** - Connect/disconnect Facebook, Instagram, Twitter, LinkedIn
3. **Analytics Dashboard** - Track performance with Chart.js visualizations
4. **Social Listening** - Monitor mentions, keywords, and sentiment analysis

### 📦 Files Created

```
✅ src/stores/socialMedia.ts              - Pinia store for state management
✅ src/components/social/
   ├── AccountsManager.vue                - Connect social accounts
   ├── PostComposer.vue                   - Create/edit posts modal
   ├── SocialAnalytics.vue                - Analytics with charts
   └── SocialListening.vue                - Mentions & listening
✅ src/views/marketing/SocialMedia.vue    - Main view (updated)
✅ src/services/socialMedia.ts            - API service (enhanced)
```

### 🔗 Route
Already configured: `/marketing/social-media`

---

## 🚀 Quick Setup (5 Minutes)

### 1. Environment Variables

Add to your `.env` file (create if doesn't exist):

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Note**: `.env` file is gitignored. For production, set actual backend URL.

### 2. Install Dependencies (if needed)

```bash
npm install
```

Dependencies already in `package.json`:
- ✅ chart.js (v4.5.0)
- ✅ pinia (v2.3.1)
- ✅ axios (v1.12.2)

### 3. Run the Application

```bash
npm run dev
```

Navigate to: **http://localhost:5173/marketing/social-media**

---

## 🎯 How to Use

### Access the Module
1. Login to your application
2. Navigate to **Marketing → Social Media**
3. You'll see 5 tabs:
   - **Overview** - Dashboard summary
   - **Connected Accounts** - Manage social accounts
   - **Posts** - View/create/edit posts
   - **Analytics** - Performance metrics
   - **Social Listening** - Monitor mentions

### Create Your First Post
1. Click **"Create Post"** button (top right)
2. Select a platform (Facebook, Instagram, Twitter, LinkedIn)
3. Enter title and content
4. Add hashtags and media (optional)
5. Choose:
   - **Publish Now** - Immediate publishing
   - **Schedule** - Pick date/time
   - **Save as Draft** - Save for later

### Connect Social Accounts
1. Go to **"Connected Accounts"** tab
2. Click **"Connect Account"** button
3. Select platform (Facebook, Instagram, etc.)
4. In production, this redirects to OAuth flow
5. In demo mode, simulates connection

### View Analytics
1. Go to **"Analytics"** tab
2. See platform performance, engagement rates
3. Interactive charts showing likes, comments, shares
4. Filter by time period (7d, 30d, 90d, 1y)

### Monitor Social Mentions
1. Go to **"Social Listening"** tab
2. Enter keywords to monitor (comma-separated)
3. Filter by platform and sentiment
4. View real-time mentions with engagement metrics

---

## 🔌 Backend API Integration

### Required Endpoints

The frontend calls these Laravel API endpoints:

#### Account Management
```
POST   /api/social/connect/{platform}
POST   /api/social/disconnect/{platform}
GET    /api/social/accounts
```

#### Posts
```
GET    /api/social-media/posts
POST   /api/social-media/posts
PUT    /api/social-media/posts/{id}
DELETE /api/social-media/posts/{id}
POST   /api/social-media/posts/{id}/publish
```

#### Analytics
```
GET    /api/social-media/analytics
GET    /api/social-media/dashboard
```

#### Listening
```
GET    /api/social-media/listening
```

### Demo Mode (No Backend Required!)

**The app works WITHOUT backend!** It uses fallback demo data:
- ✅ Mock posts with engagement metrics
- ✅ Simulated analytics charts
- ✅ Sample social mentions
- ✅ Demo connected accounts

When backend is available, it automatically switches to real data.

---

## 🎨 UI Highlights

### Modern Design
- Clean, responsive interface
- Tailwind CSS styling
- Platform-specific colors
- Smooth transitions & hover effects

### Interactive Components
- **Drag & drop** for media upload
- **Real-time** character counting
- **Auto-save** draft functionality
- **Modal dialogs** for post creation

### Charts & Visualizations
- Line charts for engagement trends
- Progress bars for sentiment analysis
- Stat cards with icons
- Platform performance breakdown

---

## 📱 Responsive Design

✅ **Mobile** (< 768px)
- Single column layout
- Stacked cards
- Touch-friendly buttons

✅ **Tablet** (768px - 1024px)
- 2-column grid
- Optimized spacing

✅ **Desktop** (> 1024px)
- 3-4 column grid
- Full dashboard view

---

## 🔐 Authentication

Uses existing JWT authentication:
- Token stored in `localStorage`
- Auto-included in API headers
- Redirects to `/login` on 401

```javascript
// Handled automatically by src/services/api.js
Authorization: Bearer <token>
```

---

## ⚙️ Configuration Options

### Character Limits (per platform)
- **Twitter**: 280 characters
- **Instagram**: 2,200 characters
- **LinkedIn**: 3,000 characters
- **Facebook**: 63,206 characters

### Media Upload
- **Max size**: 10MB
- **Allowed types**: JPG, PNG, GIF, MP4

### Refresh Intervals
- Analytics: On-demand
- Dashboard stats: On page load
- Social listening: Manual refresh

---

## 🐛 Troubleshooting

### Issue: Page shows "loading..."
**Fix**: Check if backend API is running or demo mode is active

### Issue: Can't create posts
**Fix**: Make sure you're logged in (JWT token exists)

### Issue: Charts not displaying
**Fix**: Chart.js is already installed, check browser console

### Issue: 404 on route
**Fix**: Route `/marketing/social-media` is already configured in `src/router.js`

---

## 📖 Key Files to Know

### 1. Main View
`src/views/marketing/SocialMedia.vue`
- Tabs navigation
- Dashboard stats
- Integrates all components

### 2. Store
`src/stores/socialMedia.ts`
- State: posts, dashboard, connectedAccounts
- Actions: fetchPosts, createPost, publishPost, etc.

### 3. Service
`src/services/socialMedia.ts`
- API calls with fallback data
- Account connection methods
- Analytics fetching

### 4. Components
All in `src/components/social/`:
- `AccountsManager.vue` - Social account cards
- `PostComposer.vue` - Post creation modal
- `SocialAnalytics.vue` - Charts and metrics
- `SocialListening.vue` - Mentions feed

---

## 🚀 Next Steps

### Enhance the Module
1. **Add more platforms**: TikTok, YouTube, Pinterest
2. **Bulk scheduling**: Upload CSV to schedule multiple posts
3. **Content calendar**: Drag-and-drop calendar view
4. **AI suggestions**: Content recommendations
5. **Team collaboration**: Assign posts to team members

### Backend Implementation
1. Create Laravel controllers for endpoints
2. Set up OAuth for social platforms
3. Implement webhooks for real-time updates
4. Add queue jobs for scheduled publishing

---

## 💡 Tips

✅ **Use hashtags strategically** - Add relevant hashtags for better reach

✅ **Schedule posts** - Plan content ahead for consistency

✅ **Monitor sentiment** - Respond to negative mentions quickly

✅ **Track analytics** - Adjust strategy based on performance data

✅ **Connect multiple accounts** - Manage all platforms in one place

---

## 🤝 Support

For questions or issues:
1. Check `SOCIAL_MEDIA_MODULE_SETUP.md` for detailed docs
2. Review browser console for errors
3. Verify API endpoints in `.env`
4. Try demo mode to test functionality

---

## ✨ Features Checklist

- ✅ JWT Authentication
- ✅ Post creation with media upload
- ✅ Multi-platform support
- ✅ Schedule posts
- ✅ Publish immediately
- ✅ Save drafts
- ✅ Connect social accounts
- ✅ Analytics dashboard
- ✅ Performance charts
- ✅ Social listening
- ✅ Sentiment analysis
- ✅ Mention monitoring
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Success/error messages
- ✅ Demo mode (fallback data)

---

**Ready to manage your social media like a pro! 🎉**

Access now: `http://localhost:5173/marketing/social-media`

