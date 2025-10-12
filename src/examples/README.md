# Team Access Demo Components

This directory contains demo components that visually demonstrate how team/tenant access control works in the application, similar to HubSpot's team-based visibility system.

## Components

### 1. ContactVisibilityDemo.vue
Demonstrates how contact records are filtered and displayed based on:
- **Owner access**: Users can see records they own
- **Team access**: Users can see records from their team
- **Admin access**: Admins can see all records in their tenant
- **Tenant isolation**: Users cannot see records from other tenants

### 2. DealVisibilityDemo.vue
Shows deal visibility logic with:
- Owner-based access control
- Team-based filtering
- Admin override capabilities
- Secure dropdown population

### 3. TeamAccessOverview.vue
Main demo page that combines all visibility examples in one place.

## How to View the Demo

1. **Via Router**: Navigate to `/team-access-demo` in your application
2. **Direct Import**: Import `TeamAccessOverview` component in any view
3. **Individual Components**: Import specific demo components as needed

## Key Features Demonstrated

### Permission System
- `canEdit()`: Checks if user can edit a record
- `canDelete()`: Checks if user can delete a record  
- `canView()`: Checks if user can view a record
- `canCreate()`: Checks if user can create records

### Context System
- `tenantId`: Current user's tenant ID
- `teamId`: Current user's team ID
- `isAdmin`: Whether user has admin privileges

### Team-Aware Dropdowns
- User dropdowns filtered by tenant and team
- Admin users see all users in their tenant
- Regular users see only their team members

## Usage in Real Components

```vue
<script setup>
import { useContext } from '@/composables/useContext'
import { usePermission } from '@/composables/usePermission'

const { tenantId, teamId, isAdmin } = useContext()
const { canEdit, canDelete } = usePermission()

// Filter users for dropdown
const params = isAdmin.value
  ? { tenant_id: tenantId.value }
  : { tenant_id: tenantId.value, team_id: teamId.value }

const { data } = await api.get('/users', { params })
</script>
```

## Security Notes

- All API calls include tenant/team filtering
- Dropdowns are automatically filtered by user context
- Permission checks are applied to all CRUD operations
- Admin users have broader access within their tenant only
