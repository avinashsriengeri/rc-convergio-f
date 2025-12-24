<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Tenants Management</h1>
            <p class="text-sm text-gray-600 mt-1">Manage all system tenants</p>
          </div>
          <BaseButton
            variant="primary"
            @click="showCreateModal = true"
            class="flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Tenant
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
              @click="statusFilter = 'all'"
              :class="{ 'bg-blue-50 border-blue-200 text-blue-700': statusFilter === 'all' }"
            >
              All
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              @click="statusFilter = 'active'"
              :class="{ 'bg-green-50 border-green-200 text-green-700': statusFilter === 'active' }"
            >
              Active
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              @click="statusFilter = 'inactive'"
              :class="{ 'bg-gray-50 border-gray-200 text-gray-700': statusFilter === 'inactive' }"
            >
              Inactive
            </BaseButton>
          </div>
          
          <div class="flex items-center space-x-2">
            <BaseInput
              v-model="searchQuery"
              placeholder="Search tenants..."
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

      <!-- Tenants Table -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teams</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="tenant in tenants" :key="tenant.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ tenant.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ tenant.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ tenant.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ tenant.organization_name || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ tenant.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ tenant.teams_count || 0 }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(tenant.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewTenant(tenant.id)"
                      class="text-primary-purple hover:text-primary-pink"
                    >
                      View
                    </button>
                    <button
                      @click="editTenant(tenant)"
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
        <div v-if="!loading && tenants.length === 0" class="px-6 py-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No tenants</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new tenant.</p>
        </div>

        <!-- Pagination -->
        <div v-if="tenants.length > 0" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
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
            {{ showEditModal ? 'Edit Tenant' : 'Create Tenant' }}
          </h3>
          <form @submit.prevent="saveTenant" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <BaseInput
                v-model="tenantForm.name"
                placeholder="Enter name"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <BaseInput
                v-model="tenantForm.email"
                type="email"
                placeholder="Enter email"
                required
              />
            </div>
            <div v-if="!showEditModal">
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <BaseInput
                v-model="tenantForm.password"
                type="password"
                placeholder="Enter password"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <BaseInput
                v-model="tenantForm.organization_name"
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-model="tenantForm.status"
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
const tenants = ref([])
const currentPage = ref(1)
const perPage = ref(15)
const total = ref(0)
const searchQuery = ref('')
const statusFilter = ref('all')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTenant = ref(null)

const tenantForm = ref({
  name: '',
  email: '',
  password: '',
  organization_name: '',
  status: 'active'
})

const totalPages = computed(() => Math.ceil(total.value / perPage.value))

const debouncedSearch = debounce(() => {
  currentPage.value = 1
  fetchTenants()
}, 300)

watch([statusFilter], () => {
  currentPage.value = 1
  fetchTenants()
})

const fetchTenants = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: perPage.value,
      search: searchQuery.value || undefined,
      status: statusFilter.value !== 'all' ? statusFilter.value : undefined
    }
    
    const response = await superAdminAPI.getTenants(params)
    const data = response.data
    
    if (data.data) {
      tenants.value = data.data
      total.value = data.total || data.data.length
    } else {
      tenants.value = Array.isArray(data) ? data : []
      total.value = tenants.value.length
    }
  } catch (err) {
    console.error('Failed to fetch tenants:', err)
    error('Failed to load tenants. Please try again.')
  } finally {
    loading.value = false
  }
}

const saveTenant = async () => {
  saving.value = true
  try {
    if (showEditModal.value && editingTenant.value) {
      await superAdminAPI.updateTenant(editingTenant.value.id, tenantForm.value)
      success('Tenant updated successfully')
    } else {
      await superAdminAPI.createTenant(tenantForm.value)
      success('Tenant created successfully')
    }
    closeModal()
    fetchTenants()
  } catch (err) {
    console.error('Failed to save tenant:', err)
    error(err.response?.data?.message || 'Failed to save tenant. Please try again.')
  } finally {
    saving.value = false
  }
}

const editTenant = (tenant) => {
  editingTenant.value = tenant
  tenantForm.value = {
    name: tenant.name || '',
    email: tenant.email || '',
    password: '',
    organization_name: tenant.organization_name || '',
    status: tenant.status || 'active'
  }
  showEditModal.value = true
}

const viewTenant = (id) => {
  // Navigate to tenant detail view (can be implemented later)
  console.log('View tenant:', id)
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTenant.value = null
  tenantForm.value = {
    name: '',
    email: '',
    password: '',
    organization_name: '',
    status: 'active'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

watch(currentPage, () => {
  fetchTenants()
})

onMounted(() => {
  fetchTenants()
})
</script>

