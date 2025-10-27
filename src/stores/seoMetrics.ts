import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { seoService } from '@/services/seo'

export interface MetricsData {
  totalImpressions: number
  totalClicks: number
  avgCTR: number
  avgPosition: number
  lastSynced: string
}

export interface ChartDataPoint {
  date: string
  impressions: number
  clicks: number
  ctr: number
  position: number
}

export const useSeoMetricsStore = defineStore('seoMetrics', () => {
  const metrics = ref<MetricsData>({
    totalImpressions: 0,
    totalClicks: 0,
    avgCTR: 0,
    avgPosition: 0,
    lastSynced: ''
  })
  
  const chartData = ref<ChartDataPoint[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMetrics = async (days = 30) => {
    loading.value = true
    error.value = null
    try {
      const response = await seoService.getMetrics(days)
      // Handle both direct response and nested data property
      const data = response?.data || response
      metrics.value = data.summary || {
        totalImpressions: 0,
        totalClicks: 0,
        avgCTR: 0,
        avgPosition: 0,
        lastSynced: ''
      }
      chartData.value = data.chartData || []
      return data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch metrics'
      throw err
    } finally {
      loading.value = false
    }
  }

  const refreshMetrics = async () => {
    return fetchMetrics(30)
  }

  return {
    metrics,
    chartData,
    loading,
    error,
    fetchMetrics,
    refreshMetrics
  }
})
