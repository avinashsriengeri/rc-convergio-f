<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-100 via-white to-blue-100 flex flex-col">
    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside class="w-64 min-h-screen bg-white border-r border-gray-200 rounded-tr-xl rounded-br-xl shadow-lg flex flex-col p-6">
        <div class="flex items-center mb-8">
          <div class="bg-gradient-to-tr from-pink-400 to-blue-400 w-10 h-10 rounded-full flex items-center justify-center mr-3">
            <span class="font-extrabold text-white text-xl">RC</span>
          </div>
          <span class="text-lg font-semibold text-gray-800">RC Convergio</span>
        </div>
        <nav class="flex flex-col gap-2">
          <button class="bg-pink-100 text-pink-600 font-bold rounded-lg px-4 py-2 text-left">Contacts</button>
          <button class="rounded-lg px-4 py-2 text-left hover:bg-gray-100 transition">Companies</button>
          <button class="rounded-lg px-4 py-2 text-left hover:bg-gray-100 transition">Deals</button>
          <button class="rounded-lg px-4 py-2 text-left hover:bg-gray-100 transition">Campaigns</button>
          <button class="rounded-lg px-4 py-2 text-left hover:bg-gray-100 transition">Tasks</button>
          <button class="rounded-lg px-4 py-2 text-left hover:bg-gray-100 transition">Settings</button>
        </nav>
      </aside>

      <!-- Main Dashboard Content -->
      <main class="flex-1 px-10 py-8 grid grid-cols-1 xl:grid-cols-3 gap-8 bg-transparent">
        <!-- Center Section with Statistics -->
        <section class="xl:col-span-2 flex flex-col gap-8">
          <!-- Search & Stats -->
          <div class="bg-white/80 rounded-xl shadow p-6 mb-2 flex flex-col md:flex-row gap-6 items-start">
            <input 
              type="text"
              placeholder="Search contacts, companies, deals…"
              class="w-full md:w-2/3 rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
            <button class="bg-gradient-to-tr from-pink-400 to-blue-400 text-white font-bold rounded-lg px-6 py-2 ml-auto transition hover:brightness-105">Quick Add</button>
          </div>
          <!-- Stat Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl shadow p-5 text-center">
              <div class="text-sm text-gray-500 mb-1">Open</div>
              <div class="text-2xl font-extrabold text-gray-800 mb-1">{{ (metrics && (metrics.open || metrics.open_value)) || '$128,000' }}</div>
              <div class="text-xs text-gray-400">{{ (metrics && (metrics.open_week || metrics.open_week_value)) || 'Week: $48k' }}</div>
            </div>
            <div class="bg-white rounded-xl shadow p-5 text-center">
              <div class="text-sm text-gray-500 mb-1">Won</div>
              <div class="text-2xl font-extrabold text-gray-800 mb-1">{{ (metrics && (metrics.won || metrics.won_value)) || '$24,300' }}</div>
              <div class="text-xs text-gray-400">{{ (metrics && (metrics.won_week || metrics.won_week_value)) || 'Week: $9.6k' }}</div>
            </div>
            <div class="bg-white rounded-xl shadow p-5 text-center">
              <div class="text-sm text-gray-500 mb-1">Lost</div>
              <div class="text-2xl font-extrabold text-gray-800 mb-1">{{ (metrics && (metrics.lost || metrics.lost_value)) || '$8,900' }}</div>
              <div class="text-xs text-gray-400">{{ (metrics && (metrics.lost_week || metrics.lost_week_value)) || 'Week: $3.3k' }}</div>
            </div>
          </div>
          <!-- Tasks -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-xl shadow p-6 min-h-44 flex flex-col gap-2">
              <div class="font-semibold text-gray-700 mb-2">Follow Ups</div>
              <ul class="text-gray-600 text-sm flex flex-col gap-2">
                <li><b>Follow up</b> with Acme Corp <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Today</span></li>
                <li>Send proposal to Globex <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Due</span></li>
                <li>Update date stage - Nimbus <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Queued</span></li>
              </ul>
            </div>
            <div class="bg-gradient-to-tl from-pink-100 via-white to-blue-100 rounded-xl shadow p-6 min-h-44 flex flex-col items-center justify-center">
              <div class="font-semibold text-gray-700 mb-2">Last Campaign</div>
              <div class="flex flex-col gap-1 w-full text-center">
                <div>Sent: <b>12,500</b></div>
                <div>Opens: <b>5,340 (42%)</b></div>
                <div>Clicks: <b>1,120 (9%)</b></div>
                <div>Bounces: <b>220 (1.7%)</b></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Right Section: Suggestions, Deals, Contacts -->
        <aside class="flex flex-col gap-8">
          <div class="bg-white rounded-xl shadow p-6">
            <div class="font-semibold text-gray-700 mb-3">Suggestions</div>
            <ul class="text-gray-500 text-sm flex flex-col gap-2">
              <li>Try sequencing warm leads from last 7 days.</li>
              <li>Batch-complete admin tasks after 4 PM.</li>
              <li>Best send time for emails: 9–11 AM local.</li>
            </ul>
          </div>
          <div class="bg-white rounded-xl shadow p-6 flex flex-row gap-3">
            <button class="bg-blue-100 text-blue-600 font-semibold rounded px-3 py-2 text-xs">New Deal</button>
            <button class="bg-blue-100 text-blue-600 font-semibold rounded px-3 py-2 text-xs">Add Contact</button>
            <button class="bg-blue-100 text-blue-600 font-semibold rounded px-3 py-2 text-xs">New Task</button>
          </div>
          <div class="bg-white rounded-xl shadow p-6">
            <div class="font-semibold text-gray-700 mb-3">Recent Contacts</div>
            <ul class="text-gray-600 text-sm flex flex-col gap-2">
              <li class="flex justify-between items-center">
                <span>Jane Cooper</span><span class="text-xs text-gray-400">Acme Corp · Mar 12</span>
              </li>
              <li class="flex justify-between items-center">
                <span>Devon Lane</span><span class="text-xs text-gray-400">Globex · Mar 11</span>
              </li>
              <li class="flex justify-between items-center">
                <span>Kristin Watson</span><span class="text-xs text-gray-400">Initech · Mar 11</span>
              </li>
              <li class="flex justify-between items-center">
                <span>Jacob Jones</span><span class="text-xs text-gray-400">Hooli · Mar 10</span>
              </li>
              <li class="flex justify-between items-center">
                <span>Theresa Webb</span><span class="text-xs text-gray-400">Pied Piper · Mar 10</span>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Footer from '../components/Footer.vue'
import api from '@/services/api'

const metrics = ref(null)
const loading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get('/dashboard')
    metrics.value = data
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || 'Failed to load dashboard.'
  } finally {
    loading.value = false
  }
})
</script>
