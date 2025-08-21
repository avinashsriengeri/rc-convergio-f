<template>
    <main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-0 md:pt-12 transition-all">

      <div class="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center justify-center px-4">
        <!-- Left Info Card -->
        <section class="w-full md:w-1/2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col items-start fade-in-up mb-0 md:mb-0 mt-7 mb-4" 

      >
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">

              <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8" />
            </div>
            <h2 class="text-xl font-bold text-white">RC Convergio</h2>

          </div>
          <h3 class="text-3xl md:text-4xl font-bold mb-4 text-white">Forgot your password?</h3>
          <p class="text-gray-300 mb-6 text-lg">
            Enter the email associated with your account. We'll send a secure link to reset your password.
          </p>
          <img
            src="https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=600&q=80"
            alt="Password Security"
            class="w-full rounded-xl shadow-lg mb-6"
          />
          <div class="flex flex-wrap gap-3 mt-2">
            <span class="rounded-full bg-blue-500/20 px-4 py-1 text-sm text-blue-300 border border-blue-500/30">Encrypted Links</span>
            <span class="rounded-full bg-purple-500/20 px-4 py-1 text-sm text-purple-300 border border-purple-500/30">Token Expiry</span>
            <span class="rounded-full bg-indigo-500/20 px-4 py-1 text-sm text-indigo-300 border border-indigo-500/30">No Account Disclosure</span>
          </div>

        </section>
        <!-- Forgot Password Form Card -->
        <section class="w-full md:w-1/2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-10 flex flex-col fade-in-up">

          <div class="flex items-center gap-3 mb-6 opacity-40">
            <div class="w-12 h-12 rounded-xl bg-primary/10"></div>
            <div class="h-6 w-32 rounded bg-primary/10"></div>
          </div>

          <div class="mb-5">
            <input
              v-model="email"
              type="email"
              required
              placeholder="name@company.com"
              class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              :class="{ 'error-input': emailError }"
              @input="clearError"
              autocomplete="email"
            />
          </div>
          <button
            class="w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 font-bold text-white text-lg shadow-md hover:from-blue-600 hover:to-purple-700 active:scale-95 transition-all duration-150"
            @click="handleReset"
          >
            Send Reset Link
          </button>

          <!-- Success/Info Message -->
          <transition name="fade">
            <p v-if="success" class="w-full border border-white/10 bg-white/5 text-gray-200 p-2 mt-4 rounded text-center">
              If an account exists, a reset link has been sent.
            </p>
          </transition>
          <div class="flex items-center justify-between mt-4 text-sm">
            <router-link
              to="/login"
              class="text-gray-300 hover:text-white font-semibold hover:underline transition"
            >Back to Login</router-link>
            <router-link
              to="/register"
              class="text-gray-300 hover:text-white font-semibold hover:underline transition"
            >Create account</router-link>
          </div>
          <div class="mt-6 text-xs text-gray-300 bg-white/5 border border-white/10 rounded-lg p-2">
            For your security, we do not reveal whether an email is registered.
          </div>
        </section>

      </div>
    </main>
  </template>

  <script setup>
  import { ref } from 'vue'
  const email = ref('')
  const emailError = ref(false)
  const success = ref(false)

  function handleReset() {
    emailError.value = !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)
    if (emailError.value) {
      success.value = false
      return
    }
    // Simulate sending a reset email; replace with actual API call
    success.value = true
  }
  function clearError() {
    emailError.value = false
    success.value = false
  }
  </script>

  <style scoped>
  .forgot-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid color-mix(in oklab, var(--color-primary) 20%, white);
    border-radius: 0.5rem;
    background-color: color-mix(in oklab, var(--color-primary) 5%, white);
    color: var(--color-tertiary);
    font-size: 1rem;
    outline: none;
    transition: all 0.2s;
  }
  .forgot-input::placeholder {
    color: color-mix(in oklab, var(--color-tertiary) 55%, white);
  }
  .forgot-input:focus {
    border-color: color-mix(in oklab, var(--color-accent) 40%, white);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-accent) 25%, transparent);
  }

  .error-input {
    border-color: #dc2626;
    box-shadow: 0 0 0 2px rgba(220,38,38,.12);
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
  