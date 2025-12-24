<template>
  <div id="app" class="font-baloo text-tertiary">
    <!-- Fixed Navigation Header -->
    <nav class="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 shadow-sm border-b border-gray-200/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-3 items-center h-14">
          <!-- Left: Brand -->
          <div class="flex items-center gap-2">
            
          </div>

          <!-- Center: Navigation Links (desktop) -->
          <div class="hidden md:grid grid-cols-5 justify-items-center items-center gap-6">
            <a 
              href="#hero" 
              @click="smoothScroll"
              :class="{ 'text-gray-900 font-semibold': activeSection === 'hero' }"
              class="inline-flex items-center h-8 px-3 whitespace-nowrap text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300 rounded-md"
            >
              Home
            </a>
            <a 
              href="#product" 
              @click="smoothScroll"
              :class="{ 'text-gray-900 font-semibold': activeSection === 'product' }"
              class="inline-flex items-center h-8 px-3 whitespace-nowrap text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300 rounded-md"
            >
              Our Product
            </a>
            <a 
              href="#features" 
              @click="smoothScroll"
              :class="{ 'text-gray-900 font-semibold': activeSection === 'features' }"
              class="inline-flex items-center h-8 px-3 whitespace-nowrap text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300 rounded-md"
            >
              Features
            </a>
           
            <a 
              href="#about" 
              @click="smoothScroll"
              :class="{ 'text-gray-900 font-semibold': activeSection === 'about' }"
              class="inline-flex items-center h-8 px-3 whitespace-nowrap text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300 rounded-md"
            >
              About Us
            </a>
            <a 
              href="#contact" 
              @click="smoothScroll"
              :class="{ 'text-gray-900 font-semibold': activeSection === 'contact' }"
              class="inline-flex items-center h-8 px-3 whitespace-nowrap text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300 rounded-md"
            >
              Contact
            </a>
          </div>

          <!-- Right: Login (desktop) + Mobile menu button -->
          <div class="flex items-center justify-end gap-4">
            <router-link
              to="/login"
              class="hidden md:inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1.5 text-sm rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors duration-300"
            >
              Login
            </router-link>

            <!-- Mobile menu button -->
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-gray-900">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-show="mobileMenuOpen" class="md:hidden bg-white/95 border-t border-gray-200 backdrop-blur">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#hero" @click="smoothScroll" class="block px-3 py-2 text-gray-600 hover:text-gray-900">Home</a>
          <a href="#features" @click="smoothScroll" class="block px-3 py-2 text-gray-600 hover:text-gray-900">Features</a>
          <a href="#product" @click="smoothScroll" class="block px-3 py-2 text-gray-600 hover:text-gray-900">Our Product</a>
          <a href="#about" @click="smoothScroll" class="block px-3 py-2 text-gray-600 hover:text-gray-900">About Us</a>
          <a href="#contact" @click="smoothScroll" class="block px-3 py-2 text-gray-600 hover:text-gray-900">Contact</a>
          <router-link
            to="/login"
            @click="mobileMenuOpen = false"
            class="block w-full bg-gradient-to-r from-[#d4418e] to-[#0652c5] text-white px-3 py-2 rounded-lg hover:from-[#c23a7f] hover:to-[#0548a8]"
          >
            Login
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="hero" class="relative pt-14 min-h-[75vh] bg-gradient-to-br from-[#f8fafc] via-white to-[#e2e8f0] overflow-hidden">
      <!-- Subtle Background -->
      <div class="absolute inset-0">
        <!-- Animated gradient mesh -->
        <div class="mesh-bg absolute inset-0 opacity-60 pointer-events-none"></div>

        <!-- Soft dotted grid panning subtly -->
        <div class="animated-grid absolute inset-0 opacity-20 pointer-events-none"></div>

        <!-- Blurred gradient blobs for depth -->
        <div class="absolute inset-0 pointer-events-none">
          <div class="gradient-blob blob-1"></div>
          <div class="gradient-blob blob-2"></div>
          <div class="gradient-blob blob-3"></div>
        </div>

        <!-- Animated wave patterns -->
        <div class="absolute inset-0 pointer-events-none">
          <svg class="wave-svg wave-1" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(212, 65, 142, 0.08)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg class="wave-svg wave-2" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(6, 82, 197, 0.06)" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg class="wave-svg wave-3" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(37, 150, 190, 0.05)" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,186.7C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <!-- Floating geometric shapes -->
        <div class="absolute inset-0 pointer-events-none">
          <div class="floating-shape shape-circle-1"></div>
          <div class="floating-shape shape-square-1"></div>
          <div class="floating-shape shape-triangle-1"></div>
          <div class="floating-shape shape-circle-2"></div>
          <div class="floating-shape shape-square-2"></div>
        </div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(85vh-3.5rem)]">
        <div class="w-full text-center space-y-8">
          <!-- Company Branding -->
          <div class="mb-8">
            <div class="flex items-center justify-center space-x-5 mb-6">
              <img :src="logo" alt="RC Convergio" class="w-20 h-20 object-contain">
              <div>
                <h2 class="text-3xl font-bold text-gray-900">RC Convergio</h2>
                <p class="text-lg text-gray-600">Business Transformation Suite</p>
              </div>
            </div>
          </div>

          <h1 class="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
            "Designed to delight.
            <span class="bg-gradient-to-r from-[#d4418e] via-[#0652c5] via-[#2596be] to-[#973894] bg-clip-text text-transparent animate-gradient-x">
              Built to deliver value."
            </span>
          </h1>
          
          <p class="text-base text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Access all Reliance Corporation's powerful software solutions from one unified platform. 
            From customer conversions to enterprise management - everything you need to scale your business.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <router-link
              to="/login"
              class="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#d4418e] to-[#0652c5] text-white text-base font-semibold rounded-lg hover:from-[#c23a7f] hover:to-[#0548a8] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
            >
              <span>Get Started</span>
              <svg class="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12"></path>
              </svg>
            </router-link>
            <button 
              @click="scrollToContact"
              class="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 text-gray-700 text-base font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
            >
              <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <span>Talk to Expert</span>
            </button>
          </div>

          <!-- Trust Metrics -->
          <div class="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-6 border-t border-gray-300">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900 mb-1">500+</div>
              <div class="text-sm text-gray-600">Enterprise Clients</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900 mb-1">15+</div>
              <div class="text-sm text-gray-600">Software Solutions</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900 mb-1">99.9%</div>
              <div class="text-sm text-gray-600">Uptime SLA</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Product Section - Enhanced Professional Version -->
    <section id="product" class="py-8 bg-gradient-to-b from-[#f8fafc] via-white to-[#f1f5f9]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="relative inline-block">
            <!-- Background gradient for header -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-indigo-100/50 rounded-2xl blur-xl"></div>
            <div class="relative bg-gradient-to-r from-white/80 via-gray-50/80 to-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200">
              <h2 class="text-xl lg:text-2xl font-bold text-gray-900 mb-1 tracking-tight">
                Our <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#d4418e] to-[#0652c5]">Products</span>
              </h2>
              <p class="text-xs text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                Discover our innovative solutions designed to transform your business and drive success
              </p>
            </div>
          </div>
        </div>

        <!-- Product Marquee -->
        <div class="relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200 p-4 shadow-lg">
          <div class="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none"></div>
          
          <div class="product-marquee">
            <div 
              class="product-track"
              ref="productTrack"
              :class="{ 'animate-none': manualMode }"
              :style="manualMode ? { transform: `translateX(${offset}px)` } : null"
            >
              <!-- Product Cards -->
              <div v-for="(product, index) in products" :key="`original-${index}`" class="product-card group">
                <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200 backdrop-blur-sm hover:border-gray-300 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10">
                  <!-- Product Image -->
                  <div class="product-image-container relative overflow-hidden bg-gradient-to-br from-gray-100/50 to-gray-200/50">
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" :class="product.gradient"></div>
                    <img 
                      :src="product.image" 
                      :alt="product.title" 
                      :class="['w-full h-full transition-transform duration-500 group-hover:scale-110', product.fit === 'contain' ? 'object-contain p-4' : 'object-cover']"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                    
                    <!-- Overlay Badge -->
                    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div class="bg-blue-50 backdrop-blur-md rounded-full px-3 py-1 text-xs text-blue-700 font-medium border border-blue-200 shadow-sm">
                        Featured
                      </div>
                    </div>
                  </div>

                  <!-- Card Content -->
                  <div class="p-5 space-y-3">
                    <div class="space-y-1">
                      <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                        {{ product.title }}
                      </h3>
                      <p class="text-gray-600 text-xs leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                        {{ product.description }}
                      </p>
                    </div>

                    <!-- Features -->
                    <div class="flex flex-wrap gap-1.5">
                      <span 
                        v-for="feature in product.features" 
                        :key="feature"
                        class="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-xs text-blue-700 border border-blue-200"
                      >
                        {{ feature }}
                      </span>
                    </div>

                    <!-- Action Button -->
                    <div class="pt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <a 
                        :href="product.link || '#'" 
                        target="_blank" 
                        rel="noopener" 
                        class="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200 rounded-lg px-3 py-1.5 text-xs text-blue-700 hover:text-blue-800 transition-all duration-300"
                        role="button"
                      >
                        <span>Learn More</span>
                        <svg class="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Duplicate set for seamless loop -->
              <div v-for="(product, index) in products" :key="`duplicate-${index}`" class="product-card group">
                <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200 backdrop-blur-sm hover:border-gray-300 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10">
                  <div class="product-image-container relative overflow-hidden bg-gradient-to-br from-slate-600/30 to-slate-700/30">
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" :class="product.gradient"></div>
                    <img 
                      :src="product.image" 
                      :alt="product.title" 
                      :class="['w-full h-full transition-transform duration-500 group-hover:scale-110', product.fit === 'contain' ? 'object-contain p-4' : 'object-cover']"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                    
                    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div class="bg-blue-50 backdrop-blur-md rounded-full px-3 py-1 text-xs text-blue-700 font-medium border border-blue-200 shadow-sm">
                        Featured
                      </div>
                    </div>
                  </div>

                  <div class="p-5 space-y-3">
                    <div class="space-y-1">
                      <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                        {{ product.title }}
                      </h3>
                      <p class="text-gray-600 text-xs leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                        {{ product.description }}
                      </p>
                    </div>

                    <div class="flex flex-wrap gap-1.5">
                      <span 
                        v-for="feature in product.features" 
                        :key="feature"
                        class="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-xs text-blue-700 border border-blue-200"
                      >
                        {{ feature }}
                      </span>
                    </div>

                    <div class="pt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <a 
                        :href="product.link || '#'" 
                        target="_blank" 
                        rel="noopener" 
                        class="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200 rounded-lg px-3 py-1.5 text-xs text-blue-700 hover:text-blue-800 transition-all duration-300"
                        role="button"
                      >
                        <span>Learn More</span>
                        <svg class="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

    <section id="features" class="py-8 bg-gradient-to-b from-[#f8fafc] via-white to-[#f1f5f9]">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Features Header -->
    <div class="text-center mb-8">
      <div class="relative inline-block">
        <!-- Background gradient for header -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-indigo-100/50 rounded-2xl blur-xl"></div>
        <div class="relative bg-gradient-to-r from-white/80 via-gray-50/80 to-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200">
          <h2 class="text-xl lg:text-2xl font-bold text-gray-900 mb-1 tracking-tight">
                        One Platform, <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#d4418e] to-[#0652c5]">Endless Possibilities</span>
          </h2>
          <p class="text-xs text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Access all Reliance Corporation software solutions through a single, unified portal. 
            Streamline your workflow with seamless integration and centralized management.
          </p>
        </div>
      </div>
    </div>

    <!-- Core Platform Features -->
    <div class="grid md:grid-cols-4 gap-4 mb-12">
      <div class="group relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative text-center p-3 rounded-xl bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200 backdrop-blur-sm hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
          <div class="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-lg border border-blue-200">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1-3.5-4-7-9-7s-8 3.5-9 7c1 3.5 4 7 9 7s8-3.5 9-7"/>
            </svg>
          </div>
          <h3 class="text-base font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors duration-300">Single Sign-On</h3>
          <p class="text-xs text-gray-600 font-light leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            Access all your enterprise applications with one secure login. Enhanced security with enterprise-grade authentication.
          </p>
        </div>
      </div>
      
      <div class="group relative">
        <div class="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-indigo-100/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative text-center p-3 rounded-xl bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200 backdrop-blur-sm hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
          <div class="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center shadow-lg border border-purple-200">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <rect width="7" height="9" x="3" y="3" rx="1"/>
              <rect width="7" height="5" x="14" y="3" rx="1"/>
              <rect width="7" height="9" x="14" y="12" rx="1"/>
              <rect width="7" height="5" x="3" y="16" rx="1"/>
            </svg>
          </div>
          <h3 class="text-base font-bold text-gray-900 mb-1.5 group-hover:text-purple-600 transition-colors duration-300">Unified Dashboard</h3>
          <p class="text-xs text-gray-600 font-light leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            Centralized control panel with real-time insights across all connected applications and business metrics.
          </p>
        </div>
      </div>
      
      <div class="group relative">
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-teal-100/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative text-center p-3 rounded-xl bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200 backdrop-blur-sm hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
          <div class="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center shadow-lg border border-indigo-200">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="m8 6 4 4-4 4"/>
              <path d="m12 6 4 4-4 4"/>
            </svg>
          </div>
          <h3 class="text-base font-bold text-gray-900 mb-1.5 group-hover:text-indigo-600 transition-colors duration-300">Smart Integration</h3>
          <p class="text-xs text-gray-600 font-light leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            Seamless data flow between applications. Real-time synchronization and automated workflow orchestration.
          </p>
        </div>
      </div>
      
      <div class="group relative">
        <div class="absolute inset-0 bg-gradient-to-r from-teal-100/50 to-emerald-100/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative text-center p-3 rounded-xl bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200 backdrop-blur-sm hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
          <div class="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center shadow-lg border border-teal-200">
            <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
            </svg>
          </div>
          <h3 class="text-base font-bold text-gray-900 mb-1.5 group-hover:text-teal-600 transition-colors duration-300">Advanced Analytics</h3>
          <p class="text-xs text-gray-600 font-light leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            Cross-platform reporting and business intelligence. Data-driven insights with predictive analytics capabilities.
          </p>
        </div>
      </div>
    </div>

    <!-- Enterprise Features -->
    <div class="grid lg:grid-cols-2 gap-16 items-center mb-20">
      <div class="space-y-8">
        <div>
          <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 mb-4">
            Enterprise Ready
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Built for Enterprise Scale</h3>
          <p class="text-gray-700 font-light text-sm leading-relaxed">
            Enterprise-grade platform designed to handle complex organizational needs with 
            military-grade security, compliance, and scalability built from the ground up.
          </p>
        </div>

        <div class="grid gap-6">
          <div class="flex items-start space-x-4 p-4 rounded-xl bg-white/80 border border-gray-200 hover:border-gray-300 transition-colors duration-300 shadow-sm hover:shadow-md">
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border border-blue-200">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1 text-sm">Role-Based Access Control</h4>
              <p class="text-gray-600 text-xs leading-relaxed">
                Granular permission management with department-level access controls and audit trails
              </p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4 p-4 rounded-xl bg-white/80 border border-gray-200 hover:border-gray-300 transition-colors duration-300 shadow-sm hover:shadow-md">
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center border border-purple-200">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1 text-sm">API-First Architecture</h4>
              <p class="text-gray-600 text-xs leading-relaxed">
                RESTful APIs and webhooks for seamless third-party integrations and custom development
              </p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4 p-4 rounded-xl bg-white/80 border border-gray-200 hover:border-gray-300 transition-colors duration-300 shadow-sm hover:shadow-md">
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center border border-indigo-200">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1 text-sm">Real-Time Performance</h4>
              <p class="text-gray-600 text-xs leading-relaxed">
                Lightning-fast response times with 99.9% uptime SLA and global CDN distribution
              </p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4 p-4 rounded-xl bg-white/80 border border-gray-200 hover:border-gray-300 transition-colors duration-300 shadow-sm hover:shadow-md">
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center border border-teal-200">
              <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1 text-sm">Compliance & Security</h4>
              <p class="text-gray-600 text-xs leading-relaxed">
                SOC 2, GDPR, HIPAA compliant with end-to-end encryption and data sovereignty
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive Platform Mockup -->
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-3xl blur-2xl opacity-50"></div>
        <div class="relative bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl rounded-3xl border border-gray-200 p-8 shadow-2xl">
          <!-- Browser Header -->
          <div class="flex items-center space-x-2 mb-6 pb-4 border-b border-gray-200">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <div class="flex-1 bg-gray-100/80 rounded-lg px-4 py-2 ml-4">
              <span class="text-gray-600 text-sm">portal.reliancecorporation.co.za</span>
            </div>
          </div>

          <!-- Platform Interface -->
          <div class="space-y-6">
            <!-- Header Stats -->
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <div class="text-slate-700 text-2xl font-bold">15+</div>
                <div class="text-gray-600 text-xs">Connected Apps</div>
              </div>
              <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <div class="text-gray-700 text-2xl font-bold">99.9%</div>
                <div class="text-gray-600 text-xs">Uptime</div>
              </div>
              <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div class="text-blue-700 text-2xl font-bold">500+</div>
                <div class="text-gray-600 text-xs">Active Users</div>
              </div>
            </div>

            <!-- Application Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors duration-300 group cursor-pointer shadow-sm hover:shadow-md">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center border border-slate-200">
                    <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <div class="text-gray-900 text-sm font-semibold group-hover:text-slate-700 transition-colors">RC Analytics</div>
                </div>
                <div class="h-8 bg-gradient-to-r from-slate-200/60 to-gray-200/60 rounded-lg opacity-80"></div>
              </div>
              
              <div class="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-colors duration-300 group cursor-pointer shadow-sm hover:shadow-md">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div class="text-gray-900 text-sm font-semibold group-hover:text-blue-700 transition-colors">RC CRM</div>
                </div>
                <div class="h-8 bg-gradient-to-r from-blue-200/60 to-slate-200/60 rounded-lg opacity-80"></div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center justify-between p-4 bg-gray-100/60 rounded-xl border border-gray-200">
              <div class="text-gray-900 text-sm font-medium">Quick Launch</div>
              <div class="flex space-x-2">
                <div class="w-6 h-6 bg-slate-200/60 rounded border border-slate-300"></div>
                <div class="w-6 h-6 bg-gray-200/60 rounded border border-gray-300"></div>
                <div class="w-6 h-6 bg-blue-200/60 rounded border border-blue-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Platform Benefits -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200 mb-6">
        Why Choose RC Convergio Portal
      </div>
      <h3 class="text-3xl font-bold text-gray-900 mb-4">Transform Your Business Operations</h3>
      <p class="text-gray-700 font-light text-lg mb-12 max-w-3xl mx-auto">
        Experience unprecedented efficiency with our unified platform approach
      </p>
      
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200 p-8 rounded-2xl backdrop-blur-sm hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div class="text-6xl font-bold text-blue-600 mb-4">85%</div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Time Reduction</h4>
            <p class="text-gray-600 text-sm leading-relaxed">
              Average time saved on daily operations through unified access and automated workflows
            </p>
          </div>
        </div>
        
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-indigo-100/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200 p-8 rounded-2xl backdrop-blur-sm hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div class="text-6xl font-bold text-purple-600 mb-4">60%</div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Cost Savings</h4>
            <p class="text-gray-600 text-sm leading-relaxed">
              Reduction in IT infrastructure costs through consolidated platform management
            </p>
          </div>
        </div>
        
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200 p-8 rounded-2xl backdrop-blur-sm hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div class="text-6xl font-bold text-teal-600 mb-4">99.9%</div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Reliability</h4>
            <p class="text-gray-600 text-sm leading-relaxed">
              Enterprise-grade uptime with 24/7 monitoring and automated failover systems
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center bg-gradient-to-r from-white/80 to-gray-50/80 backdrop-blur-sm p-12 rounded-3xl border border-gray-200 shadow-xl">
      <h3 class="text-3xl font-bold text-gray-900 mb-4">Ready to Unify Your Operations?</h3>
      <p class="text-gray-700 font-light text-lg mb-8 max-w-2xl mx-auto">
        Join hundreds of enterprises already transforming their business with RC Convergio Portal
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-[#d4418e] to-[#0652c5] hover:from-[#c23a7f] hover:to-[#0548a8] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Start Free Trial
          <svg class="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12"></path>
          </svg>
        </button>
        <button class="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-transparent hover:bg-gray-50 hover:border-gray-400 transition-all duration-300">
          Schedule Demo
        </button>
      </div>
    </div>
  </div>
</section>


    <!-- About Us Section -->
    <section id="about" class="py-8 bg-gradient-to-b from-[#f8fafc] via-white to-[#f1f5f9]">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="relative inline-block">
        <!-- Background gradient for header -->
        <div class="absolute inset-0 bg-gradient-to-r from-teal-100/50 via-emerald-100/50 to-green-100/50 rounded-2xl blur-xl"></div>
        <div class="relative bg-gradient-to-r from-white/80 via-gray-50/80 to-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200">
          <h2 class="text-xl lg:text-2xl font-bold text-gray-900 mb-1 tracking-tight">
                      About <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#d4418e] to-[#0652c5]">RC Convergio</span>
          </h2>
          <p class="text-xs text-gray-600 font-light max-w-2xl mx-auto">
            Pioneering the future of enterprise software integration
          </p>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid lg:grid-cols-2 gap-8 items-center mb-12">
      <!-- Left Content -->
      <div class="space-y-8">
        <div class="space-y-6">
          <p class="text-sm text-gray-700 font-light leading-relaxed">
            We're enterprise software architects dedicated to transforming how businesses operate through unified digital experiences.
          </p>
          <p class="text-sm text-gray-700 font-light leading-relaxed">
            Our mission is to eliminate operational silos by connecting all your business applications into one powerful, secure, and intuitive platform. 
            We believe that enterprise software should work together, not in isolation.
          </p>
        </div>

        <!-- Core Values -->
        <div class="space-y-4">
          <div class="flex items-start space-x-4">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 border border-blue-200">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1">Innovation First</h4>
              <p class="text-gray-600 text-sm">Cutting-edge technology that scales with your business</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 border border-purple-200">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1">Security by Design</h4>
              <p class="text-gray-600 text-sm">Enterprise-grade protection for your most valuable data</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4">
            <div class="w-8 h-8 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 border border-teal-200">
              <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1">Customer Success</h4>
              <p class="text-gray-600 text-sm">Your success is our success, every step of the way</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Content -->
      <div class="space-y-6">
        <!-- Mission Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200 backdrop-blur-sm p-8 rounded-2xl hover:border-gray-300 transition-all duration-500 shadow-lg hover:shadow-xl">
            <div class="w-12 h-12 bg-gradient-to-br from-[#d4418e] to-[#0652c5] rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">Our Mission</h3>
            <p class="text-gray-700 font-light leading-relaxed">
              Transform enterprise operations through seamless software integration, empowering businesses to achieve unprecedented efficiency and growth.
            </p>
          </div>
        </div>

        <!-- Vision Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-indigo-100/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200 backdrop-blur-sm p-8 rounded-2xl hover:border-gray-300 transition-all duration-500 shadow-lg hover:shadow-xl">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">Our Vision</h3>
            <p class="text-gray-700 font-light leading-relaxed">
              A world where enterprise software works as one unified ecosystem, eliminating complexity and maximizing business potential.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center">
      <div class="relative max-w-4xl mx-auto">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-3xl blur-2xl"></div>
        <div class="relative bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl p-12 rounded-3xl border border-gray-200 shadow-2xl">
          <h3 class="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Business?</h3>
          <p class="text-gray-700 font-light text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of enterprises already revolutionizing their operations with our unified platform.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              @click="scrollToContact"
              class="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#d4418e] to-[#0652c5] text-white text-lg font-semibold rounded-xl hover:from-[#c23a7f] hover:to-[#0548a8] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
            >
              <span>Start Your Journey</span>
              <svg class="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12"></path>
              </svg>
            </button>
            
          </div>
          
          <!-- Trust Indicator -->
          <div class="mt-8 pt-6 border-t border-slate-700/50">
            <p class="text-sm text-gray-600 flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <section id="contact" class="py-8 bg-gradient-to-b from-[#f8fafc] via-white to-[#f1f5f9]">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="relative inline-block">
        <!-- Background gradient for header -->
        <div class="absolute inset-0 bg-gradient-to-r from-rose-100/50 via-pink-100/50 to-purple-100/50 rounded-2xl blur-xl"></div>
        <div class="relative bg-gradient-to-r from-white/80 via-gray-50/80 to-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200">
          <h2 class="text-xl lg:text-2xl font-bold text-gray-900 mb-1 tracking-tight">
                      Contact <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#d4418e] to-[#0652c5]">Us</span>
          </h2>
          <p class="text-xs text-gray-600 font-light max-w-xl mx-auto">
            Ready to transform your enterprise? Our experts are here to help you get started with RC Convergio.
          </p>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Contact Form -->
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-3xl blur-2xl opacity-50"></div>
        <div class="relative bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 shadow-xl">
          <div class="mb-5">
            <h3 class="text-base font-bold text-gray-900 mb-1.5">Get Started Today</h3>
            <p class="text-xs text-gray-600 font-light">Tell us about your needs and we'll create a tailored solution for your enterprise.</p>
          </div>

          <form class="space-y-4">
            <div class="relative group">
              <input 
                v-model="contactForm.name"
                type="text" 
                placeholder="Your full name" 
                class="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#d4418e] focus:border-[#d4418e] outline-none transition-all duration-300 group-hover:border-gray-400"
              />
              <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-[#d4418e]/0 to-[#0652c5]/0 group-focus-within:from-[#d4418e]/10 group-focus-within:to-[#0652c5]/10 pointer-events-none transition-all duration-300"></div>
            </div>

            <div class="relative group">
              <input 
                v-model="contactForm.email"
                type="email" 
                placeholder="Business email address" 
                class="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#d4418e] focus:border-[#d4418e] outline-none transition-all duration-300 group-hover:border-gray-400"
              />
              <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-[#d4418e]/0 to-[#0652c5]/0 group-focus-within:from-[#d4418e]/10 group-focus-within:to-[#0652c5]/10 pointer-events-none transition-all duration-300"></div>
            </div>

            <div class="relative group">
              <select class="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#d4418e] focus:border-[#d4418e] outline-none transition-all duration-300 group-hover:border-gray-400">
                <option value="" class="bg-white">Select company size</option>
                <option value="startup" class="bg-white">Startup (1-50 employees)</option>
                <option value="growth" class="bg-white">Growing Business (51-200 employees)</option>
                <option value="enterprise" class="bg-white">Enterprise (200+ employees)</option>
              </select>
            </div>

            <div class="relative group">
              <textarea 
                v-model="contactForm.message"
                placeholder="Tell us about your current challenges and how we can help..." 
                rows="6"
                class="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#d4418e] focus:border-[#d4418e] outline-none transition-all duration-300 resize-none group-hover:border-gray-400"
              ></textarea>
              <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-[#d4418e]/0 to-[#0652c5]/0 group-focus-within:from-[#d4418e]/10 group-focus-within:to-[#0652c5]/10 pointer-events-none transition-all duration-300"></div>
            </div>

            <router-link
              to="/contact"
              class="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#d4418e] to-[#0652c5] text-white text-lg font-semibold rounded-xl hover:from-[#c23a7f] hover:to-[#0548a8] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
            >
              <span>Get Support</span>
              <svg class="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
              </svg>
            </router-link>

            <p class="text-sm text-gray-600 flex items-center">
              <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div class="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative flex items-start space-x-4 p-6 bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200 rounded-2xl backdrop-blur-sm hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-lg border border-blue-200">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-10 5L2 7"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors duration-300">Email Support</h3>
                <p class="text-gray-700 font-light mb-1.5 text-xs">Get in touch with our enterprise team</p>
                <a href="mailto:info@reliancecorporation.co.za" class="text-[#d4418e] hover:text-[#c23a7f] transition-colors duration-300 font-medium text-xs">
                  info@reliancecorporation.co.za
                </a>
              </div>
            </div>
          </div>

          <div class="relative group">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-indigo-100/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative flex items-start space-x-4 p-6 bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200 rounded-2xl backdrop-blur-sm hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-lg border border-purple-200">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-base mb-1 group-hover:text-purple-600 transition-colors duration-300">Phone Support</h3>
                <p class="text-gray-700 font-light mb-1.5 text-xs">Speak directly with our experts</p>
                <a href="tel:+27104471845" class="text-[#0652c5] hover:text-[#0548a8] transition-colors duration-300 font-medium text-xs">
                  (+27) 10 447 1845
                </a>
                <p class="text-gray-600 text-xs mt-1">Mon-Fri: 8:00 AM - 6:00 PM SAST</p>
              </div>
            </div>
          </div>

          <div class="relative group">
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-teal-100/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative flex items-start space-x-4 p-6 bg-gradient-to-br from-white/80 to-gray-50/80 border border-gray-200 rounded-2xl backdrop-blur-sm hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-100 to-teal-200 rounded-xl flex items-center justify-center shadow-lg border border-teal-200">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-base mb-1 group-hover:text-indigo-600 transition-colors duration-300">Office Address</h3>
                <p class="text-gray-700 font-light mb-1.5 text-xs">Visit us for in-person consultations</p>
                <address class="text-gray-600 not-italic text-xs leading-relaxed">
                  Fish Eagle Office Park,<br>
                  Unit 7 & 8 Kingfisher Crescent, <br>
                  Meyersdal Alberton, Johannesburg 1448
                </address>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="bg-gradient-to-br from-white/60 to-gray-50/60 border border-gray-200 rounded-2xl p-6 backdrop-blur-sm shadow-lg">
          <h4 class="font-bold text-gray-900 mb-4">Need Immediate Help?</h4>
          <div class="space-y-3">
            <a href="#" class="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-300 group">
              <svg class="w-4 h-4 mr-3 text-blue-600 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              <span>Documentation & Guides</span>
            </a>
            <a href="#" class="flex items-center text-gray-700 hover:text-purple-600 transition-colors duration-300 group">
              <svg class="w-4 h-4 mr-3 text-purple-600 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <path d="M12 17h.01"/>
              </svg>
              <span>FAQ & Support Center</span>
            </a>
            <a href="#" class="flex items-center text-gray-700 hover:text-teal-600 transition-colors duration-300 group">
              <svg class="w-4 h-4 mr-3 text-teal-600 group-hover:text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path d="m22 8-6 4 6 4V8Z"/>
                <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
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
    <footer class="bg-gray-100 text-gray-900 py-8 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-6">
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-[#d4418e]">RC Convergio</h3>
            <p class="text-gray-600 font-calibri">
              Supercharge your customer conversions with powerful automation and insights.
            </p>
          </div>
          
          <div class="space-y-4">
            <h4 class="font-bold text-gray-900">Company</h4>
            <div class="space-y-2">
              <a href="#" class="block text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <a href="#" class="block text-gray-600 hover:text-gray-900 transition-colors">Careers</a>
              <a href="#" class="block text-gray-600 hover:text-gray-900 transition-colors">Blog</a>
            </div>
          </div>
          
          <div class="space-y-4">
            <h4 class="font-bold text-gray-900">Product</h4>
            <div class="space-y-2">
              <a href="#features" class="block text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#product" class="block text-gray-600 hover:text-gray-900 transition-colors">Our Product</a>
              <a href="#" class="block text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#" class="block text-gray-600 hover:text-gray-900 transition-colors">Integrations</a>
            </div>
          </div>
          
          <div class="space-y-4">
            <h4 class="font-bold text-gray-900">Legal</h4>
            <div class="space-y-2">
              <a href="#" class="block text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" class="block text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="#" class="block text-gray-600 hover:text-gray-900 transition-colors">Security</a>
              <a href="#" class="block text-gray-600 hover:text-gray-900 transition-colors">Support</a>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-300 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p class="text-gray-600 font-calibri">
            © 2024 RC Convergio. All rights reserved.
          </p>
          <div class="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">
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
import rcErpImg from '@/assets/Rcerp.png'
import rcIsmsImg from '@/assets/Rcisms.png'
import rcMaxiImg from '@/assets/Rcmaxi.png'

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
    title: "RC Junior Minds Platform",
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
    image: rcMaxiImg,
    gradient: "bg-gradient-to-br from-teal-500/20 to-cyan-500/20",
    features: ["Marketing", "Automation", "Campaigns"]
  },
  {
    title: "RC ISMS",
    description: "Enterprise-grade security platform with threat detection, compliance monitoring, and risk assessment capabilities.",
    image: rcIsmsImg,
    gradient: "bg-gradient-to-br from-rose-500/20 to-orange-500/20",
    features: ["Security", "Compliance", "Monitoring"]
  },
  {
    title: "RC ERP",
    description: "Intelligent automation platform leveraging artificial intelligence to optimize workflows and enhance productivity.",
    image: rcErpImg,
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
/* Custom scrollbar - thin with light theme colors */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f8fafc;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Smooth scrolling for all elements */
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px; /* Offset for fixed header */
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
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
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

/* --- Professional animated background for hero --- */
.mesh-bg {
  background:
    radial-gradient(600px circle at 10% 20%, rgba(212, 65, 142, 0.15), transparent 60%),
    radial-gradient(420px circle at 85% 25%, rgba(6, 82, 197, 0.12), transparent 60%),
    radial-gradient(520px circle at 30% 85%, rgba(37, 150, 190, 0.12), transparent 60%),
    radial-gradient(360px circle at 75% 80%, rgba(151, 56, 148, 0.10), transparent 60%);
  animation: mesh-shift 22s ease-in-out infinite alternate;
}

@keyframes mesh-shift {
  0% {
    background-position: 10% 20%, 85% 25%, 30% 85%, 75% 80%;
  }
  100% {
    background-position: 18% 28%, 78% 22%, 26% 78%, 82% 72%;
  }
}

.animated-grid {
  background-image: radial-gradient(circle at 1px 1px, rgba(2, 6, 23, 0.06) 1px, transparent 1px);
  background-size: 24px 24px;
  animation: grid-pan 60s linear infinite;
}

@keyframes grid-pan {
  from { background-position: 0 0; }
  to { background-position: 240px 0; }
}

.gradient-blob {
  position: absolute;
  filter: blur(40px);
  opacity: 0.25;
  mix-blend-mode: multiply;
}

.blob-1 {
  top: -10%;
  left: -5%;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(212, 65, 142, 0.45), transparent 60%);
  animation: blob-move-1 30s ease-in-out infinite;
}

.blob-2 {
  bottom: -8%;
  right: -6%;
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, rgba(6, 82, 197, 0.4), transparent 60%);
  animation: blob-move-2 28s ease-in-out infinite;
}

.blob-3 {
  top: 18%;
  right: 15%;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(37, 150, 190, 0.38), transparent 60%);
  animation: blob-move-3 32s ease-in-out infinite;
}

@keyframes blob-move-1 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, 20px) scale(1.08); }
  100% { transform: translate(-20px, -10px) scale(1.04); }
}

@keyframes blob-move-2 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-30px, -20px) scale(1.06); }
  100% { transform: translate(15px, 10px) scale(1.03); }
}

@keyframes blob-move-3 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -25px) scale(1.07); }
  100% { transform: translate(-10px, 15px) scale(1.02); }
}

/* --- Animated wave patterns --- */
.wave-svg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.7;
}

.wave-1 {
  animation: wave-animate-1 18s ease-in-out infinite;
}

.wave-2 {
  animation: wave-animate-2 22s ease-in-out infinite;
}

.wave-3 {
  animation: wave-animate-3 26s ease-in-out infinite;
}

@keyframes wave-animate-1 {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(-3%) translateY(-2%); }
}

@keyframes wave-animate-2 {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(4%) translateY(2%); }
}

@keyframes wave-animate-3 {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(-2%) translateY(-3%); }
}

/* --- Floating geometric shapes --- */
.floating-shape {
  position: absolute;
  opacity: 0.12;
  filter: blur(2px);
}

.shape-circle-1 {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 65, 142, 0.3), rgba(151, 56, 148, 0.2));
  top: 15%;
  left: 8%;
  animation: float-shape-1 20s ease-in-out infinite;
}

.shape-square-1 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(6, 82, 197, 0.3), rgba(37, 150, 190, 0.2));
  border-radius: 12px;
  top: 60%;
  right: 12%;
  animation: float-shape-2 24s ease-in-out infinite;
  transform: rotate(45deg);
}

.shape-triangle-1 {
  width: 0;
  height: 0;
  border-left: 60px solid transparent;
  border-right: 60px solid transparent;
  border-bottom: 100px solid rgba(37, 150, 190, 0.25);
  top: 75%;
  left: 20%;
  animation: float-shape-3 28s ease-in-out infinite;
}

.shape-circle-2 {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(151, 56, 148, 0.25), rgba(212, 65, 142, 0.2));
  top: 35%;
  right: 25%;
  animation: float-shape-4 22s ease-in-out infinite;
}

.shape-square-2 {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(37, 150, 190, 0.25), rgba(6, 82, 197, 0.2));
  border-radius: 8px;
  top: 20%;
  right: 35%;
  animation: float-shape-5 26s ease-in-out infinite;
  transform: rotate(25deg);
}

@keyframes float-shape-1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -20px) rotate(120deg); }
  66% { transform: translate(-20px, 30px) rotate(240deg); }
}

@keyframes float-shape-2 {
  0%, 100% { transform: rotate(45deg) translate(0, 0); }
  33% { transform: rotate(165deg) translate(20px, -30px); }
  66% { transform: rotate(285deg) translate(-30px, 20px); }
}

@keyframes float-shape-3 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-40px, -30px) rotate(180deg); }
}

@keyframes float-shape-4 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-25px, 30px) scale(1.15); }
  66% { transform: translate(35px, -25px) scale(0.9); }
}

@keyframes float-shape-5 {
  0%, 100% { transform: rotate(25deg) translate(0, 0); }
  50% { transform: rotate(205deg) translate(25px, 35px); }
}
</style>