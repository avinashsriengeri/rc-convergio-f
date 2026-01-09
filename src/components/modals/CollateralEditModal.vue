<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="handleCancel"></div>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-purple bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-primary-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Edit Collateral
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Update collateral metadata.
                  </p>
                </div>

                <div class="mt-4 space-y-4">
                  <!-- Collateral Name -->
                  <div>
                    <label for="edit-collateral-name" class="block text-sm font-medium text-gray-700 mb-1">
                      Collateral Name
                    </label>
                    <input
                      id="edit-collateral-name"
                      v-model="form.name"
                      type="text"
                      maxlength="255"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-purple focus:border-primary-purple text-sm"
                      :class="{ 'border-red-300': errors.name }"
                      placeholder="Enter collateral name"
                    />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                  </div>

                  <!-- Collateral Type -->
                  <div>
                    <label for="edit-collateral-type" class="block text-sm font-medium text-gray-700 mb-1">
                      Collateral Type
                    </label>
                    <select
                      id="edit-collateral-type"
                      v-model="form.collateral_type"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-purple focus:border-primary-purple text-sm"
                      :class="{ 'border-red-300': errors.collateral_type }"
                    >
                      <option value="">Select Collateral Type</option>
                      <option v-for="type in types" :key="type" :value="type">
                        {{ type }}
                      </option>
                    </select>
                    <p v-if="errors.collateral_type" class="mt-1 text-sm text-red-600">{{ errors.collateral_type }}</p>
                  </div>

                  <!-- Active Status -->
                  <div class="flex items-center">
                    <input
                      id="edit-is-active"
                      v-model="form.is_active"
                      type="checkbox"
                      class="h-4 w-4 text-primary-purple focus:ring-primary-purple border-gray-300 rounded"
                    />
                    <label for="edit-is-active" class="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>

                  <!-- File Info (Read-only) -->
                  <div v-if="collateral" class="bg-gray-50 rounded-lg p-4">
                    <p class="text-sm font-medium text-gray-700 mb-2">Current File</p>
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                          {{ getFileIcon(collateral.file_extension) }}
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ collateral.name }}
                        </p>
                        <p class="text-sm text-gray-500">
                          {{ collateral.human_file_size }} • {{ collateral.file_extension.toUpperCase() }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <BaseButton
              type="submit"
              variant="primary"
              :loading="updating"
              class="w-full sm:w-auto sm:ml-3"
            >
              Update
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              @click="handleCancel"
              class="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              Cancel
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCollateralsStore } from '@/stores/collateralsStore'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { Collateral } from '@/types/collateral'

interface Props {
  collateral: Collateral | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  updated: [data: Collateral]
}>()

const collateralsStore = useCollateralsStore()

const updating = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref({
  name: '',
  collateral_type: '',
  is_active: true
})

const types = computed(() => collateralsStore.types)
const collateral = computed(() => props.collateral)

const getFileIcon = (extension: string): string => {
  const iconMap: Record<string, string> = {
    pdf: '📄',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    ppt: '📊',
    pptx: '📊'
  }
  return iconMap[extension?.toLowerCase() || ''] || '📎'
}

watch(() => props.collateral, (newCollateral) => {
  if (newCollateral) {
    form.value = {
      name: newCollateral.name || '',
      collateral_type: newCollateral.collateral_type || '',
      is_active: newCollateral.is_active ?? true
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!props.collateral) {
    return
  }

  errors.value = {}

  if (form.value.name && form.value.name.length > 255) {
    errors.value.name = 'Name must not exceed 255 characters.'
  }

  if (Object.keys(errors.value).length > 0) {
    return
  }

  try {
    updating.value = true

    const updateData: Record<string, unknown> = {}
    if (form.value.name.trim()) {
      updateData.name = form.value.name.trim()
    }
    if (form.value.collateral_type) {
      updateData.collateral_type = form.value.collateral_type
    }
    updateData.is_active = form.value.is_active

    const response = await collateralsStore.updateCollateral(props.collateral.id, updateData)
    
    emit('updated', response)
    emit('close')
  } catch (err) {
    console.error('Update error:', err)
    if (err && typeof err === 'object' && 'response' in err) {
      const errorResponse = err as { response?: { data?: { errors?: Record<string, string[]> } } }
      if (errorResponse.response?.data?.errors) {
        const apiErrors = errorResponse.response.data.errors
        Object.keys(apiErrors).forEach((key) => {
          errors.value[key] = apiErrors[key][0] || 'Validation error'
        })
      }
    }
  } finally {
    updating.value = false
  }
}

const handleCancel = () => {
  emit('close')
}

onMounted(async () => {
  await collateralsStore.fetchTypes()
})
</script>

