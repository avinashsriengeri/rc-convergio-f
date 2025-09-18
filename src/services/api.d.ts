import { AxiosResponse } from 'axios'

// Base API response types
export interface ApiResponse<T = any> {
  data: T
  meta?: any
  message?: string
}

// Auth API
export interface LoginCredentials {
  email: string
  password: string
}

export interface UserData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const authAPI: {
  login: (credentials: LoginCredentials) => Promise<AxiosResponse<ApiResponse>>
  register: (userData: UserData) => Promise<AxiosResponse<ApiResponse>>
  verify: () => Promise<AxiosResponse<ApiResponse>>
  forgotPassword: (email: string) => Promise<AxiosResponse<ApiResponse>>
  resetPassword: (data: any) => Promise<AxiosResponse<ApiResponse>>
  logout: () => Promise<AxiosResponse<ApiResponse>>
}

// Dashboard API
export const dashboardAPI: {
  getDashboard: () => Promise<AxiosResponse<ApiResponse>>
  getDealsSummary: (range?: string) => Promise<AxiosResponse<ApiResponse>>
  getTodayTasks: () => Promise<AxiosResponse<ApiResponse>>
  getRecentContacts: (limit?: number) => Promise<AxiosResponse<ApiResponse>>
  getCampaignMetrics: (range?: string) => Promise<AxiosResponse<ApiResponse>>
}

// Contacts API
export const contactsAPI: {
  getContacts: (params?: any) => Promise<AxiosResponse<ApiResponse>>
  getContact: (id: number) => Promise<AxiosResponse<ApiResponse>>
  createContact: (data: any) => Promise<AxiosResponse<ApiResponse>>
  updateContact: (id: number, data: any) => Promise<AxiosResponse<ApiResponse>>
  deleteContact: (id: number) => Promise<AxiosResponse<ApiResponse>>
  restoreContact: (id: number) => Promise<AxiosResponse<ApiResponse>>
  searchContacts: (query: string, params?: any) => Promise<AxiosResponse<ApiResponse>>
  importCSV: (file: File) => Promise<AxiosResponse<ApiResponse>>
  getImportStatus: (jobId: string) => Promise<AxiosResponse<ApiResponse>>
}

// Companies API
export const companiesAPI: {
  getCompanies: (params?: any) => Promise<AxiosResponse<ApiResponse>>
  getCompany: (id: number) => Promise<AxiosResponse<ApiResponse>>
  createCompany: (data: any) => Promise<AxiosResponse<ApiResponse>>
  updateCompany: (id: number, data: any) => Promise<AxiosResponse<ApiResponse>>
  deleteCompany: (id: number) => Promise<AxiosResponse<ApiResponse>>
  restoreCompany: (id: number) => Promise<AxiosResponse<ApiResponse>>
  getDeletedCompanies: (params?: any) => Promise<AxiosResponse<ApiResponse>>
  searchCompanies: (query: string, params?: any) => Promise<AxiosResponse<ApiResponse>>
  checkDuplicates: (data: any) => Promise<AxiosResponse<ApiResponse>>
  bulkCreate: (data: any) => Promise<AxiosResponse<ApiResponse>>
  importCSV: (file: File) => Promise<AxiosResponse<ApiResponse>>
  getImportStatus: (jobId: string) => Promise<AxiosResponse<ApiResponse>>
  attachContact: (companyId: number, contactId: number) => Promise<AxiosResponse<ApiResponse>>
  detachContact: (companyId: number, contactId: number) => Promise<AxiosResponse<ApiResponse>>
  getCompanyContacts: (companyId: number) => Promise<AxiosResponse<ApiResponse>>
  getActivityLog: (companyId: number) => Promise<AxiosResponse<ApiResponse>>
}

// Metadata API
export const metadataAPI: {
  getIndustries: () => Promise<AxiosResponse<ApiResponse>>
  getCompanyTypes: () => Promise<AxiosResponse<ApiResponse>>
  getOwners: () => Promise<AxiosResponse<ApiResponse>>
  getLeadSources: () => Promise<AxiosResponse<ApiResponse>>
  getContactTypes: () => Promise<AxiosResponse<ApiResponse>>
  getDealStages: () => Promise<AxiosResponse<ApiResponse>>
  getDealStatuses: () => Promise<AxiosResponse<ApiResponse>>
  getTaskPriorities: () => Promise<AxiosResponse<ApiResponse>>
  getTaskStatuses: () => Promise<AxiosResponse<ApiResponse>>
  getActivityTypes: () => Promise<AxiosResponse<ApiResponse>>
  getCampaignTypes: () => Promise<AxiosResponse<ApiResponse>>
  getCampaignStatuses: () => Promise<AxiosResponse<ApiResponse>>
  getCurrencies: () => Promise<AxiosResponse<ApiResponse>>
}

// Pipelines API
export const pipelinesAPI: {
  getPipelines: (params?: any) => Promise<AxiosResponse<ApiResponse>>
  getPipeline: (id: number) => Promise<AxiosResponse<ApiResponse>>
  createPipeline: (data: any) => Promise<AxiosResponse<ApiResponse>>
  updatePipeline: (id: number, data: any) => Promise<AxiosResponse<ApiResponse>>
  deletePipeline: (id: number) => Promise<AxiosResponse<ApiResponse>>
  toggleActive: (id: number) => Promise<AxiosResponse<ApiResponse>>
  getActivePipelines: () => Promise<AxiosResponse<ApiResponse>>
}

// Stages API
export const stagesAPI: {
  getStages: (params?: any) => Promise<AxiosResponse<ApiResponse>>
  getStage: (id: number) => Promise<AxiosResponse<ApiResponse>>
  createStage: (data: any) => Promise<AxiosResponse<ApiResponse>>
  updateStage: (id: number, data: any) => Promise<AxiosResponse<ApiResponse>>
  deleteStage: (id: number) => Promise<AxiosResponse<ApiResponse>>
  getStagesByPipeline: (pipelineId: number) => Promise<AxiosResponse<ApiResponse>>
  reorderStages: (pipelineId: number, stageIds: number[]) => Promise<AxiosResponse<ApiResponse>>
}

// Deals API
export const dealsAPI: {
  getDeals: (params?: any) => Promise<AxiosResponse<ApiResponse>>
  getDeal: (id: number) => Promise<AxiosResponse<ApiResponse>>
  createDeal: (data: any) => Promise<AxiosResponse<ApiResponse>>
  updateDeal: (id: number, data: any) => Promise<AxiosResponse<ApiResponse>>
  deleteDeal: (id: number) => Promise<AxiosResponse<ApiResponse>>
  moveDeal: (id: number, stageId: number) => Promise<AxiosResponse<ApiResponse>>
  getDealsByStage: (stageId: number) => Promise<AxiosResponse<ApiResponse>>
  getDealsByPipeline: (pipelineId: number) => Promise<AxiosResponse<ApiResponse>>
  getDealsSummary: (range?: string) => Promise<AxiosResponse<ApiResponse>>
  getDealsChart: (range?: string) => Promise<AxiosResponse<ApiResponse>>
  bulkUpdate: (dealIds: number[], data: any) => Promise<AxiosResponse<ApiResponse>>
  exportDeals: (params?: any) => Promise<AxiosResponse<Blob>>
}

// Activities API
export const activitiesAPI: {
  getActivities: (params?: any) => Promise<AxiosResponse<ApiResponse>>
  getActivity: (id: number) => Promise<AxiosResponse<ApiResponse>>
  createActivity: (data: any) => Promise<AxiosResponse<ApiResponse>>
  updateActivity: (id: number, data: any) => Promise<AxiosResponse<ApiResponse>>
  deleteActivity: (id: number) => Promise<AxiosResponse<ApiResponse>>
  getActivitiesByEntity: (entityType: string, entityId: number) => Promise<AxiosResponse<ApiResponse>>
  getActivityTimeline: (params?: any) => Promise<AxiosResponse<ApiResponse>>
  getUpcomingActivities: (params?: any) => Promise<AxiosResponse<ApiResponse>>
  markCompleted: (id: number) => Promise<AxiosResponse<ApiResponse>>
}

// Tasks API
export const tasksAPI: {
  getTasks: (params?: any) => Promise<AxiosResponse<ApiResponse>>
  getTask: (id: number) => Promise<AxiosResponse<ApiResponse>>
  createTask: (data: any) => Promise<AxiosResponse<ApiResponse>>
  updateTask: (id: number, data: any) => Promise<AxiosResponse<ApiResponse>>
  deleteTask: (id: number) => Promise<AxiosResponse<ApiResponse>>
  completeTask: (id: number) => Promise<AxiosResponse<ApiResponse>>
  getTasksByAssignee: (assigneeId: number) => Promise<AxiosResponse<ApiResponse>>
  getTasksByOwner: (ownerId: number) => Promise<AxiosResponse<ApiResponse>>
  getTodayTasks: () => Promise<AxiosResponse<ApiResponse>>
  getOverdueTasks: () => Promise<AxiosResponse<ApiResponse>>
  getUpcomingTasks: (days?: number) => Promise<AxiosResponse<ApiResponse>>
  bulkUpdate: (taskIds: number[], data: any) => Promise<AxiosResponse<ApiResponse>>
  bulkComplete: (taskIds: number[]) => Promise<AxiosResponse<ApiResponse>>
  exportTasks: (params?: any) => Promise<AxiosResponse<Blob>>
}

// Campaigns API
export const campaignsAPI: {
  getCampaigns: (params?: any) => Promise<AxiosResponse<ApiResponse>>
  getCampaign: (id: number) => Promise<AxiosResponse<ApiResponse>>
  createCampaign: (data: any) => Promise<AxiosResponse<ApiResponse>>
  updateCampaign: (id: number, data: any) => Promise<AxiosResponse<ApiResponse>>
  patchCampaign: (id: number, data: any) => Promise<AxiosResponse<ApiResponse>>
  deleteCampaign: (id: number) => Promise<AxiosResponse<ApiResponse>>
  sendCampaign: (id: number, data?: any) => Promise<AxiosResponse<ApiResponse>>
  scheduleCampaign: (id: number, scheduledAt: string) => Promise<AxiosResponse<ApiResponse>>
  pauseCampaign: (id: number) => Promise<AxiosResponse<ApiResponse>>
  resumeCampaign: (id: number) => Promise<AxiosResponse<ApiResponse>>
  getCampaignMetrics: (id: number, params?: any) => Promise<AxiosResponse<ApiResponse>>
  getCampaignRecipients: (id: number, params?: any) => Promise<AxiosResponse<ApiResponse>>
  addRecipients: (id: number, recipientIds: number[]) => Promise<AxiosResponse<ApiResponse>>
  removeRecipients: (id: number, recipientIds: number[]) => Promise<AxiosResponse<ApiResponse>>
  getCampaignEvents: (id: number) => Promise<AxiosResponse<ApiResponse>>
  getWebhookEvents: (params?: any) => Promise<AxiosResponse<ApiResponse>>
  getCampaignTemplates: () => Promise<AxiosResponse<ApiResponse>>
  duplicateCampaign: (id: number) => Promise<AxiosResponse<ApiResponse>>
  getRecipients: (id: number) => Promise<AxiosResponse<ApiResponse>>
  addRecipient: (id: number, recipientData: any) => Promise<AxiosResponse<ApiResponse>>
  removeRecipient: (id: number, recipientId: number) => Promise<AxiosResponse<ApiResponse>>
  getCampaignAuditLogs: (id: number, params?: any) => Promise<AxiosResponse<ApiResponse>>
  
  // Campaign Enhancements
  testCampaign: (id: number, data?: any) => Promise<AxiosResponse<ApiResponse>>
  previewCampaign: (id: number) => Promise<AxiosResponse<ApiResponse>>
  validateCampaign: (id: number) => Promise<AxiosResponse<ApiResponse>>
  unscheduleCampaign: (id: number) => Promise<AxiosResponse<ApiResponse>>
  archiveCampaign: (id: number) => Promise<AxiosResponse<ApiResponse>>
  restoreCampaign: (id: number) => Promise<AxiosResponse<ApiResponse>>
  
  // Bulk Operations
  bulkSendCampaigns: (campaignIds: number[], data?: any) => Promise<AxiosResponse<ApiResponse>>
  bulkPauseCampaigns: (campaignIds: number[]) => Promise<AxiosResponse<ApiResponse>>
  bulkResumeCampaigns: (campaignIds: number[]) => Promise<AxiosResponse<ApiResponse>>
  bulkArchiveCampaigns: (campaignIds: number[]) => Promise<AxiosResponse<ApiResponse>>
  
  // Import/Export
  exportCampaigns: (params?: any) => Promise<AxiosResponse<Blob>>
  importCampaigns: (file: File) => Promise<AxiosResponse<ApiResponse>>
  
  // Ad Integration
  attachAdsToCampaign: (id: number, adData: any) => Promise<AxiosResponse<ApiResponse>>
  getCampaignAdsMetrics: (id: number, params?: any) => Promise<AxiosResponse<ApiResponse>>
  
  // Analytics Integration
  getCampaignAnalytics: (params?: any) => Promise<AxiosResponse<ApiResponse>>
}

// Default export
declare const api: any
export default api
