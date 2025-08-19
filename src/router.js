import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Dashboard from './views/Dashboard.vue'
import ForgotPassword from './views/ForgotPassword.vue' // <--- Add this line

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/forgot-password', component: ForgotPassword }, // <--- Add this line
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
