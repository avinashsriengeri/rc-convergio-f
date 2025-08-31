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

// CRM Module views

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
  {
    path: '/companies/create',
    name: 'CompanyCreate',
    component: () => import('./views/CompanyFormPage.vue'),
    meta: { requiresAuth: true }
  },
  
  // Deals Module routes
  {
    path: '/deals',
    name: 'DealsList',
    component: () => import('./views/deals/DealsListPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/deals/kanban',
    name: 'DealsKanban',
    component: () => import('./views/deals/DealsKanbanPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/deals/new',
    name: 'DealCreate',
    component: () => import('./views/deals/DealFormPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/deals/:id',
    name: 'DealDetail',
    component: () => import('./views/deals/DealDetailPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/deals/:id/edit',
    name: 'DealEdit',
    component: () => import('./views/deals/DealFormPage.vue'),
    meta: { requiresAuth: true }
  },
  
  // Pipelines Module routes
  {
    path: '/pipelines',
    name: 'Pipelines',
    component: () => import('./views/pipelines/PipelinesPage.vue'),
    meta: { requiresAuth: true }
  },
  
  // Stages Module routes
  {
    path: '/stages',
    name: 'Stages',
    component: () => import('./views/stages/StagesPage.vue'),
    meta: { requiresAuth: true }
  },
  
  // CRM Module routes (existing)
  {
    path: '/deals-old',
    name: 'Deals',
    component: () => import('./views/Deals.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/campaigns',
    name: 'Campaigns',
    component: () => import('./views/Campaigns.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('./views/Tasks.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/activities',
    name: 'Activities',
    component: () => import('./views/Activities.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/activities/:id',
    name: 'activities.show',
    component: () => import('./views/ActivitiesDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/activities/:id/edit',
    name: 'activities.edit',
    component: () => import('./views/Activities.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./views/Settings.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('access_token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAuth === false && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
