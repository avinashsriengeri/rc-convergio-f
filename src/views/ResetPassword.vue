<template>
  <main class="min-h-screen flex items-center justify-center bg-[#3c0b3c] pt-0 md:pt-12 transition-all">
    <section class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col">
      <h2 class="text-2xl font-bold mb-4">Reset Password</h2>
      <input v-model="password" :type="showPwd ? 'text' : 'password'" placeholder="New password" class="login-input mb-3" />
      <input v-model="passwordConfirmation" :type="showPwd ? 'text' : 'password'" placeholder="Confirm password" class="login-input mb-3" />
      <button type="button" class="w-full py-3 rounded-lg bg-indigo-600 text-white font-bold" @click="submit" :disabled="loading">Reset Password</button>
      <p v-if="errorMessage" class="text-sm text-red-600 mt-3">{{ errorMessage }}</p>
      <p v-if="success" class="text-sm text-green-600 mt-3">Password updated. Redirecting…</p>
      <button class="mt-2 text-sm text-indigo-600" type="button" @click="showPwd = !showPwd">{{ showPwd ? 'Hide' : 'Show' }} Passwords</button>
    </section>
  </main>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import api from '@/services/api'
  
  const route = useRoute()
  const router = useRouter()
  const token = ref('')
  const password = ref('')
  const passwordConfirmation = ref('')
  const errorMessage = ref('')
  const success = ref(false)
  const loading = ref(false)
  const showPwd = ref(false)
  
  onMounted(() => {
    token.value = String(route.query.token || route.params.token || '')
  })
  
  async function submit() {
    errorMessage.value = ''
    if (!token.value) {
      errorMessage.value = 'Invalid token.'
      return
    }
    if (!password.value || password.value !== passwordConfirmation.value) {
      errorMessage.value = 'Passwords do not match.'
      return
    }
    loading.value = true
    try {
      await api.post('/auth/reset', {
        token: token.value,
        password: password.value,
        password_confirmation: passwordConfirmation.value,
      })
      success.value = true
      setTimeout(() => router.push('/login'), 1200)
    } catch (err) {
      errorMessage.value = err?.response?.data?.message || 'Reset failed.'
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .login-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    background-color: #f9fafb;
    color: #374151;
    font-size: 1rem;
    outline: none;
    transition: all 0.2s;
  }
  </style>


