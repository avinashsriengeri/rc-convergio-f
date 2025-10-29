<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Access Denied
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          You don't have permission to access the Lead Assignment module.
        </p>
        <p class="mt-1 text-sm text-gray-500">
          Please contact your administrator if you believe this is an error.
        </p>
      </div>
      
      <div class="mt-8">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div class="space-y-4">
            <div class="text-center">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Required Permissions</h3>
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex items-center justify-center">
                  <svg class="h-4 w-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Sales Admin Role
                </div>
                <div class="flex items-center justify-center">
                  <svg class="h-4 w-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Lead Assignment Management
                </div>
              </div>
            </div>
            
            <div class="flex justify-center space-x-4">
              <BaseButton
                @click="$router.push('/dashboard')"
                variant="outline"
                size="sm"
              >
                Go to Dashboard
              </BaseButton>
              <BaseButton
                @click="$router.push('/sales')"
                variant="primary"
                size="sm"
              >
                {{ $t('sales.overview.title') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
</script>
