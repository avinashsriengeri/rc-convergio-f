<template>
  <nav
   class="fixed w-full top-0 left-0 z-50 bg-[#3c0b3c] shadow-lg py-3 px-8 flex items-center justify-between transition-colors duration-300"
  >
    <div class="flex items-center gap-2">
      <router-link to="/" class="flex items-center gap-2">
        <img src="@/assets/logo.png" class="w-9 h-9" alt="logo" />
        <span class="text-white text-2xl font-bold">Reliance Corporation</span>
      </router-link>
    </div>
    <div class="flex gap-3">
      <router-link
        to="/"
        class="px-4 py-2 rounded-lg transition bg-white/20 text-white font-medium hover:bg-white/30 hover:scale-105 focus:outline-none"
      >Home</router-link>
      <router-link
        v-if="isAuthed"
        to="/dashboard"
        class="px-4 py-2 rounded-lg transition bg-white/20 text-white font-medium hover:bg-white/30 hover:scale-105 focus:outline-none"
      >Dashboard</router-link>
      <router-link
        v-if="isAuthed"
        to="/contacts"
        class="px-4 py-2 rounded-lg transition bg-white/20 text-white font-medium hover:bg-white/30 hover:scale-105 focus:outline-none"
      >Contacts</router-link>
      <button
        v-if="isAuthed"
        class="px-4 py-2 rounded-lg transition bg-white/20 text-white font-medium hover:bg-white/30 hover:scale-105 focus:outline-none"
        @click="logout"
      >Logout</button>
      <router-link
        v-else
        to="/login"
        class="px-4 py-2 rounded-lg transition bg-white/20 text-white font-medium hover:bg-white/30 hover:scale-105 focus:outline-none"
      >Login</router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthed = computed(() => Boolean(localStorage.getItem('token')))

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
a.router-link-active { font-weight: 600; }
</style>
