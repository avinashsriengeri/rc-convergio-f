// Currency options
export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' }
]

// Deal status options
export const DEAL_STATUSES = [
  { value: 'open', label: 'Open', color: 'gray' },
  { value: 'won', label: 'Won', color: 'green' },
  { value: 'lost', label: 'Lost', color: 'red' },
  { value: 'closed', label: 'Closed', color: 'slate' }
]

// Sort options for deals
export const DEAL_SORT_OPTIONS = [
  { value: '-created_at', label: 'Created (Newest)' },
  { value: 'created_at', label: 'Created (Oldest)' },
  { value: 'title', label: 'Title A-Z' },
  { value: '-title', label: 'Title Z-A' },
  { value: '-value', label: 'Value (High-Low)' },
  { value: 'value', label: 'Value (Low-High)' },
  { value: '-expected_close_date', label: 'Close Date (Latest)' },
  { value: 'expected_close_date', label: 'Close Date (Earliest)' },
  { value: '-probability', label: 'Probability (High-Low)' },
  { value: 'probability', label: 'Probability (Low-High)' }
]

// Sort options for pipelines
export const PIPELINE_SORT_OPTIONS = [
  { value: '-created_at', label: 'Created (Newest)' },
  { value: 'created_at', label: 'Created (Oldest)' },
  { value: 'name', label: 'Name A-Z' },
  { value: '-name', label: 'Name Z-A' },
  { value: '-deals_count', label: 'Deals (High-Low)' },
  { value: 'deals_count', label: 'Deals (Low-High)' }
]

// Sort options for stages
export const STAGE_SORT_OPTIONS = [
  { value: 'order', label: 'Order' },
  { value: '-order', label: 'Order (Reverse)' },
  { value: 'name', label: 'Name A-Z' },
  { value: '-name', label: 'Name Z-A' },
  { value: '-deals_count', label: 'Deals (High-Low)' },
  { value: 'deals_count', label: 'Deals (Low-High)' }
]

// Per page options
export const PER_PAGE_OPTIONS = [
  { value: 15, label: '15 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page' }
]

// Summary range options
export const SUMMARY_RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' }
]

// Default colors for stages
export const STAGE_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#F97316', // orange
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#EC4899', // pink
  '#6B7280'  // gray
]

// Status color mapping
export const STATUS_COLORS = {
  open: 'gray',
  won: 'green',
  lost: 'red',
  closed: 'slate'
} as const

// Status badge colors
export const STATUS_BADGE_COLORS = {
  open: 'bg-gray-100 text-gray-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
  closed: 'bg-slate-100 text-slate-800'
} as const
