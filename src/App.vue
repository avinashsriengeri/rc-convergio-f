<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <router-view />
  </div>
</template>
<script setup>
import Navbar from './components/Navbar.vue'
</script>
