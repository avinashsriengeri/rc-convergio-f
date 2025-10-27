<template>
  <div>
    <!-- Header with Add Rule Button -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Assignment Rules</h2>
        <p class="mt-1 text-sm text-gray-600">Manage automatic lead and deal assignment rules</p>
      </div>
      <BaseButton
        @click="openCreateModal"
        variant="primary"
        size="md"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Rule
      </BaseButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading rules...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Rules</h3>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <BaseButton @click="loadRules" variant="primary">
        Try Again
      </BaseButton>
    </div>

    <!-- Rules Table -->
    <div v-else-if="rules.length > 0" class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rule Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Criteria Summary
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action Summary
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="rule in formattedRules" :key="rule.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ rule.name }}</div>
              <div class="text-sm text-gray-500 max-w-xs truncate">{{ rule.description }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ rule.priority }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-2">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    rule.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ rule.is_active ? 'Active' : 'Inactive' }}
                </span>
                <button
                  @click="toggleRule(rule)"
                  :disabled="toggleLoading === rule.id"
                  class="text-gray-400 hover:text-gray-600"
                  :title="rule.is_active ? 'Deactivate rule' : 'Activate rule'"
                >
                  <svg v-if="rule.is_active" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                  <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900 max-w-xs">{{ rule.criteria_summary }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900 max-w-xs">{{ rule.action_summary }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ rule.created_at_formatted }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center space-x-2">
                <button
                  @click="openEditModal(rule)"
                  class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  title="Edit rule"
                >
                  Edit
                </button>
                <button
                  @click="deleteRule(rule)"
                  :disabled="deleteLoading === rule.id"
                  class="text-red-600 hover:text-red-900 text-sm font-medium"
                  title="Delete rule"
                >
                  {{ deleteLoading === rule.id ? 'Deleting...' : 'Delete' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No Rules Found</h3>
      <p class="text-gray-600 mb-6">Get started by creating your first assignment rule.</p>
      <BaseButton @click="openCreateModal" variant="primary">
        Create First Rule
      </BaseButton>
    </div>

    <!-- Visual Rule Modal -->
    <VisualRuleModal
      :is-open="showModal"
      :rule="selectedRule"
      :loading="modalLoading"
      @close="closeModal"
      @save="saveRule"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue'
import { leadAssignmentService } from '@/services/leadAssignment'
import { error as showError, success as showSuccess } from '@/utils/notifications'
import BaseButton from '@/components/ui/BaseButton.vue'

// Lazy load modal component
const VisualRuleModal = defineAsyncComponent(() => import('./components/VisualRuleModal.vue'))

// Props
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits(['refresh'])

// Reactive state
const rules = ref([])
const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const selectedRule = ref(null)
const modalLoading = ref(false)
const toggleLoading = ref(null)
const deleteLoading = ref(null)

// Computed
const formattedRules = computed(() => {
  return rules.value.map(rule => leadAssignmentService.formatRuleForDisplay(rule))
})

// Methods
const loadRules = async () => {
  loading.value = true
  error.value = null
  
  try {
    const data = await leadAssignmentService.loadRules()
    rules.value = data.data || data
  } catch (err) {
    console.error('Error loading rules:', err)
    error.value = err.response?.data?.message || 'Failed to load rules'
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  selectedRule.value = null
  showModal.value = true
}

const openEditModal = (rule) => {
  selectedRule.value = { ...rule }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedRule.value = null
}

const saveRule = async (ruleData) => {
  console.log('saveRule received:', ruleData)
  console.log('saveRule criteria:', ruleData.criteria)
  console.log('saveRule conditions:', ruleData.criteria?.conditions)
  
  modalLoading.value = true
  
  try {
    if (selectedRule.value?.id) {
      // Update existing rule
      await leadAssignmentService.updateRule(selectedRule.value.id, ruleData)
      showSuccess('Rule updated successfully')
    } else {
      // Create new rule
      console.log('About to call createRule with:', ruleData)
      await leadAssignmentService.createRule(ruleData)
      showSuccess('Rule created successfully')
    }
    
    closeModal()
    await loadRules()
    emit('refresh')
  } catch (err) {
    console.error('Error saving rule:', err)
    showError(err.response?.data?.message || 'Failed to save rule')
  } finally {
    modalLoading.value = false
  }
}

const toggleRule = async (rule) => {
  toggleLoading.value = rule.id
  
  try {
    await leadAssignmentService.toggleRule(rule.id)
    showSuccess(`Rule ${rule.is_active ? 'deactivated' : 'activated'} successfully`)
    await loadRules()
    emit('refresh')
  } catch (err) {
    console.error('Error toggling rule:', err)
    showError(err.response?.data?.message || 'Failed to toggle rule')
  } finally {
    toggleLoading.value = null
  }
}

const deleteRule = async (rule) => {
  if (!confirm(`Are you sure you want to delete the rule "${rule.name}"?`)) {
    return
  }
  
  deleteLoading.value = rule.id
  
  try {
    await leadAssignmentService.deleteRule(rule.id)
    showSuccess('Rule deleted successfully')
    await loadRules()
    emit('refresh')
  } catch (err) {
    console.error('Error deleting rule:', err)
    showError(err.response?.data?.message || 'Failed to delete rule')
  } finally {
    deleteLoading.value = null
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  loadRules()
})
</script>
