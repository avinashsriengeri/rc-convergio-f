<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Designations</h1>
        <p class="mt-2 text-lg text-gray-600">Manage job designations and titles</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Designation
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search designations..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="handleSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select
            v-model="filters.department_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option :value="null">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }} ({{ dept.code }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.is_active"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
            <option value="">All</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="designationsStore.loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading designations...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="designationsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-red-800">Error loading designations</h3>
          <p class="mt-1 text-sm text-red-700">{{ designationsStore.error }}</p>
        </div>
        <button
          @click="loadDesignations"
          class="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Designations Table -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="designation in designationsStore.designations" :key="designation.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ designation.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ designation.code }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span v-if="designation.department" class="font-medium">
                  {{ designation.department.name }}
                  <span class="text-gray-400">({{ designation.department.code }})</span>
                </span>
                <span v-else class="text-gray-400 italic">Shared (All Departments)</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ designation.description || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="designation.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ designation.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="designation.is_manager"
                  class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800"
                >
                  Manager
                </span>
                <span v-else class="text-xs text-gray-400">—</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editDesignation(designation)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="deleteDesignation(designation.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="designationsStore.designations.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-sm text-gray-500">
                No designations found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingDesignation"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editingDesignation ? 'Edit Designation' : 'Add New Designation' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  v-model="formData.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                <input
                  v-model="formData.code"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., SDEV, MGR, DIR"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Department (Optional)</label>
                <select
                  v-model="formData.department_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option :value="null">None - Shared across all departments</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }} ({{ dept.code }})
                  </option>
                </select>
                <p class="mt-1 text-xs text-gray-500">Leave as "None" to make this designation available across all departments</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  v-model="formData.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              <div>
                <label class="flex items-center">
                  <input
                    v-model="formData.is_active"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>

              <div>
                <label class="flex items-center">
                  <input
                    v-model="formData.is_manager"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Is Manager</span>
                </label>
                <p class="mt-1 text-xs text-gray-500">
                  Mark if employees with this designation can manage others
                </p>
              </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {{ saving ? 'Saving...' : (editingDesignation ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHrDesignationsStore } from '../store/hrDesignations'
import { useHrDepartmentsStore } from '../store/hrDepartments'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const designationsStore = useHrDesignationsStore()
const departmentsStore = useHrDepartmentsStore()

const searchQuery = ref('')
const showCreateModal = ref(false)
const editingDesignation = ref(null)
const saving = ref(false)
const departments = ref([])

const filters = ref({
  is_active: true,
  department_id: null
})

const formData = ref({
  name: '',
  code: '',
  description: '',
  department_id: null,
  is_active: true,
  is_manager: false
})

const loadDesignations = async () => {
  await designationsStore.fetchDesignations({
    ...filters.value,
    search: searchQuery.value
  })
}

const handleSearch = () => {
  designationsStore.setFilters({ search: searchQuery.value, page: 1 })
  loadDesignations()
}

const applyFilters = () => {
  designationsStore.setFilters({ ...filters.value, page: 1 })
  loadDesignations()
}

const editDesignation = (designation) => {
  editingDesignation.value = designation
  formData.value = {
    name: designation.name,
    code: designation.code,
    description: designation.description || '',
    department_id: designation.department_id || null,
    is_active: designation.is_active,
    is_manager: designation.is_manager || false
  }
}

const deleteDesignation = async (id) => {
  if (!confirm('Are you sure you want to delete this designation? This action cannot be undone if employees are assigned.')) {
    return
  }

  try {
    await designationsStore.deleteDesignation(id)
    showSuccess('Designation deleted successfully')
    await loadDesignations()
  } catch (err) {
    showError(err.message || 'Failed to delete designation')
  }
}

const handleSubmit = async () => {
  saving.value = true
  
  try {
    if (editingDesignation.value) {
      await designationsStore.updateDesignation(editingDesignation.value.id, formData.value)
      showSuccess('Designation updated successfully')
      closeModal()
      // Reload for updates to ensure we have the latest data
      await loadDesignations()
    } else {
      await designationsStore.createDesignation(formData.value)
      showSuccess('Designation created successfully')
      closeModal()
      // Don't reload immediately after create - the store already added it locally
      // This prevents the newly created designation from disappearing if API returns empty
      // The designation will appear immediately in the list
    }
  } catch (err) {
    showError(err.message || 'Failed to save designation')
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingDesignation.value = null
  formData.value = {
    name: '',
    code: '',
    description: '',
    department_id: null,
    is_active: true,
    is_manager: false
  }
}

const loadDepartments = async () => {
  try {
    await departmentsStore.fetchDepartments({ per_page: 100, is_active: true })
    departments.value = departmentsStore.activeDepartments
  } catch (err) {
    console.error('Failed to load departments:', err)
  }
}

onMounted(async () => {
  await Promise.all([
    loadDesignations(),
    loadDepartments()
  ])
})
</script>

