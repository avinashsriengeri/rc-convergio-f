import { ref, computed } from 'vue'
import { useAuth } from './useAuth'

// Mock context data for demo purposes
const tenantId = ref(1)
const teamId = ref(3)
const isAdmin = ref(false)

export function useContext() {
  const { user, userRole } = useAuth()

  // In a real app, these would come from the user's context
  const currentTenantId = computed(() => {
    return user.value?.tenant_id || tenantId.value
  })

  const currentTeamId = computed(() => {
    return user.value?.team_id || teamId.value
  })

  const currentIsAdmin = computed(() => {
    return userRole.value === 'admin' || isAdmin.value
  })

  return {
    tenantId: currentTenantId,
    teamId: currentTeamId,
    isAdmin: currentIsAdmin,
    // Additional context properties that might be useful
    organizationId: computed(() => user.value?.organization_id || 1),
    userId: computed(() => user.value?.id || null),
  }
}
