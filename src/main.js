import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router.js'
import { useAuth } from './composables/useAuth'
import i18n from './i18n.js'

import './style.css'
import './assets/css/team-badges.css'
import './assets/css/help.css'
import abTestingPlugin from './plugins/abTesting'

const app = createApp(App)
const pinia = createPinia()

// Initialize auth state
const { initAuth } = useAuth()
initAuth()

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(abTestingPlugin, {
    autoInit: true,
    debugMode: process.env.NODE_ENV === 'development'
  })
app.mount('#app')