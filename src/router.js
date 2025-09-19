
import { createRouter, createWebHistory } from 'vue-router'

// Auth views
import Login from './views/auth/Login.vue'
import Register from './views/auth/Register.vue'
import ForgotPassword from './views/auth/ForgotPassword.vue'
import ResetPassword from './views/auth/ResetPassword.vue'
import VerifyNotification from './views/auth/VerifyNotification.vue'

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
  {
    path: '/verify-notification',
    name: 'VerifyNotification',
    component: VerifyNotification,
    meta: { requiresAuth: false }
  },
  
  // OAuth callback routes (NEW - for Facebook Ads)
  {
    path: '/oauth/facebook/callback',
    name: 'FacebookOAuthCallback',
    component: () => import('./views/oauth/FacebookCallback.vue'),
    meta: { requiresAuth: true }
  },
  
  // Facebook OAuth success/error routes
  {
    path: '/facebook/oauth/success',
    name: 'FacebookOAuthSuccess',
    component: () => import('./views/oauth/FacebookOAuthSuccess.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/facebook/oauth/error',
    name: 'FacebookOAuthError',
    component: () => import('./views/oauth/FacebookOAuthError.vue'),
    meta: { requiresAuth: true }
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
    path: '/contacts/:id/edit',
    name: 'ContactEdit',
    component: () => import('./views/ContactEdit.vue'),
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
    path: '/campaigns/create',
    name: 'CampaignCreate',
    component: () => import('./views/Campaigns.vue'),
    meta: { requiresAuth: true },
    props: { openCreateModal: true }
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
  },

  // Forms Module routes
  {
    path: '/forms',
    name: 'Forms',
    component: () => import('./views/Forms/FormsList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forms/create',
    name: 'FormCreate',
    component: () => import('./views/Forms/FormBuilder.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forms/:id',
    name: 'FormView',
    component: () => import('./views/Forms/FormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forms/:id/edit',
    name: 'FormEdit',
    component: () => import('./views/Forms/FormBuilder.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forms/:id/submissions',
    name: 'FormSubmissions',
    component: () => import('./views/Forms/FormSubmissions.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forms/:formId/submissions/:submissionId',
    name: 'FormSubmissionDetail',
    component: () => import('./views/Forms/FormSubmissionDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/public/forms/:id',
    name: 'PublicForm',
    component: () => import('./views/Forms/FormPublicView.vue'),
    meta: { requiresAuth: false }
  },

  // Lists/Segments Module routes
  {
    path: '/lists',
    name: 'Lists',
    component: () => import('./views/Lists/ListsIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/lists/create',
    name: 'ListCreate',
    component: () => import('./views/Lists/ListForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/lists/:id',
    name: 'ListDetails',
    component: () => import('./views/Lists/ListDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/lists/:id/edit',
    name: 'ListEdit',
    component: () => import('./views/Lists/ListForm.vue'),
    meta: { requiresAuth: true }
  },

  // Users Module routes (Admin only)
  {
    path: '/users',
    name: 'Users',
    component: () => import('./views/Users/UsersIndex.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/users/create',
    name: 'UserCreate',
    component: () => import('./views/Users/UserForm.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/users/:id/edit',
    name: 'UserEdit',
    component: () => import('./views/Users/UserForm.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },

  // Profile Module routes
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/Profile/ProfileView.vue'),
    meta: { requiresAuth: true }
  },

  // Features Demo route
  {
    path: '/features-demo',
    name: 'FeaturesDemo',
    component: () => import('./views/FeaturesDemo.vue'),
    meta: { requiresAuth: true }
  },

  // Marketing Module routes (Parent/Child structure)
  {
    path: '/marketing',
    name: 'Marketing',
    redirect: '/marketing/overview',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'overview',
        name: 'MarketingOverview',
        component: () => import('./views/marketing/Overview.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'email',
        name: 'MarketingEmail',
        component: () => import('./views/marketing/Email.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'ads',
        name: 'MarketingAds',
        component: () => import('./views/marketing/Ads.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'events',
        name: 'MarketingEvents',
        component: () => import('./views/marketing/Events.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'buyer-intent',
        name: 'MarketingBuyerIntent',
        component: () => import('./views/marketing/BuyerIntent.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'lead-scoring',
        name: 'MarketingLeadScoring',
        component: () => import('./views/marketing/LeadScoring.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'journeys',
        name: 'MarketingJourneys',
        component: () => import('./views/marketing/Journeys.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'forecasting',
        name: 'MarketingForecasting',
        component: () => import('./views/marketing/Forecasting.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'meetings',
        name: 'MarketingMeetings',
        component: () => import('./views/marketing/Meetings.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'analytics',
        name: 'MarketingAnalytics',
        component: () => import('./views/marketing/Analytics.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('access_token')
  console.log('Router guard:', { 
    to: to.path, 
    from: from.path, 
    isAuthenticated: !!isAuthenticated 
  })
  
  // Get user role from stored user data (handle both nested roles array and flat role)
  let userRole = null
  let userData = null
  if (isAuthenticated) {
    try {
      userData = JSON.parse(localStorage.getItem('user') || '{}')
      // Handle nested roles array from backend
      if (userData.roles && userData.roles.length > 0) {
        if (typeof userData.roles[0] === 'object' && userData.roles[0]?.name) {
          userRole = userData.roles[0].name
        } else if (typeof userData.roles[0] === 'string') {
          userRole = userData.roles[0]
        }
      }
      // Fallback to flat role property
      if (!userRole) {
        userRole = userData.role
      }
    } catch (error) {
      console.error('Failed to parse user data:', error)
    }
  }
  
  // Check if user needs email verification
  const requiresEmailVerification = isAuthenticated && userData && !userData.email_verified_at
  
  // Navigation guard logic (console logs removed for production)
  
  const requiresAuth = to.meta?.requiresAuth ?? true
  const requiresAdmin = to.meta?.requiresAdmin ?? false
  
  if (requiresAuth && !isAuthenticated) {
    console.log('Router: Redirecting to login - not authenticated')
    next('/login')
  } else if (requiresAuth === false && isAuthenticated && (to.path === '/' || to.path === '/login')) {
    // Redirect authenticated users away from login/home to dashboard
    console.log('Router: Redirecting authenticated user to dashboard from', to.path)
    next('/dashboard')
  } else if (requiresAuth && requiresEmailVerification && to.path !== '/verify-notification' && to.path !== '/login') {
    // Redirect unverified users to verification page, but allow login page access
    console.log('Router: Redirecting to verification - email not verified')
    next('/verify-notification')
  } else if (requiresAdmin && userRole !== 'admin') {
    // Redirect non-admin users trying to access admin routes
    console.log('Router: Redirecting to dashboard - admin required')
    next('/dashboard')
  } else {
    console.log('Router: Allowing navigation to', to.path)
    next()
  }
})

export default router
