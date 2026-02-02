<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Leave Management</h1>
        <p class="mt-2 text-lg text-gray-600">Manage leave requests and balances</p>
      </div>
      <button
        @click="showRequestModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Apply for Leave
      </button>
    </div>

    <!-- Leave Balances -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Leave Balances</h2>
      <div v-if="leaveStore.loading" class="text-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto"></div>
      </div>
      <div v-else-if="leaveStore.leaveBalances.length" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="balance in leaveStore.leaveBalances"
          :key="balance.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ balance.leave_type?.name || 'N/A' }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ balance.balance }} days</p>
            </div>
            <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            Used: {{ balance.used_this_year }} / Accrued: {{ balance.accrued_this_year }}
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-gray-500">No leave balances available</p>
    </div>

    <!-- Leave Requests -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-900">Leave Requests</h2>
      </div>
      <div class="p-6">
        <div v-if="leaveStore.loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading leave requests...</p>
        </div>
        <div v-else-if="leaveStore.leaveRequests.length" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="request in leaveStore.leaveRequests" :key="request.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ request.leave_type?.name || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(request.start_date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(request.end_date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ request.days_requested }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-yellow-100 text-yellow-800': request.status === 'pending',
                      'bg-green-100 text-green-800': request.status === 'approved',
                      'bg-red-100 text-red-800': request.status === 'rejected',
                      'bg-gray-100 text-gray-800': request.status === 'cancelled'
                    }"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ request.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    v-if="request.status === 'pending' || request.status === 'approved'"
                    @click="handleCancelRequest(request.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-center py-12 text-sm text-gray-500">No leave requests found</p>
      </div>
    </div>

    <!-- Create Leave Request Modal -->
    <div
      v-if="showRequestModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showRequestModal = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Apply for Leave</h3>
            <button
              @click="showRequestModal = false"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleCreateRequest">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
                <select
                  v-model="newRequest.leave_type_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select leave type</option>
                  <option v-for="type in leaveStore.leaveTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    v-model="newRequest.start_date"
                    type="date"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                  <input
                    v-model="newRequest.end_date"
                    type="date"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Days Requested *</label>
                <input
                  v-model.number="newRequest.days_requested"
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  v-model="newRequest.reason"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Reason for leave..."
                ></textarea>
              </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="showRequestModal = false"
                class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {{ creating ? 'Submitting...' : 'Submit Request' }}
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
import { useRoute } from 'vue-router'
import { useHrLeaveStore } from '../store/hrLeave'
import { useHrEmployeesStore } from '../store/hrEmployees'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const route = useRoute()
const leaveStore = useHrLeaveStore()
const employeesStore = useHrEmployeesStore()

const showRequestModal = ref(false)
const creating = ref(false)

const newRequest = ref({
  employee_id: null,
  leave_type_id: null,
  start_date: '',
  end_date: '',
  days_requested: 0,
  reason: ''
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const loadData = async () => {
  // Get employee ID from query params or use current user's employee record
  const employeeId = route.query.employee_id || null
  
  await Promise.all([
    leaveStore.fetchLeaveBalances(employeeId ? { employee_id: employeeId } : {}),
    leaveStore.fetchLeaveRequests(employeeId ? { employee_id: employeeId } : {}),
    leaveStore.fetchLeaveTypes()
  ])
}

const handleCreateRequest = async () => {
  creating.value = true
  
  try {
    // Calculate days if not provided
    if (!newRequest.value.days_requested && newRequest.value.start_date && newRequest.value.end_date) {
      const start = new Date(newRequest.value.start_date)
      const end = new Date(newRequest.value.end_date)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      newRequest.value.days_requested = diffDays
    }

    // Get current employee ID (should be from user context)
    if (!newRequest.value.employee_id) {
      // For now, we'll need to get this from the current user's employee record
      // This should be handled by the backend based on the authenticated user
      newRequest.value.employee_id = 1 // Placeholder - should come from user context
    }

    await leaveStore.createLeaveRequest(newRequest.value)
    
    showSuccess('Leave request submitted successfully')
    showRequestModal.value = false
    
    // Reset form
    newRequest.value = {
      employee_id: null,
      leave_type_id: null,
      start_date: '',
      end_date: '',
      days_requested: 0,
      reason: ''
    }
    
    // Reload data
    await loadData()
  } catch (err) {
    showError(err.message || 'Failed to submit leave request')
  } finally {
    creating.value = false
  }
}

const handleCancelRequest = async (requestId) => {
  if (!confirm('Are you sure you want to cancel this leave request?')) {
    return
  }

  try {
    await leaveStore.cancelLeaveRequest(requestId)
    showSuccess('Leave request cancelled successfully')
    await loadData()
  } catch (err) {
    showError(err.message || 'Failed to cancel leave request')
  }
}

onMounted(() => {
  loadData()
})
</script>

