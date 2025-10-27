<template>
  <div class="memberships-view">
    <!-- Header -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        🚀 Advanced Features Coming Soon
      </h2>
      <p class="text-lg text-gray-600">
        Unlock premium page creation and blog features with a subscription
      </p>
    </div>

    <!-- Main Feature Card -->
    <div class="max-w-4xl mx-auto">
      <div class="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-8">
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Advanced Page & Blog Creation</h3>
          <p class="text-gray-600 text-lg mb-8">
            Get access to premium templates, advanced page types, and professional blog features
          </p>
        </div>
        
        <!-- Feature Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">📄 Advanced Pages</h4>
            <p class="text-sm text-gray-600">Premium page templates, advanced layouts, and professional designs</p>
          </div>
          
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">📝 Blog System</h4>
            <p class="text-sm text-gray-600">Professional blog creation, categories, and content management</p>
          </div>
          
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">🎯 Landing Pages</h4>
            <p class="text-sm text-gray-600">High-converting landing page templates and optimization tools</p>
          </div>
        </div>
        
        <!-- Subscription CTA -->
        <div class="text-center">
          <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
            <h4 class="text-2xl font-bold mb-3">Ready to Unlock Advanced Features?</h4>
            <p class="text-purple-100 mb-6 text-lg">
              Get access to premium templates, blog system, and advanced page creation tools
            </p>
            
            <div class="flex items-center justify-center space-x-8 mb-6">
              <div class="text-center">
                <div class="text-3xl font-bold">$29</div>
                <div class="text-purple-200 text-sm">per month</div>
              </div>
              <div class="text-purple-200">or</div>
              <div class="text-center">
                <div class="text-3xl font-bold">$290</div>
                <div class="text-purple-200 text-sm">per year</div>
                <div class="text-xs text-purple-300">Save 17%</div>
              </div>
            </div>
            
            <button
              @click="showSubscriptionModal = true"
              class="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              💳 Buy Subscription
            </button>
            
            <p class="text-purple-200 text-sm mt-4">
              Instant access • Cancel anytime • 30-day money back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Subscription Modal -->
    <div v-if="showSubscriptionModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">🚀 Upgrade to Advanced</h3>
      <button
            @click="showSubscriptionModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <div class="text-center">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            
            <h4 class="text-xl font-bold text-gray-900 mb-2">Advanced Page & Blog Features</h4>
            <p class="text-gray-600 mb-6">
              Unlock premium page creation, professional blog system, and advanced landing page templates.
            </p>
            
            <div class="space-y-3 text-left mb-6">
              <div class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-gray-700">Premium page templates</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-gray-700">Professional blog system</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-gray-700">Advanced landing pages</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
                <span class="text-sm text-gray-700">Premium components & layouts</span>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 mb-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-800 mb-1">$29/month</div>
                <div class="text-sm text-purple-600">Advanced Plan</div>
              </div>
            </div>
            
            <button
              @click="contactForUpgrade"
              class="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              💳 Purchase Subscription
      </button>
            
            <p class="text-xs text-gray-500 mt-3">
              Contact our team to purchase your advanced subscription
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCmsStore } from '@/stores/cms';

const router = useRouter();
const cmsStore = useCmsStore();

const showSubscriptionModal = ref(false);

const contactForUpgrade = () => {
  // Customize this to your preferred contact/purchase method
  const message = `Hi! I'd like to purchase the Advanced Plan subscription for RC Convergio CMS to unlock premium page creation, blog system, and landing page features. Please provide payment details and setup information.`;
  const encodedMessage = encodeURIComponent(message);
  
  // Option 1: Email for subscription purchase
  window.open(`mailto:sales@convergio.world?subject=Advanced Plan Subscription Purchase&body=${encodedMessage}`);
  
  // Option 2: WhatsApp (uncomment if preferred)
  // window.open(`https://wa.me/1234567890?text=${encodedMessage}`);
  
  // Option 3: Redirect to payment page (uncomment when payment system is ready)
  // window.open('https://convergio.world/subscribe/advanced');
  
  showSubscriptionModal.value = false;
};

// No onMounted needed for simple subscription page
</script>




