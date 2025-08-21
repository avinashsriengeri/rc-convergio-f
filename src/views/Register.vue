<template>
  <main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-0 md:pt-12 transition-all">
    <!-- Cards Container -->
    <div class="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center">
      <!-- Left Info Card -->
      <section
        class= "w-full md:w-1/2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col items-start fade-in-up mb-0 md:mb-0 mt-7 mb-4" 
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
            <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8" />
          </div>
          <h2 class="text-lg font-semibold text-white">RC Convergio</h2>
        </div>
                  <h3 class="text-3xl md:text-4xl font-bold mb-4 text-white">Create your account</h3>
        <p class="text-gray-300 mb-4">Join RC Convergio to securely manage your business data.</p>
        <img
          src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80"
          alt="Team Example"
          class="w-full rounded-lg shadow mb-4"
        />
                 <div class="flex flex-wrap gap-3 mt-2">
           <span class="rounded-full bg-blue-500/20 px-4 py-1 text-sm text-blue-300 border border-blue-500/30">Encrypted</span>
           <span class="rounded-full bg-purple-500/20 px-4 py-1 text-sm text-purple-300 border border-purple-500/30">Email Verification</span>
           <span class="rounded-full bg-indigo-500/20 px-4 py-1 text-sm text-indigo-300 border border-indigo-500/30">2FA Ready</span>
         </div>
      </section>
      <!-- Register Form Card -->
      <section
        class="w-full md:w-1/2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col fade-in-up relative"
      >
        <!-- Full Name -->
        <div class="mb-3">
          <input
            v-model="name"
            type="text"
            required
            placeholder="Full Name"
            class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
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
             class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
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
             class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            autocomplete="new-password"
          />
                     <button
             type="button"
             class="absolute right-3 top-2 text-gray-300 hover:text-white font-medium text-sm focus:outline-none"
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
             class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
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
             class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            autocomplete="organization"
          />
        </div>
        <!-- Action -->
                 <button
           class="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 font-bold text-white text-lg shadow-md hover:from-blue-600 hover:to-purple-700 active:scale-95 transition-all duration-150"
           @click="handleRegister"
         >
           Create Account
         </button>

        <!-- Success message -->
        <transition name="fade">
          <p v-if="success" class="w-full border border-primary/20 bg-primary/5 text-primary p-2 mt-4 rounded text-center">
            Check your email to verify your account.
          </p>
        </transition>
        
        <!-- Footer Links -->
                 <div class="flex items-center justify-between mt-4 text-sm">
           <router-link
             to="/login"
             class="text-gray-300 hover:text-white font-semibold hover:underline transition"
           >Back to Login</router-link>
           <span class="text-gray-300 hover:text-white hover:underline cursor-pointer">Need help?</span>
         </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPwd = ref('')
const org = ref('')
const showPwd = ref(false)
const success = ref(false)
function handleRegister() {
  if (
    name.value &&
    /\S+@\S+\.\S+/.test(email.value) &&
    password.value &&
    password.value === confirmPwd.value &&
    org.value
  ) {
    success.value = true
  } else {
    success.value = false
    // Handle error in real app
  }
}
</script>

<style scoped>
.my-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid color-mix(in oklab, var(--color-primary) 20%, white);
  border-radius: 0.375rem;
  background-color: color-mix(in oklab, var(--color-primary) 5%, white);
  color: var(--color-tertiary);
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
}
.my-input::placeholder {
  color: color-mix(in oklab, var(--color-tertiary) 55%, white);
}
.my-input:focus {
  box-shadow: 0 0 0 2px color-mix(in oklab, var(--color-accent) 25%, transparent);
  border-color: color-mix(in oklab, var(--color-accent) 40%, white);
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
