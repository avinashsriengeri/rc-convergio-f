<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEdit ? 'Edit Product' : 'Add Product' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="px-6 py-4">
        <div class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              :class="{ 'border-red-300': errors.name }"
              placeholder="Enter product name"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter product description"
            ></textarea>
          </div>

          <!-- SKU -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input
              v-model="form.sku"
              type="text"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter SKU (optional)"
            />
          </div>

          <!-- Unit Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Unit Price <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                v-model.number="form.unit_price"
                type="number"
                step="0.01"
                min="0"
                required
                class="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                :class="{ 'border-red-300': errors.unit_price }"
                placeholder="0.00"
              />
            </div>
            <p v-if="errors.unit_price" class="mt-1 text-sm text-red-600">{{ errors.unit_price }}</p>
          </div>

          <!-- Tax Rate -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tax Rate (%)
            </label>
            <div class="relative">
              <input
                v-model.number="form.tax_rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="0.00"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="form.status"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <BaseButton
            type="button"
            variant="outline"
            @click="$emit('close')"
          >
            Cancel
          </BaseButton>
          <BaseButton
            type="submit"
            variant="primary"
            :loading="saving"
          >
            {{ isEdit ? 'Update Product' : 'Create Product' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  product: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'close'])

// Reactive data
const saving = ref(false)
const errors = ref({})

const form = reactive({
  name: '',
  description: '',
  sku: '',
  unit_price: 0,
  tax_rate: 0,
  status: 'active'
})

// Methods
const validateForm = () => {
  errors.value = {}
  
  if (!form.name.trim()) {
    errors.value.name = 'Product name is required'
  }
  
  if (!form.unit_price || form.unit_price < 0) {
    errors.value.unit_price = 'Unit price must be 0 or greater'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  saving.value = true
  try {
    emit('save', { ...form })
  } catch (error) {
    console.error('Error saving product:', error)
  } finally {
    saving.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (props.product && props.isEdit) {
    Object.assign(form, {
      name: props.product.name || '',
      description: props.product.description || '',
      sku: props.product.sku || '',
      unit_price: props.product.unit_price || 0,
      tax_rate: props.product.tax_rate || 0,
      status: props.product.status || 'active'
    })
  }
})
</script>





