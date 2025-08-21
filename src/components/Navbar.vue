<template>
  <nav
   class="fixed w-full top-0 left-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 shadow-sm transition-colors duration-300"
  >
    <div class="max-w-7xl mx-auto px-4 md:px-6">
      <div class="flex items-center justify-between h-14">
        <div class="flex items-center gap-2">
          <router-link to="/" class="flex items-center gap-2">
            <img src="@/assets/logo.png" class="w-8 h-8" alt="logo" />
            <span class="text-2xl font-bold text-white">RC Convergio</span>
          </router-link>
        </div>
        <div class="flex items-center gap-1 md:gap-2">
          <router-link
            to="/"
            class="hidden md:inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors duration-300"
          >Home</router-link>
          <!-- <router-link
            to="/register"
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition"
          >Register</router-link> -->
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>
