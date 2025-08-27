import { useNotifications } from '@/composables/useNotifications'

const { success: successNotification, error: errorNotification } = useNotifications()

export const success = (message, duration = 5000) => {
  successNotification(message, duration)
}

export const error = (message, duration = 5000) => {
  errorNotification(message, duration)
}
