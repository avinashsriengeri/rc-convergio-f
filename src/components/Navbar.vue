<template>
  <nav
   class="fixed w-full top-0 left-0 z-50 bg-white/80 backdrop-blur border-b border-primary/10 shadow-sm transition-colors duration-300"
  >
    <div class="max-w-7xl mx-auto px-4 md:px-6">
      <div class="flex items-center justify-between h-14">
        <div class="flex items-center gap-2">
          <router-link to="/" class="flex items-center gap-2">
            <img src="@/assets/logo.png" class="w-8 h-8" alt="logo" />
            <span class="text-tertiary text-lg font-semibold tracking-tight">Reliance Corporation</span>
          </router-link>
        </div>
        <div class="flex items-center gap-1 md:gap-2">
          <router-link
            to="/"
            class="px-3 py-2 rounded-md text-sm font-bold text-secondary hover:text-primary hover:bg-primary/5 transition"
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
