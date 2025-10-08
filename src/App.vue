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
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
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
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
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
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
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
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                  {{ $t('common.profile') }} & Preferences
                </button>
                <button
                  @click="goToAccountDetails"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ $t('common.account_details') }}
                </button>
                <button
                  @click="goToHelp"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ $t('common.help') }} / Support
                </button>
                <div class="border-t border-gray-100 my-1"></div>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
            </svg>
            {{ $t('common.dashboard') }}
          </router-link>

          <router-link
            to="/contacts"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/contacts', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/contacts' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {{ $t('common.contacts') }}
          </router-link>

          <router-link
            to="/companies"
            class="px-6 py-3 flex items-center text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/companies'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/companies') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {{ $t('common.companies') }}
          </router-link>

          <router-link
            to="/deals"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/deals', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/deals' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            {{ $t('common.deals') }}
          </router-link>

          <router-link
            to="/activities"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/activities', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/activities' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ $t('common.activities') }}
          </router-link>

          <router-link
            to="/tasks"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/tasks', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/tasks' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            {{ $t('common.tasks') }}
          </router-link>

          <router-link
            v-if="hasFeature('manage_campaigns') || currentUserRole === 'admin'"
            to="/campaigns"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/campaigns', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/campaigns' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            {{ $t('common.campaigns') }}
          </router-link>

          <router-link
            to="/forms"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/forms', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/forms' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ $t('common.forms') }}
          </router-link>

          <router-link
            to="/lists"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/lists', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/lists' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {{ $t('common.segments') }}
          </router-link>

          <!-- Marketing Link -->
          <router-link
            to="/marketing"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/marketing'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/marketing') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {{ $t('common.marketing') }}
          </router-link>

          <!-- Sales Platform Link -->
          <router-link
            to="/sales"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/sales'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/sales') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Sales Platform
          </router-link>

          <!-- Users menu (Admin access OR Feature-based access) - Only for verified users -->
          <router-link
            v-if="(hasFeature('manage_users') || currentUserRole === 'admin') && isEmailVerified"
            to="/users"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/users', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/users' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            {{ $t('common.users') }}
          </router-link>

          <router-link
            v-if="hasFeature('system_settings') || currentUserRole === 'admin'"
            to="/settings"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/settings', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/settings' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            {{ $t('common.settings') }}
          </router-link>

          <!-- Features Demo (for testing) -->
          <router-link
            to="/features-demo"
            class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
            :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/features-demo', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/features-demo' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ $t('marketing.meetings.title') }}
            </router-link>

            <router-link
              to="/marketing/analytics"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/marketing/analytics', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/marketing/analytics' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Templates
            </router-link>

            <router-link
              to="/sales/sequences"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path.startsWith('/sales/sequences'), 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': !$route.path.startsWith('/sales/sequences') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Sequences
            </router-link>

            <router-link
              to="/sales/forecasting"
              class="flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-4 my-1"
              :class="{ 'bg-sidebar-active text-primary-purple shadow-sm transform scale-105': $route.path === '/sales/forecasting', 'text-gray-600 hover:text-primary-purple hover:bg-sidebar-active hover:shadow-sm hover:transform hover:scale-105': $route.path !== '/sales/forecasting' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Forecasting
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



