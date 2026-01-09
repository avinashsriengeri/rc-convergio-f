<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="handleCancel"></div>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-purple bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-primary-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Upload Collateral
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Upload a new collateral file for your product.
                  </p>
                </div>

                <!-- General Error Display -->
                <div v-if="errors.general" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p class="text-sm text-red-600">{{ errors.general }}</p>
                </div>

                <div class="mt-4 space-y-4">
                  <!-- Product Selection -->
                  <div>
                    <label for="product-select" class="block text-sm font-medium text-gray-700 mb-1">
                      Product <span class="text-red-500">*</span>
                    </label>
                    <select
                      id="product-select"
                      v-model="form.product_id"
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-purple focus:border-primary-purple text-sm"
                      :class="{ 'border-red-300': errors.product_id }"
                    >
                      <option value="">Select Product</option>
                      <option v-for="product in products" :key="product.id" :value="product.id">
                        {{ product.name }}
                      </option>
                    </select>
                    <p v-if="errors.product_id" class="mt-1 text-sm text-red-600">{{ errors.product_id }}</p>
                  </div>

                  <!-- Collateral Name -->
                  <div>
                    <label for="collateral-name" class="block text-sm font-medium text-gray-700 mb-1">
                      Collateral Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="collateral-name"
                      v-model="form.name"
                      type="text"
                      required
                      maxlength="255"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-purple focus:border-primary-purple text-sm"
                      :class="{ 'border-red-300': errors.name }"
                      placeholder="Enter collateral name"
                    />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                  </div>

                  <!-- Collateral Type -->
                  <div>
                    <label for="collateral-type" class="block text-sm font-medium text-gray-700 mb-1">
                      Collateral Type <span class="text-red-500">*</span>
                    </label>
                    <select
                      id="collateral-type"
                      v-model="form.collateral_type"
                      required
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

                  <!-- File Upload -->
                  <div>
                    <label for="file-upload" class="block text-sm font-medium text-gray-700 mb-1">
                      File <span class="text-red-500">*</span>
                    </label>
                    <div
                      @click="triggerFileInput"
                      @dragover.prevent="handleDragOver"
                      @dragleave.prevent="handleDragLeave"
                      @drop.prevent="handleDrop"
                      :class="[
                        'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                        dragOver ? 'border-primary-purple bg-primary-purple bg-opacity-5' : 'border-gray-300 hover:border-gray-400'
                      ]"
                    >
                      <input
                        ref="fileInput"
                        id="file-upload"
                        type="file"
                        @change="handleFileSelect"
                        class="hidden"
                        :accept="acceptedFileTypes"
                      />
                      <div v-if="!selectedFile">
                        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div class="mt-2">
                          <p class="text-sm text-gray-600">
                            <span class="font-medium text-primary-purple hover:text-primary-purple">Click to upload</span>
                            or drag and drop
                          </p>
                          <p class="text-xs text-gray-500 mt-1">
                            PDF, Images (JPG/PNG/GIF), PowerPoint (PPT/PPTX) - Max 100MB
                          </p>
                        </div>
                      </div>
                      <div v-else class="text-left">
                        <div class="flex items-center space-x-3">
                          <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                              {{ getFileIcon(selectedFile.name) }}
                            </div>
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">
                              {{ selectedFile.name }}
                            </p>
                            <p class="text-sm text-gray-500">
                              {{ formatFileSize(selectedFile.size) }}
                            </p>
                          </div>
                          <button
                            type="button"
                            @click.stop="removeFile"
                            class="flex-shrink-0 p-1 text-gray-400 hover:text-red-500"
                            aria-label="Remove file"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- File Validation Errors -->
                    <div v-if="fileErrors.length > 0" class="mt-2">
                      <div v-for="(error, index) in fileErrors" :key="index" class="text-sm text-red-600">
                        {{ error }}
                      </div>
                    </div>
                  </div>

                  <!-- Active Status -->
                  <div>
                    <div class="flex items-center">
                      <input
                        id="is-active"
                        v-model="form.is_active"
                        type="checkbox"
                        class="h-4 w-4 text-primary-purple focus:ring-primary-purple border-gray-300 rounded"
                        :class="{ 'border-red-300': errors.is_active }"
                      />
                      <label for="is-active" class="ml-2 block text-sm text-gray-900">
                        Active
                      </label>
                    </div>
                    <p v-if="errors.is_active" class="mt-1 text-sm text-red-600">{{ errors.is_active }}</p>
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
              :loading="uploading"
              :disabled="!canSubmit"
              class="w-full sm:w-auto sm:ml-3"
            >
              Upload
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
import { ref, computed, onMounted } from 'vue'
import { useCollateralsStore } from '@/stores/collateralsStore'
import { useQuotesStore } from '@/stores/quotesStore'
import BaseButton from '@/components/ui/BaseButton.vue'

interface Props {
  productId?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  productId: null
})

interface CollateralResponse {
  id: number
  name: string
  [key: string]: unknown
}

const emit = defineEmits<{
  close: []
  uploaded: [data: CollateralResponse]
}>()

const collateralsStore = useCollateralsStore()
const quotesStore = useQuotesStore()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const dragOver = ref(false)
const uploading = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref({
  product_id: props.productId || '',
  name: '',
  collateral_type: '',
  is_active: true
})

const types = computed(() => collateralsStore.types)
const products = computed(() => quotesStore.products)

const acceptedFileTypes = computed(() => {
  return '.pdf,.jpg,.jpeg,.png,.gif,.ppt,.pptx'
})

const fileErrors = computed(() => {
  const errorList: string[] = []
  
  if (selectedFile.value) {
    const fileExtension = selectedFile.value.name.split('.').pop()?.toLowerCase() || ''
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'ppt', 'pptx']
    
    if (!allowedExtensions.includes(fileExtension)) {
      errorList.push('Only PDF, Images (JPG/PNG/GIF), and PowerPoint files are allowed.')
    }
    
    const maxSize = 100 * 1024 * 1024
    if (selectedFile.value.size > maxSize) {
      errorList.push('File size must not exceed 100MB.')
    }
  }
  
  return errorList
})

const canSubmit = computed(() => {
  return (
    form.value.product_id &&
    form.value.name.trim() !== '' &&
    form.value.collateral_type &&
    selectedFile.value !== null &&
    fileErrors.value.length === 0
  )
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    setSelectedFile(file)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = true
}

const handleDragLeave = () => {
  dragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    setSelectedFile(file)
  }
}

const setSelectedFile = (file: File) => {
  selectedFile.value = file
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 B'
  }
  
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''
  const iconMap: Record<string, string> = {
    pdf: '📄',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    ppt: '📊',
    pptx: '📊'
  }
  return iconMap[extension] || '📎'
}

const handleSubmit = async () => {
  if (!canSubmit.value) {
    return
  }

  errors.value = {}

  if (!form.value.product_id) {
    errors.value.product_id = 'Product selection is required.'
  }
  if (!form.value.name.trim()) {
    errors.value.name = 'Collateral name is required.'
  }
  if (!form.value.collateral_type) {
    errors.value.collateral_type = 'Collateral type is required.'
  }
  if (!selectedFile.value) {
    errors.value.file = 'File is required.'
  }

  if (Object.keys(errors.value).length > 0) {
    return
  }

  try {
    uploading.value = true

    const formData = new FormData()
    formData.append('product_id', String(form.value.product_id))
    formData.append('name', form.value.name)
    formData.append('file', selectedFile.value as File)
    formData.append('collateral_type', form.value.collateral_type)
    formData.append('is_active', form.value.is_active ? '1' : '0')

    const response = await collateralsStore.uploadCollateral(formData)
    
    emit('uploaded', response)
    emit('close')
  } catch (err) {
    console.error('Upload error:', err)
    if (err && typeof err === 'object' && 'response' in err) {
      const errorResponse = err as { response?: { data?: { errors?: Record<string, string[]>, message?: string } } }
      
      // Show main error message if available
      if (errorResponse.response?.data?.message) {
        errors.value.general = errorResponse.response.data.message
      }
      
      // Show field-specific errors
      if (errorResponse.response?.data?.errors) {
        const apiErrors = errorResponse.response.data.errors
        Object.keys(apiErrors).forEach((key) => {
          errors.value[key] = apiErrors[key][0] || 'Validation error'
        })
      }
    }
  } finally {
    uploading.value = false
  }
}

const handleCancel = () => {
  emit('close')
}

onMounted(async () => {
  await Promise.all([
    collateralsStore.fetchTypes(),
    quotesStore.fetchProducts({})
  ])
})
</script>

