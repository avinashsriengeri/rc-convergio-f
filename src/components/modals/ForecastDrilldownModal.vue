<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Background overlay -->
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <!-- Header -->
        <div class="bg-white px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                Pipeline Drill-Down: {{ selectedStage || 'All Stages' }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">Detailed breakdown of deals and values</p>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="bg-white px-6 py-4">
          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p class="text-gray-600">Loading pipeline details...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-12">
            <div class="text-red-600 mb-4">
              <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
            <p class="text-gray-600 mb-4">{{ error }}</p>
            <button @click="loadDrilldownData" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Try Again
            </button>
          </div>

          <!-- Data Content -->
          <div v-else-if="drilldownData && drilldownData.length > 0">
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div class="bg-blue-50 rounded-lg p-4">
                <div class="text-sm font-medium text-blue-600">Total Deals</div>
                <div class="text-2xl font-bold text-blue-900">{{ formatNumber(totalDeals) }}</div>
              </div>
              <div class="bg-green-50 rounded-lg p-4">
                <div class="text-sm font-medium text-green-600">Total Value</div>
                <div class="text-2xl font-bold text-green-900">{{ formatCurrency(totalValue) }}</div>
              </div>
              <div class="bg-purple-50 rounded-lg p-4">
                <div class="text-sm font-medium text-purple-600">Weighted Value</div>
                <div class="text-2xl font-bold text-purple-900">{{ formatCurrency(totalWeighted) }}</div>
              </div>
              <div class="bg-orange-50 rounded-lg p-4">
                <div class="text-sm font-medium text-orange-600">Avg Probability</div>
                <div class="text-2xl font-bold text-orange-900">{{ formatPercentage(avgProbability) }}</div>
              </div>
            </div>

            <!-- Data Table -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deals</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weighted Value</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Probability</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="item in drilldownData" :key="item.stage" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div :class="getStageColor(item.stage)" class="w-3 h-3 rounded-full mr-3"></div>
                        <span class="text-sm font-medium text-gray-900">{{ item.stage }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatNumber(item.count) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(item.value) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(item.weighted_value || item.value * (item.probability || 0.5)) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getProbabilityColor(item.probability || 0.5)" class="text-sm font-medium">
                        {{ formatPercentage((item.probability || 0.5) * 100) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button @click="viewStageDetails(item)" class="text-blue-600 hover:text-blue-900 transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- No Data State -->
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p class="text-gray-600">No pipeline breakdown data found for the selected stage.</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
          <button @click="closeModal" class="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors">
            Close
          </button>
          <button @click="exportDrilldownData" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Export Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { forecastingService, forecastingHelpers } from '@/services/forecasting'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  selectedStage: {
    type: String,
    default: null
  },
  timeframe: {
    type: String,
    default: 'monthly'
  }
})

const emit = defineEmits(['close'])

// Reactive state
const loading = ref(false)
const error = ref(null)
const drilldownData = ref([])

// Computed properties
const totalDeals = computed(() => {
  return drilldownData.value.reduce((sum, item) => sum + (item.count || 0), 0)
})

const totalValue = computed(() => {
  return drilldownData.value.reduce((sum, item) => sum + (item.value || 0), 0)
})

const totalWeighted = computed(() => {
  return drilldownData.value.reduce((sum, item) => {
    const weighted = item.weighted_value || (item.value * (item.probability || 0.5))
    return sum + weighted
  }, 0)
})

const avgProbability = computed(() => {
  if (drilldownData.value.length === 0) return 0
  const totalProb = drilldownData.value.reduce((sum, item) => sum + (item.probability || 0.5), 0)
  return (totalProb / drilldownData.value.length) * 100
})

// Methods
const closeModal = () => {
  emit('close')
}

const loadDrilldownData = async () => {
  if (!props.selectedStage) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await forecastingService.getPipelineBreakdown({
      timeframe: props.timeframe,
      stage: props.selectedStage
    })
    
    drilldownData.value = response.data.breakdown || []
  } catch (err) {
    error.value = err.message || 'Failed to load drilldown data'
    console.error('Error loading drilldown data:', err)
  } finally {
    loading.value = false
  }
}

const viewStageDetails = (item) => {
  // This could open another modal or navigate to a detailed view
  console.log('View stage details:', item)
}

const exportDrilldownData = () => {
  // Export functionality for drilldown data
  console.log('Export drilldown data:', drilldownData.value)
}

// Helper methods
const formatCurrency = (amount) => forecastingHelpers.formatCurrency(amount)
const formatNumber = (num) => forecastingHelpers.formatNumber(num)
const formatPercentage = (value) => forecastingHelpers.formatPercentage(value)

const getStageColor = (stage) => {
  const colors = {
    'Prospecting': 'bg-blue-500',
    'Qualification': 'bg-purple-500',
    'Proposal': 'bg-yellow-500',
    'Negotiation': 'bg-orange-500',
    'Closed Won': 'bg-green-500',
    'Closed Lost': 'bg-red-500'
  }
  return colors[stage] || 'bg-gray-500'
}

const getProbabilityColor = (probability) => {
  if (probability >= 0.8) return 'text-green-600'
  if (probability >= 0.6) return 'text-yellow-600'
  if (probability >= 0.4) return 'text-orange-600'
  return 'text-red-600'
}

// Watch for modal open/close and selected stage changes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.selectedStage) {
    loadDrilldownData()
  }
})

watch(() => props.selectedStage, (newStage) => {
  if (props.isOpen && newStage) {
    loadDrilldownData()
  }
})
</script>
