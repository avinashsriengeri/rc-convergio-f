import { leadScoringService } from '@/services/leadScoring'

// Types
export interface TimeWindow {
  value: string
  label: string
  description?: string
}

export interface ScoringRule {
  id?: string | number
  name: string
  description?: string
  event_type: string
  condition: Record<string, any> | string
  points: number
  priority: number
  is_active: boolean
  time_window?: string
  created_at?: string
  updated_at?: string
}

export interface ContactScore {
  contact_id: string | number
  contact_email: string
  score: number
  score_level: 'cold' | 'warm' | 'hot' | 'lead'
  last_calculated: string
  score_breakdown?: Array<{
    category: string
    points: number
    max_points: number
    percentage: number
  }>
  recent_activities?: Array<{
    id: string | number
    event_type: string
    points: number
    description: string
    timestamp: string
    metadata?: Record<string, any>
  }>
}

// Default time windows
export const DEFAULT_TIME_WINDOWS: TimeWindow[] = [
  { value: '1h', label: '1 Hour', description: 'Last 1 hour' },
  { value: '24h', label: '24 Hours', description: 'Last 24 hours' },
  { value: '7d', label: '7 Days', description: 'Last 7 days' },
  { value: '30d', label: '30 Days', description: 'Last 30 days' },
  { value: '90d', label: '90 Days', description: 'Last 90 days' },
  { value: 'lifetime', label: 'Lifetime', description: 'All time' }
]

// Helper functions
export const formatScore = (score: number): string => {
  if (score >= 80) return 'Hot Lead'
  if (score >= 60) return 'Warm Lead'
  if (score >= 40) return 'Engaged'
  if (score > 0) return 'New Lead'
  return 'Neutral'
}

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'red'
  if (score >= 60) return 'orange'
  if (score >= 40) return 'yellow'
  return 'green'
}

export const getScoreBadgeClass = (score: number): string => {
  const color = getScoreColor(score)
  return `bg-${color}-100 text-${color}-800 text-xs font-medium px-2.5 py-0.5 rounded`
}

export const formatCondition = (condition: string | Record<string, any>): string => {
  if (!condition) return 'No condition'
  
  try {
    const cond = typeof condition === 'string' ? JSON.parse(condition) : condition
    const { event_type, operator, value, time_window } = cond
    
    let result = ''
    if (event_type) result += `${event_type} `
    if (operator) result += `${operator} `
    if (value !== undefined) result += `${value} `
    if (time_window) result += `(within ${time_window})`
    
    return result.trim() || 'Condition'
  } catch (e) {
    console.error('Error formatting condition:', e)
    return 'Invalid condition format'
  }
}

export const getTimeWindowLabel = (value: string): string => {
  const window = DEFAULT_TIME_WINDOWS.find(w => w.value === value)
  return window ? window.label : value
}

// Format date to relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return 'Never'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  }
  
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds)
    if (interval >= 1) {
      return interval === 1 
        ? `${interval} ${unit} ago` 
        : `${interval} ${unit}s ago`
    }
  }
  
  return 'Just now'
}

// Format date to a readable format
export const formatDate = (dateString: string, includeTime = true): string => {
  if (!dateString) return 'N/A'
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  
  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }
  
  return new Date(dateString).toLocaleDateString('en-US', options)
}

// Format a number with commas
export const formatNumber = (num: number): string => {
  return num?.toLocaleString() || '0'
}

// Get the appropriate color for a score change
export const getScoreChangeColor = (change: number): string => {
  if (change > 0) return 'text-green-600'
  if (change < 0) return 'text-red-600'
  return 'text-gray-500'
}

// Format a score change with a + or - sign
export const formatScoreChange = (change: number): string => {
  if (change > 0) return `+${change}`
  if (change < 0) return change.toString()
  return '0'
}

// Calculate the percentage of a value relative to a max value
export const calculatePercentage = (value: number, max: number): number => {
  if (max === 0) return 0
  return Math.round((value / max) * 100)
}

// Get the appropriate icon for an event type
export const getEventIcon = (eventType: string): string => {
  const icons: Record<string, string> = {
    'form_submitted': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'page_view': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    'email_opened': 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    'email_clicked': 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    'event_registered': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    'purchase_completed': 'M5 13l4 4L19 7',
    'download': 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
    'video_viewed': 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    'default': 'M13 10V3L4 14h7v7l9-11h-7z'
  }
  
  return icons[eventType] || icons['default']
}

// Get the appropriate color for an event type
export const getEventColor = (eventType: string): string => {
  const colors: Record<string, string> = {
    'form_submitted': 'blue',
    'page_view': 'indigo',
    'email_opened': 'green',
    'email_clicked': 'teal',
    'event_registered': 'purple',
    'purchase_completed': 'yellow',
    'download': 'pink',
    'video_viewed': 'red',
    'default': 'gray'
  }
  
  return colors[eventType] || colors['default']
}

// Format a number as a string with K, M, B suffixes
export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

// Debounce function
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return (...args: Parameters<F>): void => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number
): ((...args: Parameters<F>) => void) => {
  let inThrottle = false
  
  return (...args: Parameters<F>): void => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Export all utility functions
export default {
  formatScore,
  getScoreColor,
  getScoreBadgeClass,
  formatCondition,
  getTimeWindowLabel,
  formatRelativeTime,
  formatDate,
  formatNumber,
  getScoreChangeColor,
  formatScoreChange,
  calculatePercentage,
  getEventIcon,
  getEventColor,
  formatCompactNumber,
  debounce,
  throttle
}

export const loadTimeWindows = async (): Promise<TimeWindow[]> => {
  try {
    const windows = await leadScoringService.getTimeWindows()
    return Array.isArray(windows) ? windows : DEFAULT_TIME_WINDOWS
  } catch (error) {
    console.error('Error loading time windows:', error)
    return DEFAULT_TIME_WINDOWS
  }
}
