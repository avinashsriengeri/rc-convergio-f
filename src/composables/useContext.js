import { ref, computed } from 'vue'
import { useAuth } from './useAuth'

// Mock context data for demo purposes (fallback only)
const fallbackTenantId = ref(44) // Use valid tenant ID as fallback
const teamId = ref(3)
const isAdmin = ref(false)

export function useContext() {
  const { user, userRole } = useAuth()

  // Get tenant ID from user data, with fallback to valid tenant ID
  const currentTenantId = computed(() => {
    // Priority: user.tenant_id -> user.id -> fallback tenant ID
    return user.value?.tenant_id || user.value?.id || fallbackTenantId.value
  })

  const currentTeamId = computed(() => {
    return user.value?.team_id || teamId.value
  })

  const currentIsAdmin = computed(() => {
    return userRole.value === 'admin' || isAdmin.value
  })

  // Helper function to get tenant ID
  const getTenantId = () => {
    return currentTenantId.value
  }

  return {
    tenantId: currentTenantId,
    teamId: currentTeamId,
    isAdmin: currentIsAdmin,
    getTenantId, // Add the missing function
    // Additional context properties that might be useful
    organizationId: computed(() => user.value?.organization_id || 1),
    userId: computed(() => user.value?.id || null),
  }
}
