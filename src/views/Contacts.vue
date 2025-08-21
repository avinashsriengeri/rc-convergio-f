<template>
  <div class="min-h-screen bg-gradient-to-br from-accent/10 via-white to-primary/10 flex flex-col">
    <div class="flex flex-1">
      <Sidebar />
      <main class="flex-1 py-8 bg-transparent">
        <div class="w-full px-4 md:px-6 lg:px-8 grid grid-cols-1 gap-8">
          <div>
            <HeaderBar />
          </div>
          <section class="w-full">
          <div class="flex flex-col gap-3 mb-4">
            <div class="flex items-center justify-between">
              <h1 class="text-2xl font-semibold text-tertiary">Contacts</h1>
              <div class="flex items-center gap-2">
                <input ref="csvInput" type="file" accept=".csv" class="hidden" @change="onCsvSelected" />
                <button class="px-3 py-2 text-sm rounded-full border border-primary/20 bg-white hover:bg-primary/5 text-secondary" @click="() => csvInput?.click()">Import CSV</button>
                <button class="px-3 py-2 text-sm rounded-full bg-accent text-white hover:bg-secondary" @click="openCreate">Create Contact</button>
              </div>
            </div>
            <!-- Search under title -->
            <div class="max-w-md">
              <input
                v-model.trim="q"
                placeholder="Search name, email, phone, company"
                class="w-full rounded-lg bg-white border border-primary/20 px-4 py-2 text-sm text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <div class="flex items-center gap-2">
                <div class="px-3 py-1.5 rounded-full bg-white border border-primary/20 text-sm text-tertiary">Owner: <span class="font-medium">Everyone</span></div>
                <div class="px-3 py-1.5 rounded-full bg-white border border-primary/20 text-sm text-tertiary">Stage: <span class="font-medium">Any</span></div>
                <div class="relative">
                  <button type="button" class="px-3 py-1.5 rounded-full bg-white border border-primary/20 text-sm text-tertiary" @click="dateOpen = !dateOpen">
                    Date: <span class="font-medium">{{ dateRangeLabel }}</span>
                  </button>
                  <div v-if="dateOpen" class="absolute z-20 mt-2 w-56 bg-white border border-primary/10 rounded-lg shadow p-3">
                    <div class="text-xs font-semibold text-tertiary/80 mb-2">Quick ranges</div>
                    <div class="flex flex-col gap-1 text-sm">
                      <button class="text-left px-2 py-1 rounded hover:bg-primary/5" @click="setPreset('today')">Today</button>
                      <button class="text-left px-2 py-1 rounded hover:bg-primary/5" @click="setPreset('yesterday')">Yesterday</button>
                      <button class="text-left px-2 py-1 rounded hover:bg-primary/5" @click="setPreset('last7')">Last 7 days</button>
                      <button class="text-left px-2 py-1 rounded hover:bg-primary/5" @click="setPreset('thisMonth')">This month</button>
                    </div>
                    <div class="mt-2 flex justify-end">
                      <button class="px-2 py-1 text-sm text-tertiary/80" @click="dateOpen=false">Close</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- <div class="ml-auto flex items-center gap-2">
                <button class="px-3 py-1.5 rounded-full bg-white border text-sm">Save View</button>
                <button class="px-3 py-1.5 rounded-full bg-white border text-sm">Saved Views</button>
              </div> -->
            </div>
          </div>

      <div v-if="showForm" class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold text-tertiary mb-1">{{ isEditing ? 'Edit Contact' : 'Add Contact' }}</h2>
        <p class="text-xs text-tertiary/70 mb-4">Data is stored locally in your browser.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-tertiary/80 mb-1">First Name</label>
            <input v-model.trim="form.firstName" class="w-full rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-tertiary placeholder-tertiary/50 focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Jane" />
          </div>
          <div>
            <label class="block text-xs text-tertiary/80 mb-1">Last Name</label>
            <input v-model.trim="form.lastName" class="w-full rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-tertiary placeholder-tertiary/50 focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Doe" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs text-tertiary/80 mb-1">Email</label>
            <input v-model.trim="form.email" type="email" class="w-full rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-tertiary placeholder-tertiary/50 focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="jane@company.com" />
            <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
          </div>
          <div>
            <label class="block text-xs text-tertiary/80 mb-1">Phone</label>
            <input v-model.trim="form.phone" class="w-full rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-tertiary placeholder-tertiary/50 focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="+1 202 555 0147" />
          </div>
          <div>
            <label class="block text-xs text-tertiary/80 mb-1">Company</label>
            <input v-model.trim="form.company" class="w-full rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-tertiary placeholder-tertiary/50 focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Acme Inc." />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs text-tertiary/80 mb-1">Notes</label>
            <textarea v-model.trim="form.notes" rows="3" class="w-full rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-tertiary placeholder-tertiary/50 focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Short note..."></textarea>
          </div>
        </div>
        <div class="mt-6 flex gap-2 justify-end">
          <button class="px-4 py-2 rounded-lg border border-primary/20 bg-white text-tertiary hover:bg-primary/5" @click="reset">Reset</button>
          <button class="px-4 py-2 rounded-lg border border-primary/20 bg-white text-tertiary hover:bg-primary/5" @click="cancel">Cancel</button>
          <button class="px-4 py-2 rounded-lg bg-primary text-white hover:bg-secondary" @click="save">{{ isEditing ? 'Update' : 'Save' }}</button>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6 mt-6">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-tertiary">Contacts ({{ contacts.length }})</h2>
          <button class="text-xs text-tertiary/70 underline" @click="clearAll" v-if="contacts.length">Clear all</button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-primary/10">
            <thead class="bg-primary/5">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">Name</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">Email</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">Owner</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">Stage</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">Source</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-tertiary/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-primary/5">
              <tr v-for="row in paginatedRows" :key="row.id" class="bg-white hover:bg-primary/5">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <img :src="logo" class="w-8 h-8 rounded-full" alt="" />
                    <div class="flex flex-col">
                      <span class="text-sm font-medium text-tertiary">{{ row.firstName }} {{ row.lastName }}</span>
                      <span class="text-xs text-tertiary/70" v-if="row.company">{{ row.company }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-tertiary">{{ row.email }}</td>
                <td class="px-4 py-3 text-sm text-tertiary">{{ row.owner.name }}</td>
                <td class="px-4 py-3">
                  <span class="text-xs px-2 py-1 rounded-full text-white" :class="stageClass(row.stage)">{{ row.stage }}</span>
                </td>
                <td class="px-4 py-3 text-sm text-tertiary">{{ row.source }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-1 flex-wrap">
                    <span v-for="tag in row.tags" :key="tag" class="text-[11px] px-2 py-1 rounded-full text-white" :class="tagClass(tag)">{{ tag }}</span>
                  </div>
                  <div class="mt-2 flex items-center gap-2 flex-wrap">
                    <button class="px-2 py-1 rounded border border-primary/20 bg-white text-tertiary hover:bg-primary/5 inline-flex items-center gap-1" title="View" @click="viewRow(row)">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4 text-tertiary"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      <span class="text-xs">View</span>
                    </button>
                    <button class="px-2 py-1 rounded border border-primary/20 bg-white text-tertiary hover:bg-primary/5 inline-flex items-center gap-1" title="Edit" @click="startEdit(row)">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4 text-tertiary"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.313 3 21l1.687-4.5L16.862 3.487z"/></svg>
                      <span class="text-xs">Edit</span>
                    </button>
                    <button class="px-2 py-1 rounded border border-primary/20 bg-white text-accent hover:bg-primary/5 inline-flex items-center gap-1" title="Delete" @click="remove(row.id)">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4 text-accent"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 7h12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-7 4v7m4-7v7M5 7l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"/></svg>
                      <span class="text-xs">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div v-if="filteredRows.length" class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-xs text-tertiary/70">
            Showing
            <span class="font-medium text-tertiary">{{ pageStart + 1 }}</span>
            –
            <span class="font-medium text-tertiary">{{ Math.min(pageEnd, filteredRows.length) }}</span>
            of
            <span class="font-medium text-tertiary">{{ filteredRows.length }}</span>
          </div>
          <div class="flex items-center gap-1">
            <button class="px-2 py-1 text-sm rounded border border-primary/20 bg-white text-tertiary disabled:opacity-50" :disabled="currentPage === 1" @click="prevPage">Prev</button>
            <button v-for="p in pages" :key="p" class="px-2 py-1 text-sm rounded border border-primary/20" :class="p === currentPage ? 'bg-primary text-white' : 'bg-white text-tertiary hover:bg-primary/5'" @click="setPage(p)">{{ p }}</button>
            <button class="px-2 py-1 text-sm rounded border border-primary/20 bg-white text-tertiary disabled:opacity-50" :disabled="currentPage === totalPages" @click="nextPage">Next</button>
          </div>
        </div>
        <p v-else class="text-sm text-tertiary/70 mt-4">No contacts yet. Add one above.</p>
      </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import HeaderBar from '../components/HeaderBar.vue'
import logo from '@/assets/logo.png'

const STORAGE_KEY = 'contacts'
const form = ref({ firstName: '', lastName: '', email: '', phone: '', company: '', notes: '' })
const errors = ref({ email: '' })
const contacts = ref([])
const isEditing = ref(false)
const editId = ref(null)
const showForm = ref(false)
const csvInput = ref(null)
const openMenuId = ref(null)
// Date filter state
const dateOpen = ref(false)
const datePreset = ref('last7') // 'today' | 'yesterday' | 'last7' | 'thisMonth'

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (Array.isArray(saved)) contacts.value = saved
    if (!contacts.value.length) {
      const now = new Date()
      const d = (days) => new Date(now.getTime() - days * 86400000).toISOString()
      contacts.value = [
        { id: 1, firstName: 'Jane', lastName: 'Cooper', email: 'jane@acme.com', phone: '+1 202-555-0101', company: 'Acme Inc.', createdAt: d(3) },
        { id: 2, firstName: 'Devon', lastName: 'Lane', email: 'devon@globex.com', phone: '+1 202-555-0102', company: 'Globex', createdAt: d(20) },
      ]
      persist()
    }
  } catch (e) {
    contacts.value = []
  }
})

// Normalize rows for display with safe defaults
const displayRows = computed(() =>
  contacts.value.map(c => ({
    id: c.id,
    firstName: c.firstName || '',
    lastName: c.lastName || '',
    email: c.email || '',
    phone: c.phone || '',
    company: c.company || '',
    owner: c.owner || { name: 'You', avatar: '/vite.svg' },
    stage: c.stage || 'New',
    source: c.source || 'Website',
    tags: Array.isArray(c.tags) ? c.tags : [],
    createdAt: c.createdAt || new Date().toISOString(),
  }))
)

// Search state and filtered rows
const q = ref('')
const filteredRows = computed(() => {
  // Active date range
  const now = new Date()
  let from = null
  let to = null
  switch (datePreset.value) {
    case 'today': {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const end = new Date(start)
      end.setHours(23, 59, 59, 999)
      from = start
      to = end
      break
    }
    case 'yesterday': {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      const end = new Date(start)
      end.setHours(23, 59, 59, 999)
      from = start
      to = end
      break
    }
    case 'last7':
      from = new Date(now.getTime() - 7 * 86400000)
      to = now
      break
    case 'thisMonth': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      from = start
      to = now
      break
    }
    default:
      from = null
      to = null
  }

  const s = q.value.trim().toLowerCase()
  return displayRows.value.filter(r => {
    // Date filter
    if (from || to) {
      const created = r.createdAt ? new Date(r.createdAt) : null
      if (!created) return false
      if (from && created < from) return false
      if (to && created > to) return false
    }
    // Search filter
    if (!s) return true
    const hay = `${r.firstName} ${r.lastName} ${r.email} ${r.phone} ${r.company} ${r.owner?.name || ''} ${(r.tags || []).join(' ')}`.toLowerCase()
    return hay.includes(s)
  })
})

// Pagination
const pageSize = ref(10)
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)))
const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))
const pageStart = computed(() => (currentPage.value - 1) * pageSize.value)
const pageEnd = computed(() => currentPage.value * pageSize.value)
const paginatedRows = computed(() => filteredRows.value.slice(pageStart.value, pageEnd.value))

function setPage(p) { if (p >= 1 && p <= totalPages.value) currentPage.value = p }
function prevPage() { setPage(currentPage.value - 1) }
function nextPage() { setPage(currentPage.value + 1) }

watch(filteredRows, () => {
  // Ensure current page is valid when filter/search changes
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  if (currentPage.value < 1) currentPage.value = 1
})

// Date UI label and handlers
const dateRangeLabel = computed(() => {
  switch (datePreset.value) {
    case 'today': return 'Today'
    case 'yesterday': return 'Yesterday'
    case 'last7': return 'Last 7 days'
    case 'thisMonth': return 'This month'
    default: return 'Last 7 days'
  }
})

function setPreset(p) {
  datePreset.value = p
  dateOpen.value = false
}

// no custom range handler needed

function validate(payload) {
  errors.value.email = ''
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email || '')
  if (!emailOk) errors.value.email = 'Valid email is required'
  return emailOk
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts.value))
}

function save() {
  const payload = { ...form.value }
  if (!validate(payload)) return
  if (isEditing.value && editId.value != null) {
    contacts.value = contacts.value.map(c => (c.id === editId.value ? { ...c, ...payload } : c))
  } else {
    contacts.value = [{ id: Date.now(), createdAt: new Date().toISOString(), ...payload }, ...contacts.value]
  }
  persist()
  // Show the newest contact immediately at the top
  if (typeof setPage === 'function') setPage(1)
  reset()
  showForm.value = false
}

function startEdit(c) {
  form.value = { firstName: c.firstName || '', lastName: c.lastName || '', email: c.email || '', phone: c.phone || '', company: c.company || '', notes: c.notes || '' }
  isEditing.value = true
  editId.value = c.id
  showForm.value = true
}

function remove(id) {
  contacts.value = contacts.value.filter(c => c.id !== id)
  persist()
  if (isEditing.value && editId.value === id) reset()
}

function clearAll() {
  contacts.value = []
  persist()
}

function reset() {
  form.value = { firstName: '', lastName: '', email: '', phone: '', company: '', notes: '' }
  errors.value.email = ''
  isEditing.value = false
  editId.value = null
}

function openCreate() {
  reset()
  isEditing.value = false
  showForm.value = true
}

function cancel() {
  reset()
  showForm.value = false
}

// UI helpers
function toggleMenu(id) { openMenuId.value = openMenuId.value === id ? null : id }
function viewRow(row) { alert(`${row.firstName} ${row.lastName}\n${row.email}`) }
function onCsvSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return
  alert(`Selected CSV: ${file.name}`)
  e.target.value = ''
}

// Style helpers
function tagClass(tag) {
  const t = String(tag || '').toLowerCase()
  const map = {
    lead: 'bg-gradient-to-r from-primary to-secondary',
    customer: 'bg-gradient-to-r from-tertiary to-primary',
    vip: 'bg-gradient-to-r from-secondary to-accent',
  }
  return map[t] || 'bg-gradient-to-r from-tertiary/60 to-tertiary'
}

function stageClass(stage) {
  const s = String(stage || '').toLowerCase()
  const map = {
    new: 'bg-gradient-to-r from-primary to-secondary',
    qualified: 'bg-gradient-to-r from-tertiary to-primary',
    negotiation: 'bg-gradient-to-r from-accent to-secondary',
    won: 'bg-gradient-to-r from-primary to-tertiary',
    lost: 'bg-gradient-to-r from-accent to-secondary',
  }
  return map[s] || 'bg-gradient-to-r from-tertiary/60 to-tertiary'
}
</script>