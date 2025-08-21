import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import { useAuth } from './composables/useAuth'
import './style.css'

const app = createApp(App)

// Initialize auth state
const { initAuth } = useAuth()
initAuth()

app.use(router)
app.mount('#app')
