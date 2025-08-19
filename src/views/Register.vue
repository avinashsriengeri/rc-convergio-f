<template>
  <main class="min-h-screen flex items-center justify-center bg-[#3c0b3c] pt-0 md:pt-12 transition-all">
    <!-- Cards Container -->
    <div class="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center">
      <!-- Left Info Card -->
      <section
        class= "w-full md:w-1/2 bg-white/10 rounded-2xl shadow-xl p-8 md:p-10 flex flex-col items-start fade-in-up mb-0 md:mb-0 mt-7 mb-4" 
      >       
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8" />
          </div>
          <h2 class="text-lg font-semibold text-white">RC Convergio</h2>
        </div>
                  <h3 class="text-3xl md:text-4xl font-bold mb-4 text-white">Create your account</h3>
        <p class="text-white mb-4">Join RC Convergio to securely manage your business data.</p>
        <img
          src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80"
          alt="Team Example"
          class="w-full rounded-lg shadow mb-4"
        />
                 <div class="flex flex-wrap gap-3 mt-2">
           <span class="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-700 border border-gray-200">Encrypted</span>
           <span class="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-700 border border-gray-200">Email Verification</span>
           <span class="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-700 border border-gray-200">2FA Ready</span>
         </div>
      </section>
      <!-- Register Form Card -->
      <section
        class="w-full md:w-1/2 bg-white/05  rounded-2xl shadow-xl p-8 md:p-10 flex flex-col fade-in-up relative"
      >
        <!-- Full Name -->
        <div class="mb-3">
          <input
            v-model="name"
            type="text"
            required
            placeholder="Full Name"
            class="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autocomplete="name"
          />
        </div>
        <!-- Email -->
        <div class="mb-3">
          <input
            v-model="email"
            type="email"
            required
            placeholder="name@company.com"
             class="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autocomplete="email"
          />
        </div>
        <!-- Password -->
        <div class="mb-3 relative">
          <input
            :type="showPwd ? 'text' : 'password'"
            v-model="password"
            required
            placeholder="Create a password"
             class="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autocomplete="new-password"
          />
                     <button
             type="button"
             class="absolute right-3 top-2 text-indigo-600 font-medium text-sm focus:outline-none"
             @click="showPwd = !showPwd"
             tabindex="-1"
           >{{ showPwd ? 'Hide' : 'Show' }}</button>
        </div>
        <!-- Confirm Password -->
        <div class="mb-3">
          <input
            :type="showPwd ? 'text' : 'password'"
            v-model="confirmPwd"
            required
            placeholder="Re-enter password"
             class="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autocomplete="new-password"
          />
        </div>
        <!-- Organization Name -->
        <div class="mb-5">
          <input
            v-model="org"
            type="text"
            required
            placeholder="Your company"
             class="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autocomplete="organization"
          />
        </div>
        <!-- Action -->
                 <button
           class="w-full py-2 rounded-lg bg-indigo-600 font-bold text-white text-lg shadow-md hover:bg-indigo-700 active:scale-95 transition-all duration-150"
           @click="handleRegister"
         >
           Create Account
         </button>

        <!-- Success message -->
        <transition name="fade">
          <p v-if="success" class="w-full border border-green-500 bg-green-50 text-green-700 p-2 mt-4 rounded text-center">
            Check your email to verify your account.
          </p>
        </transition>
        
        <!-- Footer Links -->
                 <div class="flex items-center justify-between mt-4 text-sm">
           <router-link
             to="/login"
             class="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition"
           >Back to Login</router-link>
           <span class="text-indigo-600 hover:underline cursor-pointer">Need help?</span>
         </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPwd = ref('')
const org = ref('')
const showPwd = ref(false)
const success = ref(false)
const errorMessage = ref('')
const loading = ref(false)

async function handleRegister() {
  errorMessage.value = ''
  if (!name.value || !/\S+@\S+\.\S+/.test(email.value) || !password.value || password.value !== confirmPwd.value || !org.value) {
    success.value = false
    errorMessage.value = 'Please fill all fields correctly.'
    return
  }
  loading.value = true
  try {
    const { data } = await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      phone: '',
      password: password.value,
      password_confirmation: confirmPwd.value,
      organization_name: org.value,
    })
    success.value = true
    router.push('/login')
  } catch (err) {
    const resp = err?.response?.data
    if (resp?.errors) {
      const firstField = Object.keys(resp.errors)[0]
      errorMessage.value = resp.errors[firstField]?.[0] || resp.message || 'Registration failed.'
    } else {
      errorMessage.value = resp?.message || 'Registration failed.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.my-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: rgba(245, 245, 245, 0.6);
  color: #374151;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
}
.my-input::placeholder {
  color: #9ca3af;
}
.my-input:focus {
  box-shadow: 0 0 0 2px #4f46e5;
  border-color: #4f46e5;
}
.fade-in-up {
  animation: fade-in-up .7s cubic-bezier(.4,0,.2,1);
}
@keyframes fade-in-up {
  from { opacity:0; transform:translateY(32px) scale(0.98);}
  to { opacity:1; transform:translateY(0) scale(1);}
}
.fade-enter-active, .fade-leave-active { transition: opacity .4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
