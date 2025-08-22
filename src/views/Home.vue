<template>
  <div id="app" class="font-baloo text-tertiary">
    <!-- Fixed Navigation Header -->
    <nav class="fixed top-0 w-full bg-slate-800/80 backdrop-blur-md z-50 shadow-sm border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-3 items-center h-16">
          <!-- Left: Brand -->
          <div class="flex items-center gap-3">
            <img :src="logo" alt="RC Convergio" class="h-8 w-8 rounded-full" />
            <h1 class="text-2xl font-bold text-white">RC Convergio</h1>
          </div>

          <!-- Center: Navigation Links (desktop) -->
          <div class="hidden md:grid grid-cols-4 justify-items-center items-center gap-8">
            <a 
              href="#features" 
              @click="smoothScroll"
              :class="{ 'text-white font-semibold': activeSection === 'features' }"
              class="inline-flex items-center h-10 px-4 whitespace-nowrap text-gray-300 hover:text-white transition-colors duration-300 rounded-md"
            >
              Features
            </a>
            <a 
              href="#product" 
              @click="smoothScroll"
              :class="{ 'text-white font-semibold': activeSection === 'product' }"
              class="inline-flex items-center h-10 px-4 whitespace-nowrap text-gray-300 hover:text-white transition-colors duration-300 rounded-md"
            >
              Our Product
            </a>
            <a 
              href="#about" 
              @click="smoothScroll"
              :class="{ 'text-white font-semibold': activeSection === 'about' }"
              class="inline-flex items-center h-10 px-4 whitespace-nowrap text-gray-300 hover:text-white transition-colors duration-300 rounded-md"
            >
              About Us
            </a>
            <a 
              href="#contact" 
              @click="smoothScroll"
              :class="{ 'text-white font-semibold': activeSection === 'contact' }"
              class="inline-flex items-center h-10 px-4 whitespace-nowrap text-gray-300 hover:text-white transition-colors duration-300 rounded-md"
            >
              Contact
            </a>
          </div>

          <!-- Right: Login (desktop) + Mobile menu button -->
          <div class="flex items-center justify-end gap-4">
            <router-link
              to="/login"
              class="hidden md:inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors duration-300"
            >
              Login
            </router-link>

            <!-- Mobile menu button -->
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-white">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-show="mobileMenuOpen" class="md:hidden bg-slate-800/90 border-t border-white/10 backdrop-blur">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#features" @click="smoothScroll" class="block px-3 py-2 text-gray-200 hover:text-white">Features</a>
          <a href="#product" @click="smoothScroll" class="block px-3 py-2 text-gray-200 hover:text-white">Our Product</a>
          <a href="#about" @click="smoothScroll" class="block px-3 py-2 text-gray-200 hover:text-white">About Us</a>
          <a href="#contact" @click="smoothScroll" class="block px-3 py-2 text-gray-200 hover:text-white">Contact</a>
          <router-link
            to="/login"
            @click="mobileMenuOpen = false"
            class="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700"
          >
            Login
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="hero" class="relative pt-16 min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 overflow-hidden">
      <!-- Animated Background Logo -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <!-- Placeholder for Relaince Corporation Logo -->
          <div class="relative w-full h-full">
            <!-- Logo background with gradient animation -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full animate-pulse opacity-20"></div>
            <div class="absolute inset-4 bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400 rounded-full animate-spin-slow opacity-30"></div>
            <div class="absolute inset-8 bg-gradient-to-tl from-blue-300 via-purple-300 to-indigo-300 rounded-full animate-bounce-slow opacity-40"></div>
            <!-- Replace this div with your actual logo -->
            <div class="absolute inset-16 flex items-center justify-center text-white font-bold text-6xl opacity-50">
              <img src="@/assets/logo.png" alt="">
            </div>

          </div>
        </div>
      </div>

      <!-- Floating particles animation -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="floating-particles">
          <div class="particle particle-1"></div>
          <div class="particle particle-2"></div>
          <div class="particle particle-3"></div>
          <div class="particle particle-4"></div>
          <div class="particle particle-5"></div>
        </div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 flex items-center min-h-[calc(100vh-4rem)]">
        <div class="grid grid-cols-1 gap-12 items-center w-full">
          <div class="space-y-8 animate-fade-in-up text-center md:text-left">
            <!-- Company Branding -->
            <div class="mb-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="absolute inset-16 flex items-center justify-center text-white font-bold text-6xl opacity-50">
              <img src="@/assets/logo.png" alt="">
            </div>
                <div>
                  <h2 class="text-3xl font-bold text-white">RC Convergio</h2>
                  <p class="text-blue-300 text-sm">Business Transformation Suite</p>
                </div>
              </div>
            </div>

            <h1 class="text-3xl lg:text-6xl font-bold text-white leading-tight ">
              "Designed to delight.
              <span class="bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent animate-gradient-x">
                Built to deliver value."
              </span>
            </h1>
            
            <p class="text-xl text-gray-200 leading-relaxed max-w-2xl">
              Access all Relaince Corporation's powerful software solutions from one unified platform. 
              From customer conversions to enterprise management - everything you need to scale your business.
            </p>

            <!-- Key Features Pills -->
            <div class="flex flex-wrap gap-3 mb-8">
              <span class="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30 animate-fade-in">
                Unified Dashboard
              </span>
              <span class="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30 animate-fade-in" style="animation-delay: 0.1s">
                Single Sign-On
              </span>
              <span class="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30 animate-fade-in" style="animation-delay: 0.2s">
                Integrated Analytics
              </span>
            </div>
            
            

            <!-- Trust Metrics -->
            <div class="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div class="text-center">
                <div class="text-3xl font-bold text-white mb-1 animate-count-up">500+</div>
                <div class="text-gray-400 text-sm">Enterprise Clients</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-white mb-1 animate-count-up">15+</div>
                <div class="text-gray-400 text-sm">Software Solutions</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-white mb-1 animate-count-up">99.9%</div>
                <div class="text-gray-400 text-sm">Uptime SLA</div>
              </div>
            </div>
          </div>
          
          
        </div>
      </div>

      
    </section>

    <!-- Our Product Section - Enhanced Professional Version -->
    <section id="product" class="py-20 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center justify-center p-2 bg-blue-500/10 rounded-full mb-4">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            Our <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Products</span>
          </h2>
          <p class="text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
            Discover our innovative solutions designed to transform your business and drive success
          </p>
        </div>

        <!-- Product Marquee -->
        <div class="relative overflow-hidden rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-8">
          <div class="absolute inset-0 bg-gradient-to-r from-slate-800 via-transparent to-slate-800 z-10 pointer-events-none"></div>
          
          <div class="product-marquee">
            <div 
              class="product-track"
              ref="productTrack"
              :class="{ 'animate-none': manualMode }"
              :style="manualMode ? { transform: `translateX(${offset}px)` } : null"
            >
              <!-- Product Cards -->
              <div v-for="(product, index) in products" :key="`original-${index}`" class="product-card group">
                <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 backdrop-blur-sm hover:border-slate-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
                  <!-- Product Image -->
                  <div class="product-image-container relative overflow-hidden bg-gradient-to-br from-slate-600/30 to-slate-700/30">
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" :class="product.gradient"></div>
                    <img 
                      :src="product.image" 
                      :alt="product.title" 
                      :class="['w-full h-full transition-transform duration-500 group-hover:scale-110', product.fit === 'contain' ? 'object-contain p-4' : 'object-cover']"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                    
                    <!-- Overlay Badge -->
                    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div class="bg-white/10 backdrop-blur-md rounded-full px-3 py-1 text-xs text-white font-medium border border-white/20">
                        Featured
                      </div>
                    </div>
                  </div>

                  <!-- Card Content -->
                  <div class="p-6 space-y-4">
                    <div class="space-y-2">
                      <h3 class="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
                        {{ product.title }}
                      </h3>
                      <p class="text-gray-400 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
                        {{ product.description }}
                      </p>
                    </div>

                    <!-- Features -->
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="feature in product.features" 
                        :key="feature"
                        class="inline-flex items-center px-2 py-1 rounded-md bg-slate-700/50 text-xs text-gray-300 border border-slate-600/30"
                      >
                        {{ feature }}
                      </span>
                    </div>

                    <!-- Action Button -->
                    <div class="pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <a 
                        :href="product.link || '#'" 
                        target="_blank" 
                        rel="noopener" 
                        class="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/30 rounded-lg px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-all duration-300"
                        role="button"
                      >
                        <span>Learn More</span>
                        <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Duplicate set for seamless loop -->
              <div v-for="(product, index) in products" :key="`duplicate-${index}`" class="product-card group">
                <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 backdrop-blur-sm hover:border-slate-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
                  <div class="product-image-container relative overflow-hidden bg-gradient-to-br from-slate-600/30 to-slate-700/30">
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" :class="product.gradient"></div>
                    <img 
                      :src="product.image" 
                      :alt="product.title" 
                      :class="['w-full h-full transition-transform duration-500 group-hover:scale-110', product.fit === 'contain' ? 'object-contain p-4' : 'object-cover']"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                    
                    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div class="bg-white/10 backdrop-blur-md rounded-full px-3 py-1 text-xs text-white font-medium border border-white/20">
                        Featured
                      </div>
                    </div>
                  </div>

                  <div class="p-6 space-y-4">
                    <div class="space-y-2">
                      <h3 class="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
                        {{ product.title }}
                      </h3>
                      <p class="text-gray-400 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
                        {{ product.description }}
                      </p>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="feature in product.features" 
                        :key="feature"
                        class="inline-flex items-center px-2 py-1 rounded-md bg-slate-700/50 text-xs text-gray-300 border border-slate-600/30"
                      >
                        {{ feature }}
                      </span>
                    </div>

                    <div class="pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <a 
                        :href="product.link || '#'" 
                        target="_blank" 
                        rel="noopener" 
                        class="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/30 rounded-lg px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-all duration-300"
                        role="button"
                      >
                        <span>Learn More</span>
                        <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
       
      </div>
    </section>

    <section id="features" class="py-20 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Features Header -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center justify-center p-2 bg-blue-500/10 rounded-full mb-4">
        <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
      <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
        One Platform, <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Endless Possibilities</span>
      </h2>
      <p class="text-xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
        Access all Reliance Corporation software solutions through a single, unified portal. 
        Streamline your workflow with seamless integration and centralized management.
      </p>
    </div>

    <!-- Core Platform Features -->
    <div class="grid md:grid-cols-4 gap-6 mb-20">
      <div class="group relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative text-center p-8 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 backdrop-blur-sm hover:border-slate-500/50 transition-all duration-500 hover:transform hover:scale-105">
          <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">Single Sign-On</h3>
          <p class="text-gray-400 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            Access all your enterprise applications with one secure login. Enhanced security with enterprise-grade authentication.
          </p>
        </div>
      </div>
      
      <div class="group relative">
        <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative text-center p-8 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 backdrop-blur-sm hover:border-slate-500/50 transition-all duration-500 hover:transform hover:scale-105">
          <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">Unified Dashboard</h3>
          <p class="text-gray-400 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            Centralized control panel with real-time insights across all connected applications and business metrics.
          </p>
        </div>
      </div>
      
      <div class="group relative">
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative text-center p-8 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 backdrop-blur-sm hover:border-slate-500/50 transition-all duration-500 hover:transform hover:scale-105">
          <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors duration-300">Smart Integration</h3>
          <p class="text-gray-400 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            Seamless data flow between applications. Real-time synchronization and automated workflow orchestration.
          </p>
        </div>
      </div>
      
      <div class="group relative">
        <div class="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative text-center p-8 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 backdrop-blur-sm hover:border-slate-500/50 transition-all duration-500 hover:transform hover:scale-105">
          <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors duration-300">Advanced Analytics</h3>
          <p class="text-gray-400 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            Cross-platform reporting and business intelligence. Data-driven insights with predictive analytics capabilities.
          </p>
        </div>
      </div>
    </div>

    <!-- Enterprise Features -->
    <div class="grid lg:grid-cols-2 gap-16 items-center mb-20">
      <div class="space-y-8">
        <div>
          <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
            Enterprise Ready
          </div>
          <h3 class="text-3xl font-bold text-white mb-4">Built for Enterprise Scale</h3>
          <p class="text-gray-300 font-light text-lg leading-relaxed">
            Enterprise-grade platform designed to handle complex organizational needs with 
            military-grade security, compliance, and scalability built from the ground up.
          </p>
        </div>

        <div class="grid gap-6">
          <div class="flex items-start space-x-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors duration-300">
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-white mb-1">Role-Based Access Control</h4>
              <p class="text-gray-400 text-sm leading-relaxed">
                Granular permission management with department-level access controls and audit trails
              </p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors duration-300">
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-white mb-1">API-First Architecture</h4>
              <p class="text-gray-400 text-sm leading-relaxed">
                RESTful APIs and webhooks for seamless third-party integrations and custom development
              </p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors duration-300">
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-white mb-1">Real-Time Performance</h4>
              <p class="text-gray-400 text-sm leading-relaxed">
                Lightning-fast response times with 99.9% uptime SLA and global CDN distribution
              </p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors duration-300">
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-white mb-1">Compliance & Security</h4>
              <p class="text-gray-400 text-sm leading-relaxed">
                SOC 2, GDPR, HIPAA compliant with end-to-end encryption and data sovereignty
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive Platform Mockup -->
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50"></div>
        <div class="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-600/50 p-8 shadow-2xl">
          <!-- Browser Header -->
          <div class="flex items-center space-x-2 mb-6 pb-4 border-b border-slate-700/50">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <div class="flex-1 bg-slate-700/50 rounded-lg px-4 py-2 ml-4">
              <span class="text-gray-400 text-sm">portal.reliancecorporation.co.za</span>
            </div>
          </div>

          <!-- Platform Interface -->
          <div class="space-y-6">
            <!-- Header Stats -->
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30">
                <div class="text-blue-400 text-2xl font-bold">15+</div>
                <div class="text-gray-400 text-xs">Connected Apps</div>
              </div>
              <div class="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl p-4 border border-purple-500/30">
                <div class="text-purple-400 text-2xl font-bold">99.9%</div>
                <div class="text-gray-400 text-xs">Uptime</div>
              </div>
              <div class="bg-gradient-to-r from-teal-500/20 to-teal-600/20 rounded-xl p-4 border border-teal-500/30">
                <div class="text-teal-400 text-2xl font-bold">500+</div>
                <div class="text-gray-400 text-xs">Active Users</div>
              </div>
            </div>

            <!-- Application Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-slate-600/30 hover:border-blue-500/50 transition-colors duration-300 group cursor-pointer">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <div class="text-white text-sm font-semibold group-hover:text-blue-400 transition-colors">RC Analytics</div>
                </div>
                <div class="h-8 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg opacity-60"></div>
              </div>
              
              <div class="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl p-4 border border-slate-600/30 hover:border-purple-500/50 transition-colors duration-300 group cursor-pointer">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div class="text-white text-sm font-semibold group-hover:text-purple-400 transition-colors">RC CRM</div>
                </div>
                <div class="h-8 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 rounded-lg opacity-60"></div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <div class="text-white text-sm font-medium">Quick Launch</div>
              <div class="flex space-x-2">
                <div class="w-6 h-6 bg-blue-500/20 rounded border border-blue-500/30"></div>
                <div class="w-6 h-6 bg-purple-500/20 rounded border border-purple-500/30"></div>
                <div class="w-6 h-6 bg-teal-500/20 rounded border border-teal-500/30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Platform Benefits -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6">
        Why Choose RC Convergio Portal
      </div>
      <h3 class="text-3xl font-bold text-white mb-4">Transform Your Business Operations</h3>
      <p class="text-gray-300 font-light text-lg mb-12 max-w-3xl mx-auto">
        Experience unprecedented efficiency with our unified platform approach
      </p>
      
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 rounded-2xl backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300">
            <div class="text-6xl font-bold text-blue-400 mb-4">85%</div>
            <h4 class="text-lg font-bold text-white mb-2">Time Reduction</h4>
            <p class="text-gray-400 text-sm leading-relaxed">
              Average time saved on daily operations through unified access and automated workflows
            </p>
          </div>
        </div>
        
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 rounded-2xl backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300">
            <div class="text-6xl font-bold text-purple-400 mb-4">60%</div>
            <h4 class="text-lg font-bold text-white mb-2">Cost Savings</h4>
            <p class="text-gray-400 text-sm leading-relaxed">
              Reduction in IT infrastructure costs through consolidated platform management
            </p>
          </div>
        </div>
        
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 rounded-2xl backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300">
            <div class="text-6xl font-bold text-teal-400 mb-4">99.9%</div>
            <h4 class="text-lg font-bold text-white mb-2">Reliability</h4>
            <p class="text-gray-400 text-sm leading-relaxed">
              Enterprise-grade uptime with 24/7 monitoring and automated failover systems
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-12 rounded-3xl border border-slate-700/50">
      <h3 class="text-3xl font-bold text-white mb-4">Ready to Unify Your Operations?</h3>
      <p class="text-gray-300 font-light text-lg mb-8 max-w-2xl mx-auto">
        Join hundreds of enterprises already transforming their business with RC Convergio Portal
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Start Free Trial
          <svg class="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12"></path>
          </svg>
        </button>
        <button class="inline-flex items-center justify-center px-8 py-3 border-2 border-slate-600 text-base font-medium rounded-xl text-white bg-transparent hover:bg-slate-800 hover:border-slate-500 transition-all duration-300">
          Schedule Demo
        </button>
      </div>
    </div>
  </div>
</section>


    <!-- About Us Section -->
    <section id="about" class="py-20 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center justify-center p-2 bg-blue-500/10 rounded-full mb-4">
        <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
      <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
        About <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">RC Convergio</span>
      </h2>
      <p class="text-xl text-gray-400 font-light max-w-3xl mx-auto">
        Pioneering the future of enterprise software integration
      </p>
    </div>

    <!-- Content Grid -->
    <div class="grid lg:grid-cols-2 gap-16 items-center mb-20">
      <!-- Left Content -->
      <div class="space-y-8">
        <div class="space-y-6">
          <p class="text-lg text-gray-300 font-light leading-relaxed">
            We're enterprise software architects dedicated to transforming how businesses operate through unified digital experiences.
          </p>
          <p class="text-gray-300 font-light leading-relaxed">
            Our mission is to eliminate operational silos by connecting all your business applications into one powerful, secure, and intuitive platform. 
            We believe that enterprise software should work together, not in isolation.
          </p>
        </div>

        <!-- Core Values -->
        <div class="space-y-4">
          <div class="flex items-start space-x-4">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-white mb-1">Innovation First</h4>
              <p class="text-gray-400 text-sm">Cutting-edge technology that scales with your business</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-white mb-1">Security by Design</h4>
              <p class="text-gray-400 text-sm">Enterprise-grade protection for your most valuable data</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4">
            <div class="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-white mb-1">Customer Success</h4>
              <p class="text-gray-400 text-sm">Your success is our success, every step of the way</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Content -->
      <div class="space-y-6">
        <!-- Mission Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 backdrop-blur-sm p-8 rounded-2xl hover:border-slate-500/50 transition-all duration-500">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">Our Mission</h3>
            <p class="text-gray-300 font-light leading-relaxed">
              Transform enterprise operations through seamless software integration, empowering businesses to achieve unprecedented efficiency and growth.
            </p>
          </div>
        </div>

        <!-- Vision Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 backdrop-blur-sm p-8 rounded-2xl hover:border-slate-500/50 transition-all duration-500">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">Our Vision</h3>
            <p class="text-gray-300 font-light leading-relaxed">
              A world where enterprise software works as one unified ecosystem, eliminating complexity and maximizing business potential.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center">
      <div class="relative max-w-4xl mx-auto">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl"></div>
        <div class="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-12 rounded-3xl border border-slate-600/50">
          <h3 class="text-3xl font-bold text-white mb-4">Ready to Transform Your Business?</h3>
          <p class="text-gray-300 font-light text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of enterprises already revolutionizing their operations with our unified platform.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              @click="scrollToContact"
              class="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
            >
              <span>Start Your Journey</span>
              <svg class="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12"></path>
              </svg>
            </button>
            <button class="inline-flex items-center justify-center px-8 py-3 border-2 border-slate-600 text-white text-lg font-semibold rounded-xl hover:bg-slate-800 hover:border-slate-500 transition-all duration-300 backdrop-blur-sm">
              <svg class="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <span>Talk to Expert</span>
            </button>
          </div>
          
          <!-- Trust Indicator -->
          <div class="mt-8 pt-6 border-t border-slate-700/50">
            <p class="text-sm text-gray-400 flex items-center justify-center">
              <svg class="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Enterprise-grade security • 99.9% uptime SLA • 24/7 support
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center justify-center p-2 bg-blue-500/10 rounded-full mb-4">
        <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
      <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
        Contact <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Us</span>
      </h2>
      <p class="text-xl text-gray-400 font-light max-w-2xl mx-auto">
        Ready to transform your enterprise? Our experts are here to help you get started with RC Convergio.
      </p>
    </div>

    <div class="grid lg:grid-cols-2 gap-16">
      <!-- Contact Form -->
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl opacity-50"></div>
        <div class="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-600/50">
          <div class="mb-8">
            <h3 class="text-2xl font-bold text-white mb-2">Get Started Today</h3>
            <p class="text-gray-400 font-light">Tell us about your needs and we'll create a tailored solution for your enterprise.</p>
          </div>

          <form class="space-y-6">
            <div class="relative group">
              <input 
                v-model="contactForm.name"
                type="text" 
                placeholder="Your full name" 
                class="w-full px-6 py-4 bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-slate-500/70"
              />
              <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-focus-within:from-blue-500/10 group-focus-within:to-purple-500/10 pointer-events-none transition-all duration-300"></div>
            </div>

            <div class="relative group">
              <input 
                v-model="contactForm.email"
                type="email" 
                placeholder="Business email address" 
                class="w-full px-6 py-4 bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-slate-500/70"
              />
              <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-focus-within:from-blue-500/10 group-focus-within:to-purple-500/10 pointer-events-none transition-all duration-300"></div>
            </div>

            <div class="relative group">
              <select class="w-full px-6 py-4 bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-slate-500/70">
                <option value="" class="bg-slate-800">Select company size</option>
                <option value="startup" class="bg-slate-800">Startup (1-50 employees)</option>
                <option value="growth" class="bg-slate-800">Growing Business (51-200 employees)</option>
                <option value="enterprise" class="bg-slate-800">Enterprise (200+ employees)</option>
              </select>
            </div>

            <div class="relative group">
              <textarea 
                v-model="contactForm.message"
                placeholder="Tell us about your current challenges and how we can help..." 
                rows="6"
                class="w-full px-6 py-4 bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 resize-none group-hover:border-slate-500/70"
              ></textarea>
              <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-focus-within:from-blue-500/10 group-focus-within:to-purple-500/10 pointer-events-none transition-all duration-300"></div>
            </div>

            <button 
              @click="submitForm"
              type="submit"
              class="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
            >
              <span>Send Message</span>
              <svg class="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>

            <p class="text-sm text-gray-400 flex items-center">
              <svg class="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              We typically respond within 2 hours during business hours
            </p>
          </form>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="space-y-8">
        <!-- Contact Methods -->
        <div class="space-y-6">
          <div class="relative group">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative flex items-start space-x-4 p-6 bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 rounded-2xl backdrop-blur-sm hover:border-slate-500/50 transition-all duration-300">
              <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-white text-lg mb-1 group-hover:text-blue-400 transition-colors duration-300">Email Support</h3>
                <p class="text-gray-300 font-light mb-2">Get in touch with our enterprise team</p>
                <a href="mailto:info@reliancecorporation.co.za" class="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium">
                  info@reliancecorporation.co.za
                </a>
              </div>
            </div>
          </div>

          <div class="relative group">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative flex items-start space-x-4 p-6 bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 rounded-2xl backdrop-blur-sm hover:border-slate-500/50 transition-all duration-300">
              <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-white text-lg mb-1 group-hover:text-purple-400 transition-colors duration-300">Phone Support</h3>
                <p class="text-gray-300 font-light mb-2">Speak directly with our experts</p>
                <a href="tel:+27104471845" class="text-purple-400 hover:text-purple-300 transition-colors duration-300 font-medium">
                  (+27) 10 447 1845
                </a>
                <p class="text-gray-400 text-sm mt-1">Mon-Fri: 8:00 AM - 6:00 PM SAST</p>
              </div>
            </div>
          </div>

          <div class="relative group">
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative flex items-start space-x-4 p-6 bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 rounded-2xl backdrop-blur-sm hover:border-slate-500/50 transition-all duration-300">
              <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-white text-lg mb-1 group-hover:text-indigo-400 transition-colors duration-300">Headquarters</h3>
                <p class="text-gray-300 font-light mb-2">Visit us for in-person consultations</p>
                <address class="text-gray-400 not-italic text-sm leading-relaxed">
                  Glenvista Shopping Centre 2nd Floor,<br>
                  Above Checkers Liquor<br>
                  188 Biggarsberg Road & Kirby Beller Rd,<br>
                  Glenvista, Johannesburg South, 2091,<br>
                  South Africa
                </address>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-600/30 rounded-2xl p-6 backdrop-blur-sm">
          <h4 class="font-bold text-white mb-4">Need Immediate Help?</h4>
          <div class="space-y-3">
            <a href="#" class="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
              <svg class="w-4 h-4 mr-3 text-blue-400 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Documentation & Guides</span>
            </a>
            <a href="#" class="flex items-center text-gray-300 hover:text-purple-400 transition-colors duration-300 group">
              <svg class="w-4 h-4 mr-3 text-purple-400 group-hover:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>FAQ & Support Center</span>
            </a>
            <a href="#" class="flex items-center text-gray-300 hover:text-teal-400 transition-colors duration-300 group">
              <svg class="w-4 h-4 mr-3 text-teal-400 group-hover:text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              <span>Schedule a Demo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div class="space-y-4">
            <h3 class="text-2xl font-bold text-primary">RC Convergio</h3>
            <p class="text-gray-400 font-calibri">
              Supercharge your customer conversions with powerful automation and insights.
            </p>
          </div>
          
          <div class="space-y-4">
            <h4 class="font-bold">Company</h4>
            <div class="space-y-2">
              <a href="#" class="block text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#" class="block text-gray-400 hover:text-white transition-colors">Careers</a>
              <a href="#" class="block text-gray-400 hover:text-white transition-colors">Blog</a>
            </div>
          </div>
          
          <div class="space-y-4">
            <h4 class="font-bold">Product</h4>
            <div class="space-y-2">
              <a href="#features" class="block text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#product" class="block text-gray-400 hover:text-white transition-colors">Our Product</a>
              <a href="#" class="block text-gray-400 hover:text-white transition-colors">Pricing</a>
              <a href="#" class="block text-gray-400 hover:text-white transition-colors">Integrations</a>
            </div>
          </div>
          
          <div class="space-y-4">
            <h4 class="font-bold">Legal</h4>
            <div class="space-y-2">
              <a href="#" class="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" class="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" class="block text-gray-400 hover:text-white transition-colors">Security</a>
              <a href="#" class="block text-gray-400 hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p class="text-gray-400 font-calibri">
            © 2024 RC Convergio. All rights reserved.
          </p>
          <div class="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import logo from '@/assets/logo.png'
import juniorMinds from '@/assets/juniormind.png'
import rcPosSolution from '@/assets/rcpossolution.png'
import consoleImg from '@/assets/console.png'
import supportImg from '@/assets/support.png'
import rcBooksImg from '@/assets/rcbooks.png'
import missionImg from '@/assets/mission.png'

// Reactive data
const activeSection = ref('hero')
const mobileMenuOpen = ref(false)
const contactForm = ref({
  name: '',
  email: '',
  message: ''
})

// Manual slide controls for product section
const manualMode = ref(false)
const offset = ref(0)
const productTrack = ref(null)

const getStep = () => {
  const card = productTrack.value?.querySelector('.product-card')
  if (!card) return 340
  const rect = card.getBoundingClientRect()
  const gap = 24 // approximate spacing between cards
  return Math.round(rect.width + gap)
}

const wrapIfNeeded = () => {
  const track = productTrack.value
  if (!track) return
  const total = track.scrollWidth
  const half = total / 2
  if (offset.value <= -half) offset.value += half
  if (offset.value > 0) offset.value -= half
}

const nextSlide = () => {
  manualMode.value = true
  offset.value -= getStep()
  wrapIfNeeded()
}

const prevSlide = () => {
  manualMode.value = true
  offset.value += getStep()
  wrapIfNeeded()
}

// Products data for the enhanced product section
const products = ref([
  {
    title: "Junior Minds Platform",
    description: "Educational technology solution designed to enhance learning experiences for young minds with interactive content and progress tracking.",
    image: juniorMinds,
    gradient: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
    features: ["Interactive", "Educational", "Analytics"]
  },
  {
    title: "RC Console",
    description: "Comprehensive customer relationship management platform offering integrated tools for modern enterprises to streamline operations.",
    image: consoleImg,
    link: 'https://reliancecorporation.co.za/console',
    gradient: "bg-gradient-to-br from-indigo-500/20 to-teal-500/20",
    features: ["Enterprise", "Management", "Integration"]
  },
  {
    title: "RC Books",
    description: "Real-time data visualization and analytics platform providing actionable insights for data-driven decision making.",
    image: rcBooksImg,
    gradient: "bg-gradient-to-br from-pink-500/20 to-yellow-500/20",
    features: ["Analytics", "Real-time", "Insights"]
  },
  {
    title: "RC POS Solution",
    description: "Workflow management and operations platform enabling teams to collaborate effectively and automate business processes.",
    image: rcPosSolution,
    gradient: "bg-gradient-to-br from-emerald-500/20 to-blue-500/20",
    features: ["Workflow", "Automation", "Collaboration"],
    fit: 'contain'
  },
  {
    title: "RC Support Desk",
    description: "Unified communication hub integrating messaging, video conferencing, and team collaboration tools in one platform.",
    image: supportImg,
    gradient: "bg-gradient-to-br from-purple-500/20 to-indigo-500/20",
    features: ["Communication", "Video", "Integration"]
  },
  {
    title: "RC Maxi",
    description: "Complete marketing automation solution with campaign management, lead scoring, and customer journey mapping.",
    image: logo,
    gradient: "bg-gradient-to-br from-teal-500/20 to-cyan-500/20",
    features: ["Marketing", "Automation", "Campaigns"]
  },
  {
    title: "RC ISMS",
    description: "Enterprise-grade security platform with threat detection, compliance monitoring, and risk assessment capabilities.",
    image: logo,
    gradient: "bg-gradient-to-br from-rose-500/20 to-orange-500/20",
    features: ["Security", "Compliance", "Monitoring"]
  },
  {
    title: "RC ERP",
    description: "Intelligent automation platform leveraging artificial intelligence to optimize workflows and enhance productivity.",
    image: logo,
    gradient: "bg-gradient-to-br from-yellow-500/20 to-red-500/20",
    features: ["AI-Powered", "Automation", "Productivity"]
  }
])

// Smooth scroll function
const smoothScroll = (event) => {
  event.preventDefault()
  const target = event.target.getAttribute('href')
  const element = document.querySelector(target)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
  mobileMenuOpen.value = false
}

// Scroll to contact function
const scrollToContact = () => {
  const element = document.querySelector('#contact')
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Submit form function
const submitForm = () => {
  console.log('Form submitted:', contactForm.value)
  // Add your form submission logic here
  alert('Thank you for your message! We\'ll get back to you soon.')
  
  // Reset form
  contactForm.value = {
    name: '',
    email: '',
    message: ''
  }
}

// Handle scroll for active section highlighting
const handleScroll = () => {
  const sections = ['hero', 'features', 'product', 'about', 'contact']
  const scrollPosition = window.scrollY + 100

  for (const section of sections) {
    const element = document.getElementById(section)
    if (element) {
      const offsetTop = element.offsetTop
      const offsetBottom = offsetTop + element.offsetHeight

      if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
        activeSection.value = section
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #2596be;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #655997;
}

/* Smooth scrolling for all elements */
html {
  scroll-behavior: smooth;
}

/* --- Hero animations and utilities --- */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes text-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes chart-grow {
  from { height: 0%; }
  to { height: var(--final-height); }
}

@keyframes count-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Enhanced Product Marquee Animations */
@keyframes scroll-rtl {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-spin-slow { animation: spin-slow 20s linear infinite; }
.animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-float-delayed { animation: float-delayed 6s ease-in-out infinite 2s; }
.animate-fade-in-up { animation: fade-in-up 1s ease-out; }
.animate-fade-in { animation: fade-in 1s ease-out forwards; }
.animate-gradient-x { 
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}
.animate-text-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  background-size: 200% 100%;
  animation: text-shimmer 3s ease-in-out infinite;
}
.animate-chart-grow { animation: chart-grow 2s ease-out forwards; }
.animate-count-up { animation: count-up 1s ease-out 0.5s forwards; }
.animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite;
}

.particle-1 { width: 4px; height: 4px; top: 20%; left: 10%; animation-delay: 0s; }
.particle-2 { width: 6px; height: 6px; top: 60%; left: 80%; animation-delay: 2s; }
.particle-3 { width: 3px; height: 3px; top: 40%; left: 60%; animation-delay: 4s; }
.particle-4 { width: 5px; height: 5px; top: 80%; left: 20%; animation-delay: 6s; }
.particle-5 { width: 4px; height: 4px; top: 30%; left: 90%; animation-delay: 1s; }

/* Enhanced Product marquee */
.product-marquee {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.product-track {
  display: flex;
  gap: 2rem;
  animation: scroll-rtl 40s linear infinite;
  width: fit-content;
}

.product-card {
  flex-shrink: 0;
  width: 320px;
  height: 420px;
}

.product-image-container {
  height: 200px;
  width: 100%;
}

/* Pause animation on hover */
.product-marquee:hover .product-track {
  animation-play-state: paused;
}

/* Line clamp utilities */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced backdrop blur for better browser support */
@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
  .backdrop-blur-md {
    backdrop-filter: blur(12px);
  }
}

/* Smooth scrolling behavior */
.product-track {
  will-change: transform;
}

/* Focus styles for accessibility */
.product-card:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .product-card {
    width: 280px;
    height: 380px;
  }
  
  .product-image-container {
    height: 160px;
  }
}
</style>
