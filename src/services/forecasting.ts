import api from './api'

// Forecasting API wrappers
export const forecastingService = {
  // Get forecast data
  async getForecast(params = {}) {
    try {
      // Convert boolean parameters to integers (1/0) as Laravel backend expects numeric boolean values
      const processedParams = {
        ...params,
        include_trends: params.include_trends ? 1 : 0,
        include_pipeline_breakdown: params.include_pipeline_breakdown ? 1 : 0,
        include_accuracy: params.include_accuracy ? 1 : 0
      }
      
      const response = await api.get('/forecast', { params: processedParams })
      return response.data
    } catch (error) {
      console.error('Error fetching forecast data:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: {
            projected_value: 2400000,
            probability_weighted: 1800000,
            forecast_accuracy: 87.5,
            active_deals: 89,
            pipeline_breakdown: [
              { stage: 'Prospecting', value: 450000, count: 23 },
              { stage: 'Qualification', value: 380000, count: 18 },
              { stage: 'Proposal', value: 620000, count: 15 },
              { stage: 'Negotiation', value: 480000, count: 12 },
              { stage: 'Closed Won', value: 470000, count: 21 }
            ],
            trends: {
              projected_value_trend: '+15%',
              probability_weighted_trend: '+12%',
              accuracy_trend: '+3%',
              active_deals_trend: '+8'
            },
            timeframe: params.timeframe || 'monthly',
            last_updated: new Date().toISOString()
          }
        }
      }
      
      throw error
    }
  },

  // Get forecast trends
  async getForecastTrends(params = {}) {
    try {
      const response = await api.get('/forecast/trends', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching forecast trends:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: {
            months: 6,
            accuracy_trend: [
              { month: 'Jul', accuracy: 82 },
              { month: 'Aug', accuracy: 84 },
              { month: 'Sep', accuracy: 85 },
              { month: 'Oct', accuracy: 86 },
              { month: 'Nov', accuracy: 87 },
              { month: 'Dec', accuracy: 87.5 }
            ],
            projected_value_trend: [
              { month: 'Jul', value: 2100000 },
              { month: 'Aug', value: 2200000 },
              { month: 'Sep', value: 2250000 },
              { month: 'Oct', value: 2300000 },
              { month: 'Nov', value: 2350000 },
              { month: 'Dec', value: 2400000 }
            ],
            probability_weighted_trend: [
              { month: 'Jul', value: 1650000 },
              { month: 'Aug', value: 1680000 },
              { month: 'Sep', value: 1700000 },
              { month: 'Oct', value: 1720000 },
              { month: 'Nov', value: 1760000 },
              { month: 'Dec', value: 1800000 }
            ]
          }
        }
      }
      
      throw error
    }
  },

  // Get pipeline breakdown
  async getPipelineBreakdown(params = {}) {
    try {
      const response = await api.get('/forecast/by-pipeline', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching pipeline breakdown:', error)
      
      // Return fallback data for development
      return {
        data: {
          timeframe: params.timeframe || 'monthly',
          pipeline_breakdown: {
            "1": {
              pipeline_id: 1,
              pipeline_name: "Sales Pipeline",
              count: 2,
              total_value: 1500,
              probability_weighted: 1050,
              average_probability: 70
            }
          },
          total_pipelines: 1
        }
      }
    }
  },

  // Get forecast accuracy
  async getForecastAccuracy(params = {}) {
    try {
      const response = await api.get('/forecast/accuracy', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching forecast accuracy:', error)
      
      // Return fallback data for development
      return {
        data: {
          accuracy_metrics: [
            {
              month: "2025-09",
              month_name: "September 2025",
              expected_deals: 5,
              actual_closed: 0,
              expected_value: 80030,
              actual_value: 0,
              accuracy_percentage: 0
            },
            {
              month: "2025-08", 
              month_name: "August 2025",
              expected_deals: 2,
              actual_closed: 0,
              expected_value: 850,
              actual_value: 0,
              accuracy_percentage: 0
            },
            {
              month: "2025-07",
              month_name: "July 2025", 
              expected_deals: 0,
              actual_closed: 0,
              expected_value: 0,
              actual_value: 0,
              accuracy_percentage: 0
            }
          ],
          average_accuracy: 0
        }
      }
    }
  },

  // Get available timeframes
  async getTimeframes() {
    try {
      const response = await api.get('/forecast/timeframes')
      return response.data
    } catch (error) {
      console.error('Error fetching timeframes:', error)
      
      // Return fallback data for development
      return {
        data: [
          { id: 'monthly', name: 'Monthly', description: 'Monthly forecast view' },
          { id: 'quarterly', name: 'Quarterly', description: 'Quarterly forecast view' },
          { id: 'yearly', name: 'Yearly', description: 'Yearly forecast view' }
        ]
      }
    }
  },

  // Get multi-timeframe forecast data
  async getMultiTimeframeForecast(params = {}) {
    try {
      const response = await api.get('/forecast/multi-timeframe', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching multi-timeframe forecast:', error)
      
      // Return fallback data for development
      console.log('Multi-timeframe forecast API timeout - using fallback data')
      return {
        data: {
          monthly: {
            projected_value: 1500,
            probability_weighted: 1050,
            forecast_accuracy: 70,
            active_deals: 2
          },
          quarterly: {
            projected_value: 4500,
            probability_weighted: 3150,
            forecast_accuracy: 70,
            active_deals: 6
          },
          yearly: {
            projected_value: 18000,
            probability_weighted: 12600,
            forecast_accuracy: 70,
            active_deals: 24
          },
          trends: {
            monthly_trend: '+0%',
            quarterly_trend: '+0%',
            yearly_trend: '+0%'
          },
          last_updated: new Date().toISOString()
        }
      }
    }
  },
 
    // ✅ Professional export summary integration
    async exportSummaryNew(timeframe = 'monthly', format = 'excel') {
      try {
        const params = {
          timeframe,
          format,
          include_trends: 1,
          include_pipeline_breakdown: 1
        }
  
        console.log('Making API call to /forecast/export with params:', params)
  
        // ✅ Use axios instance — it already respects VITE_API_BASE_URL
        const response = await api.get('/forecast/export', { 
          params,
          responseType: 'blob' // important: tells Axios we expect a file
        })
  
        // ✅ Extract filename from response headers or fallback
        const contentDisposition = response.headers['content-disposition']
        let filename = 'forecast_summary.xlsx'
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/)
          if (match) filename = match[1]
        }
  
        // ✅ Trigger download via Blob
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
  
        console.log('✅ Forecast summary exported successfully:', filename)
        return true
      } catch (error) {
        console.error('❌ Error exporting summary:', error)
        throw error
      }
    }
  
  }




// Helper functions for forecasting data processing
export const forecastingHelpers = {
  // Format currency
  formatCurrency(amount) {
    if (typeof amount !== 'number') return amount
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  },

  // Format percentage
  formatPercentage(value, decimals = 1) {
    if (typeof value !== 'number') return value
    return `${value.toFixed(decimals)}%`
  },

  // Format number with commas
  formatNumber(num) {
    if (typeof num !== 'number') return num
    return new Intl.NumberFormat('en-US').format(num)
  },

  // Get trend color
  getTrendColor(trend) {
    if (!trend) return 'text-gray-500'
    if (trend.startsWith('+')) return 'text-green-600'
    if (trend.startsWith('-')) return 'text-red-600'
    return 'text-gray-500'
  },

  // Get accuracy color
  getAccuracyColor(accuracy) {
    if (accuracy >= 90) return 'text-green-600'
    if (accuracy >= 80) return 'text-yellow-600'
    if (accuracy >= 70) return 'text-orange-600'
    return 'text-red-600'
  },

  // Get stage color
  getStageColor(stage) {
    const colors = {
      'Prospecting': 'bg-blue-500',
      'Qualification': 'bg-purple-500',
      'Proposal': 'bg-yellow-500',
      'Negotiation': 'bg-orange-500',
      'Closed Won': 'bg-green-500'
    }
    return colors[stage] || 'bg-gray-500'
  },

  // Format date
  formatDate(dateString) {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  },

  // Calculate trend percentage
  calculateTrendPercentage(current, previous) {
    if (!previous || previous === 0) return '0%'
    const change = ((current - previous) / previous) * 100
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`
  },

  // Get timeframe display name
  getTimeframeDisplayName(timeframe) {
    const names = {
      'monthly': 'Monthly',
      'quarterly': 'Quarterly',
      'yearly': 'Yearly'
    }
    return names[timeframe] || timeframe
  },

  // Validate timeframe
  isValidTimeframe(timeframe) {
    return ['monthly', 'quarterly', 'yearly'].includes(timeframe)
  },

  // Get chart colors for pipeline stages
  getPipelineColors() {
    return [
      '#3B82F6', // Blue
      '#8B5CF6', // Purple
      '#EAB308', // Yellow
      '#F97316', // Orange
      '#10B981'  // Green
    ]
  },

  // Prepare chart data for pipeline breakdown
  preparePipelineChartData(breakdown) {
    return breakdown.map((item, index) => ({
      name: item.stage,
      value: item.value,
      count: item.count,
      percentage: item.percentage,
      fill: this.getPipelineColors()[index % this.getPipelineColors().length]
    }))
  },

  // Prepare chart data for accuracy trends
  prepareAccuracyChartData(accuracyData) {
    return accuracyData.map(item => ({
      month: item.month,
      accuracy: item.accuracy,
      actual: item.actual || null,
      forecasted: item.forecasted || null
    }))
  },

  // Get default timeframe from URL params
  getDefaultTimeframe() {
    const urlParams = new URLSearchParams(window.location.search)
    const timeframe = urlParams.get('timeframe')
    return this.isValidTimeframe(timeframe) ? timeframe : 'monthly'
  },

  // Update URL with timeframe
  updateURLTimeframe(timeframe) {
    const url = new URL(window.location)
    url.searchParams.set('timeframe', timeframe)
    window.history.replaceState({}, '', url)
  },

  // Export forecast data
  async exportForecast(params = {}) {
    try {
      const response = await api.get('/forecast/export', { 
        params,
        responseType: 'blob' // Important for file downloads
      })
      return response
    } catch (error) {
      console.error('Error exporting forecast:', error)
      throw error
    }
  },

  // Generate forecast reports
  async generateReport(params = {}) {
    try {
      const response = await api.get('/forecast/reports', { params })
      return response.data
    } catch (error) {
      console.error('Error generating forecast report:', error)
      throw error
    }
  },

  // Export report in specific format
  async exportReport(format = 'csv', params = {}) {
    try {
      const response = await api.get(`/forecast/export/${format}`, { 
        params,
        responseType: 'blob' // Important for file downloads
      })
      return response
    } catch (error) {
      console.error('Error exporting report:', error)
      throw error
    }
  },

}
