import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { seoService } from '@/services/seo'

export interface SeoPage {
  id: number
  url: string
  title: string
  impressions: number
  clicks: number
  ctr: number
  avgPosition: number
  recommendationsCount: number
  lastScanned: string
}

export interface PageMetrics {
  url: string
  title: string
  impressions: number
  clicks: number
  ctr: number
  avgPosition: number
  chartData: Array<{
    date: string
    impressions: number
    clicks: number
    ctr: number
    position: number
  }>
  topQueries: Array<{
    query: string
    impressions: number
    clicks: number
    ctr: number
    position: number
  }>
}

export const useSeoPagesStore = defineStore('seoPages', () => {
  const pages = ref<SeoPage[]>([])
  const currentPage = ref<PageMetrics | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const sortBy = ref<'impressions' | 'clicks' | 'ctr' | 'avgPosition'>('impressions')
  const sortOrder = ref<'asc' | 'desc'>('desc')

  const filteredPages = computed(() => {
    let filtered = [...pages.value]
    
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(page => 
        page.url.toLowerCase().includes(query) || 
        page.title.toLowerCase().includes(query)
      )
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortBy.value]
      const bVal = b[sortBy.value]
      const modifier = sortOrder.value === 'asc' ? 1 : -1
      return (aVal < bVal ? -1 : 1) * modifier
    })
    
    return filtered
  })

  const fetchPages = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await seoService.getPages()
      // Handle both array response and object with data property
      pages.value = Array.isArray(response) ? response : (response?.data || [])
      return pages.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch pages'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchPageMetrics = async (pageId: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await seoService.getPageMetrics(pageId)
      // Handle both direct response and nested data property
      const data = response?.data || response
      currentPage.value = {
        url: data.url || '',
        title: data.title || '',
        impressions: data.impressions || 0,
        clicks: data.clicks || 0,
        ctr: data.ctr || 0,
        avgPosition: data.avgPosition || 0,
        chartData: Array.isArray(data.chartData) ? data.chartData : [],
        topQueries: Array.isArray(data.topQueries) ? data.topQueries : []
      }
      return currentPage.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch page metrics'
      throw err
    } finally {
      loading.value = false
    }
  }

  const rescanPage = async (pageId: number) => {
    loading.value = true
    error.value = null
    try {
      await seoService.scanPage(pageId)
      await fetchPageMetrics(pageId)
    } catch (err: any) {
      error.value = err.message || 'Failed to rescan page'
      throw err
    } finally {
      loading.value = false
    }
  }

  const setSortBy = (field: typeof sortBy.value) => {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = field
      sortOrder.value = 'desc'
    }
  }

  return {
    pages,
    currentPage,
    loading,
    error,
    searchQuery,
    sortBy,
    sortOrder,
    filteredPages,
    fetchPages,
    fetchPageMetrics,
    rescanPage,
    setSortBy
  }
})
