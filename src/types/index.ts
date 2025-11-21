// Base types
export interface BaseEntity {
  id: number
  created_at: string
  updated_at: string
}

// User/Owner types
export interface User extends BaseEntity {
  name: string
  email: string
  avatar?: string
}

// Contact types
export interface Contact extends BaseEntity {
  name: string
  email: string
  phone?: string
  company_id?: number
  company?: Company
}

// Company types
export interface Company extends BaseEntity {
  name: string
  industry?: string
  website?: string
}

// Pipeline types
export interface Pipeline extends BaseEntity {
  name: string
  description?: string
  is_active: boolean
  stages_count?: number
  deals_count?: number
}

// Stage types
export interface Stage extends BaseEntity {
  name: string
  description?: string
  pipeline_id: number
  pipeline?: Pipeline
  order: number
  color: string
  is_active: boolean
  deals_count?: number
}

// Deal types
export interface Deal extends BaseEntity {
  title: string
  description?: string
  value?: number
  currency?: string
  status: DealStatus
  pipeline_id: number
  pipeline?: Pipeline
  stage_id: number
  stage?: Stage
  owner_id: number
  owner?: User
  contact_id?: number
  contact?: Contact
  company_id?: number
  company?: Company
  expected_close_date?: string
  probability: number
  tags?: string[]
  closed_at?: string
  won_at?: string
  lost_at?: string
  documents?: any[] // Documents attached to the deal
}

export type DealStatus = 'open' | 'won' | 'lost' | 'closed'

// Filter types
export interface DealFilters {
  search?: string
  status?: DealStatus | 'all'
  pipeline_id?: number
  stage_id?: number
  owner_id?: number
  value_min?: number
  value_max?: number
  date_from?: string
  date_to?: string
  sort?: string
  page?: number
  per_page?: number
}

export interface PipelineFilters {
  page?: number
  per_page?: number
  sort?: string
  is_active?: boolean
}

export interface StageFilters {
  pipeline_id?: number
  is_active?: boolean
  page?: number
  per_page?: number
  sort?: string
}

// Pagination types
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  message?: string
}

// Summary types
export interface DealsSummary {
  total_deals: number
  open_deals: number
  won_deals: number
  lost_deals: number
  closed_deals: number
  total_value: number
  won_value: number
  avg_deal_size: number
  win_rate: number
  conversion_rate: number
  deals_this_month: number
  deals_this_quarter: number
  deals_this_year: number
}

// Form types
export interface DealFormData {
  title: string
  description?: string
  value?: number
  currency?: string
  status: DealStatus
  pipeline_id: number
  stage_id: number
  owner_id: number
  contact_id?: number
  company_id?: number
  expected_close_date?: string
  probability: number
  tags?: string[]
}

export interface PipelineFormData {
  name: string
  description?: string
  is_active: boolean
}

export interface StageFormData {
  name: string
  description?: string
  pipeline_id: number
  order: number
  color: string
  is_active: boolean
}

// Currency types
export interface Currency {
  code: string
  name: string
  symbol: string
}

// API Error types
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

// Activity types
export interface Activity extends BaseEntity {
  title: string
  description?: string
  type: ActivityType
  status: ActivityStatus
  scheduled_at?: string
  duration?: number
  owner_id: number
  owner?: User
  contact_id?: number
  contact?: Contact
  company_id?: number
  company?: Company
  deal_id?: number
  deal?: Deal
  notes?: string
  completed_at?: string
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note' | 'other'
export type ActivityStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'

// Task types
export interface Task extends BaseEntity {
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  assignee_id?: number
  assignee?: User
  contact_id?: number
  contact?: Contact
  due_date: string
  notes?: string
  related_entity_type?: string
  related_entity_id?: number
  related_entity?: any
  completed_at?: string
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

// Task filter types
export interface TaskFilters {
  search?: string
  status?: TaskStatus | 'all'
  priority?: TaskPriority | 'all'
  assignee_id?: number
  owner_id?: number
  due_date_filter?: string
  due_date_from?: string
  due_date_to?: string
  sort?: string
  page?: number
  per_page?: number
}

// Task summary types
export interface TasksSummary {
  total_tasks: number
  pending_tasks: number
  completed_tasks: number
  overdue_tasks: number
  today_tasks: number
  upcoming_tasks: number
  completion_rate: number
  tasks_this_week: number
  tasks_this_month: number
  tasks_by_priority: {
    high: number
    medium: number
    low: number
    urgent: number
  }
}

// Campaign types
export interface Campaign extends BaseEntity {
  name: string
  description?: string
  type: CampaignType
  status: CampaignStatus
  owner_id?: number
  owner?: User
  subject?: string
  content: string
  scheduled_at?: string
  sent_at?: string
  recipient_count?: number
  sent_count?: number
  opened_count?: number
  clicked_count?: number
  bounced_count?: number
  unsubscribed_count?: number
}

export type CampaignType = 'email' | 'sms' | 'newsletter' | 'promotional'
export type CampaignStatus = 'draft' | 'scheduled' | 'sent' | 'cancelled'

// Campaign Metrics types
export interface CampaignMetrics {
  recipient_count: number
  sent_count: number
  opened_count: number
  clicked_count: number
  bounced_count: number
  unsubscribed_count: number
  open_rate: number
  click_rate: number
  bounce_rate: number
  unsubscribe_rate: number
  timeline_data?: any[]
}

// Webhook Event types
export interface WebhookEvent extends BaseEntity {
  event_type: string
  campaign_id?: number
  campaign?: Campaign
  recipient_id?: number
  recipient?: Contact
  data: any
  processed: boolean
  processed_at?: string
}

// Form types
  export interface ActivityFormData {
    title: string
    description?: string
    type: ActivityType
    status: ActivityStatus
    scheduled_at?: string
    duration?: number
    owner_id: number
    contact_id?: number
    company_id?: number
    deal_id?: number
    notes?: string
    tags?: string[]
    related_entity_type?: string
    related_entity_id?: number
  }

export interface TaskFormData {
  title: string
  description?: string
  priority: TaskPriority
  assignee_id?: number
  contact_id?: number
  due_date: string
  status: TaskStatus
  notes?: string
  related_entity_type?: string
  related_entity_id?: number
}

export interface CampaignFormData {
  name: string
  description?: string
  type: CampaignType
  owner_id?: number
  subject?: string
  content: string
  scheduled_at?: string
  // New optional fields for templates and recipients
  is_template?: boolean
  recipient_mode?: 'contacts' | 'segment' | 'csv' | ''
  recipient_contact_ids?: number[]
  segment_id?: number | string
}

// Store state types
export interface LoadingState {
  loading: boolean
  error: string | null
}

export interface PaginatedState<T> extends LoadingState {
  items: T[]
  meta: PaginationMeta
}

// Drag and drop types
export interface DragItem {
  id: number
  type: string
  data: Deal
}

export interface DropResult {
  active: {
    id: number
    data: any
  }
  over: {
    id: number
    data: any
  } | null
  delta: {
    x: number
    y: number
  }
}

// Environment types
export interface Environment {
  VITE_API_BASE_URL: string
  VITE_TENANT_ID: string
  VITE_AUTH_TOKEN?: string
  VITE_USERS_ENDPOINT: string
}
