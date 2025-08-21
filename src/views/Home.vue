<template>
  <div id="app" class="font-baloo text-tertiary">
    <!-- Fixed Navigation Header -->
    <nav class="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm border-b border-primary/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-3 items-center h-16">
          <!-- Left: Brand -->
          <div class="flex items-center gap-3">
            <img :src="logo" alt="RC Convergio" class="h-8 w-8 rounded-full" />
            <h1 class="text-2xl font-bold text-primary">RC Convergio</h1>
          </div>

          <!-- Center: Navigation Links (desktop) -->
          <div class="hidden md:flex items-center justify-center space-x-6">
            <a 
              href="#features" 
              @click="smoothScroll"
              :class="{ 'text-primary font-semibold': activeSection === 'features' }"
              class="text-secondary hover:text-primary transition-colors duration-300 px-3 py-2 rounded-md"
            >
              Features
            </a>
            <a 
              href="#about" 
              @click="smoothScroll"
              :class="{ 'text-primary font-semibold': activeSection === 'about' }"
              class="text-secondary hover:text-primary transition-colors duration-300 px-3 py-2 rounded-md"
            >
              About Us
            </a>
            <a 
              href="#contact" 
              @click="smoothScroll"
              :class="{ 'text-primary font-semibold': activeSection === 'contact' }"
              class="text-secondary hover:text-primary transition-colors duration-300 px-3 py-2 rounded-md"
            >
              Contact
            </a>
          </div>

          <!-- Right: Login (desktop) + Mobile menu button -->
          <div class="flex items-center justify-end gap-4">
            <router-link
              to="/login"
              class="hidden md:inline-block bg-accent text-black px-6 py-2 rounded-lg hover:bg-secondary transition-colors duration-300"
            >
              Login
            </router-link>

            <!-- Mobile menu button -->
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-primary">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-show="mobileMenuOpen" class="md:hidden bg-white border-t border-primary/10">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#features" @click="smoothScroll" class="block px-3 py-2 text-secondary hover:text-primary">Features</a>
          <a href="#about" @click="smoothScroll" class="block px-3 py-2 text-secondary hover:text-primary">About Us</a>
          <a href="#contact" @click="smoothScroll" class="block px-3 py-2 text-secondary hover:text-primary">Contact</a>
          <router-link
            to="/login"
            @click="mobileMenuOpen = false"
            class="block w-full bg-accent text-white px-3 py-2 rounded-lg hover:bg-secondary"
          >
            Login
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="hero" class="pt-16 min-h-screen bg-gradient-to-br from-primary/5 via-white to-tertiary/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <h1 class="text-5xl lg:text-6xl font-bold text-tertiary leading-tight">
              Customer Conversions, 
              <span class="text-primary">Supercharged</span>
            </h1>
            <p class="text-xl text-tertiary/80 font-calibri leading-relaxed max-w-xl">
              RC Convergio helps you capture, nurture, and convert leads with powerful automation, 
              unified messaging, and actionable insights
            </p>
            
            <!-- Email Capture Form -->
            <div class="flex flex-col sm:flex-row gap-4 max-w-md">
              <input 
                v-model="heroEmail"
                type="email" 
                placeholder="Enter your email" 
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <button 
                @click="scrollToContact"
                class="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
          
          <!-- Dashboard Mockup -->
          <div class="relative">
            <div class="bg-white rounded-2xl shadow-2xl p-6 transform rotate-1">
              <div class="bg-gradient-to-r from-primary to-tertiary h-4 rounded-t-lg mb-4"></div>
              <div class="space-y-4">
                <div class="h-8 bg-gray-100 rounded w-3/4"></div>
                <div class="grid grid-cols-3 gap-4">
                  <div class="h-16 bg-primary/10 rounded"></div>
                  <div class="h-16 bg-secondary/10 rounded"></div>
                  <div class="h-16 bg-accent/10 rounded"></div>
                </div>
                <div class="h-32 bg-gradient-to-r from-tertiary/10 to-primary/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust Indicators Bar -->
      <div class="bg-white py-12 border-t border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p class="text-gray-600 font-calibri mb-8">Trusted by 5,000+ teams</p>
          <div class="flex justify-center items-center space-x-12 opacity-60">
            <div class="h-8 w-24 bg-gray-300 rounded"></div>
            <div class="h-8 w-24 bg-gray-300 rounded"></div>
            <div class="h-8 w-24 bg-gray-300 rounded"></div>
            <div class="h-8 w-24 bg-gray-300 rounded"></div>
            <div class="h-8 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Features Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to convert more
          </h2>
          <p class="text-xl text-gray-600 font-calibri max-w-3xl mx-auto">
            Turn first-time visitors into marketing, sales, and service to accelerate growth
          </p>
        </div>

        <!-- Main Features -->
        <div class="grid md:grid-cols-3 gap-8 mb-20">
          <div class="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Lead Automation</h3>
            <p class="text-gray-600 font-calibri">
              Capture and qualify leads with workflows, forms, and funnel tracking
            </p>
          </div>
          
          <div class="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
            <div class="text-4xl mb-4">📧</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Unified Inbox</h3>
            <p class="text-gray-600 font-calibri">
              Manage email, chat, and social messages in one place, with context
            </p>
          </div>
          
          <div class="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Analytics</h3>
            <p class="text-gray-600 font-calibri">
              Track attribution, funnel performance, and revenue impact
            </p>
          </div>
        </div>

        <!-- Advanced Features -->
        <div class="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div class="space-y-8">
            <div>
              <h3 class="text-3xl font-bold text-gray-900 mb-4">Personalize every touchpoint</h3>
              <p class="text-gray-600 font-calibri text-lg">
                Use segments and dynamic content to deliver relevant experiences
              </p>
            </div>

            <div class="grid sm:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="text-2xl">🎯</div>
                <h4 class="font-bold text-gray-900">Smart Segments</h4>
                <p class="text-gray-600 font-calibri text-sm">
                  Build real-time audiences based on behavior and demographics
                </p>
              </div>
              
              <div class="space-y-3">
                <div class="text-2xl">🔄</div>
                <h4 class="font-bold text-gray-900">Dynamic Content</h4>
                <p class="text-gray-600 font-calibri text-sm">
                  Swap headlines, blocks, and CTAs to match visitor intent
                </p>
              </div>
              
              <div class="space-y-3">
                <div class="text-2xl">🛣️</div>
                <h4 class="font-bold text-gray-900">Journeys</h4>
                <p class="text-gray-600 font-calibri text-sm">
                  Drag-and-drop automation to nurture and down customers
                </p>
              </div>
              
              <div class="space-y-3">
                <div class="text-2xl">✅</div>
                <h4 class="font-bold text-gray-900">Compliance</h4>
                <p class="text-gray-600 font-calibri text-sm">
                  GDPR, CCPA and consent tools built in out of the box
                </p>
              </div>
            </div>
          </div>

          <!-- Product Screenshot -->
          <div class="relative">
            <div class="bg-white rounded-xl shadow-2xl p-6">
              <div class="bg-gradient-to-r from-primary to-secondary h-3 rounded-t-lg mb-6"></div>
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div class="w-4 h-4 bg-primary rounded-full"></div>
                  <div class="h-4 bg-gray-200 rounded flex-1"></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="h-20 bg-gradient-to-br from-tertiary/20 to-accent/20 rounded-lg"></div>
                  <div class="h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg"></div>
                </div>
                <div class="h-24 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Proof -->
        <div class="text-center mb-16">
          <h3 class="text-3xl font-bold text-gray-900 mb-4">Loved by modern go-to-market teams</h3>
          <p class="text-gray-600 font-calibri text-lg mb-12">Here's what our customers say</p>
          
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-gray-50 p-6 rounded-xl">
              <p class="text-gray-700 font-calibri mb-4">
                "Our marketing and sales teams love and increased our qualified pipeline by 22% in two months."
              </p>
              <div class="font-bold text-primary">Ana Thompson</div>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-xl">
              <p class="text-gray-700 font-calibri mb-4">
                "The automation and insights gave our team superpowers using was first and intuitive."
              </p>
              <div class="font-bold text-secondary">Jamal Ortiz</div>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-xl">
              <p class="text-gray-700 font-calibri mb-4">
                "We finally have a clear view of the funnel. Campaign decisions are now data-driven."
              </p>
              <div class="font-bold text-tertiary">Mira Park</div>
            </div>
          </div>
        </div>

        <!-- Pricing -->
        <div class="text-center">
          <h3 class="text-3xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h3>
          <p class="text-gray-600 font-calibri text-lg mb-12">Choose a plan that fits your stage, upgrade anytime</p>
          
          <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div class="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
              <h4 class="text-xl font-bold text-gray-900 mb-2">Starter</h4>
              <p class="text-gray-600 font-calibri mb-6">For small teams getting started</p>
              <button class="w-full bg-primary text-white py-3 rounded-lg hover:bg-tertiary transition-colors duration-300">
                Contact Sales
              </button>
            </div>
            
            <div class="border-2 border-accent rounded-xl p-8 relative">
              <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm">
                Popular
              </div>
              <h4 class="text-xl font-bold text-gray-900 mb-2">Growth</h4>
              <p class="text-gray-600 font-calibri mb-6">Advanced automation and reporting</p>
              <button class="w-full bg-accent text-white py-3 rounded-lg hover:bg-secondary transition-colors duration-300">
                Contact Sales
              </button>
            </div>
            
            <div class="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
              <h4 class="text-xl font-bold text-gray-900 mb-2">Scale</h4>
              <p class="text-gray-600 font-calibri mb-6">For large orgs with complex needs</p>
              <button class="w-full bg-tertiary text-white py-3 rounded-lg hover:bg-secondary transition-colors duration-300">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Us Section -->
    <section id="about" class="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">About RC Convergio</h2>
        </div>

        <div class="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div class="space-y-6">
            <p class="text-lg text-gray-700 font-calibri leading-relaxed">
              We're a team of builders dedicated to helping companies grow through better customer experiences.
            </p>
            <p class="text-gray-600 font-calibri leading-relaxed">
              Our mission is to make sophisticated growth tools simple and accessible for businesses of all sizes. 
              We believe that every interaction matters and every customer deserves personalized experiences.
            </p>
          </div>

          <div class="grid gap-8">
            <div class="bg-white p-6 rounded-xl shadow-sm">
              <div class="text-3xl mb-4">🎯</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
              <p class="text-gray-600 font-calibri">
                Make sophisticated growth tools simple and accessible
              </p>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-sm">
              <div class="text-3xl mb-4">🔒</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Trust & Security</h3>
              <p class="text-gray-600 font-calibri">
                Your data is encrypted and protected by enterprise-grade standards
              </p>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center bg-white p-12 rounded-2xl shadow-sm">
          <h3 class="text-3xl font-bold text-gray-900 mb-4">Ready to boost conversions?</h3>
          <p class="text-gray-600 font-calibri text-lg mb-8">
            Start your 14-day free trial. No credit card required.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              @click="scrollToContact"
              class="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </button>
            <button class="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p class="text-xl text-gray-600 font-calibri">
            Have questions? Our team is here to help.
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-16">
          <!-- Contact Form -->
          <div class="space-y-6">
            <div>
              <input 
                v-model="contactForm.name"
                type="text" 
                placeholder="Your name" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <input 
                v-model="contactForm.email"
                type="email" 
                placeholder="Work email" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <textarea 
                v-model="contactForm.message"
                placeholder="How can we help?" 
                rows="5"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              ></textarea>
            </div>
            <button 
              @click="submitForm"
              class="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-secondary transition-colors duration-300"
            >
              Send message
            </button>
          </div>

          <!-- Contact Information -->
          <div class="space-y-8">
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900">Email</h3>
                  <p class="text-gray-600 font-calibri">support@rcconvergio.com</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900">Phone</h3>
                  <p class="text-gray-600 font-calibri">+1 (555) 000-1234</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-tertiary/10 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900">Address</h3>
                  <p class="text-gray-600 font-calibri">123 Market Street<br>San Francisco, CA</p>
                </div>
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

// Reactive data
const activeSection = ref('hero')
const mobileMenuOpen = ref(false)
const heroEmail = ref('')
const contactForm = ref({
  name: '',
  email: '',
  message: ''
})

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
  const sections = ['hero', 'features', 'about', 'contact']
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
</style>
