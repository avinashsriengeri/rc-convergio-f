import { CURRENCIES } from './constants'

// Format currency
export const formatCurrency = (amount: number | null | undefined, currency: string = 'USD'): string => {
  if (amount === null || amount === undefined) return '-'
  
  const currencyInfo = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0]
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

// Format date
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

// Format date and time
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// Format time only
export const formatTime = (time: string | Date | null | undefined): string => {
  if (!time) return '-'
  
  const date = new Date(time)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Format relative time
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return formatDate(date)
  }
}

// Format percentage
export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-'
  return `${value}%`
}

// Format number with commas
export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-'
  return new Intl.NumberFormat('en-US').format(value)
}

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Get initials from name
export const getInitials = (name: string): string => {
  if (!name) return ''
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Format tags array to string
export const formatTags = (tags: string[] | null | undefined): string => {
  if (!tags || tags.length === 0) return '-'
  return tags.join(', ')
}

// Parse tags string to array
export const parseTags = (tagsString: string): string[] => {
  if (!tagsString) return []
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
}

// Format probability with color
export const getProbabilityColor = (probability: number): string => {
  if (probability >= 80) return 'text-green-600'
  if (probability >= 60) return 'text-blue-600'
  if (probability >= 40) return 'text-yellow-600'
  if (probability >= 20) return 'text-orange-600'
  return 'text-red-600'
}

// Format deal value with color based on size
export const getValueColor = (value: number | null | undefined): string => {
  if (!value) return 'text-gray-600'
  if (value >= 100000) return 'text-green-600'
  if (value >= 50000) return 'text-blue-600'
  if (value >= 10000) return 'text-yellow-600'
  return 'text-gray-600'
}

// Check if date is overdue
export const isOverdue = (date: string | Date | null | undefined): boolean => {
  if (!date) return false
  return new Date(date) < new Date()
}

// Check if date is today
export const isToday = (date: string | Date | null | undefined): boolean => {
  if (!date) return false
  const today = new Date()
  const targetDate = new Date(date)
  return today.toDateString() === targetDate.toDateString()
}

// Check if date is this week
export const isThisWeek = (date: string | Date | null | undefined): boolean => {
  if (!date) return false
  const today = new Date()
  const targetDate = new Date(date)
  const diffTime = Math.abs(today.getTime() - targetDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 7
}
