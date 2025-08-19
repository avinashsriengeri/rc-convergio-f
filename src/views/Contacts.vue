<template>
  <div class="p-6">
    <div class="flex items-center gap-3 mb-4">
      <input v-model="query" type="text" placeholder="Search contacts…" class="border rounded px-3 py-2 w-64" @input="debouncedSearch" />
      <button class="px-4 py-2 bg-indigo-600 text-white rounded" @click="fetchContacts">Refresh</button>
      <label class="ml-auto inline-flex items-center gap-2 cursor-pointer">
        <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="importCsv" />
        <span class="px-4 py-2 bg-gray-100 border rounded" @click="fileInput.click()">Import CSV</span>
      </label>
    </div>
    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="bg-gray-50">
            <th class="text-left px-4 py-2">Name</th>
            <th class="text-left px-4 py-2">Email</th>
            <th class="text-left px-4 py-2">Phone</th>
            <th class="text-left px-4 py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in contacts" :key="item.id" class="border-t">
            <td class="px-4 py-2">{{ item.name || (item.first_name + ' ' + (item.last_name || '')) }}</td>
            <td class="px-4 py-2">{{ item.email }}</td>
            <td class="px-4 py-2">{{ item.phone }}</td>
            <td class="px-4 py-2">{{ item.created_at }}</td>
          </tr>
          <tr v-if="!loading && contacts.length === 0">
            <td colspan="4" class="px-4 py-6 text-center text-gray-500">No contacts</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex items-center justify-between mt-4">
      <div>
        <button class="px-3 py-1 border rounded mr-2" :disabled="page<=1" @click="changePage(page-1)">Prev</button>
        <button class="px-3 py-1 border rounded" @click="changePage(page+1)">Next</button>
      </div>
      <div class="text-sm text-gray-500" v-if="total">Total: {{ total }}</div>
    </div>
    <p v-if="errorMessage" class="text-sm text-red-600 mt-3">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/services/api'

const contacts = ref([])
const total = ref(0)
const page = ref(1)
const perPage = ref(10)
const sort = ref('created_at:desc')
const query = ref('')
const loading = ref(false)
const errorMessage = ref('')
const fileInput = ref(null)
let searchTimeout = null

function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (query.value && query.value.length > 1) {
      runSearch()
    } else {
      fetchContacts()
    }
  }, 300)
}

async function runSearch() {
  loading.value = true
  errorMessage.value = ''
  try {
    const { data } = await api.get('/contacts/search', { params: { q: query.value } })
    contacts.value = data?.data || data?.results || data || []
    total.value = contacts.value.length
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || 'Search failed.'
  } finally {
    loading.value = false
  }
}

async function fetchContacts() {
  loading.value = true
  errorMessage.value = ''
  try {
    const { data } = await api.get('/contacts', {
      params: { page: page.value, per_page: perPage.value, sort: sort.value },
    })
    const list = data?.data || data?.items || data?.results || []
    contacts.value = list
    total.value = data?.total || list.length
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || 'Failed to load contacts.'
  } finally {
    loading.value = false
  }
}

async function importCsv(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const form = new FormData()
  form.append('file', file)
  try {
    await api.post('/contacts/import', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    fetchContacts()
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || 'Import failed.'
  } finally {
    if (fileInput.value) fileInput.value.value = ''
  }
}

function changePage(p) {
  page.value = Math.max(1, p)
  fetchContacts()
}

onMounted(fetchContacts)
</script>


