<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Pages</h2>
        <p class="mt-1 text-sm text-gray-500">Analyze SEO performance for each page</p>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white shadow rounded-lg p-4">
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="pagesStore.searchQuery"
              type="text"
              placeholder="Search pages by URL or title..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <button
          @click="pagesStore.fetchPages()"
          :disabled="pagesStore.loading"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <svg v-if="!pagesStore.loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pagesStore.loading && pagesStore.pages.length === 0" class="bg-white shadow rounded-lg p-12">
      <div class="flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-500">Loading pages...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!pagesStore.loading && pagesStore.filteredPages.length === 0" class="bg-white shadow rounded-lg p-12">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No pages found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ pagesStore.searchQuery ? 'Try adjusting your search query' : 'Get started by connecting Google Search Console' }}
        </p>
      </div>
    </div>

    <!-- Data Table -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="pagesStore.setSortBy('url')"
              >
                <div class="flex items-center space-x-1">
                  <span>Page URL</span>
                  <svg v-if="pagesStore.sortBy === 'url'" class="w-4 h-4" :class="{ 'transform rotate-180': pagesStore.sortOrder === 'desc' }" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </th>
              <th 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="pagesStore.setSortBy('impressions')"
              >
                <div class="flex items-center space-x-1">
                  <span>Impressions (30d)</span>
                  <svg v-if="pagesStore.sortBy === 'impressions'" class="w-4 h-4" :class="{ 'transform rotate-180': pagesStore.sortOrder === 'desc' }" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </th>
              <th 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="pagesStore.setSortBy('clicks')"
              >
                <div class="flex items-center space-x-1">
                  <span>Clicks</span>
                  <svg v-if="pagesStore.sortBy === 'clicks'" class="w-4 h-4" :class="{ 'transform rotate-180': pagesStore.sortOrder === 'desc' }" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </th>
              <th 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="pagesStore.setSortBy('ctr')"
              >
                <div class="flex items-center space-x-1">
                  <span>CTR</span>
                  <svg v-if="pagesStore.sortBy === 'ctr'" class="w-4 h-4" :class="{ 'transform rotate-180': pagesStore.sortOrder === 'desc' }" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </th>
              <th 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="pagesStore.setSortBy('avgPosition')"
              >
                <div class="flex items-center space-x-1">
                  <span>Avg Position</span>
                  <svg v-if="pagesStore.sortBy === 'avgPosition'" class="w-4 h-4" :class="{ 'transform rotate-180': pagesStore.sortOrder === 'desc' }" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recommendations
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="page in pagesStore.filteredPages" 
              :key="page.id"
              @click="navigateToPage(page.id)"
              class="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <div class="text-sm font-medium text-gray-900 truncate max-w-md">{{ page.url }}</div>
                  <div class="text-sm text-gray-500 truncate max-w-md">{{ page.title }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatNumber(page.impressions) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatNumber(page.clicks) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatPercentage(page.ctr) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm" :class="getPositionColor(page.avgPosition)">
                  {{ page.avgPosition.toFixed(1) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="page.recommendationsCount > 0" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {{ page.recommendationsCount }}
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  0
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Results Count -->
    <div v-if="pagesStore.filteredPages.length > 0" class="text-sm text-gray-500 text-center">
      Showing {{ pagesStore.filteredPages.length }} page{{ pagesStore.filteredPages.length !== 1 ? 's' : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSeoPagesStore } from '@/stores/seoPages'
import { error as showError } from '@/utils/notifications'

const router = useRouter()
const pagesStore = useSeoPagesStore()

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(2)}%`
}

const getPositionColor = (position: number) => {
  if (position <= 3) return 'text-green-600 font-semibold'
  if (position <= 10) return 'text-yellow-600 font-semibold'
  return 'text-red-600'
}

const navigateToPage = (pageId: number) => {
  router.push(`/marketing/seo/pages/${pageId}`)
}

onMounted(async () => {
  try {
    await pagesStore.fetchPages()
  } catch (error) {
    console.error('Failed to load pages:', error)
    showError('Failed to load pages')
  }
})
</script>








