<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Subscriptions</h3>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plan
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Period End
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="subscription in safeSubscriptions" :key="subscription?.id || Math.random()" class="hover:bg-gray-50">
            <!-- Customer -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-700">
                      {{ getInitials(subscription?.customer_name) }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ subscription?.customer_name || 'N/A' }}</div>
                  <div class="text-sm text-gray-500">{{ subscription?.customer_email || 'N/A' }}</div>
                </div>
              </div>
            </td>

            <!-- Plan -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ subscription?.plan_name || 'N/A' }}</div>
              <div class="text-sm text-gray-500">ID: {{ subscription?.plan_id || 'N/A' }}</div>
            </td>

            <!-- Status -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusColor(subscription?.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ getStatusText(subscription?.status) }}
              </span>
              <div v-if="subscription?.cancel_at_period_end" class="text-xs text-orange-600 mt-1">
                Cancels at period end
              </div>
            </td>

            <!-- Period End -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(subscription?.current_period_end) }}
            </td>

            <!-- Created -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(subscription?.created_at) }}
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="$emit('view-details', subscription)"
                  class="text-blue-600 hover:text-blue-800"
                  title="View Details"
                >
                  View Details
                </button>
                
                <div class="relative" v-if="subscription?.status === 'active'">
                  <button
                    @click="showChangePlan = subscription"
                    class="text-green-600 hover:text-green-800"
                    title="Change Plan"
                  >
                    Change Plan
                  </button>
                </div>
                
                <button
                  v-if="subscription?.status === 'active' && !subscription?.cancel_at_period_end"
                  @click="cancelSubscription(subscription)"
                  class="text-orange-600 hover:text-orange-800"
                  title="Cancel Subscription"
                >
                  Cancel
                </button>
                
                <button
                  @click="openPortal(subscription)"
                  class="text-purple-600 hover:text-purple-800"
                  title="Open Billing Portal"
                >
                  Portal
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="subscriptions.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No subscriptions</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating your first subscription plan.</p>
    </div>

    <!-- Change Plan Modal -->
    <div v-if="showChangePlan" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="showChangePlan = null">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Change Plan</h3>
          <p class="text-sm text-gray-600 mb-4">
            Change plan for {{ showChangePlan.customer_name }} ({{ showChangePlan.customer_email }})
          </p>
          
          <div class="space-y-2 mb-4">
            <label class="block text-sm font-medium text-gray-700">Select New Plan</label>
            <select v-model="selectedNewPlan" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Choose a plan...</option>
              <option v-for="plan in safeAvailablePlans" :key="plan.id" :value="plan.id">
                {{ plan.name }} - ${{ plan.price }}/{{ plan.interval }}
              </option>
            </select>
          </div>

          <div class="flex items-center justify-end space-x-3">
            <button
              @click="showChangePlan = null"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="confirmChangePlan"
              :disabled="!selectedNewPlan"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Change Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  subscriptions: {
    type: Array,
    default: () => []
  },
  availablePlans: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['view-details', 'change-plan', 'cancel', 'open-portal'])

const showChangePlan = ref(null)
const selectedNewPlan = ref('')

// Safely handle subscriptions data - ensure it's always an array
const safeSubscriptions = computed(() => {
  if (Array.isArray(props.subscriptions)) {
    return props.subscriptions
  } else if (props.subscriptions && props.subscriptions.data && Array.isArray(props.subscriptions.data)) {
    return props.subscriptions.data
  } else {
    return []
  }
})

// Safely handle available plans data - ensure it's always an array
const safeAvailablePlans = computed(() => {
  if (Array.isArray(props.availablePlans)) {
    return props.availablePlans
  } else if (props.availablePlans && props.availablePlans.data && Array.isArray(props.availablePlans.data)) {
    return props.availablePlans.data
  } else {
    return []
  }
})

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    trialing: 'bg-yellow-100 text-yellow-800',
    past_due: 'bg-orange-100 text-orange-800',
    cancelled: 'bg-gray-100 text-gray-800',
    incomplete: 'bg-red-100 text-red-800',
    incomplete_expired: 'bg-red-100 text-red-800',
    unpaid: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    active: 'Active',
    trialing: 'Trialing',
    past_due: 'Past Due',
    cancelled: 'Cancelled',
    incomplete: 'Incomplete',
    incomplete_expired: 'Expired',
    unpaid: 'Unpaid'
  }
  return texts[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const cancelSubscription = (subscription) => {
  if (window.Swal) {
    window.Swal.fire({
      title: 'Cancel Subscription?',
      text: `Are you sure you want to cancel ${subscription?.customer_name || 'this'}'s subscription?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        emit('cancel', subscription?.id)
      }
    })
  } else {
    if (confirm(`Cancel ${subscription?.customer_name || 'this'}'s subscription?`)) {
      emit('cancel', subscription?.id)
    }
  }
}

const openPortal = (subscription) => {
  emit('open-portal', subscription?.id)
}

const confirmChangePlan = () => {
  if (selectedNewPlan.value) {
    emit('change-plan', showChangePlan.value?.id, selectedNewPlan.value)
    showChangePlan.value = null
    selectedNewPlan.value = ''
  }
}
</script>
