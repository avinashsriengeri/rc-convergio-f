<template>
  <div class="health-check-container">
    <div 
      v-if="showHealthCheck" 
      class="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm"
    >
      <div class="flex items-center justify-between mb-2">
        <h4 class="text-sm font-medium text-gray-900">System Health</h4>
        <button 
          @click="showHealthCheck = false"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">API Status:</span>
          <span :class="healthStatus.api ? 'text-green-600' : 'text-red-600'">
            {{ healthStatus.api ? '✅ Healthy' : '❌ Error' }}
          </span>
        </div>
        
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Database:</span>
          <span :class="healthStatus.database ? 'text-green-600' : 'text-red-600'">
            {{ healthStatus.database ? '✅ Connected' : '❌ Error' }}
          </span>
        </div>
        
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Tracking:</span>
          <span :class="healthStatus.tracking ? 'text-green-600' : 'text-red-600'">
            {{ healthStatus.tracking ? '✅ Active' : '❌ Error' }}
          </span>
        </div>
        
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Last Check:</span>
          <span class="text-gray-500">{{ formatTime(healthStatus.lastCheck) }}</span>
        </div>
      </div>
      
      <button 
        @click="performHealthCheck"
        :disabled="checking"
        class="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xs py-1 px-2 rounded transition-colors"
      >
        {{ checking ? 'Checking...' : 'Check Now' }}
      </button>
    </div>
    
    <!-- Health Check Toggle Button -->
    <button 
      @click="toggleHealthCheck"
      class="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-full shadow-lg z-40"
      title="System Health Check"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const showHealthCheck = ref(false)
const checking = ref(false)
const healthStatus = ref({
  api: null,
  database: null,
  tracking: null,
  lastCheck: null
})

const formatTime = (timestamp) => {
  if (!timestamp) return 'Never'
  return new Date(timestamp).toLocaleTimeString()
}

const performHealthCheck = async () => {
  checking.value = true
  
  try {
    // Check API health endpoint
    const healthResponse = await api.get('/health')
    healthStatus.value.api = healthResponse.status === 200
    
    // Check database connectivity through a simple query
    const dbResponse = await api.get('/tracking/actions')
    healthStatus.value.database = dbResponse.status === 200
    
    // Check tracking endpoint
    const trackingResponse = await api.get('/tracking/intent?per_page=1')
    healthStatus.value.tracking = trackingResponse.status === 200
    
    healthStatus.value.lastCheck = new Date().toISOString()
    
  } catch (error) {
    console.error('Health check failed:', error)
    healthStatus.value.api = false
    healthStatus.value.database = false
    healthStatus.value.tracking = false
    healthStatus.value.lastCheck = new Date().toISOString()
  } finally {
    checking.value = false
  }
}

const toggleHealthCheck = () => {
  showHealthCheck.value = !showHealthCheck.value
  if (showHealthCheck.value && !healthStatus.value.lastCheck) {
    performHealthCheck()
  }
}

// Auto health check on mount
onMounted(() => {
  // Perform initial health check after 5 seconds
  setTimeout(() => {
    performHealthCheck()
  }, 5000)
})
</script>

<style scoped>
.health-check-container {
  font-family: system-ui, -apple-system, sans-serif;
}
</style>


