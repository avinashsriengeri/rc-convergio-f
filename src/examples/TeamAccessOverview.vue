<template>
  <div class="p-6 space-y-6">
    <h1 class="text-xl font-bold mb-4">🏗️ Team Access Overview</h1>
    <p class="text-gray-600 mb-4">
      This page simulates how different modules apply team-based visibility and ownership.
      Each section below represents one module with who-can-see and dropdown logic.
    </p>

    <ContactVisibilityDemo />
    <DealVisibilityDemo />
  </div>
</template>

<script setup>
import ContactVisibilityDemo from './ContactVisibilityDemo.vue'
import DealVisibilityDemo from './DealVisibilityDemo.vue'
</script>

<style scoped>
h1 { border-bottom: 2px solid #ddd; padding-bottom: 0.5rem; }
</style>
