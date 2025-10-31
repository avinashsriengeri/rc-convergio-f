<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" v-if="!hasError">
    <!-- Professional Header -->
    <div class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Subscription Plans</h1>
            <p class="text-base text-gray-600">Manage your subscription plans and pricing strategies</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="refreshPlans"
              :disabled="subscriptionsStore.plansLoading"
              class="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple disabled:opacity-50"
            >
              <svg v-if="subscriptionsStore.plansLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              @click="openCreateModal"
              class="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-primary-purple hover:bg-primary-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Plan
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Professional Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <!-- Total Plans Card -->
        <div class="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-primary-purple rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Plans</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">{{ subscriptionsStore.plans.length }}</p>
                <p class="text-xs text-gray-500 font-medium">+2 this month</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Plans Card -->
        <div class="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-primary-purple/10 rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-primary-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Plans</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">{{ subscriptionsStore.activePlansCount || subscriptionsStore.plans.filter(p => p.active !== false).length }}</p>
                <p class="text-xs text-gray-500 font-medium">100% active</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Average Price Card -->
        <div class="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-primary-purple/10 rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-primary-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Avg. Price</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">${{ averagePrice }}</p>
                <p class="text-xs text-gray-500 font-medium">Per month</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stripe Synced Card -->
        <div class="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-primary-purple rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Stripe Synced</p>
                <p class="text-3xl font-bold text-gray-900 mt-1">{{ stripeSyncedCount }}</p>
                <p class="text-xs text-gray-500 font-medium">Payment ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Plans Grid -->
      <div v-if="subscriptionsStore.plansLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="bg-white border border-gray-200 rounded-xl shadow-sm min-h-[280px] animate-pulse">
          <div class="p-5">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div class="space-y-2">
              <div class="h-3 bg-gray-200 rounded"></div>
              <div class="h-3 bg-gray-200 rounded w-5/6"></div>
              <div class="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="subscriptionsStore.plans.length === 0" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
          <div class="w-20 h-20 bg-gradient-to-r from-primary-purple to-primary-purple/90 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">No subscription plans</h3>
          <p class="text-gray-600 mb-8">Get started by creating your first subscription plan to begin monetizing your services.</p>
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-8 py-4 border border-transparent shadow-lg text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-primary-purple to-primary-purple/90 hover:from-primary-purple/90 hover:to-primary-purple/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transform hover:scale-105 transition-all duration-200"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Your First Plan
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SubscriptionPlanCard
          v-for="plan in subscriptionsStore.plans"
          :key="plan.id"
          :plan="plan"
          @edit="editPlan"
          @delete="deletePlan"
          @checkout-created="handleCheckoutCreated"
        />
      </div>
    </div>

    <!-- Create/Edit Plan Modal -->
    <SubscriptionPlanModal
      :show="showModal"
      :plan="editingPlan"
      :loading="subscriptionsStore.loading"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
  
  <!-- Error State -->
  <div v-else class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p class="text-gray-600 mb-4">There was an error loading the subscription plans.</p>
      <button 
        @click="retryLoad"
        class="bg-primary-purple text-white px-4 py-2 rounded-md hover:bg-primary-purple/90"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onErrorCaptured } from 'vue'
import { useCommerceSubscriptionsStore } from '@/stores/useCommerceSubscriptionsStore'
import SubscriptionPlanCard from '@/components/commerce/SubscriptionPlanCard.vue'
import SubscriptionPlanModal from '@/components/commerce/SubscriptionPlanModal.vue'

const subscriptionsStore = useCommerceSubscriptionsStore()

const showModal = ref(false)
const editingPlan = ref(null)
const hasError = ref(false)

const averagePrice = computed(() => {
  if (subscriptionsStore.plans.length === 0) return '0.00'
  const total = subscriptionsStore.plans.reduce((sum, plan) => {
    const price = plan.amount_cents ? plan.amount_cents / 100 : parseFloat(plan.price || 0)
    return sum + price
  }, 0)
  return (total / subscriptionsStore.plans.length).toFixed(2)
})

const stripeSyncedCount = computed(() => {
  return subscriptionsStore.plans.filter(plan => plan.stripe_price_id).length
})

const openCreateModal = () => {
  editingPlan.value = null
  showModal.value = true
}

const editPlan = (plan) => {
  editingPlan.value = plan
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingPlan.value = null
}

const handleSubmit = async (planData) => {
  try {
    if (editingPlan.value) {
      await subscriptionsStore.updatePlan(editingPlan.value.id, planData)
      if (window.Swal) {
        window.Swal.fire({
          icon: 'success',
          title: 'Plan Updated!',
          text: 'Subscription plan has been updated successfully',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
      }
    } else {
      await subscriptionsStore.createPlan(planData)
      if (window.Swal) {
        window.Swal.fire({
          icon: 'success',
          title: 'Plan Created!',
          text: 'New subscription plan has been created successfully',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
      }
    }
    closeModal()
  } catch (error) {
    console.error('Error saving plan:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to save plan',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  }
}

const deletePlan = async (planId) => {
  try {
    await subscriptionsStore.deletePlan(planId)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Plan Deleted!',
        text: 'Subscription plan has been deleted successfully',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } catch (error) {
    console.error('Error deleting plan:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to delete plan',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  }
}

const handleCheckoutCreated = (data) => {
  console.log('Checkout created for plan:', data.plan.name, 'URL:', data.checkoutUrl)
  // Optional: You can add additional logic here, like logging or analytics
}

const refreshPlans = async () => {
  try {
    await subscriptionsStore.fetchPlans()
  } catch (error) {
    console.error('Error refreshing plans:', error)
  }
}

const retryLoad = async () => {
  hasError.value = false
  await initializePlans()
}

const initializePlans = async () => {
  try {
    hasError.value = false
    await subscriptionsStore.fetchPlans()
    console.log('Plans after fetch:', subscriptionsStore.plans)
    console.log('Plans length:', subscriptionsStore.plans.length)
  } catch (error) {
    console.error('Error initializing subscription plans:', error)
    hasError.value = true
  }
}

onMounted(async () => {
  await initializePlans()
})

// Global error handler for this component
onErrorCaptured((error, instance, info) => {
  console.error('Component error captured:', error, info)
  hasError.value = true
  return false // Prevent error from propagating
})
</script>
