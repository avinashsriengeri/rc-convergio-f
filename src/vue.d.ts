declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/components/*' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/components/ui/*' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/components/modals/*' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/stores/*' {
  const store: any
  export default store
}

declare module '@/stores/activities' {
  export const useActivitiesStore: () => any
}

declare module '@/stores/refs' {
  export const useRefsStore: () => any
}

declare module '@/utils/*' {
  const utils: any
  export default utils
}

declare module '@/utils/notifications' {
  export const success: (message: string, duration?: number) => void
  export const error: (message: string, duration?: number) => void
  export const warning: (message: string, duration?: number) => void
  export const info: (message: string, duration?: number) => void
  export const notify: (message: string, options?: any) => void
}

declare module '@/utils/formatters' {
  export const formatDate: (date: string | Date | null | undefined) => string
  export const formatTime: (time: string | Date | null | undefined) => string
  export const formatDateTime: (date: string | Date | null | undefined) => string
  export const formatRelativeTime: (date: string | Date | null | undefined) => string
  export const formatCurrency: (amount: number | null | undefined, currency?: string) => string
  export const formatPercentage: (value: number | null | undefined) => string
  export const formatNumber: (value: number | null | undefined) => string
  export const formatFileSize: (bytes: number) => string
  export const truncateText: (text: string, maxLength: number) => string
  export const getInitials: (name: string) => string
  export const isOverdue: (date: string | Date | null | undefined) => boolean
}

declare module '@/utils/constants' {
  export const PER_PAGE_OPTIONS: Array<{ value: number; label: string }>
  export const CURRENCIES: Array<{ code: string; name: string; symbol: string }>
  export const DEAL_STATUSES: Array<{ value: string; label: string; color: string }>
  export const DEAL_SORT_OPTIONS: Array<{ value: string; label: string }>
  export const PIPELINE_SORT_OPTIONS: Array<{ value: string; label: string }>
  export const STAGE_SORT_OPTIONS: Array<{ value: string; label: string }>
  export const SUMMARY_RANGE_OPTIONS: Array<{ value: string; label: string }>
  export const STAGE_COLORS: string[]
  export const STATUS_COLORS: Record<string, string>
  export const STATUS_BADGE_COLORS: Record<string, string>
}

declare module '@/types' {
  export interface Activity {
    id: number
    title: string
    description?: string
    type: string
    status: string
    scheduled_at?: string
    duration?: number
    owner_id: number
    owner?: any
    contact_id?: number
    contact?: any
    company_id?: number
    company?: any
    deal_id?: number
    deal?: any
    notes?: string
    completed_at?: string
    created_at: string
    updated_at: string
  }
  
  export interface ActivityFormData {
    title: string
    description?: string
    type: string
    status: string
    scheduled_at?: string
    duration?: number
    owner_id?: number
    contact_id?: number
    company_id?: number
    deal_id?: number
    notes?: string
  }
  
  export interface PaginationMeta {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
  
  export interface Task {
    id: number
    title: string
    description?: string
    priority: string
    status: string
    assignee_id?: number
    assignee?: any
    due_date: string
    notes?: string
    related_entity_type?: string
    related_entity_id?: number
    related_entity?: any
    completed_at?: string
    created_at: string
    updated_at: string
  }
  
  export interface TaskFormData {
    title: string
    description?: string
    priority: string
    status: string
    assignee_id?: number
    due_date: string
    notes?: string
    related_entity_type?: string
    related_entity_id?: number
  }
  
  export interface TaskFilters {
    search?: string
    status?: string
    priority?: string
    assignee_id?: number
    owner_id?: number
    due_date_filter?: string
    due_date_from?: string
    due_date_to?: string
    sort?: string
    page?: number
    per_page?: number
  }
  
  export interface TaskStatus {
    pending: string
    in_progress: string
    completed: string
    cancelled: string
  }
  
  export interface Campaign {
    id: number
    name: string
    description?: string
    type: string
    status: string
    owner_id?: number
    owner?: any
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
    created_at: string
    updated_at: string
  }
  
  export interface CampaignFormData {
    name: string
    description?: string
    type: string
    status: string
    owner_id?: number
    subject?: string
    content: string
    scheduled_at?: string
  }
  
  export interface CampaignMetrics {
    total_campaigns: number
    active_campaigns: number
    completed_campaigns: number
    total_recipients: number
    total_sent: number
    total_opened: number
    total_clicked: number
    open_rate: number
    click_rate: number
    campaigns_this_month: number
    campaigns_this_quarter: number
  }
  
  export interface User {
    id: number
    name: string
    email: string
    role: string
    created_at: string
    updated_at: string
  }
  
  export interface BaseEntity {
    id: number
    created_at: string
    updated_at: string
  }
  
  export interface Contact {
    id: number
    first_name: string
    last_name: string
    email: string
    phone?: string
    company_id?: number
    company?: any
    created_at: string
    updated_at: string
  }
  
  export interface Company {
    id: number
    name: string
    industry?: string
    website?: string
    phone?: string
    email?: string
    address?: string
    created_at: string
    updated_at: string
  }
  
  export interface Deal {
    id: number
    title: string
    description?: string
    value?: number
    currency?: string
    probability?: number
    expected_close_date?: string
    pipeline_id: number
    pipeline?: any
    stage_id: number
    stage?: any
    owner_id: number
    owner?: any
    contact_id?: number
    contact?: any
    company_id?: number
    company?: any
    status: string
    created_at: string
    updated_at: string
  }
  
  export interface Pipeline {
    id: number
    name: string
    description?: string
    owner_id: number
    owner?: any
    stages?: any[]
    deals_count?: number
    created_at: string
    updated_at: string
  }
  
  export interface Stage {
    id: number
    name: string
    color?: string
    order: number
    pipeline_id: number
    pipeline?: any
    deals_count?: number
    created_at: string
    updated_at: string
  }
  
  export interface ApiResponse<T> {
    data: T
    meta?: PaginationMeta
    message?: string
  }
  
  export interface LoadingState {
    loading: boolean
    error: string | null
  }
  
  export interface PaginatedState extends LoadingState {
    meta: PaginationMeta
  }
  
  export interface DragItem {
    id: number
    type: string
  }
  
  export interface Environment {
    id: number
    name: string
    description?: string
    created_at: string
    updated_at: string
  }
  
  export interface WebhookEvent {
    id: number
    event_type: string
    payload: any
    processed: boolean
    created_at: string
    updated_at: string
  }
  
  export interface DealsSummary {
    total_deals: number
    open_deals: number
    won_deals: number
    lost_deals: number
    total_value: number
    won_value: number
    deals_this_month: number
    deals_this_quarter: number
    conversion_rate: number
  }
  
  export interface DealFilters {
    search?: string
    status?: string
    pipeline_id?: number
    stage_id?: number
    owner_id?: number
    value_from?: number
    value_to?: number
    expected_close_date_from?: string
    expected_close_date_to?: string
    sort?: string
    page?: number
    per_page?: number
  }
}

declare module '@/composables/useAuth' {
  export function useAuth(): {
    user: any
    isAuthenticated: any
    loading: any
    userRole: any
    userName: any
    userEmail: any
    initAuth: () => Promise<void>
    login: (credentials: any) => Promise<{ success: boolean; message: string }>
    register: (userData: any) => Promise<{ success: boolean; message: string }>
    logout: () => Promise<void>
    verifyToken: () => Promise<boolean>
    forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>
    resetPassword: (data: any) => Promise<{ success: boolean; message: string }>
  }
}
