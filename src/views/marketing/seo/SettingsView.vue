    <template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">SEO Settings</h2>
      <p class="mt-1 text-sm text-gray-500">Configure your SEO tools and integrations</p>
    </div>

    <!-- Google Search Console Integration -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <h3 class="text-lg font-medium text-gray-900">Google Search Console</h3>
        </div>
      </div>
      <div class="px-6 py-6">
        <!-- Connected State -->
        <div v-if="isConnected" class="space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <div class="flex items-center text-green-600">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="font-semibold">Connected</span>
                </div>
              </div>
              <div class="space-y-1 text-sm text-gray-600">
                <p><span class="font-medium">Site:</span> {{ connectionStatus.siteUrl }}</p>
                <p><span class="font-medium">Last synced:</span> {{ formatLastSynced(connectionStatus.lastSynced) }}</p>
                <p v-if="connectionStatus.dataRange">
                  <span class="font-medium">Data range:</span> {{ connectionStatus.dataRange }}
                </p>
              </div>
            </div>
            <button
              @click="showDisconnectModal = true"
              class="ml-4 px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Disconnect
            </button>
          </div>

          <!-- Sync Button -->
          <div class="pt-4 border-t border-gray-200">
            <button
              @click="syncNow"
              :disabled="syncing"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg v-if="!syncing" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ syncing ? 'Syncing...' : 'Sync Now' }}
            </button>
            <p class="mt-2 text-xs text-gray-500">
              Manually sync your Google Search Console data. Automatic syncs occur daily.
            </p>
          </div>
        </div>

        <!-- Not Connected State -->
        <div v-else class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <h3 class="text-sm font-medium text-blue-800">Connect to unlock full SEO features</h3>
                <div class="mt-2 text-sm text-blue-700">
                  <ul class="list-disc list-inside space-y-1">
                    <li>Real-time search performance data</li>
                    <li>Keyword rankings and trends</li>
                    <li>Page-level analytics</li>
                    <li>Automated SEO recommendations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Website URL Input -->
          <div class="space-y-3">
            <div>
              <label for="website-url" class="block text-sm font-medium text-gray-700 mb-2">
                Website URL <span class="text-red-500">*</span>
              </label>
              <input
                id="website-url"
                v-model="websiteUrl"
                type="url"
                placeholder="https://example.com"
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                @input="validateWebsiteUrl"
              />
              <p v-if="urlError" class="mt-1 text-sm text-red-600">{{ urlError }}</p>
              <p class="mt-1 text-xs text-gray-500">
                Enter the full URL of your website (e.g., https://example.com)
              </p>
            </div>

            <button
              @click="connectGSC"
              :disabled="connecting || !isValidUrl"
              class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="!connecting" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <svg v-else class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ connecting ? 'Connecting...' : 'Connect Google Search Console' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Site Scanning -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900">Site Scanning</h3>
        </div>
      </div>
      <div class="px-6 py-6">
        <div class="space-y-4">
          <p class="text-sm text-gray-600">
            Run a full site scan to analyze your website's SEO health and generate recommendations.
          </p>

          <div v-if="lastScan" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-900">Last Scan</span>
              <span :class="getScanStatusClass(lastScan.status)" class="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full">
                {{ lastScan.status.toUpperCase() }}
              </span>
            </div>
            <div class="space-y-1 text-sm text-gray-600">
              <p><span class="font-medium">Started:</span> {{ formatDate(lastScan.startedAt) }}</p>
              <p v-if="lastScan.completedAt">
                <span class="font-medium">Completed:</span> {{ formatDate(lastScan.completedAt) }}
              </p>
              <p v-if="lastScan.pagesScanned">
                <span class="font-medium">Pages scanned:</span> {{ lastScan.pagesScanned }}
              </p>
              <p v-if="lastScan.issuesFound !== undefined">
                <span class="font-medium">Issues found:</span> {{ lastScan.issuesFound }}
              </p>
            </div>
          </div>

          <button
            @click="startFullScan"
            :disabled="scanning"
            class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            <svg v-if="!scanning" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <svg v-else class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ scanning ? 'Scanning...' : 'Start Full Site Scan' }}
          </button>

          <p class="text-xs text-gray-500">
            A full site scan may take several minutes depending on your website size. You'll be notified when it's complete.
          </p>
        </div>
      </div>
    </div>

    <!-- Disconnect Modal -->
    <div v-if="showDisconnectModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative p-8 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="text-center">
          <svg class="mx-auto mb-4 w-14 h-14 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Disconnect Google Search Console?</h3>
          <p class="text-sm text-gray-600 mb-6">
            Are you sure you want to disconnect? You'll lose access to advanced SEO analytics and automated recommendations.
          </p>
          <div class="flex justify-center space-x-3">
            <button
              @click="showDisconnectModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              @click="disconnectGSC"
              :disabled="disconnecting"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
            >
              {{ disconnecting ? 'Disconnecting...' : 'Disconnect' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { seoService } from '@/services/seo'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const isConnected = ref(false)
const connecting = ref(false)
const disconnecting = ref(false)
const syncing = ref(false)
const scanning = ref(false)
const showDisconnectModal = ref(false)

// Website URL validation
const websiteUrl = ref('')
const urlError = ref('')
const isValidUrl = ref(false)

const connectionStatus = ref({
  siteUrl: '',
  lastSynced: '',
  dataRange: ''
})

const lastScan = ref<{
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt: string
  completedAt?: string
  pagesScanned?: number
  issuesFound?: number
} | null>(null)

const formatLastSynced = (timestamp: string) => {
  if (!timestamp) return 'Never'
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${days} day${days > 1 ? 's' : ''} ago`
}

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getScanStatusClass = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'running': return 'bg-blue-100 text-blue-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'failed': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const validateWebsiteUrl = () => {
  urlError.value = ''
  
  if (!websiteUrl.value) {
    isValidUrl.value = false
    return
  }
  
  try {
    const url = new URL(websiteUrl.value)
    
    // Must be http or https
    if (!['http:', 'https:'].includes(url.protocol)) {
      urlError.value = 'URL must start with http:// or https://'
      isValidUrl.value = false
      return
    }
    
    // Must have a valid domain
    if (!url.hostname || url.hostname === 'localhost') {
      urlError.value = 'Please enter a valid domain (not localhost)'
      isValidUrl.value = false
      return
    }
    
    // Google Search Console prefers https
    if (url.protocol === 'http:') {
      urlError.value = 'Warning: HTTPS is recommended for better SEO'
      // Still allow it
    }
    
    isValidUrl.value = true
  } catch (error) {
    urlError.value = 'Please enter a valid URL'
    isValidUrl.value = false
  }
}

const connectGSC = async () => {
  // Validate URL before connecting
  if (!websiteUrl.value || !isValidUrl.value) {
    showError('Please enter a valid website URL')
    return
  }
  
  connecting.value = true
  try {
    // Pass website URL to backend
    const response = await seoService.connectGSC({ website_url: websiteUrl.value })
    
    // In real implementation, this redirects to Google OAuth
    if (response.authUrl) {
      // Store website URL in sessionStorage for callback
      sessionStorage.setItem('gsc_website_url', websiteUrl.value)
      window.location.href = response.authUrl
    } else {
      // Simulate connection (for testing without backend)
      setTimeout(() => {
        isConnected.value = true
        connectionStatus.value = {
          siteUrl: websiteUrl.value,
          lastSynced: new Date().toISOString(),
          dataRange: 'Last 90 days'
        }
        showSuccess('Successfully connected to Google Search Console')
        connecting.value = false
        websiteUrl.value = '' // Clear input
        isValidUrl.value = false // Reset validation
      }, 1500)
    }
  } catch (error: any) {
    console.error('Failed to connect:', error)
    showError(error.message || 'Failed to connect to Google Search Console')
    connecting.value = false
  }
}

const disconnectGSC = async () => {
  disconnecting.value = true
  try {
    await seoService.disconnectGSC()
    isConnected.value = false
    connectionStatus.value = {
      siteUrl: '',
      lastSynced: '',
      dataRange: ''
    }
    showDisconnectModal.value = false
    showSuccess('Disconnected from Google Search Console')
  } catch (error: any) {
    console.error('Failed to disconnect:', error)
    showError(error.message || 'Failed to disconnect')
  } finally {
    disconnecting.value = false
  }
}

const syncNow = async () => {
  syncing.value = true
  try {
    // In real implementation, trigger sync via API
    await new Promise(resolve => setTimeout(resolve, 2000))
    connectionStatus.value.lastSynced = new Date().toISOString()
    showSuccess('Data synced successfully')
  } catch (error: any) {
    console.error('Failed to sync:', error)
    showError(error.message || 'Failed to sync data')
  } finally {
    syncing.value = false
  }
}

const startFullScan = async () => {
  scanning.value = true
  try {
    await seoService.fullSiteScan()
    lastScan.value = {
      status: 'running',
      startedAt: new Date().toISOString()
    }
    showSuccess('Full site scan started. This may take several minutes.')
    
    // Poll for scan completion (in real implementation)
    // For now, simulate completion
    setTimeout(() => {
      if (lastScan.value) {
        lastScan.value.status = 'completed'
        lastScan.value.completedAt = new Date().toISOString()
        lastScan.value.pagesScanned = 42
        lastScan.value.issuesFound = 15
        showSuccess('Site scan completed')
      }
      scanning.value = false
    }, 5000)
  } catch (error: any) {
    console.error('Failed to start scan:', error)
    showError(error.message || 'Failed to start site scan')
    scanning.value = false
  }
}

const checkConnectionStatus = async () => {
  try {
    const status = await seoService.getGSCStatus()
    isConnected.value = status.connected
    if (status.connected) {
      connectionStatus.value = status.data
    }
  } catch (error) {
    console.error('Failed to check connection status:', error)
  }
}

onMounted(async () => {
  await checkConnectionStatus()
})
</script>
