<template>
  <nav
   class="fixed w-full top-0 left-0 z-50 bg-gradient-to-tr from-highlight to-accent via-pink-400 shadow-lg py-3 px-8 flex items-center justify-between transition-colors duration-300"
  >
    <div class="flex items-center gap-2">
      <router-link to="/" class="flex items-center gap-2">
        <img src="@/assets/logo.png" class="w-9 h-9" alt="logo" />
        <span class="text-white text-2xl font-bold">Reliance Corporation</span>
     
      </router-link>
    </div>
    <div class="flex gap-4">
      <router-link
        to="/"
        class="px-4 py-2 rounded-lg transition bg-white/20 text-white font-medium hover:bg-white/30 hover:scale-105 focus:outline-none"
      >Home</router-link>
      <router-link
        to="/login"
        class="px-4 py-2 rounded-lg transition bg-white/20 text-white font-medium hover:bg-white/30 hover:scale-105 focus:outline-none"
      >Login</router-link>
      <!-- <router-link
        to="/register"
        class="px-4 py-2 rounded-lg transition bg-white/20 text-white font-medium hover:bg-white/30 hover:scale-105 focus:outline-none"
      >Register</router-link> -->
    </div>
  </nav>
</template>

<script setup>
</script>
