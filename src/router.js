
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
  
  // Public Contact Form Routes
  {
    path: '/contact',
    name: 'ContactForm',
    component: () => import('./views/public/ContactForm.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/contact/success/:ticketId?',
    name: 'ContactSuccess',
    component: () => import('./views/public/ContactSuccess.vue'),
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
    path: '/activities/create',
    name: 'ActivitiesCreate',
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
  {
    path: '/public/events/:id',
    name: 'PublicEventRegistration',
    component: () => import('./views/PublicEventRegistration.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/events/:id/rsvp',
    name: 'PublicRSVPConfirmation',
    component: () => import('./views/PublicRSVPConfirmation.vue'),
    meta: { requiresAuth: false }
  },
  // Backend RSVP redirect route - handles backend URLs and redirects to frontend
  {
    path: '/api/public/events/:id/rsvp',
    name: 'BackendRSVPRedirect',
    component: () => import('./views/BackendRSVPRedirect.vue'),
    meta: { requiresAuth: false }
  },
  // RSVP redirect route for Vite proxy redirects
  {
    path: '/rsvp-redirect/:id/rsvp',
    name: 'RSVPRedirect',
    component: () => import('./views/BackendRSVPRedirect.vue'),
    meta: { requiresAuth: false }
  },

  // Public Quote View route - no authentication required
  {
    path: '/public/quotes/:uuid/view',
    name: 'PublicQuoteView',
    component: () => import('./views/public/QuoteViewPublic.vue'),
    meta: { requiresAuth: false, public: true }
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

  // Help & Support Page
  {
    path: '/support',
    name: 'Support',
    component: () => import('./views/HelpSupport.vue'),
    meta: { requiresAuth: true }
  },

  // Features Demo route
  {
    path: '/features-demo',
    name: 'FeaturesDemo',
    component: () => import('./views/FeaturesDemo.vue'),
    meta: { requiresAuth: true }
  },

  // Team Access Demo route
  {
    path: '/team-access-demo',
    name: 'TeamAccessDemo',
    component: () => import('./examples/TeamAccessOverview.vue'),
    meta: { requiresAuth: true }
  },

  // Marketing Module routes (Parent/Child structure)
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
    },
    {
      path: 'social-media',
      name: 'MarketingSocialMedia',
      component: () => import('./views/marketing/SocialMedia.vue'),
      meta: { requiresAuth: true }
    }
  ]
},
{
  path: '/marketing/seo',
  component: () => import('./views/marketing/seo/SeoLayout.vue'),
  meta: { requiresAuth: true },
  children: [
    {
      path: '',
      name: 'SeoDashboard',
      component: () => import('./views/marketing/seo/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: 'pages',
      name: 'SeoPages',
      component: () => import('./views/marketing/seo/PagesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: 'pages/:id',
      name: 'SeoPageDetail',
      component: () => import('./views/marketing/seo/PageDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: 'recommendations',
      name: 'SeoRecommendations',
      component: () => import('./views/marketing/seo/RecommendationsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: 'settings',
      name: 'SeoSettings',
      component: () => import('./views/marketing/seo/SettingsView.vue'),
      meta: { requiresAuth: true }
    }
  ]
},
// Legacy route redirect for backwards compatibility
{
  path: '/marketing/seo-tools',
  redirect: '/marketing/seo'
},
  
  // Sales Platform Module routes (Parent/Child structure)
  {
    path: '/sales',
    name: 'Sales',
    redirect: '/sales/quotes',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'overview',
        name: 'SalesOverview',
        component: () => import('./views/sales/Overview.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'quotes',
        name: 'SalesQuotes',
        component: () => import('./views/sales/quotes/QuotesList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'quotes/create',
        name: 'SalesQuoteCreate',
        component: () => import('./views/sales/quotes/QuoteForm.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'quotes/:id',
        name: 'SalesQuoteView',
        component: () => import('./views/sales/quotes/QuoteView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'quotes/:id/edit',
        name: 'SalesQuoteEdit',
        component: () => import('./views/sales/quotes/QuoteForm.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'products',
        name: 'SalesProducts',
        component: () => import('./views/sales/products/ProductsList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'quote-templates',
        name: 'SalesQuoteTemplates',
        component: () => import('./views/sales/quote-templates/TemplatesList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'sequences',
        name: 'SalesSequences',
        component: () => import('./views/sales/sequences/SequencesList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'sequences/create',
        name: 'SalesSequenceCreate',
        component: () => import('./views/sales/sequences/SequenceForm.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'sequences/:id/edit',
        name: 'SalesSequenceEdit',
        component: () => import('./views/sales/sequences/SequenceForm.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'sequences/:id/view',
        name: 'SalesSequenceView',
        component: () => import('./views/sales/sequences/SequenceView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'forecasting',
        name: 'SalesForecasting',
        component: () => import('./views/sales/Forecasting.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'lead-assignment',
        name: 'SalesLeadAssignment',
        component: () => import('./views/sales/LeadAssignment.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },

  // Public Commerce Checkout Route (must be outside commerce parent)
  {
    path: '/commerce/checkout/:id',
    name: 'CommerceCheckout',
    component: () => import('./views/commerce/CommerceCheckout.vue'),
    meta: { requiresAuth: false, public: true }
  },

  // Commerce Platform Module routes (Parent/Child structure)
  {
    path: '/commerce',
    name: 'Commerce',
    redirect: '/commerce/overview',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'overview',
        name: 'CommerceOverview',
        component: () => import('./views/commerce/CommerceOverview.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'orders',
        name: 'CommerceOrders',
        component: () => import('./views/commerce/CommerceOrders.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'payment-links',
        name: 'CommercePaymentLinks',
        component: () => import('./views/commerce/CommercePaymentLinks.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'CommerceSettings',
        component: () => import('./views/commerce/CommerceSettings.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'subscription-plans',
        name: 'SubscriptionPlans',
        component: () => import('./views/commerce/SubscriptionPlans.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'subscriptions',
        name: 'SubscriptionsDashboard',
        component: () => import('./views/commerce/SubscriptionsDashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'branding',
        name: 'CommerceBranding',
        component: () => import('./views/commerce/CommerceBranding.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },

  // Public Subscription Checkout Route
  {
    path: '/commerce/subscription-checkout/:sessionId',
    name: 'SubscriptionCheckout',
    component: () => import('./views/commerce/PublicCheckout.vue'),
    meta: { requiresAuth: false, public: true }
  },

  // Documents Module routes (moved to Sales Platform)
  {
    path: '/sales/documents',
    name: 'SalesDocuments',
    component: () => import('./views/documents/DocumentsPage.vue'),
    meta: { requiresAuth: true }
  },

  // Service Platform Module routes (Parent/Child structure)
  {
    path: '/service',
    name: 'ServicePlatform',
    component: () => import('./modules/service/pages/ServicePlatform.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'TicketsView',
        component: () => import('./modules/service/pages/TicketsView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':id',
        name: 'TicketDetailView',
        component: () => import('./modules/service/pages/TicketDetailView.vue'),
        props: true,
        meta: { requiresAuth: true }
      },
      {
        path: 'closed',
        name: 'ClosedTicketsView',
        component: () => import('./modules/service/pages/TicketsView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'open',
        name: 'OpenTicketsView',
        component: () => import('./modules/service/pages/TicketsView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'in-progress',
        name: 'InProgressTicketsView',
        component: () => import('./modules/service/pages/TicketsView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'resolved',
        name: 'ResolvedTicketsView',
        component: () => import('./modules/service/pages/TicketsView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'feedback-analytics',
        name: 'FeedbackAnalytics',
        component: () => import('./modules/service/pages/FeedbackAnalytics.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'email-integration',
        name: 'EmailIntegration',
        component: () => import('./modules/service/pages/EmailIntegration.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'live-chat',
        name: 'LiveChat',
        component: () => import('./modules/service/pages/LiveChat.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'integration',
        name: 'IntegrationWidget',
        component: () => import('./views/Service/IntegrationWidget.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'help',
        name: 'ServiceHelpCenter',
        component: () => import('./modules/service/pages/help/PublicHelpCenter.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'help/article/:slug',
        name: 'ServiceArticleDetail',
        component: () => import('./modules/service/pages/help/ArticleDetail.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'help/admin',
        name: 'ServiceHelpAdmin',
        component: () => import('./modules/service/pages/help/AdminKnowledgeBase.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'help/admin/analytics',
        name: 'ServiceHelpAnalytics',
        component: () => import('./modules/service/pages/help/AnalyticsView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'help/admin/articles/:id',
        name: 'ServiceHelpArticleDetail',
        component: () => import('./modules/service/pages/help/admin/ArticleDetail.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },

   // CMS / Content Platform Module routes
   {
    path: '/cms',
    name: 'CMS',
    component: () => import('./views/cms/CmsLayout.vue'),
    redirect: '/cms/pages',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'pages',
        name: 'CmsPages',
        component: () => import('./views/cms/PagesView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'editor/:id',
        name: 'CmsPageEditor',
        component: () => import('./views/cms/PageEditor.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'templates',
        name: 'CmsTemplates',
        component: () => import('./views/cms/TemplatesView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'personalization',
        name: 'CmsPersonalization',
        component: () => import('./views/cms/PersonalizationView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'ab-testing',
        name: 'CmsAbTesting',
        component: () => import('./views/cms/AbTestingView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'memberships',
        name: 'CmsMemberships',
        component: () => import('./views/cms/MembershipsView.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },

  // Copilot Module routes
  {
    path: '/copilot',
    name: 'Copilot',
    redirect: '/copilot/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'CopilotDashboard',
        component: () => import('./views/copilot/CopilotDashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'help',
        name: 'CopilotHelp',
        component: () => import('./views/copilot/CopilotHelp.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'features',
        name: 'CopilotFeatures',
        component: () => import('./views/copilot/CopilotFeatures.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'history',
        name: 'CopilotHistory',
        component: () => import('./views/copilot/CopilotHistory.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'analytics',
        name: 'CopilotAnalytics',
        component: () => import('./views/copilot/CopilotAnalytics.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },

  // Help Center Public Routes (standalone, no authentication required)
  {
    path: '/help',
    name: 'PublicHelpCenter',
    component: () => import('./modules/service/pages/help/PublicHelpCenter.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/help/advanced',
    name: 'HelpCenterAdvanced',
    component: () => import('./modules/service/pages/help/HelpCenter.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/help/article/:slug',
    name: 'PublicArticleDetail',
    component: () => import('./modules/service/pages/help/ArticleDetail.vue'),
    meta: { requiresAuth: false }
  },

  // Widget routes (public)
  {
    path: '/widget',
    name: 'WidgetView',
    component: () => import('./views/EnhancedWidgetView.vue'),
    meta: { requiresAuth: false }
  },

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
    isAuthenticated: !!isAuthenticated,
    toMeta: to.meta,
    toName: to.name
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
  
  const requiresAuth = to.meta?.public ? false : (to.meta?.requiresAuth ?? true)
  const requiresAdmin = to.meta?.requiresAdmin ?? false
  
  console.log('Router guard decision:', {
    path: to.path,
    isPublic: to.meta?.public,
    requiresAuth,
    requiresAdmin,
    isAuthenticated: !!isAuthenticated,
    requiresEmailVerification
  })
  
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
