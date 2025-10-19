<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <!-- Header -->
        <div class="bg-white px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Edit Payment Link
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <form @submit.prevent="updatePaymentLink">
          <div class="bg-white px-6 py-6">
            <div class="space-y-6">
              <!-- Link Title -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700">
                  Link Title
                </label>
                <input
                  id="title"
                  v-model="formData.title"
                  type="text"
                  required
                  placeholder="Enter a title for this payment link"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-purple focus:border-primary-purple sm:text-sm"
                />
              </div>

              <!-- Amount (only show if no quote) -->
              <div v-if="!link.quote">
                <label for="amount" class="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="amount"
                    v-model="formData.amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-purple focus:border-primary-purple sm:text-sm"
                  />
                </div>
              </div>

              <!-- Currency (only show if no quote) -->
              <div v-if="!link.quote">
                <label for="currency" class="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  id="currency"
                  v-model="formData.currency"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-purple focus:border-primary-purple sm:text-sm"
                >
                  <option value="usd">USD - US Dollar</option>
                  <option value="eur">EUR - Euro</option>
                  <option value="gbp">GBP - British Pound</option>
                  <option value="cad">CAD - Canadian Dollar</option>
                  <option value="aud">AUD - Australian Dollar</option>
                </select>
              </div>

              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  rows="3"
                  placeholder="Enter a description for this payment link"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-purple focus:border-primary-purple sm:text-sm"
                ></textarea>
              </div>

              <!-- Expiration -->
              <div>
                <label for="expires_at" class="block text-sm font-medium text-gray-700">
                  Expiration Date (Optional)
                </label>
                <input
                  id="expires_at"
                  v-model="formData.expires_at"
                  type="datetime-local"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-purple focus:border-primary-purple sm:text-sm"
                />
              </div>

              <!-- Status -->
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  v-model="formData.status"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-purple focus:border-primary-purple sm:text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-purple hover:bg-primary-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple disabled:opacity-50"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Updating...' : 'Update Payment Link' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, defineProps } from 'vue'
import { commerceAPI } from '@/services/api.js'

const props = defineProps({
  link: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const loading = ref(false)

const formData = ref({
  title: '',
  amount: '',
  currency: 'usd',
  description: '',
  expires_at: '',
  status: 'draft'
})

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:MM
}

const updatePaymentLink = async () => {
  loading.value = true
  try {
    const updateData = {
      title: formData.value.title,
      description: formData.value.description,
      status: formData.value.status
    }

    // Only include amount and currency if no quote is linked
    if (!props.link.quote) {
      updateData.amount = parseFloat(formData.value.amount)
      updateData.currency = formData.value.currency
    }

    // Include expiration date if provided
    if (formData.value.expires_at) {
      updateData.expires_at = new Date(formData.value.expires_at).toISOString()
    }

    const response = await commerceAPI.updatePaymentLink(props.link.id, updateData)
    
    // Show success notification
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Payment link has been updated successfully',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }

    emit('updated', response.data.data)
    emit('close')
  } catch (error) {
    console.error('Error updating payment link:', error)
    
    // Show error notification
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'Failed to update payment link',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Initialize form data
  formData.value = {
    title: props.link.quote ? `Payment Link for ${props.link.quote.quote_number}` : `Payment Link #${props.link.id}`,
    amount: props.link.quote ? props.link.quote.total : (props.link.metadata?.amount || ''),
    currency: props.link.quote ? props.link.quote.currency.toLowerCase() : 'usd',
    description: props.link.metadata?.description || '',
    expires_at: formatDateForInput(props.link.expires_at),
    status: props.link.status
  }
})
</script>
