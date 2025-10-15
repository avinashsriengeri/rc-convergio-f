# Social Media Management Tool - Setup Guide

## 📋 Overview

A comprehensive Social Media Management Tool built with Vue.js 3 (Composition API) and integrated into the Marketing Module of RC Convergio. This tool enables users to manage social media presence across multiple platforms with scheduling, analytics, and listening capabilities.

## 🚀 Features

### 1. **Post Scheduling and Publishing**
- Create and edit posts for multiple platforms
- Schedule posts for future publishing
- Publish posts immediately
- Save posts as drafts
- Media upload support (images/videos)
- Platform-specific character limits
- Hashtag and mention support

### 2. **Social Media Account Management**
- Connect/disconnect social accounts:
  - Facebook
  - Instagram
  - X/Twitter
  - LinkedIn
- View connection status and follower counts
- OAuth integration ready

### 3. **Analytics Dashboard**
- Real-time performance tracking
- Platform-specific analytics
- Engagement metrics (likes, shares, comments, views)
- Interactive charts using Chart.js
- Time-period filtering (7d, 30d, 90d, 1y)
- Top performing posts
- Engagement rate calculation

### 4. **Social Listening / Mentions**
- Monitor brand mentions across platforms
- Keyword tracking
- Sentiment analysis (Positive, Negative, Neutral)
- Real-time mention feed
- Engagement metrics per mention
- Platform-specific filtering

## 📁 Project Structure

```
src/
├── components/
│   └── social/
│       ├── AccountsManager.vue      # Account connection management
│       ├── PostComposer.vue         # Post creation/editing modal
│       ├── SocialAnalytics.vue      # Analytics dashboard with charts
│       └── SocialListening.vue      # Social listening & mentions
├── views/
│   └── marketing/
│       └── SocialMedia.vue          # Main social media view
├── services/
│   └── socialMedia.ts               # API service layer
├── stores/
│   └── socialMedia.ts               # Pinia state management
└── router.js                        # Route configuration
```

## 🛠️ Installation & Setup

### 1. Install Dependencies

The required dependencies are already included in `package.json`:
- `chart.js`: ^4.5.0 (for analytics charts)
- `pinia`: ^2.3.1 (state management)
- `axios`: ^1.12.2 (HTTP client)

If you need to reinstall:
```bash
npm install
```

### 2. Environment Configuration

Create or update your `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Social Media API Base URL
VITE_SOCIAL_API_BASE_URL=http://localhost:8000/api/social

# App Configuration
VITE_APP_NAME=RC Convergio
VITE_APP_ENV=development

# Feature Flags
VITE_ENABLE_SOCIAL_MEDIA=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SOCIAL_LISTENING=true

# OAuth Configuration (for social platform connections)
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_INSTAGRAM_APP_ID=your_instagram_app_id
VITE_TWITTER_API_KEY=your_twitter_api_key
VITE_LINKEDIN_CLIENT_ID=your_linkedin_client_id

# Upload Configuration
VITE_MAX_UPLOAD_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,video/mp4

# Debug Mode
VITE_DEBUG=false
```

### 3. Backend API Endpoints

The frontend expects the following Laravel API endpoints:

#### Authentication (Already Implemented)
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/user/profile
PUT    /api/user/profile
```

#### Social Media Account Management
```
POST   /api/social/connect/{platform}           # Initiate OAuth connection
POST   /api/social/disconnect/{platform}        # Disconnect account
GET    /api/social/accounts                     # Get all connected accounts
GET    /api/social/accounts/{platform}/status   # Check account status
```

#### Posts Management
```
GET    /api/social-media/posts                  # List posts (with filters)
POST   /api/social-media/posts                  # Create post
GET    /api/social-media/posts/{id}            # Get single post
PUT    /api/social-media/posts/{id}            # Update post
DELETE /api/social-media/posts/{id}            # Delete post
POST   /api/social-media/posts/{id}/publish    # Publish post immediately
POST   /api/social-media/posts/{id}/schedule   # Schedule post
```

#### Analytics
```
GET    /api/social-media/analytics              # Get analytics data
GET    /api/social-media/dashboard              # Get dashboard stats
```

#### Social Listening
```
GET    /api/social-media/listening              # Get mentions/keywords
```

### 4. Database Schema (Laravel Backend)

You'll need these database tables:

#### social_media_posts
```sql
CREATE TABLE social_media_posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    campaign_id BIGINT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    platform ENUM('facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok') NOT NULL,
    status ENUM('draft', 'scheduled', 'published', 'failed') DEFAULT 'draft',
    scheduled_at TIMESTAMP NULL,
    published_at TIMESTAMP NULL,
    media_urls JSON NULL,
    hashtags JSON NULL,
    mentions JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### social_media_analytics
```sql
CREATE TABLE social_media_analytics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    social_media_post_id BIGINT UNSIGNED NOT NULL,
    platform VARCHAR(50) NOT NULL,
    metric_type ENUM('likes', 'shares', 'comments', 'views', 'clicks', 'impressions', 'reach', 'engagement_rate') NOT NULL,
    metric_value INT NOT NULL DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    meta_data JSON NULL,
    FOREIGN KEY (social_media_post_id) REFERENCES social_media_posts(id) ON DELETE CASCADE
);
```

#### social_media_accounts
```sql
CREATE TABLE social_media_accounts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    platform VARCHAR(50) NOT NULL,
    username VARCHAR(255) NOT NULL,
    access_token TEXT NULL,
    refresh_token TEXT NULL,
    token_expires_at TIMESTAMP NULL,
    profile_data JSON NULL,
    status ENUM('active', 'error', 'expired') DEFAULT 'active',
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_synced_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_platform (user_id, platform)
);
```

## 🔌 API Integration

### Using JWT Authentication

All API requests automatically include JWT token:

```javascript
// Token is stored in localStorage and automatically added to requests
localStorage.getItem('access_token')
// Header: Authorization: Bearer <token>
```

### Error Handling

The service includes fallback data for demo mode when API is unavailable:

```javascript
try {
  const response = await api.get('/social-media/posts')
  return response.data
} catch (error) {
  // Fallback to demo data
  return getFallbackPosts()
}
```

## 🎨 UI Components

### 1. AccountsManager Component
```vue
<AccountsManager />
```
Features:
- Visual platform cards (Facebook, Instagram, Twitter, LinkedIn)
- Connect/disconnect buttons
- Follower count display
- Connection status indicators
- OAuth flow initiation

### 2. PostComposer Component
```vue
<PostComposer
  :show="showModal"
  :post="editingPost"
  @close="handleClose"
  @saved="handleSaved"
/>
```
Features:
- Platform selection
- Character count per platform
- Media upload with preview
- Hashtag input and preview
- Mention support
- Schedule date/time picker
- Publish options (now/schedule/draft)

### 3. SocialAnalytics Component
```vue
<SocialAnalytics />
```
Features:
- Summary statistics
- Platform performance breakdown
- Interactive Chart.js charts
- Time period filtering
- Top performing posts
- Engagement rate calculation

### 4. SocialListening Component
```vue
<SocialListening />
```
Features:
- Keyword monitoring
- Sentiment analysis visualization
- Real-time mention feed
- Platform filtering
- Engagement metrics
- Reply/save actions

## 🎯 Usage Examples

### Create a New Post

```vue
<script setup>
import { ref } from 'vue'
import PostComposer from '@/components/social/PostComposer.vue'

const showComposer = ref(false)

const handlePostSaved = () => {
  console.log('Post saved!')
  // Refresh posts list
}
</script>

<template>
  <button @click="showComposer = true">Create Post</button>
  <PostComposer
    :show="showComposer"
    @close="showComposer = false"
    @saved="handlePostSaved"
  />
</template>
```

### Load Analytics

```vue
<script setup>
import { useSocialMediaStore } from '@/stores/socialMedia'

const store = useSocialMediaStore()

const loadAnalytics = async () => {
  try {
    const response = await store.fetchDashboard()
    console.log('Dashboard data:', response)
  } catch (error) {
    console.error('Error:', error)
  }
}
</script>
```

## 🔒 Security Considerations

1. **JWT Token Management**
   - Tokens stored in `localStorage`
   - Auto-refresh on expiration
   - Automatic redirect to login on 401

2. **OAuth Security**
   - State parameter for CSRF protection
   - Secure token storage
   - Token expiration handling

3. **Input Validation**
   - Client-side validation for all forms
   - XSS protection via Vue's built-in escaping
   - File upload size and type restrictions

## 📱 Responsive Design

The interface is fully responsive with Tailwind CSS:
- Mobile: Single column layout
- Tablet: 2-column grid
- Desktop: 3-4 column grid
- Collapsible sidebar on mobile

## 🎨 Styling

Uses Tailwind CSS utility classes:
- Consistent color scheme
- Hover and transition effects
- Shadow and border styling
- Platform-specific colors

Platform Colors:
- Facebook: Blue (#1877F2)
- Instagram: Pink (#E4405F)
- Twitter: Sky Blue (#1DA1F2)
- LinkedIn: Dark Blue (#0A66C2)

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
Access at: `http://localhost:5173/marketing/social-media`

### Production Build
```bash
npm run build
npm run preview
```

## 🧪 Testing

### Test Accounts (Demo Mode)
When backend API is unavailable, the app uses demo data:
- Mock posts with engagement metrics
- Simulated connected accounts
- Sample analytics data
- Demo mentions and sentiment

## 📊 State Management

Using Pinia store (`src/stores/socialMedia.ts`):

```javascript
import { useSocialMediaStore } from '@/stores/socialMedia'

const store = useSocialMediaStore()

// State
store.posts
store.dashboard
store.connectedAccounts

// Actions
store.fetchPosts()
store.createPost(data)
store.connectAccount(account)
store.fetchAnalytics()
```

## 🔄 Real-time Updates

The dashboard auto-refreshes:
- Posts list updates after create/edit/delete
- Analytics refresh on demand
- Social listening updates every 30 seconds (configurable)

## 🌐 Internationalization

Translation keys in `src/locales/`:
```json
{
  "socialMedia": {
    "title": "Social Media Management",
    "createPost": "Create Post",
    "publishNow": "Publish Now",
    "schedule": "Schedule"
  }
}
```

## 🐛 Troubleshooting

### Issue: Charts not rendering
**Solution**: Ensure Chart.js is installed:
```bash
npm install chart.js
```

### Issue: OAuth callback not working
**Solution**: Check redirect URIs in OAuth app settings match:
```
http://localhost:5173/oauth/facebook/callback
```

### Issue: 401 Unauthorized errors
**Solution**: Check JWT token in localStorage and ensure it's not expired

### Issue: Posts not appearing
**Solution**: 
1. Check API endpoint URL in `.env`
2. Verify backend is running
3. Check browser console for errors
4. Try demo mode (fallback data)

## 📚 Additional Resources

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)

## 🤝 Contributing

When extending this module:
1. Follow Vue 3 Composition API patterns
2. Use TypeScript interfaces for type safety
3. Add error handling with fallback data
4. Maintain consistent styling with Tailwind
5. Update this documentation

## 📝 License

Part of RC Convergio project.

---

**Built with ❤️ using Vue 3, Tailwind CSS, and Chart.js**

