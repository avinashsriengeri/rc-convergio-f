<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ $t('common.quick_add') }}
          </h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="grid grid-cols-2 gap-4">
          <!-- Add Contact -->
          <button
            @click="addContact"
            class="p-4 border border-gray-200 rounded-lg hover:border-[#2596be] hover:bg-[#2596be]/5 transition-colors text-left"
          >
            <div class="w-8 h-8 bg-gradient-to-r from-[#2596be] to-[#973894] rounded-lg flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900">{{ $t('common.add_contact') }}</h3>
            <p class="text-sm text-gray-500">{{ $t('common.create_contact') }}</p>
          </button>

          <!-- Add Company -->
          <button
            @click="addCompany"
            class="p-4 border border-gray-200 rounded-lg hover:border-[#2596be] hover:bg-[#2596be]/5 transition-colors text-left"
          >
            <div class="w-8 h-8 bg-gradient-to-r from-[#655997] to-[#cc3266] rounded-lg flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h12v8H6V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900">{{ $t('common.add_company') }}</h3>
            <p class="text-sm text-gray-500">{{ $t('common.create_company') }}</p>
          </button>

          <!-- Add Task -->
          <button
            @click="addTask"
            class="p-4 border border-gray-200 rounded-lg hover:border-[#2596be] hover:bg-[#2596be]/5 transition-colors text-left"
          >
            <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900">{{ $t('common.add_task') }}</h3>
            <p class="text-sm text-gray-500">{{ $t('common.create_task') }}</p>
          </button>

          <!-- Add Deal -->
          <button
            @click="addDeal"
            class="p-4 border border-gray-200 rounded-lg hover:border-[#2596be] hover:bg-[#2596be]/5 transition-colors text-left"
          >
            <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900">{{ $t('common.add_deal') }}</h3>
            <p class="text-sm text-gray-500">{{ $t('common.create_deal') }}</p>
          </button>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end pt-6">
          <BaseButton
            type="button"
            variant="outline"
            @click="$emit('close')"
          >
            {{ $t('common.cancel') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'

const emit = defineEmits(['close', 'created'])
const router = useRouter()

const addContact = () => {
  emit('close')
  // Redirect to contacts page and trigger create modal
  router.push('/contacts?create=true')
}

const addCompany = () => {
  emit('close')
  router.push('/companies/create')
}

const addTask = () => {
  emit('close')
  // Redirect to tasks page and trigger create modal
  router.push('/tasks?create=true')
}

const addDeal = () => {
  emit('close')
  router.push('/deals/new')
}
</script>

