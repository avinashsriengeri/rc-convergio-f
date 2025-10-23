import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { seoService } from '@/services/seo'

export type RecommendationType = 'meta' | 'title' | 'alt' | 'heading' | 'content' | 'technical' | 'performance'
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low'
export type RecommendationStatus = 'open' | 'resolved' | 'ignored'

export interface Recommendation {
  id: number
  pageId: number
  pageUrl: string
  type: RecommendationType
  severity: SeverityLevel
  status: RecommendationStatus
  title: string
  description: string
  impact: string
  howToFix: string
  createdAt: string
  resolvedAt?: string
}

export const useSeoRecommendationsStore = defineStore('seoRecommendations', () => {
  const recommendations = ref<Recommendation[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedIds = ref<Set<number>>(new Set())
  
  // Filters
  const severityFilter = ref<SeverityLevel | 'all'>('all')
  const statusFilter = ref<RecommendationStatus | 'all'>('all')
  const typeFilter = ref<RecommendationType | 'all'>('all')

  const filteredRecommendations = computed(() => {
    let filtered = [...recommendations.value]
    
    if (severityFilter.value !== 'all') {
      filtered = filtered.filter(r => r.severity === severityFilter.value)
    }
    
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter.value)
    }
    
    if (typeFilter.value !== 'all') {
      filtered = filtered.filter(r => r.type === typeFilter.value)
    }
    
    return filtered
  })

  const recommendationsByPage = computed(() => {
    return (pageId: number) => {
      return recommendations.value.filter(r => r.pageId === pageId)
    }
  })

  const criticalCount = computed(() => {
    return recommendations.value.filter(r => r.severity === 'critical' && r.status === 'open').length
  })

  const openCount = computed(() => {
    return recommendations.value.filter(r => r.status === 'open').length
  })

  const fetchRecommendations = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await seoService.getRecommendations()
      // Handle both array response and object with data property
      recommendations.value = Array.isArray(data) ? data : (data?.data || [])
      return recommendations.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch recommendations'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resolveRecommendation = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await seoService.resolveRecommendation(id)
      const index = recommendations.value.findIndex(r => r.id === id)
      if (index !== -1) {
        recommendations.value[index].status = 'resolved'
        recommendations.value[index].resolvedAt = new Date().toISOString()
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to resolve recommendation'
      throw err
    } finally {
      loading.value = false
    }
  }

  const bulkResolve = async () => {
    if (selectedIds.value.size === 0) return
    
    loading.value = true
    error.value = null
    try {
      await Promise.all(
        Array.from(selectedIds.value).map(id => seoService.resolveRecommendation(id))
      )
      
      selectedIds.value.forEach(id => {
        const index = recommendations.value.findIndex(r => r.id === id)
        if (index !== -1) {
          recommendations.value[index].status = 'resolved'
          recommendations.value[index].resolvedAt = new Date().toISOString()
        }
      })
      
      selectedIds.value.clear()
    } catch (err: any) {
      error.value = err.message || 'Failed to resolve recommendations'
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleSelection = (id: number) => {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
    } else {
      selectedIds.value.add(id)
    }
  }

  const selectAll = () => {
    filteredRecommendations.value.forEach(r => {
      if (r.status === 'open') {
        selectedIds.value.add(r.id)
      }
    })
  }

  const clearSelection = () => {
    selectedIds.value.clear()
  }

  return {
    recommendations,
    loading,
    error,
    selectedIds,
    severityFilter,
    statusFilter,
    typeFilter,
    filteredRecommendations,
    recommendationsByPage,
    criticalCount,
    openCount,
    fetchRecommendations,
    resolveRecommendation,
    bulkResolve,
    toggleSelection,
    selectAll,
    clearSelection
  }
})
    