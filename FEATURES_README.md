# 🚀 Frontend Feature Restriction System

A comprehensive feature access control system for RC Convergio CRM that integrates with backend feature endpoints and provides granular control over UI elements, menu items, and page access.

## 📋 Overview

The feature system allows you to:
- **Hide/Show UI elements** based on user permissions
- **Disable buttons** when users lack access
- **Protect entire pages** with access denied screens
- **Control sidebar menu** visibility dynamically
- **Support role-based, domain-based, and plan-based** restrictions

## 🔧 Backend Integration

The system integrates with these backend endpoints:
- `GET /api/features/status` - Fetch all feature statuses
- `GET /api/features/check/{feature}` - Check specific feature access

## 🏗️ Architecture

### Core Components

1. **`useFeatures()` Composable** - Main feature management logic
2. **`FeatureGuard`** - Conditionally render content
3. **`FeatureButton`** - Auto-disable/hide buttons
4. **`FeaturePageGuard`** - Protect entire pages

### Feature Structure

```typescript
interface FeatureStatus {
  feature: string           // Feature identifier (e.g., 'manage_users')
  enabled: boolean          // Whether feature is globally enabled
  reason?: string           // Why feature is disabled
  restrictions?: {
    roles?: string[]        // Required user roles
    domains?: string[]      // Required domains
    plans?: string[]        // Required subscription plans
  }
}
```

## 🚀 Quick Start

### 1. Basic Feature Check

```vue
<template>
  <div>
    <!-- Simple conditional rendering -->
    <div v-if="hasFeature('manage_users')">
      User management content
    </div>
    
    <!-- Hide entire sections -->
    <div v-if="hasFeature('advanced_analytics')">
      Analytics dashboard
    </div>
  </div>
</template>

<script setup>
import { useFeatures } from '@/composables/useFeatures'

const { hasFeature } = useFeatures()
</script>
```

### 2. Using FeatureGuard Component

```vue
<template>
  <FeatureGuard feature="manage_campaigns">
    <div class="campaign-creator">
      <h2>Create Campaign</h2>
      <button>New Campaign</button>
    </div>
  </FeatureGuard>
</template>

<script setup>
import FeatureGuard from '@/components/ui/FeatureGuard.vue'
</script>
```

### 3. Using FeatureButton Component

```vue
<template>
  <!-- Hide button when feature is disabled -->
  <FeatureButton feature="export_data" class="btn-primary">
    Export Data
  </FeatureButton>
  
  <!-- Disable button when feature is disabled -->
  <FeatureButton feature="bulk_operations" variant="disable" class="btn-secondary">
    Bulk Delete
  </FeatureButton>
  
  <!-- Always show, use fallback behavior -->
  <FeatureButton feature="advanced_features" variant="fallback" class="btn-outline">
    Advanced Options
  </FeatureButton>
</template>

<script setup>
import FeatureButton from '@/components/ui/FeatureButton.vue'
</script>
```

### 4. Protecting Entire Pages

```vue
<template>
  <FeaturePageGuard feature="system_settings">
    <div class="settings-page">
      <h1>System Settings</h1>
      <!-- Page content here -->
    </div>
  </FeaturePageGuard>
</template>

<script setup>
import FeaturePageGuard from '@/components/ui/FeaturePageGuard.vue'
</script>
```

## 🎯 Feature Variants

### FeatureButton Variants

- **`hide`** (default) - Button is completely hidden when feature is disabled
- **`disable`** - Button is visible but disabled when feature is disabled
- **`fallback`** - Button is always visible, uses fallback behavior

### FeatureGuard Options

- **`fallback`** - Whether to show content when features aren't loaded
- **`showWhenDisabled`** - Show content even when feature is disabled

## 🔍 Advanced Usage

### Multiple Feature Checks

```vue
<script setup>
import { useFeatures } from '@/composables/useFeatures'

const { hasAnyFeature, hasAllFeatures } = useFeatures()

// Check if user has ANY of these features
const canManageData = hasAnyFeature(['manage_users', 'manage_campaigns'])

// Check if user has ALL of these features
const isPowerUser = hasAllFeatures(['advanced_analytics', 'bulk_operations', 'export_data'])
</script>
```

### Feature Combinations in Templates

```vue
<template>
  <!-- Show if user has any management feature -->
  <div v-if="hasAnyFeature(['manage_users', 'manage_campaigns', 'manage_lists'])">
    <h3>Management Tools</h3>
    <!-- Management content -->
  </div>
  
  <!-- Show if user has all admin features -->
  <div v-if="hasAllFeatures(['system_settings', 'user_management', 'audit_logs'])">
    <h3>Admin Panel</h3>
    <!-- Admin content -->
  </div>
</template>
```

### Dynamic Feature Loading

```vue
<script setup>
import { useFeatures } from '@/composables/useFeatures'

const { features, isReady, loading, error, refreshFeatures } = useFeatures()

// Manually refresh features
const reloadFeatures = async () => {
  await refreshFeatures()
}

// Check if features are loaded
if (isReady.value) {
  console.log('Features loaded:', features.value.length)
}
</script>
```

## 🎨 UI Integration Examples

### Sidebar Menu Control

```vue
<template>
  <!-- Users menu (Admin only) -->
  <router-link
    v-if="hasFeature('manage_users')"
    to="/users"
    class="sidebar-link"
  >
    <svg>...</svg>
    Users
  </router-link>
  
  <!-- Campaigns menu (Manager+) -->
  <router-link
    v-if="hasFeature('manage_campaigns')"
    to="/campaigns"
    class="sidebar-link"
  >
    <svg>...</svg>
    Campaigns
  </router-link>
</template>
```

### Button States

```vue
<template>
  <!-- Export button - hidden when feature disabled -->
  <FeatureButton feature="export_data" class="btn-export">
    Export to Excel
  </FeatureButton>
  
  <!-- Bulk operations - disabled when feature disabled -->
  <FeatureButton feature="bulk_operations" variant="disable" class="btn-bulk">
    Bulk Delete Selected
  </FeatureButton>
  
  <!-- Settings - always visible -->
  <FeatureButton feature="system_settings" variant="fallback" class="btn-settings">
    System Settings
  </Button>
</template>
```

### Form Field Control

```vue
<template>
  <form>
    <input v-model="name" placeholder="Name" />
    <input v-model="email" placeholder="Email" />
    
    <!-- Advanced fields only for premium users -->
    <FeatureGuard feature="advanced_fields">
      <input v-model="phone" placeholder="Phone" />
      <input v-model="company" placeholder="Company" />
    </FeatureGuard>
    
    <button type="submit">Save</button>
  </form>
</template>
```

## 🛡️ Security Features

### Automatic Role Checking

The system automatically checks user roles against feature restrictions:

```typescript
// Backend feature definition
{
  feature: 'manage_users',
  enabled: true,
  restrictions: {
    roles: ['admin', 'manager']
  }
}

// Frontend automatically checks user.roles array
const hasAccess = hasFeature('manage_users') // Returns true/false based on user role
```

### Domain Restrictions

Support for domain-based access control:

```typescript
{
  feature: 'premium_analytics',
  enabled: true,
  restrictions: {
    domains: ['enterprise.com', 'corporate.org']
  }
}
```

### Fallback Behavior

When the API fails, the system falls back to default features:

```typescript
// Default features for fallback
const defaultFeatures = [
  {
    feature: 'manage_users',
    enabled: true,
    restrictions: { roles: ['admin'] }
  }
  // ... more defaults
]
```

## 🔧 Configuration

### Feature Identifiers

Use consistent feature names throughout your application:

```typescript
// Core Management
'manage_users'           // User management
'manage_campaigns'       // Campaign creation/editing
'manage_lists'          // List/segment management
'manage_forms'          // Form builder access

// Data Operations
'export_data'           // Data export functionality
'bulk_operations'       // Bulk actions
'data_import'           // Data import functionality

// System Features
'system_settings'        // System configuration
'advanced_analytics'     // Advanced reporting
'audit_logs'            // Audit trail access
'api_access'            // API key management
```

### Adding New Features

1. **Define in backend** - Add feature to `/api/features/status` endpoint
2. **Use in frontend** - Check feature with `hasFeature('new_feature')`
3. **Apply restrictions** - Add role/domain/plan requirements in backend

## 🧪 Testing

### Features Demo Page

Visit `/features-demo` to test all feature components and see real-time feature status.

### Development Testing

```javascript
// In browser console
const { hasFeature } = useFeatures()

// Test feature access
console.log('Can manage users:', hasFeature('manage_users'))
console.log('Can manage campaigns:', hasFeature('manage_campaigns'))
```

## 🚨 Troubleshooting

### Common Issues

1. **Features not loading** - Check network tab for API errors
2. **Menu items hidden** - Verify feature names match backend
3. **Buttons disabled** - Check user role and feature restrictions
4. **Page access denied** - Ensure feature is enabled and user has required role

### Debug Information

The system provides comprehensive logging:

```javascript
// Check feature status
console.log('Features loaded:', features.value)
console.log('Features ready:', isReady.value)
console.log('Has errors:', hasErrors.value)
console.log('Error details:', error.value)
```

### Fallback Behavior

When features fail to load:
- System uses default feature set
- UI gracefully degrades
- Users see appropriate access controls
- No broken functionality

## 📚 API Reference

### useFeatures() Composable

```typescript
const {
  // State
  features,           // Reactive array of all features
  isReady,           // Whether features are loaded
  loading,           // Loading state
  error,             // Error message if any
  
  // Methods
  hasFeature,        // Check single feature access
  hasAnyFeature,     // Check if user has any of multiple features
  hasAllFeatures,    // Check if user has all of multiple features
  getFeature,        // Get feature details
  refreshFeatures,   // Reload features from API
  clearFeatures      // Clear feature cache
} = useFeatures()
```

### FeatureGuard Props

```typescript
interface FeatureGuardProps {
  feature: string           // Required: Feature to check
  fallback?: boolean        // Optional: Show content while loading
  showWhenDisabled?: boolean // Optional: Show even when disabled
}
```

### FeatureButton Props

```typescript
interface FeatureButtonProps {
  feature: string                    // Required: Feature to check
  variant?: 'hide' | 'disable' | 'fallback'  // Optional: Behavior variant
  fallback?: boolean                 // Optional: Fallback behavior
  disabled?: boolean                 // Optional: Additional disabled state
  class?: string                     // Optional: CSS classes
}
```

### FeaturePageGuard Props

```typescript
interface FeaturePageGuardProps {
  feature: string                    // Required: Feature to check
  accessDeniedMessage?: string       // Optional: Custom error message
  redirectTo?: string                // Optional: Redirect path on access denied
}
```

## 🔮 Future Enhancements

- **Plan-based restrictions** - Subscription tier limitations
- **Time-based access** - Feature availability windows
- **Usage tracking** - Monitor feature usage patterns
- **A/B testing** - Feature rollouts and experiments
- **Audit logging** - Track feature access attempts

## 📞 Support

For questions or issues with the feature system:
1. Check the browser console for error messages
2. Verify backend feature endpoints are working
3. Test with the `/features-demo` page
4. Review this documentation for usage patterns

---

**Built with ❤️ for RC Convergio CRM**
