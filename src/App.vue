<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <router-view v-slot="{ Component, route }">
      <Navbar v-if="!route.meta?.hideNavbar" />
      <component :is="Component" />
    </router-view>
  </div>
  
</template>
<script setup>
import Navbar from './components/Navbar.vue'
</script>
