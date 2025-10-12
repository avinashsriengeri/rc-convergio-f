<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-lg font-medium text-gray-900">Teams</h2>
        <p class="text-sm text-gray-600 mt-1">Manage teams and assign users to them</p>
      </div>
      <BaseButton
        variant="primary"
        @click="createTeam"
        class="flex items-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Team
      </BaseButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading teams</h3>
      <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
      <div class="mt-6">
        <BaseButton variant="primary" @click="refreshTeams">
          Try Again
        </BaseButton>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && teams.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No teams created yet</h3>
      <p class="mt-1 text-sm text-gray-500">Click Add Team to create your first team.</p>
      <div class="mt-6">
        <BaseButton variant="primary" @click="createTeam">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Team
        </BaseButton>
      </div>
    </div>

    <!-- Teams Table -->
    <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Members
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="team in teams"
              :key="team.id"
              class="hover:bg-gray-50"
            >
              <!-- Team Name -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ team.name }}</div>
                    <div v-if="team.description" class="text-sm text-gray-500">{{ team.description }}</div>
                  </div>
                </div>
              </td>

              <!-- Members Count -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-sm text-gray-900">{{ teamHelpers.formatMemberCount(team.members_count || 0) }}</span>
                </div>
              </td>

              <!-- Created At -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ teamHelpers.formatDate(team.created_at) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <BaseButton
                    variant="outline"
                    size="sm"
                    @click="viewMembers(team)"
                    class="flex items-center"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Members
                  </BaseButton>
                  <BaseButton
                    variant="outline"
                    size="sm"
                    @click="editTeam(team)"
                    class="flex items-center"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </BaseButton>
                  <button
                    @click="deleteTeam(team)"
                    class="text-gray-400 hover:text-red-600 p-1 rounded"
                    title="Delete team"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Team Modal -->
    <TeamModal
      v-if="showTeamModal"
      :team="teamToEdit"
      @close="showTeamModal = false"
      @saved="handleTeamSaved"
    />

    <!-- Team Members Drawer -->
    <TeamMembersDrawer
      v-if="showMembersDrawer"
      :team="teamToView"
      @close="showMembersDrawer = false"
      @updated="handleMembersUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete Team"
      :message="`Are you sure you want to delete the team '${teamToDelete?.name}'? This action cannot be undone and will remove all team members.`"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { teamsAPI, teamHelpers, type Team } from '@/services/teams'
import { useNotifications } from '@/composables/useNotifications'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
import TeamModal from './TeamModal.vue'
import TeamMembersDrawer from './TeamMembersDrawer.vue'

const { success, error: showError } = useNotifications()

// Reactive data
const loading = ref(false)
const error = ref<string | null>(null)
const teams = ref<Team[]>([])
const showTeamModal = ref(false)
const showMembersDrawer = ref(false)
const showDeleteModal = ref(false)
const teamToEdit = ref<Team | null>(null)
const teamToView = ref<Team | null>(null)
const teamToDelete = ref<Team | null>(null)

// Methods
const refreshTeams = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await teamsAPI.getTeams()
    
    // Handle Laravel pagination structure: response.data.data.data
    let apiTeams = []
    if (response.data.success && response.data.data && response.data.data.data) {
      // Laravel paginated response
      apiTeams = response.data.data.data
    } else if (response.data.data && Array.isArray(response.data.data)) {
      // Direct array response
      apiTeams = response.data.data
    } else if (Array.isArray(response.data)) {
      // Simple array response
      apiTeams = response.data
    }
    
    // Transform backend data to match our interface
    teams.value = apiTeams.map((team: any) => ({
      id: team.id,
      name: team.name,
      description: team.description,
      members_count: team.members?.length || 0, // Use members array length
      created_at: team.created_at,
      updated_at: team.updated_at
    }))
  } catch (err: any) {
    console.error('Failed to load teams:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load teams'
    showError('Failed to load teams')
  } finally {
    loading.value = false
  }
}

const createTeam = () => {
  teamToEdit.value = null
  showTeamModal.value = true
}

const editTeam = (team: Team) => {
  teamToEdit.value = team
  showTeamModal.value = true
}

const viewMembers = (team: Team) => {
  teamToView.value = team
  showMembersDrawer.value = true
}

const deleteTeam = (team: Team) => {
  teamToDelete.value = team
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!teamToDelete.value) return
  
  try {
    await teamsAPI.deleteTeam(teamToDelete.value.id)
    
    // Remove from local array
    teams.value = teams.value.filter((t: Team) => t.id !== teamToDelete.value!.id)
    
    showDeleteModal.value = false
    teamToDelete.value = null
    success('Team deleted successfully')
  } catch (err: any) {
    console.error('Failed to delete team:', err)
    showError('Failed to delete team')
  }
}

const handleTeamSaved = () => {
  showTeamModal.value = false
  teamToEdit.value = null
  refreshTeams()
  success('Team saved successfully')
}

const handleMembersUpdated = () => {
  showMembersDrawer.value = false
  teamToView.value = null
  refreshTeams()
}

// Lifecycle
onMounted(() => {
  refreshTeams()
})
</script>
