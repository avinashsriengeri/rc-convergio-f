<template>
  <div class="min-h-screen bg-gray-50" v-if="!hasError">
    <!-- Professional Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-900">Subscription Plans</h1>
            <p class="text-sm text-gray-600">Manage your subscription plans and pricing strategies</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="refreshPlans"
              :disabled="subscriptionsStore.plansLoading"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Refresh Plans
            </button>
            <button
              @click="openCreateModal"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Create Plan
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Professional Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Plans Card -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Plans</p>
              <p class="text-xl font-bold text-gray-900">{{ subscriptionsStore.plans.length }}</p>
            </div>
          </div>
        </div>

        <!-- Active Plans Card -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Plans</p>
              <p class="text-xl font-bold text-gray-900">{{ subscriptionsStore.activePlansCount || subscriptionsStore.plans.filter(p => p.active !== false).length }}</p>
            </div>
          </div>
        </div>

        <!-- Average Price Card -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Price</p>
              <p class="text-xl font-bold text-gray-900">${{ averagePrice }}</p>
            </div>
          </div>
        </div>

        <!-- Stripe Synced Card -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Stripe Synced</p>
              <p class="text-xl font-bold text-gray-900">{{ stripeSyncedCount }}</p>
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
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-12 max-w-md mx-auto">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No subscription plans</h3>
          <p class="text-sm text-gray-600 mb-8">Get started by creating your first subscription plan to begin monetizing your services.</p>
          <button
            @click="openCreateModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
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
      <BaseButton variant="primary" size="md" @click="retryLoad">
        Try Again
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onErrorCaptured } from 'vue'
import { useCommerceSubscriptionsStore } from '@/stores/useCommerceSubscriptionsStore'
import SubscriptionPlanCard from '@/components/commerce/SubscriptionPlanCard.vue'
import SubscriptionPlanModal from '@/components/commerce/SubscriptionPlanModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

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
