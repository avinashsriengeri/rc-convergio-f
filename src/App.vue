<template>
  <div id="app" class="bg-gradient-to-br from-[#F8F9FF] to-white flex flex-col" :class="$route.path === '/' ? 'min-h-screen overflow-auto' : 'h-screen overflow-hidden'">
    <!-- Show only login page content for login route - no sidebar/header -->
    <div v-if="$route.path === '/login' || $route.path === '/register' || $route.path === '/forgot-password' || $route.path === '/reset-password' || $route.path === '/verify-notification'" class="min-h-screen">
      <router-view />
      <NotificationToast />
    </div>

    <!-- Authenticated layout for all other routes -->
    <template v-else>
    <!-- Unified Header Bar (for authenticated users) -->
    <header v-if="isAuthenticated && $route.path !== '/widget'" class="flex w-full z-40 shadow-lg h-15 flex-shrink-0"><!-- <header v-if="isAuthenticated" class="flex w-full z-40 shadow-lg h-15 flex-shrink-0"> -->
      <!-- Left Section (logo + company name) - aligns with sidebar -->
      <div class="w-56 flex items-center px-4 bg-sidebar-bg border-r border-gray-200">
        <!-- Mobile menu button -->
        <button class="md:hidden p-2 hover:bg-sidebar-active rounded-lg transition-colors mr-3">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="w-12 h-12 flex items-center justify-center">
          <img src="/src/assets/logo.png" alt="RC Convergio" class="w-12 h-12 object-contain" />
        </div>
        <span class="ml-3 font-semibold text-gray-800 font-inter">RC Convergio</span>
      </div>

      <!-- Right Section (main header actions) - aligns with main content -->
      <div class="flex-1 flex items-center justify-end px-6 bg-sidebar-bg border-l border-gray-200">
        <!-- Right side content -->
        <div class="flex items-center gap-2">
          <!-- Dialer Button -->
          <div class="relative" data-testid="header-dialer">
            <HeaderPill
              :active="showDialerDropdown"
              aria-label="Open dialer"
              @click="toggleDialerDropdown"
            >
              <template #icon>
                <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62,10.79c1.44,2.83,3.76,5.14,6.59,6.59l2.2-2.2c0.27-0.27,0.67-0.36,1.02-0.24 c1.12,0.37,2.33,0.57,3.57,0.57c0.55,0,1,0.45,1,1V20c0,0.55-0.45,1-1,1c-9.39,0-17-7.61-17-17c0-0.55,0.45-1,1-1h3.5 c0.55,0,1,0.45,1,1c0,1.25,0.2,2.45,0.57,3.57c0.11,0.35,0.03,0.74-0.25,1.02L6.62,10.79z" />
                </svg>
              </template>
            </HeaderPill>
            
            <!-- Dialer Dropdown -->
            <div
              v-if="showDialerDropdown"
              @click.stop
              class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            >
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('common.dialer.title') }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ $t('common.dialer.intro') }}</p>
                <button
                  @click="joinWaitlist"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {{ $t('common.actions.join_waitlist') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Notifications Button -->
          <div class="relative" data-testid="header-notifications">
            <HeaderPill
              :active="showNotificationsDropdown"
              :badge-count="unreadNotifications"
              aria-label="Open notifications"
              @click="toggleNotificationsDropdown"
            >
              <template #icon>
                <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,22c1.1,0,2-0.9,2-2h-4C10,21.1,10.9,22,12,22z M18,16v-5c0-3.07-1.64-5.64-4.5-6.32V4 c0-0.83-0.67-1.5-1.5-1.5S10.5,3.17,10.5,4v0.68C7.63,5.36,6,7.92,6,11v5l-2,2v1h16v-1L18,16z" />
                </svg>
              </template>
            </HeaderPill>
            
            <!-- Notifications Dropdown -->
            <div
              v-if="showNotificationsDropdown"
              @click.stop
              class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            >
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('common.notifications.title') }}</h3>
                <p class="text-sm text-gray-600">{{ $t('common.notifications.intro') }}</p>
              </div>
            </div>
          </div>

          <!-- Language Selector -->
          <div class="relative language-dropdown" data-testid="header-language">
            <HeaderPill
              :active="showLanguageDropdown"
              :with-text="true"
              :title="currentLanguage.name"
              aria-label="Select language"
              @click="toggleLanguageDropdown"
            >
              <template #icon>
                <img :src="getFlag(currentLanguage.code)" :alt="currentLanguage.name" class="w-5 h-5 rounded-sm" />
              </template>
              <template #text>
                <span class="text-gray-600 text-sm hidden sm:block">{{ currentLanguage.name }}</span>
                <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </template>
            </HeaderPill>
            
            <!-- Language Dropdown Menu -->
            <div
              v-if="showLanguageDropdown"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            >
              <div class="py-1">
                <button
                  v-for="language in languages"
                  :key="language.code"
                  @click="selectLanguage(language.code)"
                  :class="[
                    'w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors',
                    currentLanguage.code === language.code ? 'bg-blue-50 text-blue-700' : ''
                  ]"
                >
                  <img :src="getFlag(language.code)" :alt="language.name" class="w-5 h-5 rounded-sm" />
                  <span>{{ language.name }}</span>
                  <svg
                    v-if="currentLanguage.code === language.code"
                    class="w-4 h-4 text-blue-600 ml-auto"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Profile Dropdown -->
          <div class="relative profile-dropdown" data-testid="header-profile">
            <HeaderPill
              :active="showProfileDropdown"
              aria-label="Open profile menu"
              @click="toggleProfileDropdown"
            >
              <template #icon>
                <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
                  <span class="text-gray-700 font-medium text-xs">{{ user && user.name ? user.name.charAt(0) : 'U' }}</span>
                </div>
              </template>
            </HeaderPill>
            
            <!-- Dropdown Menu -->
            <div
              v-if="showProfileDropdown"
              class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            >
              <!-- User Info -->
              <div class="p-4 border-b border-gray-100">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-r from-primary-purple to-primary-pink rounded-full flex items-center justify-center">
                    <span class="text-white font-medium text-lg">{{ user && user.name ? user.name.charAt(0) : 'U' }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-900 truncate">{{ user && user.name ? user.name : 'User' }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ user && user.email ? user.email : 'user@example.com' }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Menu Items -->
              <div class="py-1">
                <button
                  @click="goToProfile"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                  </svg>
                  {{ $t('common.profile') }} & Preferences
                </button>
                <button
                  @click="goToAccountDetails"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  {{ $t('common.account_details') }}
                </button>
                <button
                  @click="goToHelp"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45,12.9,13,13.5,13,15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2,.9-2,2H8c0-2.21,1.79-4,4-4s4,1.79,4,4c0,.88-.36,1.68-.93,2.25z" />
                  </svg>
                  {{ $t('common.help') }} / Support
                </button>
                <div class="border-t border-gray-100 my-1"></div>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                  </svg>
                  {{ $t('common.logout') }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Products Launcher -->
          <ProductsLauncher data-testid="header-products" />
          
          <!-- Company Account -->
          <div data-testid="header-company">
            <HeaderPill
              :with-text="true"
              :title="currentOrgName"
              aria-label="Company information"
            >
              <template #text>
                <span class="hidden sm:inline text-gray-800 text-sm font-medium truncate max-w-[140px] sm:max-w-[200px] md:max-w-[260px]" :title="currentOrgName">{{ currentOrgName }}</span>
                <span class="sm:hidden text-gray-800 text-sm font-medium" title="RC">RC</span>
              </template>
            </HeaderPill>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Layout -->
        <div class="flex flex-1" :class="isAuthenticated ? 'overflow-auto' : ($route.path === '/' ? 'overflow-auto' : 'overflow-hidden')">
      <!-- Sidebar (for authenticated users) -->
      <!-- <div v-if="isAuthenticated" class="w-56 bg-sidebar-bg text-gray-700 shadow-lg border-r border-gray-200 hidden md:block overflow-hidden"> -->
        <div v-if="isAuthenticated && $route.path !== '/widget'" class="w-56 bg-sidebar-bg text-gray-700 shadow-lg border-r border-gray-200 hidden md:block overflow-hidden">
        <!-- Navigation (no duplicate branding) -->
        <nav class="pt-2 overflow-y-auto max-h-screen sidebar-scrollbar">
          <router-link
            to="/dashboard"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/dashboard', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/dashboard' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            {{ $t('common.dashboard') }}
          </router-link>

          <router-link
            to="/contacts"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/contacts', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/contacts' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {{ $t('common.contacts') }}
          </router-link>

          <router-link
            to="/companies"
            class="px-6 py-3 flex items-center text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/companies'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/companies') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M3 21h18"/>
              <path d="M5 21V7l8-4v18"/>
              <path d="M19 21V9.5l-6-3.5"/>
              <path d="M9 9v.01"/>
              <path d="M9 12v.01"/>
              <path d="M9 15v.01"/>
              <path d="M9 18v.01"/>
            </svg>
            {{ $t('common.companies') }}
          </router-link>

          <router-link
            to="/deals"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/deals', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/deals' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14.1a3.2 3.2 0 0 0 0 4.2c.8.8 2.1.8 2.8 0l1.7-1.7"/>
              <path d="M13 12h-2a2 2 0 1 0 0 4h3c.6 0 1.1-.2 1.4-.6L21 9.9a3.2 3.2 0 0 0 0-4.2c-.8-.8-2.1-.8-2.8 0l-1.7 1.7"/>
            </svg>
            {{ $t('common.deals') }}
          </router-link>

          <router-link
            to="/activities"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/activities', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/activities' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            {{ $t('common.activities') }}
          </router-link>

          <router-link
            to="/tasks"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/tasks', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/tasks' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <polyline points="9,11 12,14 22,4"/>
              <path d="M21,12v7a2,2 0 0,1 -2,2H5a2,2 0 0,1 -2,-2V5a2,2 0 0,1 2,-2h11"/>
            </svg>
            {{ $t('common.tasks') }}
          </router-link>

          <router-link
            v-if="hasFeature('manage_campaigns') || currentUserRole === 'admin'"
            to="/campaigns"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/campaigns', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/campaigns' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            {{ $t('common.campaigns') }}
          </router-link>

          <router-link
            to="/forms"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/forms', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/forms' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
            {{ $t('common.forms') }}
          </router-link>

          <router-link
            to="/lists"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/lists', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/lists' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M3 6h18M3 12h18M3 18h18"/>
              <circle cx="6" cy="6" r="1" fill="currentColor"/>
              <circle cx="6" cy="12" r="1" fill="currentColor"/>
              <circle cx="6" cy="18" r="1" fill="currentColor"/>
            </svg>
            {{ $t('common.segments') }}
          </router-link>


          <!-- Marketing Link -->
          <router-link
            to="/marketing"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/marketing'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/marketing') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
            {{ $t('common.marketing') }}
          </router-link>

          <!-- Sales Platform Link -->
          <router-link
            to="/sales"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/sales'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/sales') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            {{ $t('common.sales') }}
          </router-link>

          <!-- Commerce Platform Link -->
          <router-link
            to="/commerce"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/commerce'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/commerce') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {{ $t('common.commerce') }}
          </router-link>

            <!-- Service Platform Link -->
          <router-link
            to="/service"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/service') || $route.path.startsWith('/help'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/service') && !$route.path.startsWith('/help') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
            </svg>
            {{ $t('common.service') }}
          </router-link>

           <!-- CMS / Content Platform Link -->
          <router-link
            to="/cms"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/cms'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/cms') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            {{ $t('common.cms') }}
          </router-link>

          <!-- RC Maxi / AI Assistant Link -->
          <router-link
            to="/copilot"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/copilot'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/copilot') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M12 3l1.912 5.813L20 10.721l-5.813 1.912L12 21l-1.912-5.813L4 13.279l5.813-1.912z"/>
              <circle cx="12" cy="12" r="1" fill="currentColor"/>
            </svg>
            {{ $t('common.rc_maxi') }}
          </router-link>

          <!-- Users menu (Admin access OR Feature-based access) - Only for verified users -->
          <router-link
            v-if="(hasFeature('manage_users') || currentUserRole === 'admin') && isEmailVerified"
            to="/users"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/users', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/users' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {{ $t('common.users') }}
          </router-link>

          <router-link
            v-if="hasFeature('system_settings') || currentUserRole === 'admin'"
            to="/settings"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/settings', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/settings' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            {{ $t('common.settings') }}
          </router-link>

          <!-- Super Admin Dropdown Menu -->
          <div v-if="isSuperAdmin" class="mx-4 my-1 super-admin-dropdown">
            <button
              @click="showSuperAdminDropdown = !showSuperAdminDropdown"
              class="w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm': $route.path.startsWith('/super-admin'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm': !$route.path.startsWith('/super-admin') }"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <span>Super Admin</span>
              </div>
              <svg 
                class="w-4 h-4 transition-transform duration-200" 
                :class="{ 'rotate-180': showSuperAdminDropdown }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Dropdown Submenu -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div
                v-if="showSuperAdminDropdown"
                class="overflow-hidden"
              >
                <div class="pl-4 pt-1 space-y-1">
                  <router-link
                    to="/super-admin"
                    @click="showSuperAdminDropdown = false"
                    class="flex items-center px-6 py-2.5 text-sm rounded-lg transition-all duration-200"
                    :class="{ 'bg-sidebar-active text-primary-purple shadow-sm': $route.path === '/super-admin', 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active': $route.path !== '/super-admin' }"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    Dashboard
                  </router-link>
                  <router-link
                    to="/super-admin/tenants"
                    @click="showSuperAdminDropdown = false"
                    class="flex items-center px-6 py-2.5 text-sm rounded-lg transition-all duration-200"
                    :class="{ 'bg-sidebar-active text-primary-purple shadow-sm': $route.path === '/super-admin/tenants', 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active': $route.path !== '/super-admin/tenants' }"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/>
                    </svg>
                    Tenants
                  </router-link>
                  <router-link
                    to="/super-admin/users"
                    @click="showSuperAdminDropdown = false"
                    class="flex items-center px-6 py-2.5 text-sm rounded-lg transition-all duration-200"
                    :class="{ 'bg-sidebar-active text-primary-purple shadow-sm': $route.path === '/super-admin/users', 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active': $route.path !== '/super-admin/users' }"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Users
                  </router-link>
                  <router-link
                    to="/super-admin/statistics"
                    @click="showSuperAdminDropdown = false"
                    class="flex items-center px-6 py-2.5 text-sm rounded-lg transition-all duration-200"
                    :class="{ 'bg-sidebar-active text-primary-purple shadow-sm': $route.path === '/super-admin/statistics', 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active': $route.path !== '/super-admin/statistics' }"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path d="M3 3v18h18M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                    </svg>
                    Statistics
                  </router-link>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Features Demo (for testing) -->
          <router-link
            to="/features-demo"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/features-demo', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/features-demo' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M9 2v4M15 2v4M9 18v4M15 18v4M20 9h-4M20 14h-4M4 9h4M4 14h4"/>
              <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
            {{ $t('common.features_demo') }}
          </router-link>
        </nav>
      </div>

      <!-- Marketing Sub-menu (shows when on marketing routes) -->
      <div v-if="$route.path.startsWith('/marketing')" class="fixed left-0 top-0 h-full w-56 bg-sidebar-bg z-40 transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- Marketing Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">{{ $t('common.marketing') }}</h2>
              <button
                @click="$router.push('/dashboard')"
                class="text-gray-700 hover:text-primary-purple transition-colors"
                :title="$t('common.back_to_main_menu')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Marketing Navigation -->
          <nav class="flex-1 py-4 overflow-y-auto sidebar-scrollbar">
            <router-link
              to="/marketing/overview"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/overview', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/overview' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              {{ $t('marketing.overview.title') }}
            </router-link>

            <router-link
              to="/marketing/email"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/email', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/email' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              {{ $t('marketing.email.title') }}
            </router-link>

            <router-link
              to="/marketing/ads"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/ads', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/ads' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <rect x="6" y="3" width="12" height="18" rx="2" ry="2"/>
                <line x1="9" y1="9" x2="15" y2="9"/>
                <line x1="9" y1="12" x2="15" y2="12"/>
                <line x1="9" y1="15" x2="13" y2="15"/>
              </svg>
              {{ $t('marketing.ads.title') }}
            </router-link>

            <router-link
              to="/marketing/events"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/events', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/events' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <rect x="8" y="14" width="4" height="4"/>
              </svg>
              {{ $t('marketing.events.title') }}
            </router-link>

            <router-link
              to="/marketing/buyer-intent"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/buyer-intent', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/buyer-intent' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
              {{ $t('marketing.buyer_intent.title') }}
            </router-link>

            <router-link
              to="/marketing/lead-scoring"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/lead-scoring', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/lead-scoring' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
              </svg>
              {{ $t('marketing.lead_scoring.title') }}
            </router-link>

            <router-link
              to="/marketing/journeys"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/journeys', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/journeys' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <circle cx="5" cy="6" r="3"/>
                <path d="M5 9v6"/>
                <circle cx="5" cy="18" r="3"/>
                <path d="M12 3a3 3 0 1 0 3 3 3 3 0 0 0-3-3z"/>
                <path d="M12 8v8"/>
                <circle cx="12" cy="19" r="3"/>
                <path d="M19 3a3 3 0 1 0 3 3 3 3 0 0 0-3-3z"/>
                <path d="M19 8v8"/>
                <circle cx="19" cy="19" r="3"/>
              </svg>
              {{ $t('marketing.journeys.title') }}
            </router-link>

            

            <router-link
              to="/marketing/meetings"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/meetings', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/meetings' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              {{ $t('marketing.meetings.title') }}
            </router-link>

            <router-link
              to="/marketing/seo"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/marketing/seo'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/marketing/seo') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              SEO Tools
            </router-link>
 
            <router-link
              to="/marketing/social-media"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/social-media', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/social-media' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Social Media
            </router-link>

            <router-link
              to="/marketing/analytics"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/analytics', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/analytics' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                <path d="M22 12A10 10 0 0 0 12 2v10z"/>
              </svg>
              {{ $t('marketing.analytics.title') }}
            </router-link>
          </nav>
        </div>
      </div>

      <!-- Sales Platform Sub-menu (shows when on sales routes) -->
      <div v-if="$route.path.startsWith('/sales')" class="fixed left-0 top-0 h-full w-56 bg-sidebar-bg z-40 transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- Sales Platform Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">{{ $t('sales.overview.title') }}</h2>
              <button
                @click="$router.push('/dashboard')"
                class="text-gray-700 hover:text-primary-purple transition-colors"
                title="Back to main menu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Sales Platform Navigation -->
          <nav class="flex-1 py-4 overflow-y-auto sidebar-scrollbar">
            <router-link
              to="/sales/overview"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/sales/overview', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/sales/overview' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
              </svg>
              {{ $t('sales.overview.title') }}
            </router-link>

            <router-link
              to="/sales/quotes"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/sales/quotes'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/sales/quotes') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              {{ $t('sales.quotes.title') }}
            </router-link>

            <router-link
              to="/sales/products"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/sales/products'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/sales/products') }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2L2,7L12,12L22,7L12,2M2,17L12,22L22,17V10L12,15L2,10V17Z"/>
              </svg>
              {{ $t('sales.products.title') }}
            </router-link>

            <router-link
              to="/sales/quote-templates"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/sales/quote-templates'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/sales/quote-templates') }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
              </svg>
              {{ $t('sales.templates_nav') }}
            </router-link>

            <router-link
              to="/sales/sequences"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/sales/sequences'), 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/sales/sequences') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              {{ $t('sales.sequences.title') }}
            </router-link>

            <router-link
              to="/sales/forecasting"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/sales/forecasting', 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/sales/forecasting' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {{ $t('sales.forecasting.title') }}
            </router-link>

            <router-link
              to="/sales/lead-assignment"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/sales/lead-assignment', 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/sales/lead-assignment' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {{ $t('sales.lead_assignment.title') }}
            </router-link>

            <router-link
              to="/sales/documents"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/sales/documents'), 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/sales/documents') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {{ $t('sales.documents.title') }}
            </router-link>
          </nav>
        </div>
      </div>

      <!-- Commerce Platform Sub-menu (shows when on commerce routes) -->
      <div v-if="$route.path.startsWith('/commerce')" class="fixed left-0 top-0 h-full w-56 bg-sidebar-bg z-40 transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- Commerce Platform Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">{{ $t('commerce.overview.title') }}</h2>
              <button
                @click="$router.push('/dashboard')"
                class="text-gray-700 hover:text-primary-purple transition-colors"
                title="Back to main menu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Commerce Platform Navigation -->
          <nav class="flex-1 py-4 overflow-y-auto sidebar-scrollbar">
            <router-link
              to="/commerce/overview"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/commerce/overview', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/commerce/overview' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7,18C5.9,18 5,18.9 5,20S5.9,22 7,22 9,21.1 9,20 8.1,18 7,18M1,2V4H3L6.6,11.59L5.25,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75L7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.59 17.3,11.97L20.88,5H5.21L4.27,3H1M17,18C15.9,18 15,18.9 15,20S15.9,22 17,22 19,21.1 19,20 18.1,18 17,18Z"/>
              </svg>
              {{ $t('sales.overview.title') }}
            </router-link>

            <router-link
              to="/commerce/orders"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/commerce/orders'), 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/commerce/orders') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Orders
            </router-link>

            <router-link
              to="/commerce/payment-links"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/commerce/payment-links'), 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/commerce/payment-links') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Payment Links
            </router-link>

            <router-link
              to="/commerce/subscription-plans"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/commerce/subscription-plans'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/commerce/subscription-plans') }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,19.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,19.54Z"/>
              </svg>
              Subscription Plans
            </router-link>

            <router-link
              to="/commerce/subscriptions"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/commerce/subscriptions'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/commerce/subscriptions') }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17,17H7V14L3,18L7,22V19H19A2,2 0 0,0 21,17V13H19V17M7,7H17V10L21,6L17,2V5H5A2,2 0 0,0 3,7V11H5V7Z"/>
              </svg>
              Subscriptions
            </router-link>

            <router-link
              to="/commerce/branding"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/commerce/branding', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/commerce/branding' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z"/>
              </svg>
              Branding
            </router-link>

            <router-link
              to="/commerce/settings"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/commerce/settings', 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/commerce/settings' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </router-link>
          </nav>
        </div>
      </div>

       <!-- Service Platform Sub-menu (shows when on service routes or help center) -->
      <div v-if="$route.path.startsWith('/service') || $route.path.startsWith('/help')" class="fixed left-0 top-0 h-full w-56 bg-sidebar-bg z-40 transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- Service Platform Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">{{ $t('service.overview.title') }}</h2>
              <button
                @click="$router.push('/dashboard')"
                class="text-gray-700 hover:text-primary-purple transition-colors"
                title="Back to main menu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Service Platform Navigation -->
          <nav class="flex-1 py-4 overflow-y-auto sidebar-scrollbar">
            <router-link
              to="/service"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12Z"/>
              </svg>
              All Tickets
            </router-link>

            <router-link
              to="/service/open"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service/open', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service/open' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
              </svg>
              Open Tickets
            </router-link>

            <router-link
              to="/service/in-progress"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service/in-progress', 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service/in-progress' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              In Progress
            </router-link>

            <router-link
              to="/service/resolved"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service/resolved', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service/resolved' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
              </svg>
              Resolved Tickets
            </router-link>

            <router-link
              to="/service/closed"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service/closed', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service/closed' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
              </svg>
              Closed Tickets
            </router-link>

            <router-link
              to="/service/feedback-analytics"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service/feedback-analytics', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service/feedback-analytics' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10.08L23,10M1,21H5V9H1V21Z"/>
              </svg>
              Feedback Analytics
            </router-link>

            <router-link
              to="/service/email-integration"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service/email-integration', 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service/email-integration' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Integration
            </router-link>

            <router-link
              to="/service/live-chat"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service/live-chat', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service/live-chat' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5L6,21V18.5C4.5,17.3 3.5,15.8 3.5,14.1C3.5,13.4 3.6,12.7 3.8,12C4.1,7.9 7.7,5 12,5C16.3,5 19.9,7.9 20.2,12C20.4,12.7 20.5,13.4 20.5,14.1C20.5,15.8 19.5,17.3 18,18.5V21L15.53,18.5C14.43,18.82 13.24,19 12,19Z"/>
              </svg>
              Live Chat
            </router-link>

            <!-- Help Center Section -->
            <div class="mt-6 mb-2">
              <div class="px-6 py-2">
                <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Knowledge Base</h3>
              </div>
            </div>

            <router-link
              to="/help"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/help'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/help') }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z"/>
              </svg>
              Help Center
            </router-link>

            <router-link
              to="/service/help/admin"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/service/help/admin'), 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/service/help/admin') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
              Manage Articles
            </router-link>
          </nav>
        </div>
      </div>

      <div v-if="$route.path.startsWith('/cms')" class="fixed left-0 top-0 h-full w-56 bg-sidebar-bg z-40 transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- CMS Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">{{ $t('cms.pages.title') }}</h2>
              <button
                @click="$router.push('/dashboard')"
                class="text-gray-700 hover:text-primary-purple transition-colors"
                title="Back to main menu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>
 
          <!-- CMS Navigation -->
          <nav class="flex-1 py-4 overflow-y-auto sidebar-scrollbar">
            <router-link
              to="/cms/pages"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/cms/pages' || $route.path.startsWith('/cms/editor'), 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !($route.path === '/cms/pages' || $route.path.startsWith('/cms/editor')) }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Pages
            </router-link>
 
            <router-link
              to="/cms/templates"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/cms/templates', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/cms/templates' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
              </svg>
              {{ $t('cms.templates.title') }}
            </router-link>
 
            <router-link
              to="/cms/personalization"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/cms/personalization', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/cms/personalization' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14M17.5,9.5L19,11L15,15L13,13L14.5,11.5L15,12L17.5,9.5Z"/>
              </svg>
              Personalization
            </router-link>
 
            <router-link
              to="/cms/ab-testing"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/cms/ab-testing', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/cms/ab-testing' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,20A2,2 0 0,1 12,22A2,2 0 0,1 10,20A2,2 0 0,1 12,18A2,2 0 0,1 14,20M12,2A2,2 0 0,1 14,4A2,2 0 0,1 12,6A2,2 0 0,1 10,4A2,2 0 0,1 12,2M20,12A2,2 0 0,1 22,14A2,2 0 0,1 20,16A2,2 0 0,1 18,14A2,2 0 0,1 20,12M4,12A2,2 0 0,1 6,14A2,2 0 0,1 4,16A2,2 0 0,1 2,14A2,2 0 0,1 4,12M6.34,6.34L12,12L17.66,6.34L19.07,7.75L13.41,13.41L12,12L6.34,17.66L4.93,16.24L10.59,10.59L12,12L17.66,17.66L16.24,19.07L10.59,13.41L12,12L6.34,6.34L7.75,4.93L13.41,10.59L12,12Z"/>
              </svg>
              A/B Testing
            </router-link>
 
            <router-link
              to="/cms/memberships"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/cms/memberships', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/cms/memberships' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16,4C16.88,4 17.67,4.38 18.18,5C18.69,4.38 19.48,4 20.36,4C21.8,4 23,5.2 23,6.64C23,8.09 21.8,9.29 20.36,9.29C19.48,9.29 18.69,8.91 18.18,8.29C17.67,8.91 16.88,9.29 16,9.29C14.56,9.29 13.36,8.09 13.36,6.64C13.36,5.2 14.56,4 16,4M12.5,11.5C14.69,11.5 16.5,13.31 16.5,15.5V16.5H8.5V15.5C8.5,13.31 10.31,11.5 12.5,11.5M12.5,9.5C10.29,9.5 8.5,7.71 8.5,5.5C8.5,3.29 10.29,1.5 12.5,1.5C14.71,1.5 16.5,3.29 16.5,5.5C16.5,7.71 14.71,9.5 12.5,9.5M6,10V7H4V10H1V12H4V15H6V12H9V10H6Z"/>
              </svg>
              Memberships
            </router-link>
          </nav>
        </div>
      </div>

      <!-- RC Maxi Sub-menu (shows when on copilot routes) -->
      <div v-if="$route.path.startsWith('/copilot')" class="fixed left-0 top-0 h-full w-56 bg-sidebar-bg z-40 transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- RC Maxi Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">RC Maxi</h2>
              <button
                @click="$router.push('/dashboard')"
                class="text-gray-700 hover:text-primary-purple transition-colors"
                title="Back to main menu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>
 
          <!-- RC Maxi Navigation -->
          <nav class="flex-1 py-4 overflow-y-auto sidebar-scrollbar">
            <router-link
              to="/copilot/dashboard"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/copilot/dashboard', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/copilot/dashboard' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21,16V4H3V16H21M21,2A2,2 0 0,1 23,4V16A2,2 0 0,1 21,18H14L16,21V22H8V21L10,18H3A2,2 0 0,1 1,16V4A2,2 0 0,1 3,2H21Z"/>
              </svg>
              Dashboard
            </router-link>
 
            <router-link
              to="/copilot/help"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/copilot/help', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/copilot/help' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.68 6.5,20.68C8.45,20.68 10.55,21.1 12,22C13.35,21.15 15.8,20.68 17.5,20.68C19.15,20.68 20.85,20.95 22.25,21.58C22.35,21.58 22.4,21.66 22.5,21.66C22.75,21.66 23,21.41 23,21.16V6.5C22.4,6.05 21.75,5.75 21,5.5V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,18.9 12,19.9C10.65,18.9 8.2,18.5 6.5,18.5C5.3,18.5 4.1,18.65 3,19V6.5C4.05,5.85 5.25,5.5 6.5,5.5C8.2,5.5 10.65,5.9 12,6.9C13.35,5.9 15.8,5.5 17.5,5.5V5.5C18.6,5.5 19.65,5.65 20.5,6V6.5C21,6.05 21.75,5.75 22.5,5.5C22.4,5.05 21.75,4.75 21,4.5V5.5C19.9,4.85 18.7,4.5 17.5,4.5C15.8,4.5 13.35,4.9 12,5.9C10.65,4.9 8.2,4.5 6.5,4.5C4.55,4.5 2.45,4.9 1,6V6.5C2.05,5.85 4.05,5.4 6.5,5Z"/>
              </svg>
              Help Center
            </router-link>
 
            <router-link
              to="/copilot/features"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/copilot/features', 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/copilot/features' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Features
            </router-link>
 
            <router-link
              to="/copilot/history"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/copilot/history', 'text-gray-800 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/copilot/history' }"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3"/>
              </svg>
              History
            </router-link>
 
            <router-link
              to="/copilot/analytics"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/copilot/analytics', 'text-gray-700 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/copilot/analytics' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </router-link>
          </nav>
        </div>
      </div>

      <!-- Main content area -->
        <div class="flex-1 flex flex-col" :class="isAuthenticated ? 'overflow-auto' : ($route.path === '/' ? 'overflow-auto' : 'h-full overflow-hidden')">
        <!-- Top navigation (for unauthenticated users, excluding login page) -->
        <!-- <nav v-if="!isAuthenticated && !['/', '/login', '/register', '/forgot-password'].includes($route.path)" class="bg-white shadow-sm border-b border-gray-200"> -->
          <nav v-if="!isAuthenticated && !['/', '/login', '/register', '/forgot-password', '/widget'].includes($route.path)" class="bg-white shadow-sm border-b border-gray-200">  
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
              <div class="flex items-center">
                <router-link to="/" class="flex items-center space-x-3">
                  <div class="w-12 h-12 flex items-center justify-center">
                    <img src="/src/assets/logo.png" alt="RC Convergio" class="w-12 h-12 object-contain" />
                  </div>
                  <span class="text-xl font-bold text-gray-900">RC Convergio</span>
                </router-link>
              </div>
              <div class="flex items-center space-x-4">
                <router-link
                  to="/"
                  class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-purple transition-colors"
                  :class="{ 'text-primary-purple': $route.path === '/' }"
                >
                  Home
                </router-link>
                <router-link
                  to="/login"
                  class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-purple transition-colors"
                  :class="{ 'text-primary-purple': $route.path === '/login' }"
                >
                  Login
                </router-link>
              </div>
            </div>
          </div>
        </nav>

        <!-- Main content -->
        <main class="flex-1" :class="isAuthenticated ? 'overflow-auto' : ($route.path === '/' ? 'overflow-auto' : 'h-full overflow-hidden')">
          <router-view />
        </main>
      </div>
    </div>

    <!-- Notification toasts -->
    <NotificationToast />
    
    <!-- RC Maxi Chat (floating) -->
    <CopilotChat v-if="isAuthenticated" />

    <!-- Coming Soon Modal -->
    <div
      v-if="showComingSoonModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="closeComingSoonModal"
    >
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center" @click.stop>
          <!-- Close button -->
          <button
            @click="closeComingSoonModal"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Icon -->
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-[#2596be] to-[#973894] mb-4">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <!-- Content -->
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Coming Soon!</h3>
          <p class="text-gray-600 mb-6">
            This feature is currently under development and will be available soon. Stay tuned!
          </p>

          <!-- Button -->
          <button
            @click="closeComingSoonModal"
            class="w-full bg-gradient-to-r from-[#2596be] to-[#973894] hover:from-[#1d7a9f] hover:to-[#7d2d7a] text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { useClickOutside } from '@/composables/useClickOutside'
import ProductsLauncher from '@/components/ProductsLauncher.vue'
import { useFeatures } from '@/composables/useFeatures'
import { useRealTimeUpdates } from '@/composables/useRealTimeUpdates'
import { useNotifications } from '@/composables/useNotifications'
import { languages, changeLanguage } from '@/i18n.js'
import BaseButton from '@/components/ui/BaseButton.vue'
import NotificationToast from '@/components/ui/NotificationToast.vue'
import HeaderPill from '@/components/ui/HeaderPill.vue'
import CopilotChat from '@/components/copilot/CopilotChat.vue'
// Lucide Icons
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Handshake, 
  Calendar, 
  CheckSquare, 
  Megaphone, 
  FileText, 
  List, 
  TrendingUp, 
  ShoppingCart, 
  Star, 
  Headphones, 
  Globe, 
  Brain, 
  UserCog, 
  Settings, 
  TestTube,
  BarChart3,
  Mail,
  Zap,
  CalendarDays,
  Target,
  GitBranch,
  Users2,
  Search,
  MessageSquare,
  PieChart,
  FileBarChart,
  Package,
  Layers,
  Repeat,
  Palette,
  Ticket,
  Clock,
  Shield,
  XCircle,
  ThumbsUp,
  MessageCircle,
  HelpCircle,
  Copy,
  UserCheck,
  Shuffle,
  Group,
  Monitor,
  BookOpen,
  History
} from 'lucide-vue-next'

const router = useRouter()
const { locale } = useI18n()
const { isAuthenticated, user, userName, userRole, loading, logout, initAuth, isEmailVerified, currentOrgName, isSuperAdmin } = useAuth()
const { hasFeature, isReady: featuresReady } = useFeatures()
const { success, error } = useNotifications()

// Profile dropdown state
const showProfileDropdown = ref(false)

// Language dropdown state
const showLanguageDropdown = ref(false)

// Dialer dropdown state
const showDialerDropdown = ref(false)

// Notifications dropdown state
const showNotificationsDropdown = ref(false)
const unreadNotifications = ref(3) // Mock unread count

// Super Admin dropdown state
const showSuperAdminDropdown = ref(false)

// Auto-open Super Admin dropdown if on super-admin route
watch(() => router.currentRoute.value.path, (newPath) => {
  if (newPath.startsWith('/super-admin') && isSuperAdmin.value) {
    showSuperAdminDropdown.value = true
  }
}, { immediate: true })

// Modal states
const showComingSoonModal = ref(false)

// Marketing navigation is now handled by router-based sub-menu

const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === locale.value) || languages[0]
})

// User role for conditional menu rendering (kept for backward compatibility)
const currentUserRole = computed(() => userRole.value)

// Initialize auth state on app mount
onMounted(() => {
  initAuth()
})

// Initialize real-time updates
useRealTimeUpdates()

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
}

const toggleLanguageDropdown = () => {
  showLanguageDropdown.value = !showLanguageDropdown.value
}

const toggleDialerDropdown = () => {
  showDialerDropdown.value = !showDialerDropdown.value
}

const toggleNotificationsDropdown = () => {
  showNotificationsDropdown.value = !showNotificationsDropdown.value
  // Hide badge after opening notifications
  if (showNotificationsDropdown.value) {
    unreadNotifications.value = 0
  }
}

// Marketing dropdown functions removed - now using router-based sub-menu


const selectLanguage = (languageCode) => {
  changeLanguage(languageCode)
  showLanguageDropdown.value = false
  success(`Language changed to ${languages.find(lang => lang.code === languageCode)?.name}`)
}

const getFlag = (code) => {
  return `/flags/${code}.svg`
}

const joinWaitlist = () => {
  showDialerDropdown.value = false
  window.open('https://reliancecorporation.co.za/rc-dialer', '_blank', 'noopener,noreferrer')
}

const goToProfile = () => {
  showProfileDropdown.value = false
  router.push('/profile')
}

const goToAccountDetails = () => {
  showProfileDropdown.value = false
  showComingSoonModal.value = true
}

const goToHelp = () => {
  showProfileDropdown.value = false
  router.push('/support')
}

const closeComingSoonModal = () => {
  showComingSoonModal.value = false
}

const handleLogout = async () => {
  try {
    showProfileDropdown.value = false
    await logout()
    success('Logged out successfully')
    router.push('/login')
  } catch (err) {
    error('Failed to logout')
  }
}

// Close dropdown when clicking outside
const closeDropdown = (event) => {
  if (!event.target.closest('.profile-dropdown')) {
    showProfileDropdown.value = false
  }
  if (!event.target.closest('.language-dropdown')) {
    showLanguageDropdown.value = false
  }
  if (!event.target.closest('[data-testid="header-dialer"]')) {
    showDialerDropdown.value = false
  }
  if (!event.target.closest('[data-testid="header-notifications"]')) {
    showNotificationsDropdown.value = false
  }
  if (!event.target.closest('.super-admin-dropdown')) {
    // Only close if not navigating to a super-admin route
    if (!router.currentRoute.value.path.startsWith('/super-admin')) {
      showSuperAdminDropdown.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

// Cleanup event listener on unmount
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 400;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
}

.font-semibold {
  font-weight: 600;
}

.font-medium {
  font-weight: 500;
}

/* Custom scrollbar - thin with standard colors */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Sidebar specific scrollbar styling */
.sidebar-scrollbar::-webkit-scrollbar {
  width: 2px;
}

.sidebar-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Hide scrollbar for dashboard main content */
.scrollbar-hide {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Safari and Chrome */
}
</style>


