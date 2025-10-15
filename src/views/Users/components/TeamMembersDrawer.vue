<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative ml-auto h-full w-full max-w-md bg-white shadow-xl">
      <div class="flex h-full flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 class="text-lg font-medium text-gray-900">{{ team?.name }}</h2>
            <p class="text-sm text-gray-500">Manage team members</p>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading members</h3>
            <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
            <div class="mt-4">
              <BaseButton variant="primary" @click="loadMembers">
                Try Again
              </BaseButton>
            </div>
          </div>

          <!-- Members List -->
          <div v-else class="space-y-6">
            <!-- Current Members -->
            <div>
              <h3 class="text-sm font-medium text-gray-900 mb-3">Current Members</h3>
              
              <!-- Empty State -->
              <div v-if="members.length === 0" class="text-center py-12">
                <div class="mx-auto h-16 w-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 mb-2">No team members yet</h4>
                <p class="text-sm text-gray-500 mb-4">Start building your team by adding members below.</p>
              </div>

              <!-- Members List -->
              <div v-else class="space-y-2">
                <div
                  v-for="member in members"
                  :key="member.id"
                  class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                        <span class="text-sm font-semibold text-white">
                          {{ (member.name || 'U').charAt(0).toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-semibold text-gray-900">{{ member.name }}</div>
                      <div class="text-sm text-gray-500">{{ member.email }}</div>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-3">
                    <!-- Role Badge -->
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                      :class="teamHelpers.getRoleBadgeClass(member.role)"
                    >
                      {{ teamHelpers.getRoleDisplayName(member.role) }}
                    </span>
                    
                    <!-- Actions -->
                    <div class="flex items-center space-x-1">
                      <button
                        @click="changeMemberRole(member)"
                        class="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        title="Change role"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        @click="removeMember(member)"
                        class="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        title="Remove member"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Member Section -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-sm font-medium text-gray-900 mb-3">Add Member</h3>
              
              <div class="space-y-3">
                <!-- User Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Select User <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <select
                      v-model="newMember.user_id"
                      :disabled="loadingUsers"
                      class="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': !newMember.user_id }"
                    >
                      <option value="" disabled>
                        {{ loadingUsers ? 'Loading users...' : 'Choose a user to add...' }}
                      </option>
                      <option
                        v-for="user in availableUsers"
                        :key="user.id"
                        :value="user.id"
                      >
                        {{ user.name }} • {{ user.email }}
                      </option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg v-if="loadingUsers" class="h-5 w-5 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p v-if="availableUsers.length === 0" class="mt-1 text-sm text-gray-500">
                    No available users to add to this team.
                  </p>
                </div>

                <!-- Role Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Role <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <select
                      v-model="newMember.role"
                      class="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white transition-colors duration-200"
                    >
                      <option value="member">Member</option>
                      <option value="manager">Manager</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Add Button -->
                <BaseButton
                  variant="primary"
                  @click="addMember"
                  :loading="addingMember"
                  :disabled="!newMember.user_id || !newMember.role"
                  class="w-full mt-4 py-2.5 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <svg v-if="!addingMember" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {{ addingMember ? 'Adding Member...' : 'Add Member' }}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Change Modal -->
    <div v-if="showRoleModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60">
      <div class="relative top-20 mx-auto p-5 border w-80 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Change Member Role</h3>
          
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ memberToUpdate?.name }}
              </label>
              <select
                v-model="roleUpdate.role"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="member">Member</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end space-x-3 mt-6">
            <BaseButton
              type="button"
              variant="secondary"
              @click="showRoleModal = false"
            >
              Cancel
            </BaseButton>
            <BaseButton
              type="button"
              variant="primary"
              @click="confirmRoleChange"
              :loading="updatingRole"
            >
              Update Role
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Remove Member Confirmation Modal -->
    <ConfirmationModal
      v-if="showRemoveModal"
      title="Remove Member"
      :message="`Are you sure you want to remove '${memberToRemove?.name}' from this team?`"
      confirm-text="Remove"
      confirm-variant="danger"
      @confirm="confirmRemoveMember"
      @cancel="showRemoveModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { teamsAPI, teamHelpers, type Team, type TeamMember, type AddMemberData, type UpdateMemberRoleData } from '@/services/teams'
import { usersAPI } from '@/services/api'
import { useNotifications } from '@/composables/useNotifications'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'

interface Props {
  team: Team | null
}

interface Emits {
  (e: 'close'): void
  (e: 'updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { success, error: showError } = useNotifications()

// Reactive data
const loading = ref(false)
const error = ref<string | null>(null)
const members = ref<TeamMember[]>([])
const availableUsers = ref<any[]>([])
const loadingUsers = ref(false)
const addingMember = ref(false)
const updatingRole = ref(false)

const showRoleModal = ref(false)
const showRemoveModal = ref(false)
const memberToUpdate = ref<TeamMember | null>(null)
const memberToRemove = ref<TeamMember | null>(null)

const newMember = reactive<AddMemberData>({
  user_id: 0,
  role: 'member'
})

const roleUpdate = reactive<UpdateMemberRoleData>({
  role: 'member'
})

// Methods
const loadMembers = async () => {
  if (!props.team) return

  loading.value = true
  error.value = null

  try {
    const response = await teamsAPI.getTeamMembers(props.team.id)
    
    // Handle Laravel pagination structure: response.data.data.data
    let apiMembers = []
    if (response.data.success && response.data.data && response.data.data.data) {
      // Laravel paginated response
      apiMembers = response.data.data.data
    } else if (response.data.data && Array.isArray(response.data.data)) {
      // Direct array response
      apiMembers = response.data.data
    } else if (Array.isArray(response.data)) {
      // Simple array response
      apiMembers = response.data
    }

    members.value = apiMembers.map((member: any) => ({
      id: member.id,
      name: member.user?.name || 'Unknown User',
      email: member.user?.email || 'No email',
      role: member.role,
      team_id: member.team_id,
      user_id: member.user_id,
      created_at: member.created_at
    }))
  } catch (err: any) {
    console.error('Failed to load team members:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load team members'
    showError('Failed to load team members')
  } finally {
    loading.value = false
  }
}

const loadAvailableUsers = async () => {
  loadingUsers.value = true
  try {
    // Use the correct API method from usersAPI
    const response = await usersAPI.getUsers({ per_page: 100 })
    
    // Handle Laravel pagination structure: response.data.data.data
    let apiUsers = []
    if (response.data.success && response.data.data && response.data.data.data) {
      // Laravel paginated response
      apiUsers = response.data.data.data
    } else if (response.data.data && Array.isArray(response.data.data)) {
      // Direct array response
      apiUsers = response.data.data
    } else if (Array.isArray(response.data)) {
      // Simple array response
      apiUsers = response.data
    }

    // Filter out users who are already members
    const memberUserIds = members.value.map((m: TeamMember) => m.user_id)
    availableUsers.value = apiUsers.filter((user: any) => !memberUserIds.includes(user.id))
  } catch (err: any) {
    console.error('Failed to load available users:', err)
    showError('Failed to load available users')
  } finally {
    loadingUsers.value = false
  }
}

const addMember = async () => {
  if (!props.team || !newMember.user_id || !newMember.role) return

  addingMember.value = true

  try {
    await teamsAPI.addMember(props.team.id, {
      user_id: newMember.user_id,
      role: newMember.role
    })

    // Reset form
    newMember.user_id = 0
    newMember.role = 'member'

    // Reload members and available users
    await loadMembers()
    await loadAvailableUsers()

    success('Member added successfully')
  } catch (err: any) {
    console.error('Failed to add member:', err)
    showError('Failed to add member')
  } finally {
    addingMember.value = false
  }
}

const changeMemberRole = (member: TeamMember) => {
  memberToUpdate.value = member
  roleUpdate.role = member.role
  showRoleModal.value = true
}

const confirmRoleChange = async () => {
  if (!props.team || !memberToUpdate.value) return

  updatingRole.value = true

  try {
    await teamsAPI.updateMemberRole(props.team.id, memberToUpdate.value.user_id, {
      role: roleUpdate.role
    })

    // Update local member
    const memberIndex = members.value.findIndex((m: TeamMember) => m.id === memberToUpdate.value!.id)
    if (memberIndex !== -1) {
      members.value[memberIndex].role = roleUpdate.role
    }

    showRoleModal.value = false
    memberToUpdate.value = null
    success('Member role updated successfully')
  } catch (err: any) {
    console.error('Failed to update member role:', err)
    showError('Failed to update member role')
  } finally {
    updatingRole.value = false
  }
}

const removeMember = (member: TeamMember) => {
  memberToRemove.value = member
  showRemoveModal.value = true
}

const confirmRemoveMember = async () => {
  if (!props.team || !memberToRemove.value) return

  try {
    await teamsAPI.removeMember(props.team.id, memberToRemove.value.user_id)

    // Remove from local array
    members.value = members.value.filter((m: TeamMember) => m.id !== memberToRemove.value!.id)

    // Reload available users to include the removed user
    await loadAvailableUsers()

    showRemoveModal.value = false
    memberToRemove.value = null
    success('Member removed successfully')
  } catch (err: any) {
    console.error('Failed to remove member:', err)
    showError('Failed to remove member')
  }
}

// Watch for team changes
watch(() => props.team, (newTeam: Team | null) => {
  if (newTeam) {
    loadMembers()
    loadAvailableUsers()
  }
}, { immediate: true })
</script>
