import { computed } from 'vue'
import { useAuth } from './useAuth'
import { useContext } from './useContext'

export function usePermission() {
  const { user, userRole } = useAuth()
  const { tenantId, teamId, isAdmin } = useContext()

  // Check if current user can edit a record
  const canEdit = (record) => {
    if (!record || !user.value) return false

    // Admin can edit any record in their tenant
    if (isAdmin.value && record.tenant_id === tenantId.value) {
      return true
    }

    // Owner can edit their own records
    if (record.owner_id === user.value.id) {
      return true
    }

    // Team members can edit records in their team
    if (record.team_id === teamId.value && record.tenant_id === tenantId.value) {
      return true
    }

    return false
  }

  // Check if current user can delete a record
  const canDelete = (record) => {
    if (!record || !user.value) return false

    // Admin can delete any record in their tenant
    if (isAdmin.value && record.tenant_id === tenantId.value) {
      return true
    }

    // Owner can delete their own records
    if (record.owner_id === user.value.id) {
      return true
    }

    // Team members can delete records in their team (if they have delete permissions)
    if (record.team_id === teamId.value && record.tenant_id === tenantId.value) {
      // In a real app, you might check specific delete permissions here
      return userRole.value === 'manager' || userRole.value === 'admin'
    }

    return false
  }

  // Check if current user can view a record
  const canView = (record) => {
    if (!record || !user.value) return false

    // Admin can view any record in their tenant
    if (isAdmin.value && record.tenant_id === tenantId.value) {
      return true
    }

    // Owner can view their own records
    if (record.owner_id === user.value.id) {
      return true
    }

    // Team members can view records in their team
    if (record.team_id === teamId.value && record.tenant_id === tenantId.value) {
      return true
    }

    return false
  }

  // Check if current user can create records
  const canCreate = (recordType = null) => {
    if (!user.value) return false

    // Admin can create any record type
    if (isAdmin.value) {
      return true
    }

    // Regular users can create records in their team/tenant
    return true
  }

  return {
    canEdit,
    canDelete,
    canView,
    canCreate,
  }
}
