<template>
  <main
    class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 pt-0 md:pt-12 transition-all"
  >
    <!-- Cards Container -->
    <div class="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-10 md:gap-12 items-center justify-center"
    >
      <!-- Left Info Card -->
      <section
        class="w-full md:w-1/2 bg-white/90 rounded-2xl shadow-xl p-8 md:p-10 flex flex-col items-start fade-in-up mb-0 md:mb-0"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8" />
          </div>
          <h2 class="text-xl font-bold ">RC Convergio</h2>
        </div>

        <h3 class="text-4xl font-extrabold mb-4 text-gray-900">Welcome back 👋</h3>
        <p class="text-gray-600 mb-6 text-lg">
          Securely access your customer data, pipelines, and insights.
        </p>

        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
          alt="Dashboard Example"
          class="w-full rounded-xl shadow-lg mb-6"
        />

        <div class="flex flex-wrap gap-3 mt-2">
          <span class="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-700 border border-gray-200">SSO Ready</span>
          <span class="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-700 border border-gray-200">Encrypted</span>
          <span class="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-700 border border-gray-200">2FA Supported</span>
        </div>
      </section>

      <!-- Login Form Card -->
      <section
        class="w-full md:w-1/2 bg-white rounded-2xl shadow-2xl p-10 flex flex-col fade-in-up"
      >
        <!-- Email Field -->
        <div class="mb-5">
          <input
            v-model="username"
            type="email"
            required
            placeholder="Email"
            class="login-input"
            :class="{ 'error-input': emailError }"
            @input="clearError"
            autocomplete="username"
          />
          <p v-if="emailError" class="text-sm text-red-600 pl-1 pt-1">
            Invalid email format. Please use name@company.com
          </p>
        </div>

        <!-- Password Field -->
        <div class="mb-5 relative">
          <input
            :type="showPwd ? 'text' : 'password'"
            v-model="password"
            required
            placeholder="Password"
            class="login-input"
            :class="{ 'error-input': pwdError }"
            @input="clearError"
            autocomplete="current-password"
          />
          <button
            type="button"
            class="absolute right-3 top-2 text-indigo-600 font-medium text-sm focus:outline-none"
            @click="showPwd = !showPwd"
            tabindex="-1"
          >
            {{ showPwd ? 'Hide' : 'Show' }}
          </button>
          <p v-if="pwdError" class="text-sm text-red-600 pl-1 pt-1">
            Password must be at least 8 characters
          </p>
        </div>

        <!-- Action -->
        <button
          class="w-full mt-2 py-3 rounded-lg bg-black font-bold text-white text-lg shadow-md hover:bg-indigo-700 active:scale-95 transition-all duration-150"
          @click="handleLogin"
        >
          Login
        </button>

        <!-- Links -->
     

        <router-link
  to="/forgot-password"
  class="block text-sm mt-4 text-indigo-600 hover:underline transition"
>
  Forgot Password?
</router-link>
        <div class="flex items-center justify-between mt-6">
          <span class="text-xs text-gray-400">
            Tip: Use your company email to sign in.
          </span>
          <router-link
            to="/register"
            class="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline text-sm transition"
          >
            Sign Up
          </router-link>
        </div>

        <p v-if="tryError" class="text-xs text-orange-600 mt-3">{{ tryError }}</p>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const showPwd = ref(false)
const emailError = ref(false)
const pwdError = ref(false)
const tryError = ref('')
const router = useRouter()

function handleLogin(e) {
  emailError.value = !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(username.value)
  pwdError.value = password.value.length < 8
  if (emailError.value || pwdError.value) return

  if (username.value === 'lock@company.com') {
    tryError.value = 'Too many attempts. Try again in 00:58'
    return
  }
  tryError.value = ''
  router.push('/dashboard')
}
function clearError() {
  emailError.value = false
  pwdError.value = false
  tryError.value = ''
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
.login-input::placeholder {
  color: #9ca3af;
}
.login-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
}
.error-input {
  border-color: #dc2626;
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
}
.fade-in-up {
  animation: fade-in-up .7s cubic-bezier(.4,0,.2,1);
}
@keyframes fade-in-up {
  from { opacity:0; transform:translateY(32px) scale(0.98);}
  to { opacity:1; transform:translateY(0) scale(1);}
}
</style>
