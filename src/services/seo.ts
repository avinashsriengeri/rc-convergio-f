import api from './api'

export interface SeoKeyword {
  id: number
  keyword: string
  search_volume?: number
  difficulty?: number
  cpc?: number
  competition?: number
  position?: number
  url?: string
  impressions: number
  clicks: number
  ctr: number
  status: 'active' | 'inactive' | 'monitoring'
  target_url?: string
  meta_data?: any
  created_at: string
  updated_at: string
}

export interface SeoReport {
  id: number
  name: string
  url: string
  report_type: 'audit' | 'keyword_analysis' | 'competitor_analysis' | 'technical_seo'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  score?: number
  recommendations?: string[]
  issues?: string[]
  meta_data?: any
  generated_at?: string
  user_id: number
  user?: {
    id: number
    name: string
    email: string
  }
  keywords?: SeoKeyword[]
  created_at: string
  updated_at: string
}

export interface SeoStats {
  total_keywords: number
  active_keywords: number
  avg_position: number
  top_10_keywords: number
}

export interface SeoDashboard {
  stats: SeoStats
  top_keywords: SeoKeyword[]
  recent_reports: SeoReport[]
}

class SeoService {
  // Keywords
  async getKeywords(params?: {
    search?: string
    status?: string
    position_max?: number
    sort_by?: string
    sort_order?: 'asc' | 'desc'
    per_page?: number
    page?: number
  }) {
    const response = await api.get('/seo/keywords', { params })
    return response.data
  }

  async createKeyword(data: {
    keyword: string
    search_volume?: number
    difficulty?: number
    cpc?: number
    competition?: number
    target_url?: string
    status?: 'active' | 'inactive' | 'monitoring'
  }) {
    const response = await api.post('/seo/keywords', data)
    return response.data
  }

  async updateKeyword(id: number, data: Partial<SeoKeyword>) {
    const response = await api.put(`/seo/keywords/${id}`, data)
    return response.data
  }

  async deleteKeyword(id: number) {
    const response = await api.delete(`/seo/keywords/${id}`)
    return response.data
  }

  // Reports
  async getReports(params?: {
    report_type?: string
    status?: string
    search?: string
    per_page?: number
    page?: number
  }) {
    const response = await api.get('/seo/reports', { params })
    return response.data
  }

  async generateReport(data: {
    name: string
    url: string
    report_type: 'audit' | 'keyword_analysis' | 'competitor_analysis' | 'technical_seo'
  }) {
    const response = await api.post('/seo/reports', data)
    return response.data
  }

  async getReport(id: number) {
    const response = await api.get(`/seo/reports/${id}`)
    return response.data
  }

  // Dashboard
  async getDashboard(): Promise<{ success: boolean; data: SeoDashboard }> {
    const response = await api.get('/seo/dashboard')
    return response.data
  }

  // Metrics
  async getMetrics(days: number = 30) {
    const response = await api.get('/seo/metrics', { params: { days } })
    return response.data
  }

  // Pages
  async getPages() {
    const response = await api.get('/seo/pages')
    return response.data
  }

  async getPageMetrics(pageId: number) {
    const response = await api.get(`/seo/pages/${pageId}/metrics`)
    return response.data
  }

  async scanPage(pageId: number) {
    const response = await api.post(`/seo/pages/${pageId}/scan`)
    return response.data
  }

  // Recommendations
  async getRecommendations() {
    const response = await api.get('/seo/recommendations')
    return response.data
  }

  async resolveRecommendation(id: number) {
    const response = await api.post(`/seo/recommendations/${id}/resolve`)
    return response.data
  }

  // Google Search Console
  async connectGSC(data?: { website_url: string }) {
    const response = await api.post('/seo/connect', data)
    return response.data
  }

  async disconnectGSC() {
    const response = await api.post('/seo/disconnect')
    return response.data
  }

  async getGSCStatus() {
    const response = await api.get('/seo/connection-status')
    return response.data
  }

  // Site Scan
  async fullSiteScan() {
    const response = await api.post('/seo/scan')
    return response.data
  }
}

export const seoService = new SeoService()

// Helper functions
export const seoHelpers = {
  getKeywordDifficultyColor(difficulty?: number): string {
    if (!difficulty) return 'text-gray-500'
    if (difficulty <= 30) return 'text-green-600'
    if (difficulty <= 70) return 'text-yellow-600'
    return 'text-red-600'
  },

  getKeywordDifficultyLabel(difficulty?: number): string {
    if (!difficulty) return 'Unknown'
    if (difficulty <= 30) return 'Easy'
    if (difficulty <= 70) return 'Medium'
    return 'Hard'
  },

  getCompetitionColor(competition?: number): string {
    if (!competition) return 'text-gray-500'
    if (competition <= 0.3) return 'text-green-600'
    if (competition <= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  },

  getCompetitionLabel(competition?: number): string {
    if (!competition) return 'Unknown'
    if (competition <= 0.3) return 'Low'
    if (competition <= 0.7) return 'Medium'
    return 'High'
  },

  getPositionColor(position?: number): string {
    if (!position) return 'text-gray-500'
    if (position <= 3) return 'text-green-600'
    if (position <= 10) return 'text-yellow-600'
    return 'text-red-600'
  },

  getReportStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  },

  getScoreColor(score?: number): string {
    if (!score) return 'text-gray-500'
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  },

  formatNumber(num?: number): string {
    if (!num) return '0'
    return new Intl.NumberFormat().format(num)
  },

  formatCurrency(amount?: number): string {
    if (!amount) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  },

  formatPercentage(value?: number): string {
    if (!value) return '0%'
    return `${(value * 100).toFixed(2)}%`
  }
}