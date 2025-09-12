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

        <!-- Empty State -->
        <div v-else-if="!metrics || Object.keys(metrics).length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h4 class="mt-2 text-sm font-medium text-gray-900">No metrics available</h4>
          <p class="mt-1 text-sm text-gray-500">Campaign metrics will appear once the campaign is sent and recipients start engaging.</p>
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
                  <p class="text-sm font-medium text-blue-100">Recipients</p>
                  <p class="text-2xl font-bold">{{ metrics.sent_count || 0 }}</p>
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
                  <p class="text-sm font-medium text-green-100">Sent</p>
                  <p class="text-2xl font-bold">{{ metrics.sent_count || 0 }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-yellow-100">Opened</p>
                  <p class="text-2xl font-bold">{{ metrics.opened_count || 0 }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-purple-100">Clicked</p>
                  <p class="text-2xl font-bold">{{ metrics.clicked_count || 0 }}</p>
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
                    <span class="text-2xl font-bold text-blue-600">{{ metrics.open_percentage || 0 }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" :style="{ width: (metrics.open_percentage || 0) + '%' }"></div>
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
                    <span class="text-2xl font-bold text-green-600">{{ metrics.click_percentage || 0 }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" :style="{ width: (metrics.click_percentage || 0) + '%' }"></div>
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
                    <span class="text-2xl font-bold text-red-600">{{ metrics.bounce_percentage || 0 }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-red-600 h-2 rounded-full" :style="{ width: (metrics.bounce_percentage || 0) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Engagement Timeline -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-medium text-gray-900">Engagement Timeline</h4>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Sent</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Opened</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span>Clicked</span>
                </div>
              </div>
            </div>
            
            <!-- Chart Container -->
            <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div v-if="!metrics.timeline || metrics.timeline.length === 0" class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h4 class="mt-2 text-sm font-medium text-gray-900">No timeline data available</h4>
                <p class="mt-1 text-sm text-gray-500">Timeline data will appear as engagement events occur</p>
              </div>
              <div v-else class="w-full h-full p-4">
                <!-- Simple Bar Chart Implementation -->
                <div class="flex items-end justify-between h-full space-x-2">
                  <div v-for="(data, index) in metrics.timeline" :key="index" class="flex-1 flex flex-col items-center">
                    <div class="w-full flex flex-col items-center space-y-1 mb-2">
                      <!-- Sent Bar -->
                      <div class="w-full bg-green-500 rounded-t" :style="{ height: (data.sent_count / Math.max(...metrics.timeline.map(d => d.sent_count))) * 120 + 'px' }"></div>
                      <!-- Opened Bar -->
                      <div class="w-full bg-yellow-500" :style="{ height: (data.opened_count / Math.max(...metrics.timeline.map(d => d.sent_count))) * 120 + 'px' }"></div>
                      <!-- Clicked Bar -->
                      <div class="w-full bg-purple-500 rounded-b" :style="{ height: (data.clicked_count / Math.max(...metrics.timeline.map(d => d.sent_count))) * 120 + 'px' }"></div>
                    </div>
                    <div class="text-xs text-gray-600 text-center">
                      <div class="font-medium">{{ formatDateShort(data.date) }}</div>
                      <div class="text-gray-500">{{ data.sent_count }} sent</div>
                    </div>
                  </div>
                </div>
              </div>
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
            variant="outline"
            @click="loadMetrics"
            :loading="loading"
          >
            Refresh
          </BaseButton>
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
    console.log('Campaign metrics response:', response)
    
    // Handle the API response structure from the image
    if (response.data && response.data.data) {
      metrics.value = response.data.data
    } else {
      metrics.value = {}
    }
  } catch (err) {
    console.error('Error loading campaign metrics:', err)
    error('Failed to load campaign metrics')
    metrics.value = {}
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

const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

// Lifecycle
onMounted(() => {
  loadMetrics()
})
</script>
