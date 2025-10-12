<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
            <p class="text-sm text-gray-600 mt-1">Manage system users and their permissions</p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="secondary"
              @click="refreshUsers"
              :loading="loading"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="createUser"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add User
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex flex-wrap gap-2">
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              @click="setActiveTab('users')"
              :class="{ 'bg-blue-50 border-blue-200 text-blue-700': activeTab === 'users' }"
            >
              All Users
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              @click="setRoleFilter('admin')"
              :class="{ 'bg-red-50 border-red-200 text-red-700': roleFilter === 'admin' && activeTab === 'users' }"
              v-if="activeTab === 'users'"
            >
              Administrators
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              @click="setRoleFilter('manager')"
              :class="{ 'bg-purple-50 border-purple-200 text-purple-700': roleFilter === 'manager' && activeTab === 'users' }"
              v-if="activeTab === 'users'"
            >
              Managers
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              @click="setRoleFilter('user')"
              :class="{ 'bg-green-50 border-green-200 text-green-700': roleFilter === 'user' && activeTab === 'users' }"
              v-if="activeTab === 'users'"
            >
              Users
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              @click="setActiveTab('teams')"
              :class="{ 'bg-indigo-50 border-indigo-200 text-indigo-700': activeTab === 'teams' }"
              v-if="isAdmin"
            >
              Teams
            </BaseButton>
          </div>
          
          <!-- Status Filter -->
          <div class="flex flex-wrap gap-2" v-if="activeTab === 'users'">
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              @click="setStatusFilter('all')"
              :class="{ 'bg-blue-50 border-blue-200 text-blue-700': statusFilter === 'all' }"
            >
              All Status
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              @click="setStatusFilter('active')"
              :class="{ 'bg-green-50 border-green-200 text-green-700': statusFilter === 'active' }"
            >
              Active
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              @click="setStatusFilter('inactive')"
              :class="{ 'bg-gray-50 border-gray-200 text-gray-700': statusFilter === 'inactive' }"
            >
              Inactive
            </BaseButton>
          </div>
          
          <div class="flex items-center space-x-2" v-if="activeTab === 'users'">
            <BaseInput
              v-model="searchQuery"
              placeholder="Search users..."
              @input="debouncedSearch"
              class="w-64"
            >
              <template #prefix>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </template>
            </BaseInput>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Users Tab Content -->
      <div v-if="activeTab === 'users'">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading users</h3>
          <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
          <div class="mt-6">
            <BaseButton variant="primary" @click="refreshUsers">
              Try Again
            </BaseButton>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && filteredUsers.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            {{ searchQuery ? 'No users found' : 'No users created' }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ searchQuery ? 'Try adjusting your search criteria.' : 'Get started by adding your first user.' }}
          </p>
          <div class="mt-6" v-if="!searchQuery">
            <BaseButton variant="primary" @click="createUser">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add User
            </BaseButton>
          </div>
        </div>

        <!-- Users Table -->
        <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="user in filteredUsers"
                  :key="user.id"
                  class="hover:bg-gray-50"
                >
                  <!-- User Info -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span class="text-sm font-medium text-gray-700">
                            {{ user.name.charAt(0).toUpperCase() }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Role -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getRoleBadgeClass(user.role)"
                    >
                      {{ getRoleDisplayName(user.role) }}
                    </span>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusBadgeClass(user.status)"
                    >
                      {{ user.status }}
                    </span>
                  </td>

                  <!-- Last Login -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.last_login ? formatDate(user.last_login) : 'Never' }}
                  </td>

                  <!-- Created -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(user.created_at) }}
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2">
                      <BaseButton
                        variant="outline"
                        size="sm"
                        @click="viewUser(user)"
                        class="flex items-center"
                      >
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </BaseButton>
                      <BaseButton
                        variant="outline"
                        size="sm"
                        @click="editUser(user)"
                        class="flex items-center"
                      >
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </BaseButton>
                      <button
                        v-if="user.status === 'active'"
                        @click="toggleUserStatus(user)"
                        class="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                        title="Deactivate user"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                      </button>
                      <button
                        v-else
                        @click="toggleUserStatus(user)"
                        class="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Activate user"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button
                        @click="deleteUser(user)"
                        :disabled="user.id === currentUserId"
                        class="text-gray-400 hover:text-red-600 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        :title="user.id === currentUserId ? 'Cannot delete yourself' : 'Delete user'"
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
      </div>

      <!-- Teams Tab Content -->
      <TeamsTab v-else-if="activeTab === 'teams'" />
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete User"
      :message="`Are you sure you want to delete the user '${userToDelete?.name}'? This action cannot be undone and will revoke all their access.`"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />

    <!-- Status Change Confirmation Modal -->
    <ConfirmationModal
      v-if="showStatusModal"
      :title="userToToggle?.status === 'active' ? 'Deactivate User' : 'Activate User'"
      :message="`Are you sure you want to ${userToToggle?.status === 'active' ? 'deactivate' : 'activate'} the user '${userToToggle?.name}'?`"
      :confirm-text="userToToggle?.status === 'active' ? 'Deactivate' : 'Activate'"
      :confirm-variant="userToToggle?.status === 'active' ? 'danger' : 'primary'"
      @confirm="confirmStatusToggle"
      @cancel="showStatusModal = false"
    />

    <!-- User Detail Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">User Details</h3>
            <button
              @click="showViewModal = false"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- User Info -->
          <div v-if="userToView" class="space-y-4">
            <!-- Avatar and Name -->
            <div class="text-center">
              <div class="mx-auto h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center mb-3">
                <span class="text-xl font-medium text-gray-700">
                  {{ userToView.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <h4 class="text-lg font-medium text-gray-900">{{ userToView.name }}</h4>
              <p class="text-sm text-gray-500">{{ userToView.email }}</p>
            </div>

            <!-- Role and Status -->
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getRoleBadgeClass(userToView.role)"
                >
                  {{ getRoleDisplayName(userToView.role) }}
                </span>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusBadgeClass(userToView.status)"
                >
                  {{ userToView.status }}
                </span>
              </div>
            </div>

            <!-- Dates -->
            <div class="space-y-3 pt-3 border-t border-gray-200">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Created</label>
                <p class="text-sm text-gray-900">{{ formatDate(userToView.created_at) }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                <p class="text-sm text-gray-900">{{ formatDate(userToView.updated_at) }}</p>
              </div>
              
              <div v-if="userToView.last_login">
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                <p class="text-sm text-gray-900">{{ formatDate(userToView.last_login) }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex items-center justify-end space-x-3">
            <BaseButton
              type="button"
              variant="outline"
              @click="showViewModal = false"
            >
              Close
            </BaseButton>
            <BaseButton
              v-if="userToView"
              type="button"
              variant="primary"
              @click="editUserFromModal"
            >
              Edit User
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash-es'
import { useNotifications } from '@/composables/useNotifications'
import { usersAPI } from '@/services/api'
import { useAuth } from '@/composables/useAuth'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
import TeamsTab from './components/TeamsTab.vue'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'user'
  role_names?: string[] // Add role_names array from backend
  status: 'active' | 'inactive'
  last_login?: string
  created_at: string
  updated_at: string
}

const router = useRouter()
const { success, error: showError } = useNotifications()
const { user: currentUser, userRole } = useAuth()

// Reactive data
const loading = ref(false)
const error = ref<string | null>(null)
const users = ref<User[]>([])
const searchQuery = ref('')
const roleFilter = ref<'all' | 'admin' | 'manager' | 'user'>('all')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')
const activeTab = ref<'users' | 'teams'>('users')
const showDeleteModal = ref(false)
const showStatusModal = ref(false)
const showViewModal = ref(false)
const userToDelete = ref<User | null>(null)
const userToToggle = ref<User | null>(null)
const userToView = ref<User | null>(null)
const currentUserId = ref(1) // Mock current user ID

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Admin',
    email: 'admin@company.com',
    role: 'admin',
    status: 'active',
    last_login: '2024-01-25T14:30:00Z',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-25T14:30:00Z'
  },
  {
    id: 2,
    name: 'Jane Manager',
    email: 'jane.manager@company.com',
    role: 'manager',
    status: 'active',
    last_login: '2024-01-24T16:45:00Z',
    created_at: '2024-01-05T09:15:00Z',
    updated_at: '2024-01-24T16:45:00Z'
  },
  {
    id: 3,
    name: 'Mike Sales',
    email: 'mike.sales@company.com',
    role: 'user',
    status: 'active',
    last_login: '2024-01-23T11:20:00Z',
    created_at: '2024-01-08T14:30:00Z',
    updated_at: '2024-01-23T11:20:00Z'
  },
  {
    id: 4,
    name: 'Sarah Marketing',
    email: 'sarah.marketing@company.com',
    role: 'user',
    status: 'inactive',
    last_login: '2024-01-15T09:30:00Z',
    created_at: '2024-01-10T11:45:00Z',
    updated_at: '2024-01-20T13:15:00Z'
  },
  {
    id: 5,
    name: 'David Support',
    email: 'david.support@company.com',
    role: 'user',
    status: 'active',
    created_at: '2024-01-12T15:20:00Z',
    updated_at: '2024-01-12T15:20:00Z'
  }
]

// Computed
const isAdmin = computed(() => {
  const role = userRole.value?.toLowerCase()
  return role === 'admin' || role === 'administrator' || 
         currentUser.value?.role_names?.includes('admin') ||
         currentUser.value?.role_names?.includes('administrator')
})

const filteredUsers = computed(() => {
  let filtered = users.value

  // Filter by role
  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Methods
const refreshUsers = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await usersAPI.getUsers()
    const apiUsers = response.data.data || response.data
    
    // Transform backend data to match our interface
    users.value = apiUsers.map((user: any): User => {
      // Use role_names[0] from backend for display, fallback to role field
      let userRole: 'admin' | 'manager' | 'user' = 'user'
      if (user.role_names && Array.isArray(user.role_names) && user.role_names.length > 0) {
        userRole = user.role_names[0] as 'admin' | 'manager' | 'user'
      } else if (user.role) {
        userRole = user.role as 'admin' | 'manager' | 'user'
      }
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userRole,
        role_names: user.role_names || [],
        status: user.status || 'active',
        last_login: user.last_login,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    })
  } catch (err: any) {
    console.error('Failed to load users from API:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load users from API'
    showError('Failed to load users from API, showing mock data')
    
    // Fallback to mock data if API fails
    users.value = mockUsers
  } finally {
    loading.value = false
  }
}

const createUser = () => {
  router.push('/users/create')
}

const editUser = (user: User) => {
  router.push(`/users/${user.id}/edit`)
}

const viewUser = (user: User) => {
  userToView.value = user
  showViewModal.value = true
}

const editUserFromModal = () => {
  if (userToView.value) {
    showViewModal.value = false
    editUser(userToView.value)
  }
}

const deleteUser = (user: User) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!userToDelete.value) return
  
  try {
    await usersAPI.deleteUser(userToDelete.value.id)
    
    // Remove from local array
    users.value = users.value.filter((u: User) => u.id !== userToDelete.value!.id)
    
    showDeleteModal.value = false
    userToDelete.value = null
    success('User deleted successfully')
  } catch (err: any) {
    console.error('Failed to delete user:', err)
    showError('Failed to delete user')
  }
}

const toggleUserStatus = (user: User) => {
  userToToggle.value = user
  showStatusModal.value = true
}

const confirmStatusToggle = async () => {
  if (!userToToggle.value) return
  
  try {
    const newStatus = userToToggle.value.status === 'active' ? 'inactive' : 'active'
    
    // Call API to update user status
    await usersAPI.updateUser(userToToggle.value.id, {
      status: newStatus
    })
    
    // Update status in local array
    const userIndex = users.value.findIndex((u: User) => u.id === userToToggle.value!.id)
    if (userIndex !== -1) {
      users.value[userIndex].status = newStatus
      users.value[userIndex].updated_at = new Date().toISOString()
    }
    
    showStatusModal.value = false
    userToToggle.value = null
    success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
  } catch (err) {
    console.error('Failed to toggle user status:', err)
    showError('Failed to update user status')
  }
}

const setActiveTab = (tab: 'users' | 'teams') => {
  activeTab.value = tab
  // Reset filters when switching tabs
  if (tab === 'users') {
    roleFilter.value = 'all'
    statusFilter.value = 'all'
    searchQuery.value = ''
  }
}

const setRoleFilter = (role: 'all' | 'admin' | 'manager' | 'user') => {
  roleFilter.value = role
}

const setStatusFilter = (status: 'all' | 'active' | 'inactive') => {
  statusFilter.value = status
}

const debouncedSearch = debounce(() => {
  // Search is handled by computed property
}, 300)

// Role display utility
const roleDisplay = {
  admin: "Administrator",
  manager: "Manager", 
  user: "Standard User",
  sales_rep: "Sales Representative"
}

const getRoleDisplayName = (roleKey: string) => {
  return roleDisplay[roleKey as keyof typeof roleDisplay] || roleKey.charAt(0).toUpperCase() + roleKey.slice(1)
}

const getRoleBadgeClass = (role: string) => {
  const classes = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-purple-100 text-purple-800',
    user: 'bg-green-100 text-green-800'
  }
  return classes[role as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  refreshUsers()
})

// Initialize with mock data as fallback
users.value = mockUsers
</script>
