<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
          <button
            @click="$emit('cancel')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="mb-6">
          <p class="text-sm text-gray-600">{{ message }}</p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3">
          <BaseButton
            type="button"
            variant="outline"
            @click="$emit('cancel')"
          >
            {{ cancelText }}
          </BaseButton>
          <BaseButton
            type="button"
            :variant="confirmVariant"
            @click="$emit('confirm')"
            :loading="loading"
          >
            {{ confirmText }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../ui/BaseButton.vue'

interface Props {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmVariant: 'primary',
  loading: false
})

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<script lang="ts">
export default {
  name: 'ConfirmationModal'
}
</script>
