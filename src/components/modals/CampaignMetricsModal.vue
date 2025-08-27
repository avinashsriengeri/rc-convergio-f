<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              Campaign Metrics: {{ campaign?.name }}
            </h3>
            <p class="text-sm text-gray-600 mt-1">Detailed analytics and performance data</p>
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

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- Metrics Content -->
        <div v-else class="space-y-6">
          <!-- Key Metrics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-blue-100">Total Recipients</p>
                  <p class="text-2xl font-bold">{{ metrics.total_recipients || 0 }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-green-100">Delivered</p>
                  <p class="text-2xl font-bold">{{ metrics.delivered || 0 }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-purple-100">Opened</p>
                  <p class="text-2xl font-bold">{{ metrics.opened || 0 }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-orange-100">Clicked</p>
                  <p class="text-2xl font-bold">{{ metrics.clicked || 0 }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Rate Metrics -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4">Open Rate</h4>
              <div class="flex items-center">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">Current</span>
                    <span class="text-2xl font-bold text-blue-600">{{ metrics.open_rate || 0 }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" :style="{ width: (metrics.open_rate || 0) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4">Click Rate</h4>
              <div class="flex items-center">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">Current</span>
                    <span class="text-2xl font-bold text-green-600">{{ metrics.click_rate || 0 }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" :style="{ width: (metrics.click_rate || 0) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4">Bounce Rate</h4>
              <div class="flex items-center">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">Current</span>
                    <span class="text-2xl font-bold text-red-600">{{ metrics.bounce_rate || 0 }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-red-600 h-2 rounded-full" :style="{ width: (metrics.bounce_rate || 0) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Timeline -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Performance Timeline</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivered
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opened
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clicked
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bounced
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="timeline in metrics.timeline" :key="timeline.date" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(timeline.date) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ timeline.sent || 0 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ timeline.delivered || 0 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ timeline.opened || 0 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ timeline.clicked || 0 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ timeline.bounced || 0 }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Top Links -->
          <div v-if="metrics.top_links && metrics.top_links.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Top Clicked Links</h4>
            <div class="space-y-3">
              <div v-for="link in metrics.top_links" :key="link.url" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ link.url }}</p>
                  <p class="text-xs text-gray-500">{{ link.clicks }} clicks</p>
                </div>
                <div class="ml-4">
                  <span class="text-sm text-gray-600">{{ link.click_rate }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Geographic Data -->
          <div v-if="metrics.geographic_data && metrics.geographic_data.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Geographic Performance</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="geo in metrics.geographic_data" :key="geo.country" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-900">{{ geo.country }}</span>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-900">{{ geo.opens }} opens</p>
                  <p class="text-xs text-gray-500">{{ geo.open_rate }}% rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
          <BaseButton
            type="button"
            variant="secondary"
            @click="$emit('close')"
          >
            Close
          </BaseButton>
          <BaseButton
            type="button"
            variant="primary"
            @click="exportMetrics"
            :loading="exporting"
          >
            Export Data
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { campaignsAPI } from '@/services/api'
import { success, error } from '@/utils/notifications'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  campaign: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

// Reactive data
const loading = ref(false)
const exporting = ref(false)
const metrics = ref({})

// Methods
const loadMetrics = async () => {
  if (!props.campaign?.id) return
  
  loading.value = true
  try {
    const response = await campaignsAPI.getCampaignMetrics(props.campaign.id)
    metrics.value = response.data.data
  } catch (err) {
    console.error('Error loading campaign metrics:', err)
    error('Failed to load campaign metrics')
  } finally {
    loading.value = false
  }
}

const exportMetrics = async () => {
  if (!props.campaign?.id) return
  
  exporting.value = true
  try {
    const response = await campaignsAPI.getCampaignMetrics(props.campaign.id, { export: true })
    
    // Create download link
    const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `campaign-metrics-${props.campaign.name}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    success('Metrics exported successfully')
  } catch (err) {
    console.error('Error exporting metrics:', err)
    error('Failed to export metrics')
  } finally {
    exporting.value = false
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  loadMetrics()
})
</script>
