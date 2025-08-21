import { ref, readonly } from 'vue'

const notifications = ref([])
let nextId = 0

export function useNotifications() {
  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = nextId++
    const notification = {
      id,
      message,
      type,
      timestamp: Date.now()
    }
    
    notifications.value.push(notification)
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
    
    return id
  }
  
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  const success = (message, duration) => addNotification(message, 'success', duration)
  const error = (message, duration) => addNotification(message, 'error', duration)
  const warning = (message, duration) => addNotification(message, 'warning', duration)
  const info = (message, duration) => addNotification(message, 'info', duration)
  
  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  }
}

