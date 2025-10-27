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
    <header v-if="isAuthenticated" class="flex w-full z-40 shadow-lg h-15 flex-shrink-0">
      <!-- Left Section (logo + company name) - aligns with sidebar -->
      <div class="w-64 flex items-center px-4 bg-sidebar-bg border-r border-gray-200">
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
      <div v-if="isAuthenticated" class="w-64 bg-sidebar-bg text-gray-700 shadow-lg border-r border-gray-200 hidden md:block overflow-hidden">
        <!-- Navigation (no duplicate branding) -->
        <nav class="pt-2">
          <router-link
            to="/dashboard"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/dashboard', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/dashboard' }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h2V3H3v10zm0 8h2v-6H3v6zm8-16h2v4h-2V5zm0 6h2v4h-2v-4zm0 6h2v4h-2v-4zm8-12h2v4h-2V7zm0 6h2v4h-2v-4zm0 6h2v4h-2v-4z" />
            </svg>
            {{ $t('common.dashboard') }}
          </router-link>

          <router-link
            to="/contacts"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/contacts', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/contacts' }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.97L14.5 12H16v10h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9.5C9 8.12 7.88 7 6.5 7S4 8.12 4 9.5V15H2.5v7h5z" />
            </svg>
            {{ $t('common.contacts') }}
          </router-link>

          <router-link
            to="/companies"
            class="px-6 py-3 flex items-center text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/companies'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/companies') }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
            </svg>
            {{ $t('common.companies') }}
          </router-link>

          <router-link
            to="/deals"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/deals', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/deals' }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 4V2c0-.55-.45-1-1-1s-1 .45-1 1v2H3c-.55 0-1 .45-1 1s.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1V6h2c.55 0 1-.45 1-1s-.45-1-1-1H7zm10 0V2c0-.55-.45-1-1-1s-1 .45-1 1v2h-2c-.55 0-1 .45-1 1s.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1V6h2c.55 0 1-.45 1-1s-.45-1-1-1h-2z" />
            </svg>
            {{ $t('common.deals') }}
          </router-link>

          <router-link
            to="/activities"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/activities', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/activities' }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
            {{ $t('common.activities') }}
          </router-link>

          <router-link
            to="/tasks"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/tasks', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/tasks' }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            {{ $t('common.tasks') }}
          </router-link>

          <router-link
            v-if="hasFeature('manage_campaigns') || currentUserRole === 'admin'"
            to="/campaigns"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/campaigns', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/campaigns' }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
            </svg>
            {{ $t('common.campaigns') }}
          </router-link>

          <router-link
            to="/forms"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/forms', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/forms' }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            {{ $t('common.forms') }}
          </router-link>

          <router-link
            to="/lists"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/lists', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/lists' }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
            </svg>
            {{ $t('common.segments') }}
          </router-link>


          <!-- Marketing Link -->
          <router-link
            to="/marketing"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/marketing'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/marketing') }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
            </svg>
            {{ $t('common.marketing') }}
          </router-link>

          <!-- Sales Platform Link -->
          <router-link
            to="/sales"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/sales'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/sales') }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            Sales Platform
          </router-link>

          <!-- Commerce Platform Link -->
          <router-link
            to="/commerce"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/commerce'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/commerce') }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Commerce Platform
          </router-link>

            <!-- Service Platform Link -->
          <router-link
            to="/service"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/service') || $route.path.startsWith('/help'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/service') && !$route.path.startsWith('/help') }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
            </svg>
            Service Platform
          </router-link>

           <!-- CMS / Content Platform Link -->
          <router-link
            to="/cms"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/cms'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/cms') }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            CMS Hub
          </router-link>

          <!-- Copilot / AI Assistant Link -->
          <router-link
            to="/copilot"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/copilot'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/copilot') }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
            </svg>
            Copilot AI
          </router-link>

          <!-- Users menu (Admin access OR Feature-based access) - Only for verified users -->
          <router-link
            v-if="(hasFeature('manage_users') || currentUserRole === 'admin') && isEmailVerified"
            to="/users"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/users', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/users' }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </svg>
            {{ $t('common.users') }}
          </router-link>

          <router-link
            v-if="hasFeature('system_settings') || currentUserRole === 'admin'"
            to="/settings"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/settings', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/settings' }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
            </svg>
            {{ $t('common.settings') }}
          </router-link>

          <!-- Features Demo (for testing) -->
          <router-link
            to="/features-demo"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/features-demo', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/features-demo' }"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H19V1h-2v1H7V1H5v1H4.5C3.67 2 3 2.67 3 3.5v15C3 19.33 3.67 20 4.5 20h15c.83 0 1.5-.67 1.5-1.5v-15C21 2.67 20.33 2 19.5 2zM19 18H5V8h14v10z" />
            </svg>
            {{ $t('common.features_demo') }}
          </router-link>
        </nav>
      </div>

      <!-- Marketing Sub-menu (shows when on marketing routes) -->
      <div v-if="$route.path.startsWith('/marketing')" class="fixed left-0 top-0 h-full w-64 bg-sidebar-bg z-40 transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- Marketing Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">{{ $t('common.marketing') }}</h2>
              <button
                @click="$router.push('/dashboard')"
                class="text-gray-500 hover:text-primary-purple transition-colors"
                :title="$t('common.back_to_main_menu')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Marketing Navigation -->
          <nav class="flex-1 py-4">
            <router-link
              to="/marketing/overview"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/overview', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/overview' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {{ $t('marketing.overview.title') }}
            </router-link>

            <router-link
              to="/marketing/email"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/email', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/email' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ $t('marketing.email.title') }}
            </router-link>

            <router-link
              to="/marketing/ads"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/ads', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/ads' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h3zM9 4h6V3H9v1zM5 7h14v10H5V7z" />
              </svg>
              {{ $t('marketing.ads.title') }}
            </router-link>

            <router-link
              to="/marketing/events"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/events', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/events' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ $t('marketing.events.title') }}
            </router-link>

            <router-link
              to="/marketing/buyer-intent"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/buyer-intent', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/buyer-intent' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {{ $t('marketing.buyer_intent.title') }}
            </router-link>

            <router-link
              to="/marketing/lead-scoring"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/lead-scoring', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/lead-scoring' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {{ $t('marketing.lead_scoring.title') }}
            </router-link>

            <router-link
              to="/marketing/journeys"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/journeys', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/journeys' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {{ $t('marketing.journeys.title') }}
            </router-link>

            

            <router-link
              to="/marketing/meetings"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/meetings', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/meetings' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {{ $t('marketing.meetings.title') }}
            </router-link>

            <router-link
              to="/marketing/seo"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/marketing/seo'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/marketing/seo') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              SEO Tools
            </router-link>
 
            <router-link
              to="/marketing/social-media"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/social-media', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/social-media' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Social Media
            </router-link>

            <router-link
              to="/marketing/analytics"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/analytics', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/analytics' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ $t('marketing.analytics.title') }}
            </router-link>
          </nav>
        </div>
      </div>

      <!-- Sales Platform Sub-menu (shows when on sales routes) -->
      <div v-if="$route.path.startsWith('/sales')" class="fixed left-0 top-0 h-full w-64 bg-sidebar-bg z-40 transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- Sales Platform Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">Sales Platform</h2>
              <button
                @click="$router.push('/dashboard')"
                class="text-gray-500 hover:text-primary-purple transition-colors"
                title="Back to main menu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Sales Platform Navigation -->
          <nav class="flex-1 py-4">
            <router-link
              to="/sales/overview"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/sales/overview', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/sales/overview' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Overview
            </router-link>

            <router-link
              to="/sales/quotes"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/sales/quotes'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/sales/quotes') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Quotes
            </router-link>

            <router-link
              to="/sales/products"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/sales/products'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/sales/products') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Products
            </router-link>

            <router-link
              to="/sales/quote-templates"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/sales/quote-templates'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/sales/quote-templates') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Templates
            </router-link>

            <router-link
              to="/sales/sequences"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/sales/sequences'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/sales/sequences') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Sequences
            </router-link>

            <router-link
              to="/sales/forecasting"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/sales/forecasting', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/sales/forecasting' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Forecasting
            </router-link>

            <router-link
              to="/sales/lead-assignment"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/sales/lead-assignment', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/sales/lead-assignment' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Lead Assignment
            </router-link>

            <router-link
              to="/sales/documents"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/sales/documents'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/sales/documents') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Documents
            </router-link>
          </nav>
        </div>
      </div>

      <!-- Commerce Platform Sub-menu (shows when on commerce routes) -->
      <div v-if="$route.path.startsWith('/commerce')" class="fixed left-0 top-0 h-full w-64 bg-sidebar-bg z-40 transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- Commerce Platform Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">Commerce Platform</h2>
              <button
                @click="$router.push('/dashboard')"
                class="text-gray-500 hover:text-primary-purple transition-colors"
                title="Back to main menu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Commerce Platform Navigation -->
          <nav class="flex-1 py-4">
            <router-link
              to="/commerce/overview"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/commerce/overview', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/commerce/overview' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Overview
            </router-link>

            <router-link
              to="/commerce/orders"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/commerce/orders'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/commerce/orders') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Orders
            </router-link>

            <router-link
              to="/commerce/payment-links"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/commerce/payment-links'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/commerce/payment-links') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Payment Links
            </router-link>

            <router-link
              to="/commerce/subscription-plans"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/commerce/subscription-plans'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/commerce/subscription-plans') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Subscription Plans
            </router-link>

            <router-link
              to="/commerce/subscriptions"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/commerce/subscriptions'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/commerce/subscriptions') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Subscriptions
            </router-link>

            <router-link
              to="/commerce/branding"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/commerce/branding', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/commerce/branding' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
              Branding
            </router-link>

            <router-link
              to="/commerce/settings"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/commerce/settings', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/commerce/settings' }"
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
      <div v-if="$route.path.startsWith('/service') || $route.path.startsWith('/help')" class="fixed left-0 top-0 h-full w-64 bg-sidebar-bg z-40 transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- Service Platform Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">Service Platform</h2>
              <button
                @click="$router.push('/dashboard')"
                class="text-gray-500 hover:text-primary-purple transition-colors"
                title="Back to main menu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Service Platform Navigation -->
          <nav class="flex-1 py-4">
            <router-link
              to="/service"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              All Tickets
            </router-link>

            <router-link
              to="/service/open"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service/open', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service/open' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Open Tickets
            </router-link>

            <router-link
              to="/service/in-progress"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service/in-progress', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service/in-progress' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              In Progress
            </router-link>

            <router-link
              to="/service/resolved"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service/resolved', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service/resolved' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Resolved Tickets
            </router-link>

            <router-link
              to="/service/closed"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service/closed', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service/closed' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Closed Tickets
            </router-link>

            <router-link
              to="/service/feedback-analytics"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service/feedback-analytics', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service/feedback-analytics' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Feedback Analytics
            </router-link>

            <router-link
              to="/service/email-integration"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service/email-integration', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service/email-integration' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Integration
            </router-link>

            <router-link
              to="/service/live-chat"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/service/live-chat', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/service/live-chat' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/help'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/help') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help Center
            </router-link>

            <router-link
              to="/service/help/admin"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/service/help/admin'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/service/help/admin') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
              Manage Articles
            </router-link>
          </nav>
        </div>
      </div>

      <div v-if="$route.path.startsWith('/cms')" class="fixed left-0 top-0 h-full w-64 bg-sidebar-bg z-40 transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- CMS Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">CMS Hub</h2>
              <button
                @click="$router.push('/dashboard')"
                class="text-gray-500 hover:text-primary-purple transition-colors"
                title="Back to main menu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>
 
          <!-- CMS Navigation -->
          <nav class="flex-1 py-4 overflow-y-auto">
            <router-link
              to="/cms/pages"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/cms/pages' || $route.path.startsWith('/cms/editor'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !($route.path === '/cms/pages' || $route.path.startsWith('/cms/editor')) }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Pages
            </router-link>
 
            <router-link
              to="/cms/templates"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/cms/templates', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/cms/templates' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Templates
            </router-link>
 
            <router-link
              to="/cms/personalization"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/cms/personalization', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/cms/personalization' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personalization
            </router-link>
 
            <router-link
              to="/cms/ab-testing"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/cms/ab-testing', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/cms/ab-testing' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              A/B Testing
            </router-link>
 
            <router-link
              to="/cms/memberships"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/cms/memberships', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/cms/memberships' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Memberships
            </router-link>
          </nav>
        </div>
      </div>

      <!-- Copilot Sub-menu (shows when on copilot routes) -->
      <div v-if="$route.path.startsWith('/copilot')" class="fixed left-0 top-0 h-full w-64 bg-sidebar-bg z-40 transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- Copilot Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">Copilot AI</h2>
              <button
                @click="$router.push('/dashboard')"
                class="text-gray-500 hover:text-primary-purple transition-colors"
                title="Back to main menu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>
 
          <!-- Copilot Navigation -->
          <nav class="flex-1 py-4 overflow-y-auto">
            <router-link
              to="/copilot/dashboard"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/copilot/dashboard', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/copilot/dashboard' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
              </svg>
              Dashboard
            </router-link>
 
            <router-link
              to="/copilot/help"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/copilot/help', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/copilot/help' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help Center
            </router-link>
 
            <router-link
              to="/copilot/features"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/copilot/features', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/copilot/features' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Features
            </router-link>
 
            <router-link
              to="/copilot/history"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/copilot/history', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/copilot/history' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </router-link>
 
            <router-link
              to="/copilot/analytics"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/copilot/analytics', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/copilot/analytics' }"
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
        <nav v-if="!isAuthenticated && !['/', '/login', '/register', '/forgot-password'].includes($route.path)" class="bg-white shadow-sm border-b border-gray-200">
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
    
    <!-- Copilot Chat (floating) -->
    <CopilotChat v-if="isAuthenticated" />
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

const router = useRouter()
const { locale } = useI18n()
const { isAuthenticated, user, userName, userRole, loading, logout, initAuth, isEmailVerified, currentOrgName } = useAuth()
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
  // TODO: Navigate to account details page when created
  // router.push('/account')
}

const goToHelp = () => {
  showProfileDropdown.value = false
  // TODO: Navigate to help/support page when created
  // router.push('/help')
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
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
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


