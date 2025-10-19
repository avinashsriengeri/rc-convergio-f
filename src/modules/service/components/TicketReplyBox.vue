<template>
  <div class="border border-gray-200 rounded-lg p-4">
    <h3 class="text-lg font-medium text-gray-900 mb-3">Add Reply</h3>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          v-model="message"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Type your reply here..."
          required
        ></textarea>
      </div>
      
      <div class="mb-4">
        <label class="flex items-center">
          <input
            v-model="isInternal"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span class="ml-2 text-sm text-gray-700">Internal note (not visible to customer)</span>
        </label>
      </div>
      
      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="submitting || !message.trim()"
          class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ submitting ? 'Sending...' : 'Send Reply' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useServiceTicketsStore } from '../store/serviceTickets'

// Props
const props = defineProps({
  ticketId: {
    type: [String, Number],
    required: true
  }
})

// Emits
const emit = defineEmits(['message-sent', 'cancel'])

// Store
const ticketsStore = useServiceTicketsStore()

// Local state
const message = ref('')
const isInternal = ref(false)
const submitting = ref(false)

// Methods
const handleSubmit = async () => {
  if (!message.value.trim()) return
  
  submitting.value = true
  
  try {
    const messageData = {
      body: message.value.trim(),  // Backend expects "body" field
      is_internal: isInternal.value
    }
    
    await ticketsStore.addMessage(props.ticketId, messageData)
    
    // Reset form
    message.value = ''
    isInternal.value = false
    
    emit('message-sent')
  } catch (err) {
    console.error('Error sending message:', err)
    // You might want to show an error message to the user here
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  message.value = ''
  isInternal.value = false
  emit('cancel')
}
</script>
