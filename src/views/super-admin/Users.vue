<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Cross-Tenant Users</h1>
            <p class="text-sm text-gray-600 mt-1">Manage users across all tenants</p>
          </div>
          <BaseButton
            variant="primary"
            @click="showCreateModal = true"
            class="flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create User
          </BaseButton>
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
              @click="tenantFilter = null"
              :class="{ 'bg-blue-50 border-blue-200 text-blue-700': !tenantFilter }"
            >
              All Tenants
            </BaseButton>
            <BaseButton
              v-for="tenant in availableTenants"
              :key="tenant.id"
              type="button"
              variant="outline"
              size="sm"
              @click="tenantFilter = tenant.id"
              :class="{ 'bg-blue-50 border-blue-200 text-blue-700': tenantFilter === tenant.id }"
            >
              {{ tenant.organization_name || tenant.name }}
            </BaseButton>
          </div>
          
          <div class="flex items-center space-x-2">
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
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-purple"></div>
      </div>

      <!-- Users Table -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ user.tenant?.organization_name || user.tenant?.name || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    {{ getUserRole(user) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(user.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="editUser(user)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && users.length === 0" class="px-6 py-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
        </div>

        <!-- Pagination -->
        <div v-if="users.length > 0" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ ((currentPage - 1) * perPage) + 1 }} to {{ Math.min(currentPage * perPage, total) }} of {{ total }} results
          </div>
          <div class="flex items-center space-x-2">
            <BaseButton
              variant="outline"
              size="sm"
              @click="currentPage--"
              :disabled="currentPage === 1"
            >
              Previous
            </BaseButton>
            <BaseButton
              variant="outline"
              size="sm"
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
            >
              Next
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click.self="closeModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Edit User' : 'Create User' }}
          </h3>
          <form @submit.prevent="saveUser" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <BaseInput
                v-model="userForm.name"
                placeholder="Enter name"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <BaseInput
                v-model="userForm.email"
                type="email"
                placeholder="Enter email"
                required
              />
            </div>
            <div v-if="!showEditModal">
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <BaseInput
                v-model="userForm.password"
                type="password"
                placeholder="Enter password"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tenant</label>
              <select
                v-model="userForm.tenant_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-primary-purple"
                required
              >
                <option value="">Select tenant</option>
                <option v-for="tenant in availableTenants" :key="tenant.id" :value="tenant.id">
                  {{ tenant.organization_name || tenant.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                v-model="userForm.role"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-primary-purple"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-model="userForm.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-primary-purple"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div class="flex items-center justify-end space-x-3 pt-4">
              <BaseButton
                type="button"
                variant="outline"
                @click="closeModal"
              >
                Cancel
              </BaseButton>
              <BaseButton
                type="submit"
                variant="primary"
                :loading="saving"
              >
                {{ showEditModal ? 'Update' : 'Create' }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { superAdminAPI } from '@/services/api'
import { useNotifications } from '@/composables/useNotifications'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { debounce } from 'lodash-es'

const { success, error } = useNotifications()

const loading = ref(true)
const saving = ref(false)
const users = ref([])
const availableTenants = ref([])
const currentPage = ref(1)
const perPage = ref(15)
const total = ref(0)
const searchQuery = ref('')
const tenantFilter = ref(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingUser = ref(null)

const userForm = ref({
  name: '',
  email: '',
  password: '',
  tenant_id: '',
  role: 'user',
  status: 'active'
})

const totalPages = computed(() => Math.ceil(total.value / perPage.value))

const debouncedSearch = debounce(() => {
  currentPage.value = 1
  fetchUsers()
}, 300)

watch([tenantFilter], () => {
  currentPage.value = 1
  fetchUsers()
})

const fetchTenants = async () => {
  try {
    const response = await superAdminAPI.getTenants({ per_page: 100 })
    const data = response.data
    availableTenants.value = data.data || data || []
  } catch (err) {
    console.error('Failed to fetch tenants:', err)
  }
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: perPage.value,
      search: searchQuery.value || undefined,
      tenant_id: tenantFilter.value || undefined
    }
    
    const response = await superAdminAPI.getUsers(params)
    const data = response.data
    
    if (data.data) {
      users.value = data.data
      total.value = data.total || data.data.length
    } else {
      users.value = Array.isArray(data) ? data : []
      total.value = users.value.length
    }
  } catch (err) {
    console.error('Failed to fetch users:', err)
    error('Failed to load users. Please try again.')
  } finally {
    loading.value = false
  }
}

const saveUser = async () => {
  saving.value = true
  try {
    if (showEditModal.value && editingUser.value) {
      await superAdminAPI.updateUser(editingUser.value.id, userForm.value)
      success('User updated successfully')
    } else {
      await superAdminAPI.createUser(userForm.value)
      success('User created successfully')
    }
    closeModal()
    fetchUsers()
  } catch (err) {
    console.error('Failed to save user:', err)
    error(err.response?.data?.message || 'Failed to save user. Please try again.')
  } finally {
    saving.value = false
  }
}

const editUser = (user) => {
  editingUser.value = user
  userForm.value = {
    name: user.name || '',
    email: user.email || '',
    password: '',
    tenant_id: user.tenant_id || user.tenant?.id || '',
    role: getUserRole(user) || 'user',
    status: user.status || 'active'
  }
  showEditModal.value = true
}

const getUserRole = (user) => {
  if (user.roles && user.roles.length > 0) {
    const role = user.roles[0]
    return typeof role === 'object' ? role.name : role
  }
  return user.role || 'user'
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    password: '',
    tenant_id: '',
    role: 'user',
    status: 'active'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

watch(currentPage, () => {
  fetchUsers()
})

onMounted(async () => {
  await fetchTenants()
  await fetchUsers()
})
</script>

