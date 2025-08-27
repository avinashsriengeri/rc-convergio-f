// Simple notification system
let notificationTimeout: NodeJS.Timeout | null = null

interface NotificationOptions {
  duration?: number
  type?: 'success' | 'error' | 'warning' | 'info'
}

const showNotification = (message: string, options: NotificationOptions = {}) => {
  const { duration = 5000, type = 'info' } = options

  // Remove existing notification
  const existingNotification = document.getElementById('notification')
  if (existingNotification) {
    existingNotification.remove()
  }

  // Clear existing timeout
  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
  }

  // Create notification element
  const notification = document.createElement('div')
  notification.id = 'notification'
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`
  
  // Set background color based on type
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }
  
  notification.className += ` ${bgColors[type]} text-white`

  // Create content
  notification.innerHTML = `
    <div class="flex items-center">
      <div class="flex-shrink-0">
        ${getIcon(type)}
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium">${message}</p>
      </div>
      <div class="ml-auto pl-3">
        <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `

  // Add to DOM
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full')
  }, 100)

  // Auto remove after duration
  notificationTimeout = setTimeout(() => {
    notification.classList.add('translate-x-full')
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 300)
  }, duration)
}

const getIcon = (type: string) => {
  const icons = {
    success: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`,
    error: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>`,
    warning: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>`,
    info: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`
  }
  return icons[type as keyof typeof icons] || icons.info
}

// Export convenience functions
export const success = (message: string, duration?: number) => {
  showNotification(message, { type: 'success', duration })
}

export const error = (message: string, duration?: number) => {
  showNotification(message, { type: 'error', duration })
}

export const warning = (message: string, duration?: number) => {
  showNotification(message, { type: 'warning', duration })
}

export const info = (message: string, duration?: number) => {
  showNotification(message, { type: 'info', duration })
}

// Export the main function for custom usage
export const notify = showNotification
