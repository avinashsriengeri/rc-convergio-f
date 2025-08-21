import { createRouter, createWebHistory } from 'vue-router'

// Auth views
import Login from './views/auth/Login.vue'
import Register from './views/auth/Register.vue'
import ForgotPassword from './views/auth/ForgotPassword.vue'
import ResetPassword from './views/auth/ResetPassword.vue'

// Main views
import Home from './views/Home.vue'
import Dashboard from './views/Dashboard.vue'
import Contacts from './views/Contacts.vue'
import ContactDetail from './views/ContactDetail.vue'
import Companies from './views/Companies.vue'
import CompanyDetail from './views/CompanyDetail.vue'
import DeletedCompanies from './views/DeletedCompanies.vue'

const routes = [
  // Public routes
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { requiresAuth: false }
  },
  
  // Protected routes
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: Contacts,
    meta: { requiresAuth: true }
  },
  {
    path: '/contacts/:id',
    name: 'ContactDetail',
    component: ContactDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/companies',
    name: 'Companies',
    component: Companies,
    meta: { requiresAuth: true }
  },
  {
    path: '/companies/:id',
    name: 'CompanyDetail',
    component: CompanyDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/companies/deleted',
    name: 'DeletedCompanies',
    component: DeletedCompanies,
    meta: { requiresAuth: true }
  },
  
  // Catch all route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')
  const requiresAuth = to.meta.requiresAuth
  
  // If route requires auth and user is not authenticated
  if (requiresAuth && !token) {
    next('/login')
    return
  }
  
  // If user is authenticated and trying to access auth pages
  if (token && ['Login', 'Register', 'ForgotPassword', 'ResetPassword'].includes(to.name)) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router
