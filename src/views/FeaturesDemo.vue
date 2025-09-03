<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Feature Access Demo</h1>
        <p class="text-gray-600">
          This page demonstrates the feature restriction system. Features are loaded from the backend and control UI visibility.
        </p>
        
        <!-- Feature Status -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="text-lg font-medium text-blue-900 mb-3">Feature Status</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="feature in features" :key="feature.feature" class="bg-white p-3 rounded border">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">{{ feature.feature }}</span>
                <span 
                  :class="feature.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 py-1 text-xs rounded-full font-medium"
                >
                  {{ feature.enabled ? 'Enabled' : 'Disabled' }}
                </span>
              </div>
              <p v-if="feature.reason" class="text-sm text-gray-600 mt-1">{{ feature.reason }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature Guard Demo -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- FeatureGuard Component Demo -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">FeatureGuard Component</h2>
          <p class="text-gray-600 mb-4">
            The FeatureGuard component conditionally renders content based on feature access.
          </p>
          
          <div class="space-y-4">
            <FeatureGuard feature="manage_users">
              <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 class="font-medium text-green-900">User Management Access</h4>
                <p class="text-sm text-green-700">This content is only visible to users with 'manage_users' feature.</p>
              </div>
            </FeatureGuard>
            
            <FeatureGuard feature="manage_campaigns">
              <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 class="font-medium text-blue-900">Campaign Management Access</h4>
                <p class="text-sm text-blue-700">This content is only visible to users with 'manage_campaigns' feature.</p>
              </div>
            </FeatureGuard>
            
            <FeatureGuard feature="system_settings">
              <div class="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 class="font-medium text-purple-900">System Settings Access</h4>
                <p class="text-sm text-purple-700">This content is only visible to users with 'system_settings' feature.</p>
              </div>
            </FeatureGuard>
          </div>
        </div>

        <!-- FeatureButton Component Demo -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">FeatureButton Component</h2>
          <p class="text-gray-600 mb-4">
            FeatureButton components automatically disable or hide based on feature access.
          </p>
          
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Hide Variant (default)</h4>
              <FeatureButton feature="manage_users" class="bg-blue-600 text-white hover:bg-blue-700">
                Manage Users
              </FeatureButton>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Disable Variant</h4>
              <FeatureButton feature="manage_campaigns" variant="disable" class="bg-green-600 text-white hover:bg-green-700">
                Manage Campaigns
              </FeatureButton>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Fallback Variant</h4>
              <FeatureButton feature="export_data" variant="fallback" class="bg-purple-600 text-white hover:bg-purple-700">
                Export Data
              </FeatureButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Direct Feature Checks Demo -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Direct Feature Checks</h2>
        <p class="text-gray-600 mb-4">
          Using the useFeatures composable directly in components.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">User Management</h4>
            <p class="text-sm text-gray-600 mb-2">
              Access: <span :class="hasFeature('manage_users') ? 'text-green-600' : 'text-red-600'">
                {{ hasFeature('manage_users') ? 'Granted' : 'Denied' }}
              </span>
            </p>
            <button 
              v-if="hasFeature('manage_users')"
              class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Access Feature
            </button>
          </div>
          
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Campaign Management</h4>
            <p class="text-sm text-gray-600 mb-2">
              Access: <span :class="hasFeature('manage_campaigns') ? 'text-green-600' : 'text-red-600'">
                {{ hasFeature('manage_campaigns') ? 'Granted' : 'Denied' }}
              </span>
            </p>
            <button 
              v-if="hasFeature('manage_campaigns')"
              class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Access Feature
            </button>
          </div>
          
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">System Settings</h4>
            <p class="text-sm text-gray-600 mb-2">
              Access: <span :class="hasFeature('system_settings') ? 'text-green-600' : 'text-red-600'">
                {{ hasFeature('system_settings') ? 'Granted' : 'Denied' }}
              </span>
            </p>
            <button 
              v-if="hasFeature('system_settings')"
              class="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
            >
              Access Feature
            </button>
          </div>
        </div>
      </div>

      <!-- Feature Combinations Demo -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Feature Combinations</h2>
        <p class="text-gray-600 mb-4">
          Checking multiple features at once.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Any Feature Access</h4>
            <p class="text-sm text-gray-600 mb-2">
              Has any of [manage_users, manage_campaigns]: 
              <span :class="hasAnyFeature(['manage_users', 'manage_campaigns']) ? 'text-green-600' : 'text-red-600'">
                {{ hasAnyFeature(['manage_users', 'manage_campaigns']) ? 'Yes' : 'No' }}
              </span>
            </p>
          </div>
          
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">All Features Access</h4>
            <p class="text-sm text-gray-600 mb-2">
              Has all of [manage_users, manage_campaigns]: 
              <span :class="hasAllFeatures(['manage_users', 'manage_campaigns']) ? 'text-green-600' : 'text-red-600'">
                {{ hasAllFeatures(['manage_users', 'manage_campaigns']) ? 'Yes' : 'No' }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Loading and Error States -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">System Status</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Features Ready</h4>
            <span :class="isReady ? 'text-green-600' : 'text-yellow-600'">
              {{ isReady ? 'Yes' : 'No' }}
            </span>
          </div>
          
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Loading</h4>
            <span :class="loading ? 'text-yellow-600' : 'text-green-600'">
              {{ loading ? 'Yes' : 'No' }}
            </span>
          </div>
          
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Has Errors</h4>
            <span :class="hasErrors ? 'text-red-600' : 'text-green-600'">
              {{ hasErrors ? 'Yes' : 'No' }}
            </span>
          </div>
        </div>
        
        <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 class="font-medium text-red-900 mb-2">Error</h4>
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFeatures } from '@/composables/useFeatures'
import FeatureGuard from '@/components/ui/FeatureGuard.vue'
import FeatureButton from '@/components/ui/FeatureButton.vue'

const {
  features,
  hasFeature,
  hasAnyFeature,
  hasAllFeatures,
  isReady,
  loading,
  error,
  hasErrors
} = useFeatures()
</script>
