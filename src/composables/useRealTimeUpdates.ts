import { ref, onMounted, onUnmounted } from 'vue'
import { useNotifications } from './useNotifications'

interface ContactCreatedEvent {
  contact_id: number
  submission_id: number
  form_id: number
}

export function useRealTimeUpdates() {
  const { success } = useNotifications()
  const isListening = ref(false)
  
  // Event handler for contact creation
  const handleContactCreated = (event: CustomEvent<ContactCreatedEvent>) => {
    const { contact_id, submission_id, form_id } = event.detail
    
    console.log('Contact created event received:', { contact_id, submission_id, form_id })
    
    // Show success notification
    success(`New contact created from form submission! Contact ID: ${contact_id}`)
    
    // Emit a custom event that can be listened to by other components
    window.dispatchEvent(new CustomEvent('contacts-list-update', {
      detail: { 
        action: 'contact-created',
        contact_id,
        submission_id,
        form_id,
        timestamp: new Date().toISOString()
      }
    }))
  }
  
  // Start listening for real-time updates
  const startListening = () => {
    if (isListening.value) return
    
    console.log('Starting real-time updates listener...')
    window.addEventListener('contact-created', handleContactCreated as EventListener)
    isListening.value = true
  }
  
  // Stop listening for real-time updates
  const stopListening = () => {
    if (!isListening.value) return
    
    console.log('Stopping real-time updates listener...')
    window.removeEventListener('contact-created', handleContactCreated as EventListener)
    isListening.value = false
  }
  
  // Lifecycle hooks
  onMounted(() => {
    startListening()
  })
  
  onUnmounted(() => {
    stopListening()
  })
  
  return {
    isListening,
    startListening,
    stopListening
  }
}
