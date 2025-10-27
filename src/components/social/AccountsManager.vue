<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Connected Accounts</h3>
        <p class="text-sm text-gray-600 mt-1">Manage your social media account connections</p>
      </div>
      <button
        @click="showConnectModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Connect Account
      </button>
    </div>

    <!-- Connected Accounts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Facebook -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="fab fa-facebook text-blue-600 text-xl"></i>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Facebook</h4>
              <p v-if="isConnected('facebook')" class="text-sm text-gray-600">
                @{{ getAccount('facebook')?.username }}
              </p>
              <p v-else class="text-sm text-gray-500">Not connected</p>
            </div>
          </div>
          <div>
            <button
              v-if="!isConnected('facebook')"
              @click="connectPlatform('facebook')"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Connect
            </button>
            <button
              v-else
              @click="disconnectPlatform('facebook')"
              class="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Disconnect
            </button>
          </div>
        </div>
        <div v-if="isConnected('facebook')" class="mt-3 pt-3 border-t border-gray-100">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Followers</span>
            <span class="font-medium text-gray-900">{{ formatNumber(getAccount('facebook')?.followers_count || 0) }}</span>
          </div>
        </div>
      </div>

      <!-- Instagram -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <i class="fab fa-instagram text-pink-600 text-xl"></i>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Instagram</h4>
              <p v-if="isConnected('instagram')" class="text-sm text-gray-600">
                @{{ getAccount('instagram')?.username }}
              </p>
              <p v-else class="text-sm text-gray-500">Not connected</p>
            </div>
          </div>
          <div>
            <button
              v-if="!isConnected('instagram')"
              @click="connectPlatform('instagram')"
              class="text-pink-600 hover:text-pink-700 text-sm font-medium"
            >
              Connect
            </button>
            <button
              v-else
              @click="disconnectPlatform('instagram')"
              class="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Disconnect
            </button>
          </div>
        </div>
        <div v-if="isConnected('instagram')" class="mt-3 pt-3 border-t border-gray-100">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Followers</span>
            <span class="font-medium text-gray-900">{{ formatNumber(getAccount('instagram')?.followers_count || 0) }}</span>
          </div>
        </div>
      </div>

      <!-- X/Twitter -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
              <i class="fab fa-twitter text-sky-600 text-xl"></i>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">X / Twitter</h4>
              <p v-if="isConnected('twitter')" class="text-sm text-gray-600">
                @{{ getAccount('twitter')?.username }}
              </p>
              <p v-else class="text-sm text-gray-500">Not connected</p>
            </div>
          </div>
          <div>
            <button
              v-if="!isConnected('twitter')"
              @click="connectPlatform('twitter')"
              class="text-sky-600 hover:text-sky-700 text-sm font-medium"
            >
              Connect
            </button>
            <button
              v-else
              @click="disconnectPlatform('twitter')"
              class="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Disconnect
            </button>
          </div>
        </div>
        <div v-if="isConnected('twitter')" class="mt-3 pt-3 border-t border-gray-100">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Followers</span>
            <span class="font-medium text-gray-900">{{ formatNumber(getAccount('twitter')?.followers_count || 0) }}</span>
          </div>
        </div>
      </div>

      <!-- LinkedIn -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="fab fa-linkedin text-blue-700 text-xl"></i>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">LinkedIn</h4>
              <p v-if="isConnected('linkedin')" class="text-sm text-gray-600">
                {{ getAccount('linkedin')?.username }}
              </p>
              <p v-else class="text-sm text-gray-500">Not connected</p>
            </div>
          </div>
          <div>
            <button
              v-if="!isConnected('linkedin')"
              @click="connectPlatform('linkedin')"
              class="text-blue-700 hover:text-blue-800 text-sm font-medium"
            >
              Connect
            </button>
            <button
              v-else
              @click="disconnectPlatform('linkedin')"
              class="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Disconnect
            </button>
          </div>
        </div>
        <div v-if="isConnected('linkedin')" class="mt-3 pt-3 border-t border-gray-100">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Connections</span>
            <span class="font-medium text-gray-900">{{ formatNumber(getAccount('linkedin')?.followers_count || 0) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Connection Instructions -->
    <div v-if="connectedAccounts.length === 0" class="mt-6 text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No accounts connected</h3>
      <p class="mt-1 text-sm text-gray-500">Connect your social media accounts to start publishing posts</p>
    </div>

    <!-- Connect Modal -->
    <div v-if="showConnectModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="showConnectModal = false">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Connect Social Account</h3>
            <button @click="showConnectModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-3">
            <button
              v-for="platform in availablePlatforms"
              :key="platform.value"
              @click="connectPlatform(platform.value)"
              :disabled="isConnected(platform.value)"
              :class="[
                'w-full flex items-center justify-between p-4 border rounded-lg transition-colors',
                isConnected(platform.value) 
                  ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
                  : 'bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
              ]"
            >
              <div class="flex items-center space-x-3">
                <i :class="[platform.icon, 'text-xl']"></i>
                <span class="font-medium text-gray-900">{{ platform.label }}</span>
              </div>
              <span v-if="isConnected(platform.value)" class="text-sm text-green-600 font-medium">
                Connected
              </span>
            </button>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-600">
              <svg class="inline w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              You'll be redirected to authorize access to your account. We only request read and publish permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSocialMediaStore, type ConnectedAccount } from '@/stores/socialMedia'
import { success as showSuccess, error as showError } from '@/utils/notifications'
import api from '@/services/api'

const socialMediaStore = useSocialMediaStore()

// State
const showConnectModal = ref(false)

// Computed
const connectedAccounts = computed(() => socialMediaStore.connectedAccounts)

const availablePlatforms = [
  { value: 'facebook', label: 'Facebook', icon: 'fab fa-facebook text-blue-600' },
  { value: 'instagram', label: 'Instagram', icon: 'fab fa-instagram text-pink-600' },
  { value: 'twitter', label: 'X / Twitter', icon: 'fab fa-twitter text-sky-600' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'fab fa-linkedin text-blue-700' }
]

// Methods
const isConnected = (platform: string) => {
  return socialMediaStore.isConnected(platform)
}

const getAccount = (platform: string) => {
  return connectedAccounts.value.find(acc => acc.platform === platform)
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const connectPlatform = async (platform: string) => {
  try {
    // Call backend API to initiate OAuth flow
    const response = await api.post(`/social/connect/${platform}`)
    
    if (response.data.auth_url) {
      // Redirect to OAuth authorization URL
      window.location.href = response.data.auth_url
    } else if (response.data.success && response.data.data) {
      // Account connected successfully
      socialMediaStore.connectAccount(response.data.data)
      showSuccess(`${platform} account connected successfully!`)
      showConnectModal.value = false
    }
  } catch (error: any) {
    console.error(`Failed to connect ${platform}:`, error)
    showError(`Failed to connect ${platform} account`)
  }
}

const disconnectPlatform = async (platform: string) => {
  if (!confirm(`Are you sure you want to disconnect your ${platform} account?`)) {
    return
  }

  try {
    // Call backend API to disconnect
    await api.post(`/social/disconnect/${platform}`)
    socialMediaStore.disconnectAccount(platform)
    showSuccess(`${platform} account disconnected successfully`)
  } catch (error: any) {
    console.error(`Failed to disconnect ${platform}:`, error)
    showError(`Failed to disconnect ${platform} account`)
  }
}
</script>
