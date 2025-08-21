<template>
  <div class="min-h-screen flex flex-col bg-white font-baloo text-tertiary">
    <router-view v-slot="{ Component, route }">
      <Navbar v-if="!route.meta?.hideNavbar" />
      <div :class="route.meta?.hideNavbar ? '' : 'pt-14'">
        <component :is="Component" />
      </div>
    </router-view>
  </div>
  
</template>
<script setup>
import Navbar from './components/Navbar.vue'
</script>
