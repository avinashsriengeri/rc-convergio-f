import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuth } from './composables/useAuth'
import i18n from './i18n.js'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

// Initialize auth state
const { initAuth } = useAuth()
initAuth()

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
