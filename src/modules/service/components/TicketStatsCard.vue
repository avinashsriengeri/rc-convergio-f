<template>
  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
    <!-- Total Tickets -->
    <div class="group bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer aspect-square">
      <div class="flex flex-col items-center justify-center text-center h-full">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-300/25 group-hover:shadow-xl group-hover:shadow-blue-300/40 transition-all duration-300">
          <svg class="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">{{ stats?.total || 0 }}</p>
        <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</p>
      </div>
    </div>

    <!-- Open Tickets -->
    <div class="group bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl hover:shadow-amber-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer aspect-square">
      <div class="flex flex-col items-center justify-center text-center h-full">
        <div class="w-12 h-12 bg-gradient-to-br from-amber-200 via-orange-200 to-orange-300 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-amber-300/25 group-hover:shadow-xl group-hover:shadow-amber-300/40 transition-all duration-300">
          <svg class="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors duration-300">{{ stats?.by_status?.open || 0 }}</p>
        <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Open</p>
      </div>
    </div>

    <!-- In Progress -->
    <div class="group bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer aspect-square">
      <div class="flex flex-col items-center justify-center text-center h-full">
        <div class="w-12 h-12 bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-300 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-purple-300/25 group-hover:shadow-xl group-hover:shadow-purple-300/40 transition-all duration-300">
          <svg class="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-300">{{ stats?.by_status?.in_progress || 0 }}</p>
        <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider">In Progress</p>
      </div>
    </div>

    <!-- Closed -->
    <div class="group bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl hover:shadow-green-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer aspect-square">
      <div class="flex flex-col items-center justify-center text-center h-full">
        <div class="w-12 h-12 bg-gradient-to-br from-green-200 via-emerald-200 to-teal-300 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-green-300/25 group-hover:shadow-xl group-hover:shadow-green-300/40 transition-all duration-300">
          <svg class="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors duration-300">{{ stats?.by_status?.closed || 0 }}</p>
        <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Closed</p>
      </div>
    </div>

    <!-- SLA Breached -->
    <div class="group bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl hover:shadow-red-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer aspect-square">
      <div class="flex flex-col items-center justify-center text-center h-full">
        <div class="w-12 h-12 bg-gradient-to-br from-red-200 via-pink-200 to-rose-300 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-red-300/25 group-hover:shadow-xl group-hover:shadow-red-300/40 transition-all duration-300">
          <svg class="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors duration-300">{{ stats?.by_sla?.breached || 0 }}</p>
        <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider">SLA Breached</p>
      </div>
    </div>

    <!-- Average Response Time -->
    <div class="group bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer aspect-square">
      <div class="flex flex-col items-center justify-center text-center h-full">
        <div class="w-12 h-12 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-300 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-indigo-300/25 group-hover:shadow-xl group-hover:shadow-indigo-300/40 transition-all duration-300">
          <svg class="w-6 h-6 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">{{ formatTime(stats?.avg_response_time) }}</p>
        <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Response</p>
      </div>
    </div>

    <!-- Average Resolution Time -->
    <div class="group bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl hover:shadow-cyan-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer aspect-square">
      <div class="flex flex-col items-center justify-center text-center h-full">
        <div class="w-12 h-12 bg-gradient-to-br from-cyan-200 via-blue-200 to-indigo-300 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-cyan-300/25 group-hover:shadow-xl group-hover:shadow-cyan-300/40 transition-all duration-300">
          <svg class="w-6 h-6 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors duration-300">{{ formatTime(stats?.avg_resolution_time) }}</p>
        <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Resolution</p>
      </div>
    </div>

    <!-- Resolved -->
    <div class="group bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer aspect-square">
      <div class="flex flex-col items-center justify-center text-center h-full">
        <div class="w-12 h-12 bg-gradient-to-br from-emerald-200 via-teal-200 to-cyan-300 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-emerald-300/25 group-hover:shadow-xl group-hover:shadow-emerald-300/40 transition-all duration-300">
          <svg class="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors duration-300">{{ stats?.by_status?.resolved || 0 }}</p>
        <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Resolved</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useServiceTicketsStore } from '../store/serviceTickets'

// Store
const ticketsStore = useServiceTicketsStore()

// Computed
const stats = computed(() => ticketsStore.stats)

// Methods
const formatTime = (minutes) => {
  if (!minutes || minutes === 0) return '0m'
  
  if (minutes < 60) {
    return `${Math.round(minutes)}m`
  } else if (minutes < 1440) { // Less than 24 hours
    const hours = Math.round(minutes / 60)
    return `${hours}h`
  } else {
    const days = Math.round(minutes / 1440)
    return `${days}d`
  }
}

// Lifecycle
onMounted(() => {
  ticketsStore.fetchStats()
})
</script>
