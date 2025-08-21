<template>
  <header class="w-full bg-white/50 backdrop-blur border-b border-primary/10 px-6 py-4 flex items-center gap-4 sticky top-0 z-40 rounded-xl">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search contacts, companies, deals…"
      class="w-full md:w-2/3 rounded-lg bg-primary/5 border border-primary/20 px-4 py-2 text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/30"
      @keyup.enter="onSearch"
    />
    <div class="ml-auto relative" @click.stop>
      <button class="flex items-center gap-3" @click="isOpen = !isOpen">
        <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-400 to-blue-400 flex items-center justify-center text-white font-bold">
          {{ initials }}
        </div>
        <span class="text-sm font-medium text-tertiary hidden md:block">{{ displayName }}</span>
      </button>
      <div v-if="isOpen" class="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-primary/10 p-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-white font-bold">
            {{ initials }}
          </div>
          <div class="min-w-0">
            <div class="font-semibold text-tertiary truncate">{{ displayName }}</div>
            <div class="text-sm text-tertiary/70 truncate">{{ email }}</div>
          </div>
        </div>
        <button
          class="w-full bg-tertiary/10 hover:bg-tertiary/20 rounded-lg px-4 py-2 text-left font-medium text-tertiary"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
  
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const isOpen = ref(false)
const storedUser = ref(null)

function readUser() {
  try {
    const raw = localStorage.getItem('user')
    storedUser.value = raw ? JSON.parse(raw) : null
  } catch (e) {
    storedUser.value = null
  }
}

const email = computed(() => storedUser.value?.email || '')
const displayName = computed(() => {
  if (storedUser.value?.name) return storedUser.value.name
  if (email.value) {
    const local = email.value.split('@')[0] || ''
    const friendly = local.replace(/[._-]+/g, ' ').trim()
    return friendly
      .split(' ')
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'User'
  }
  return 'User'
})
const initials = computed(() => displayName.value.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase())

function onSearch() {
  // Hook up to real search later
  // Keeping minimal behavior per request
  console.log('Search:', searchQuery.value)
}

function handleDocumentClick() {
  isOpen.value = false
}

function logout() {
  localStorage.removeItem('user')
  isOpen.value = false
  router.push('/login')
}

onMounted(() => {
  readUser()
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

