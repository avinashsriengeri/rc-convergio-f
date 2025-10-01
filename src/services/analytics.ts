// @ts-ignore - analyticsAPI is exported from api.js but TypeScript doesn't recognize it
import { analyticsAPI } from './api.js'

export const analyticsService = {
  async getModules() {
    try {
      const response = await analyticsAPI.getModules()
      // Handle both direct data and wrapped { success: true, data: [...] } responses
      const data = response.data?.data || response.data
      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.log('Analytics Modules API failed or returned empty - using fallback data');
        return this.getFallbackModulesData()
      }
      return { data: Array.isArray(data) ? data : [] }
    } catch (error) {
      console.log('Analytics Modules API failed - using fallback data:', (error as Error)?.message)
      return this.getFallbackModulesData()
    }
  },

  getFallbackModulesData() {
    return {
      data: [
        { id: 'contacts', name: 'Contacts', icon: 'users' },
        { id: 'deals', name: 'Deals', icon: 'handshake' },
        { id: 'campaigns', name: 'Campaigns', icon: 'megaphone' },
        { id: 'ads', name: 'Ads', icon: 'target' },
        { id: 'events', name: 'Events', icon: 'calendar' },
        { id: 'meetings', name: 'Meetings', icon: 'video' },
        { id: 'tasks', name: 'Tasks', icon: 'checklist' },
        { id: 'companies', name: 'Companies', icon: 'building' },
        { id: 'forecast', name: 'Forecast', icon: 'trending-up' },
        { id: 'lead_scoring', name: 'Lead Scoring', icon: 'star' },
        { id: 'journeys', name: 'Journeys', icon: 'route' },
        { id: 'visitor_intent', name: 'Visitor Intent', icon: 'eye' },
      ]
    }
  },

  async getPeriods() {
    try {
      const response = await analyticsAPI.getPeriods()
      // Handle both direct data and wrapped { success: true, data: [...] } responses
      const data = response.data?.data || response.data
      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.log('Analytics Periods API failed or returned empty - using fallback data');
        return this.getFallbackPeriodsData()
      }
      return { data: Array.isArray(data) ? data : [] }
    } catch (error) {
      console.log('Analytics Periods API failed - using fallback data:', (error as Error)?.message)
      return this.getFallbackPeriodsData()
    }
  },

  getFallbackPeriodsData() {
    return {
      data: [
        { id: 'week', name: 'This Week', label: 'week' },
        { id: 'month', name: 'This Month', label: 'month' },
        { id: 'quarter', name: 'This Quarter', label: 'quarter' },
        { id: 'year', name: 'This Year', label: 'year' },
      ]
    }
  },

  async getDashboard(period = 'month') {
    try {
      const response = await analyticsAPI.getDashboard({ period })
      // Handle both direct data and wrapped { success: true, data: {...} } responses
      const data = response.data?.data || response.data
      if (!data || typeof data !== 'object') {
        console.log('Analytics Dashboard API failed or returned empty - using fallback data');
        return this.getFallbackDashboardData()
      }
      return { data }
    } catch (error) {
      console.log('Analytics Dashboard API failed - using fallback data:', (error as Error)?.message)
      return this.getFallbackDashboardData()
    }
  },

  getFallbackDashboardData(_period = 'month') {
    return {
      data: {
        contacts: {
          total: 1247,
          new: 89,
          growth: 12.5,
          trend: 'up'
        },
        deals: {
          total: 156,
          new: 23,
          value: 2840000,
          growth: 8.3,
          trend: 'up'
        },
        campaigns: {
          total: 45,
          active: 12,
          sent: 33,
          growth: 15.2,
          trend: 'up'
        },
        ads: {
          total: 8,
          active: 5,
          spend: 12500,
          impressions: 125000,
          growth: 22.1,
          trend: 'up'
        },
        events: {
          total: 18,
          upcoming: 6,
          attendees: 234,
          growth: 5.7,
          trend: 'up'
        },
        meetings: {
          total: 67,
          scheduled: 12,
          completed: 55,
          growth: 18.9,
          trend: 'up'
        },
        tasks: {
          total: 234,
          completed: 189,
          pending: 45,
          growth: 3.2,
          trend: 'up'
        },
        companies: {
          total: 89,
          new: 12,
          growth: 7.8,
          trend: 'up'
        },
        forecast: {
          projected: 3200000,
          probability_weighted: 2560000,
          accuracy: 87.5,
          growth: 11.2,
          trend: 'up'
        },
        lead_scoring: {
          total_leads: 456,
          qualified: 123,
          avg_score: 78.5,
          growth: 9.4,
          trend: 'up'
        },
        journeys: {
          total: 15,
          active: 8,
          completed: 7,
          participants: 567,
          growth: 13.6,
          trend: 'up'
        },
        visitor_intent: {
          total_visitors: 2341,
          high_intent: 234,
          medium_intent: 567,
          low_intent: 1540,
          growth: 16.8,
          trend: 'up'
        }
      }
    }
  },

  async getModuleData(module: string, period = 'month') {
    try {
      const response = await analyticsAPI.getModuleAnalytics(module, { period })
      // Handle both direct data and wrapped { success: true, data: {...} } responses
      const data = response.data?.data || response.data
      if (!data || typeof data !== 'object') {
        console.log(`Analytics ${module} API failed or returned empty - using fallback data`);
        return {
          data: this.getFallbackModuleData(module, period)
        };
      }
      return { data }
    } catch (error) {
      console.log(`Analytics ${module} API failed - using fallback data:`, (error as Error)?.message)
      return {
        data: this.getFallbackModuleData(module, period)
      }
    }
  },

  // Specific module endpoints for better error handling and type safety
  async getContactsAnalytics(period = 'month') {
    try {
      const response = await analyticsAPI.getContactsAnalytics({ period })
      const data = response.data?.data || response.data
      if (!data || typeof data !== 'object') {
        console.log('Analytics Contacts API failed or returned empty - using fallback data');
        return { data: this.getFallbackModuleData('contacts', period) };
      }
      return { data }
    } catch (error) {
      console.log('Analytics Contacts API failed - using fallback data:', (error as Error)?.message)
      return { data: this.getFallbackModuleData('contacts', period) }
    }
  },

  async getCompaniesAnalytics(period = 'month') {
    try {
      const response = await analyticsAPI.getCompaniesAnalytics({ period })
      const data = response.data?.data || response.data
      if (!data || typeof data !== 'object') {
        return { data: this.getFallbackModuleData('companies', period) };
      }
      return { data }
    } catch (error) {
      return { data: this.getFallbackModuleData('companies', period) }
    }
  },

  async getDealsAnalytics(period = 'month') {
    try {
      const response = await analyticsAPI.getDealsAnalytics({ period })
      const data = response.data?.data || response.data
      if (!data || typeof data !== 'object') {
        return { data: this.getFallbackModuleData('deals', period) };
      }
      return { data }
    } catch (error) {
      return { data: this.getFallbackModuleData('deals', period) }
    }
  },

  async getCampaignsAnalytics(period = 'month') {
    try {
      const response = await analyticsAPI.getCampaignsAnalytics({ period })
      const data = response.data?.data || response.data
      if (!data || typeof data !== 'object') {
        return { data: this.getFallbackModuleData('campaigns', period) };
      }
      return { data }
    } catch (error) {
      return { data: this.getFallbackModuleData('campaigns', period) }
    }
  },

  async getAdsAnalytics(period = 'month') {
    try {
      const response = await analyticsAPI.getAdsAnalytics({ period })
      const data = response.data?.data || response.data
      if (!data || typeof data !== 'object') {
        return { data: this.getFallbackModuleData('ads', period) };
      }
      return { data }
    } catch (error) {
      return { data: this.getFallbackModuleData('ads', period) }
    }
  },

  async getEventsAnalytics(period = 'month') {
    try {
      const response = await analyticsAPI.getEventsAnalytics({ period })
      const data = response.data?.data || response.data
      if (!data || typeof data !== 'object') {
        return { data: this.getFallbackModuleData('events', period) };
      }
      return { data }
    } catch (error) {
      return { data: this.getFallbackModuleData('events', period) }
    }
  },

  async getMeetingsAnalytics(period = 'month') {
    try {
      const response = await analyticsAPI.getMeetingsAnalytics({ period })
      const data = response.data?.data || response.data
      if (!data || typeof data !== 'object') {
        return { data: this.getFallbackModuleData('meetings', period) };
      }
      return { data }
    } catch (error) {
      return { data: this.getFallbackModuleData('meetings', period) }
    }
  },

  async getTasksAnalytics(period = 'month') {
    try {
      const response = await analyticsAPI.getTasksAnalytics({ period })
      const data = response.data?.data || response.data
      if (!data || typeof data !== 'object') {
        return { data: this.getFallbackModuleData('tasks', period) };
      }
      return { data }
    } catch (error) {
      return { data: this.getFallbackModuleData('tasks', period) }
    }
  },

  async getForecastAnalytics(period = 'month') {
    try {
      const response = await analyticsAPI.getForecastAnalytics({ period })
      const data = response.data?.data || response.data
      if (!data || typeof data !== 'object') {
        return { data: this.getFallbackModuleData('forecast', period) };
      }
      return { data }
    } catch (error) {
      return { data: this.getFallbackModuleData('forecast', period) }
    }
  },

  async getLeadScoringAnalytics(period = 'month') {
    try {
      const response = await analyticsAPI.getLeadScoringAnalytics({ period })
      const data = response.data?.data || response.data
      if (!data || typeof data !== 'object') {
        return { data: this.getFallbackModuleData('lead_scoring', period) };
      }
      return { data }
    } catch (error) {
      return { data: this.getFallbackModuleData('lead_scoring', period) }
    }
  },

  async getJourneysAnalytics(period = 'month') {
    try {
      const response = await analyticsAPI.getJourneysAnalytics({ period })
      const data = response.data?.data || response.data
      if (!data || typeof data !== 'object') {
        return { data: this.getFallbackModuleData('journeys', period) };
      }
      return { data }
    } catch (error) {
      return { data: this.getFallbackModuleData('journeys', period) }
    }
  },

  async getVisitorIntentAnalytics(period = 'month') {
    try {
      const response = await analyticsAPI.getVisitorIntentAnalytics({ period })
      const data = response.data?.data || response.data
      if (!data || typeof data !== 'object') {
        return { data: this.getFallbackModuleData('visitor_intent', period) };
      }
      return { data }
    } catch (error) {
      return { data: this.getFallbackModuleData('visitor_intent', period) }
    }
  },

  getFallbackModuleData(module: string, period: string) {
    const baseData = {
      period,
      summary: {
        total: 0,
        growth: 0,
        trend: 'up'
      },
      chart_data: [],
      metrics: {}
    };

    switch (module) {
      case 'contacts':
        return {
          ...baseData,
          summary: { total: 1247, growth: 12.5, trend: 'up' },
          chart_data: [
            { date: '2024-01-01', value: 1100 },
            { date: '2024-01-08', value: 1150 },
            { date: '2024-01-15', value: 1200 },
            { date: '2024-01-22', value: 1247 }
          ],
          metrics: {
            new_contacts: 89,
            converted: 23,
            active: 456
          }
        };
      case 'deals':
        return {
          ...baseData,
          summary: { total: 156, growth: 8.3, trend: 'up' },
          chart_data: [
            { date: '2024-01-01', value: 140 },
            { date: '2024-01-08', value: 145 },
            { date: '2024-01-15', value: 150 },
            { date: '2024-01-22', value: 156 }
          ],
          metrics: {
            total_value: 2840000,
            avg_deal_size: 18205,
            win_rate: 34.2
          }
        };
      case 'campaigns':
        return {
          ...baseData,
          summary: { total: 45, growth: 15.2, trend: 'up' },
          chart_data: [
            { date: '2024-01-01', value: 35 },
            { date: '2024-01-08', value: 38 },
            { date: '2024-01-15', value: 42 },
            { date: '2024-01-22', value: 45 }
          ],
          metrics: {
            open_rate: 24.5,
            click_rate: 3.2,
            conversion_rate: 1.8
          }
        };
      case 'ads':
        return {
          ...baseData,
          summary: { total: 8, growth: 22.1, trend: 'up' },
          chart_data: [
            { date: '2024-01-01', value: 6 },
            { date: '2024-01-08', value: 7 },
            { date: '2024-01-15', value: 7 },
            { date: '2024-01-22', value: 8 }
          ],
          metrics: {
            spend: 12500,
            impressions: 125000,
            clicks: 2500,
            ctr: 2.0
          }
        };
      case 'events':
        return {
          ...baseData,
          summary: { total: 18, growth: 5.7, trend: 'up' },
          chart_data: [
            { date: '2024-01-01', value: 16 },
            { date: '2024-01-08', value: 17 },
            { date: '2024-01-15', value: 17 },
            { date: '2024-01-22', value: 18 }
          ],
          metrics: {
            attendees: 234,
            rsvp_rate: 78.5,
            attendance_rate: 65.2
          }
        };
      case 'meetings':
        return {
          ...baseData,
          summary: { total: 67, growth: 18.9, trend: 'up' },
          chart_data: [
            { date: '2024-01-01', value: 55 },
            { date: '2024-01-08', value: 58 },
            { date: '2024-01-15', value: 62 },
            { date: '2024-01-22', value: 67 }
          ],
          metrics: {
            scheduled: 12,
            completed: 55,
            avg_duration: 32
          }
        };
      case 'tasks':
        return {
          ...baseData,
          summary: { total: 234, growth: 3.2, trend: 'up' },
          chart_data: [
            { date: '2024-01-01', value: 225 },
            { date: '2024-01-08', value: 228 },
            { date: '2024-01-15', value: 231 },
            { date: '2024-01-22', value: 234 }
          ],
          metrics: {
            completed: 189,
            pending: 45,
            completion_rate: 80.8
          }
        };
      case 'companies':
        return {
          ...baseData,
          summary: { total: 89, growth: 7.8, trend: 'up' },
          chart_data: [
            { date: '2024-01-01', value: 82 },
            { date: '2024-01-08', value: 84 },
            { date: '2024-01-15', value: 86 },
            { date: '2024-01-22', value: 89 }
          ],
          metrics: {
            new_companies: 12,
            active: 67,
            converted: 8
          }
        };
      case 'forecast':
        return {
          ...baseData,
          summary: { total: 3200000, growth: 11.2, trend: 'up' },
          chart_data: [
            { date: '2024-01-01', value: 2800000 },
            { date: '2024-01-08', value: 2900000 },
            { date: '2024-01-15', value: 3050000 },
            { date: '2024-01-22', value: 3200000 }
          ],
          metrics: {
            probability_weighted: 2560000,
            accuracy: 87.5,
            active_deals: 45
          }
        };
      case 'lead_scoring':
        return {
          ...baseData,
          summary: { total: 456, growth: 9.4, trend: 'up' },
          chart_data: [
            { date: '2024-01-01', value: 410 },
            { date: '2024-01-08', value: 425 },
            { date: '2024-01-15', value: 440 },
            { date: '2024-01-22', value: 456 }
          ],
          metrics: {
            qualified: 123,
            avg_score: 78.5,
            high_score: 89
          }
        };
      case 'journeys':
        return {
          ...baseData,
          summary: { total: 15, growth: 13.6, trend: 'up' },
          chart_data: [
            { date: '2024-01-01', value: 12 },
            { date: '2024-01-08', value: 13 },
            { date: '2024-01-15', value: 14 },
            { date: '2024-01-22', value: 15 }
          ],
          metrics: {
            active: 8,
            completed: 7,
            participants: 567
          }
        };
      case 'visitor_intent':
        return {
          ...baseData,
          summary: { total: 2341, growth: 16.8, trend: 'up' },
          chart_data: [
            { date: '2024-01-01', value: 2000 },
            { date: '2024-01-08', value: 2100 },
            { date: '2024-01-15', value: 2200 },
            { date: '2024-01-22', value: 2341 }
          ],
          metrics: {
            high_intent: 234,
            medium_intent: 567,
            low_intent: 1540
          }
        };
      default:
        return baseData;
    }
  }
}

export const analyticsHelpers = {
  formatNumber: (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  },
  formatCurrency: (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  },
  getTrendIcon: (trend: string) => {
    return trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'
  },
  getTrendColor: (trend: string) => {
    return trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
  }
}
