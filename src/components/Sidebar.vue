<template>
  <aside class="w-64 min-h-screen bg-white border-r border-primary/10 rounded-tr-xl rounded-br-xl shadow-lg flex flex-col p-6">
    <div class="flex items-center mb-8">
      <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3">
        <img src="@/assets/logo.png" alt="Logo" class="w-7 h-7" />
      </div>
      <span class="text-lg font-semibold text-tertiary">RC Convergio</span>
    </div>
    <nav class="flex flex-col gap-2">
      <router-link to="/dashboard" class="rounded-lg px-4 py-2 hover:bg-primary/5 transition" active-class="bg-primary/10 text-primary font-semibold">Dashboard</router-link>
      <router-link to="/contacts" class="rounded-lg px-4 py-2 hover:bg-primary/5 transition" active-class="bg-secondary/10 text-secondary font-bold">Contacts</router-link>
      <button class="rounded-lg px-4 py-2 text-left hover:bg-primary/5 transition">Companies</button>
      <button class="rounded-lg px-4 py-2 text-left hover:bg-primary/5 transition">Deals</button>
      <button class="rounded-lg px-4 py-2 text-left hover:bg-primary/5 transition">Campaigns</button>
      <button class="rounded-lg px-4 py-2 text-left hover:bg-primary/5 transition">Tasks</button>
      <button class="rounded-lg px-4 py-2 text-left hover:bg-primary/5 transition">Settings</button>
    </nav>
  </aside>
  
</template>

<script setup>
</script>

