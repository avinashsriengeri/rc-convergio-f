<template>
  <div v-if="show && subscription" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
    <div class="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white" @click.stop>
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Subscription Details</h3>
            <p class="text-sm text-gray-500">{{ subscription.customer_name }} - {{ subscription.plan_name }}</p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="min-h-[400px]">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <!-- Customer Info -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Customer Information</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                  <p class="text-sm text-gray-900">{{ subscription.customer_name }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                  <p class="text-sm text-gray-900">{{ subscription.customer_email }}</p>
                </div>
              </div>
            </div>

            <!-- Subscription Info -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Subscription Information</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Plan</label>
                  <p class="text-sm text-gray-900">{{ subscription.plan_name }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                  <span :class="getStatusColor(subscription.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getStatusText(subscription.status) }}
                  </span>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Period Start</label>
                  <p class="text-sm text-gray-900">{{ formatDate(subscription.current_period_start) }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Period End</label>
                  <p class="text-sm text-gray-900">{{ formatDate(subscription.current_period_end) }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</label>
                  <p class="text-sm text-gray-900">{{ formatDate(subscription.created_at) }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Cancel at Period End</label>
                  <p class="text-sm text-gray-900">{{ subscription.cancel_at_period_end ? 'Yes' : 'No' }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-3">
              <button
                v-if="subscription.status === 'active'"
                @click="showChangePlanModal = true"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Change Plan
              </button>
              <button
                v-if="subscription.status === 'active' && !subscription.cancel_at_period_end"
                @click="$emit('cancel', subscription.id)"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                Cancel Subscription
              </button>
              <button
                @click="$emit('open-portal', subscription.id)"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Open Billing Portal
              </button>
            </div>
          </div>

          <!-- Invoices Tab -->
          <div v-if="activeTab === 'invoices'" class="space-y-4">
            <div v-if="subscription.invoices && subscription.invoices.length > 0">
              <div class="bg-white shadow rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="invoice in subscription.invoices" :key="invoice.id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ invoice.invoice_number || `#${invoice.id}` }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(invoice.created_at) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${{ formatPrice(invoice.amount_paid || invoice.total) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="getInvoiceStatusColor(invoice.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                          {{ getInvoiceStatusText(invoice.status) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div class="flex items-center space-x-2">
                          <!-- View PDF Button -->
                          <button
                            @click="viewInvoicePDF(invoice.id)"
                            :disabled="isLoadingInvoice(invoice.id, 'view')"
                            class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="View Invoice PDF"
                          >
                            <svg v-if="!isLoadingInvoice(invoice.id, 'view')" class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <svg v-else class="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            View
                          </button>

                          <!-- Download PDF Button -->
                          <button
                            @click="downloadInvoicePDF(invoice.id)"
                            :disabled="isLoadingInvoice(invoice.id, 'download')"
                            class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Download Invoice PDF"
                          >
                            <svg v-if="!isLoadingInvoice(invoice.id, 'download')" class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <svg v-else class="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Download
                          </button>

                          <!-- Send Email Button -->
                          <button
                            @click="sendInvoiceEmail(invoice.id)"
                            :disabled="isLoadingInvoice(invoice.id, 'email')"
                            class="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Send Invoice to Customer"
                          >
                            <svg v-if="!isLoadingInvoice(invoice.id, 'email')" class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <svg v-else class="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Send
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No invoices available</h3>
              <p class="mt-1 text-sm text-gray-500">Invoice history will appear here once payments are processed.</p>
            </div>
          </div>

          <!-- Invoice Preview Section -->
          <div v-if="activeTab === 'invoices' && subscriptionsStore.invoicePreview" class="mt-6 border-t pt-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                Invoice Preview: {{ subscriptionsStore.invoicePreview.invoiceNumber }}
              </h3>
              <button
                @click="subscriptionsStore.clearInvoicePreview()"
                class="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close Preview
              </button>
            </div>
            
            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div class="p-4 bg-gray-50 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700">{{ subscriptionsStore.invoicePreview.filename }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="downloadInvoicePDF(subscriptionsStore.invoicePreview.id)"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </button>
                    <button
                      @click="sendInvoiceEmail(subscriptionsStore.invoicePreview.id)"
                      class="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Email
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Invoice HTML Content -->
              <div class="p-6">
                <div 
                  class="invoice-preview-content"
                  v-html="subscriptionsStore.invoicePreview.htmlContent"
                ></div>
              </div>
            </div>
          </div>

          <!-- Activity Tab -->
          <div v-if="activeTab === 'activity'" class="space-y-4">
            <!-- Loading State -->
            <div v-if="subscriptionsStore.activityLoading" class="flex items-center justify-center py-8">
              <div class="flex items-center space-x-2">
                <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm text-gray-600">Loading activity...</span>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="subscriptionsStore.activityError" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading activity</h3>
              <p class="mt-1 text-sm text-gray-500">{{ subscriptionsStore.activityError }}</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="subscriptionsStore.activity.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No activity available</h3>
              <p class="mt-1 text-sm text-gray-500">Activity history will appear here as events occur.</p>
            </div>

            <!-- Activity List -->
            <div v-else class="space-y-3">
              <div v-for="activity in subscriptionsStore.activity" :key="activity.id" class="relative flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 hover:border-blue-200">
                <!-- Activity Timeline Line -->
                <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <!-- Activity Icon -->
                <div class="relative flex-shrink-0 z-10">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-sm border-2 border-white" :class="getActivityIconClass(activity.event_type)">
                    <svg class="w-5 h-5" :class="getActivityIconColor(activity.event_type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="activity.event_type === 'customer.subscription.created'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      <path v-else-if="activity.event_type === 'invoice.payment_succeeded' || activity.event_type === 'payment_intent.succeeded'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path v-else-if="activity.event_type === 'checkout.session.completed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      <path v-else-if="activity.event_type === 'customer.subscription.updated'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      <path v-else-if="activity.event_type === 'invoice.finalized'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <!-- Activity Content -->
                <div class="flex-1 min-w-0 pb-4">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h4 class="text-sm font-semibold text-gray-900 mb-1">{{ activity.description || 'Activity event' }}</h4>
                      <p class="text-xs text-gray-500 mb-2">{{ formatActivityDate(activity.timestamp || activity.created_at) }}</p>
                      
                      <!-- Activity Details -->
                      <div v-if="activity.payload" class="space-y-1">
                        <div v-if="activity.payload.plan_name" class="flex items-center space-x-2">
                          <span class="text-xs text-gray-500">Plan:</span>
                          <span class="text-xs font-medium text-gray-700">{{ activity.payload.plan_name }}</span>
                        </div>
                        <div v-if="activity.payload.amount || activity.payload.amount_paid" class="flex items-center space-x-2">
                          <span class="text-xs text-gray-500">Amount:</span>
                          <span class="text-xs font-medium text-gray-700">{{ formatCurrency((activity.payload.amount || activity.payload.amount_paid) / 100) }}</span>
                        </div>
                        <div v-if="activity.payload.currency" class="flex items-center space-x-2">
                          <span class="text-xs text-gray-500">Currency:</span>
                          <span class="text-xs font-medium text-gray-700 uppercase">{{ activity.payload.currency }}</span>
                        </div>
                        <div v-if="activity.payload.payment_method" class="flex items-center space-x-2">
                          <span class="text-xs text-gray-500">Payment:</span>
                          <span class="text-xs font-medium text-gray-700 capitalize">{{ activity.payload.payment_method }}</span>
                        </div>
                        <div v-if="activity.payload.status" class="flex items-center space-x-2">
                          <span class="text-xs text-gray-500">Status:</span>
                          <span class="text-xs font-medium px-2 py-1 rounded-full" :class="getStatusBadgeClass(activity.payload.status)">{{ activity.payload.status }}</span>
                        </div>
                        <div v-if="activity.payload.session_id" class="flex items-center space-x-2">
                          <span class="text-xs text-gray-500">Session:</span>
                          <span class="text-xs font-mono text-gray-600">{{ activity.payload.session_id }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Activity Status Badge -->
                    <div class="flex-shrink-0 ml-4">
                      <span v-if="activity.is_processed" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Processed
                      </span>
                      <span v-else class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Change Plan Modal -->
  <ChangePlanModal
    :show="showChangePlanModal"
    :subscription="subscription"
    @close="showChangePlanModal = false"
    @plan-changed="handlePlanChanged"
  />
</template>

<style scoped>
.invoice-preview-content {
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}

.invoice-preview-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.invoice-preview-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
}

.invoice-preview-content :deep(th),
.invoice-preview-content :deep(td) {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.invoice-preview-content :deep(th) {
  background-color: #f9fafb;
  font-weight: 600;
}

.invoice-preview-content :deep(.invoice-header) {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 24px;
  border-radius: 8px 8px 0 0;
}

.invoice-preview-content :deep(.invoice-body) {
  padding: 24px;
}

.invoice-preview-content :deep(.invoice-footer) {
  background-color: #f9fafb;
  padding: 16px 24px;
  border-radius: 0 0 8px 8px;
  border-top: 1px solid #e5e7eb;
}
</style>

<script setup>
import { ref, watch } from 'vue'
import { useCommerceSubscriptionsStore } from '@/stores/useCommerceSubscriptionsStore'
import ChangePlanModal from './ChangePlanModal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  subscription: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'change-plan', 'cancel', 'open-portal'])

const subscriptionsStore = useCommerceSubscriptionsStore()
const activeTab = ref('overview')
const loadingInvoices = ref({}) // Track loading state for each invoice action
const showChangePlanModal = ref(false)

const tabs = [
  { id: 'overview', name: 'Overview' },
  { id: 'invoices', name: 'Invoices' },
  { id: 'activity', name: 'Activity' }
]

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    trialing: 'bg-yellow-100 text-yellow-800',
    past_due: 'bg-orange-100 text-orange-800',
    cancelled: 'bg-gray-100 text-gray-800',
    incomplete: 'bg-red-100 text-red-800',
    incomplete_expired: 'bg-red-100 text-red-800',
    unpaid: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    active: 'Active',
    trialing: 'Trialing',
    past_due: 'Past Due',
    cancelled: 'Cancelled',
    incomplete: 'Incomplete',
    incomplete_expired: 'Expired',
    unpaid: 'Unpaid'
  }
  return texts[status] || status
}

const getInvoiceStatusColor = (status) => {
  const colors = {
    paid: 'bg-green-100 text-green-800',
    open: 'bg-blue-100 text-blue-800',
    draft: 'bg-gray-100 text-gray-800',
    void: 'bg-red-100 text-red-800',
    uncollectible: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getInvoiceStatusText = (status) => {
  const texts = {
    paid: 'Paid',
    open: 'Open',
    draft: 'Draft',
    void: 'Void',
    uncollectible: 'Uncollectible'
  }
  return texts[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPrice = (amount) => {
  if (!amount) return '0.00'
  return (amount / 100).toFixed(2)
}

// Invoice action methods
const isLoadingInvoice = (invoiceId, action) => {
  return loadingInvoices.value[`${invoiceId}-${action}`] || false
}

const setLoadingInvoice = (invoiceId, action, loading) => {
  loadingInvoices.value[`${invoiceId}-${action}`] = loading
}

const viewInvoicePDF = async (invoiceId) => {
  setLoadingInvoice(invoiceId, 'view', true)
  try {
    await subscriptionsStore.viewInvoicePDF(invoiceId)
    
    // Show success message
    if (window.Swal && window.Swal.fire) {
      window.Swal.fire({
        icon: 'success',
        title: 'Invoice Preview',
        text: 'Invoice preview is now displayed below',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } catch (error) {
    console.error('Error viewing invoice PDF:', error)
    
    // Show error message
    if (window.Swal && window.Swal.fire) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to view invoice',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    } else {
      alert(`Error: ${error.response?.data?.message || 'Failed to view invoice'}`)
    }
  } finally {
    setLoadingInvoice(invoiceId, 'view', false)
  }
}

const downloadInvoicePDF = async (invoiceId) => {
  setLoadingInvoice(invoiceId, 'download', true)
  try {
    await subscriptionsStore.downloadInvoicePDF(invoiceId)
    
    // Show success message
    if (window.Swal && window.Swal.fire) {
      window.Swal.fire({
        icon: 'success',
        title: 'PDF Downloaded',
        text: 'Invoice PDF has been downloaded successfully',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } catch (error) {
    console.error('Error downloading invoice PDF:', error)
    
    // Show error message
    if (window.Swal && window.Swal.fire) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to download invoice',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    } else {
      alert(`Error: ${error.response?.data?.message || 'Failed to download invoice'}`)
    }
  } finally {
    setLoadingInvoice(invoiceId, 'download', false)
  }
}

const sendInvoiceEmail = async (invoiceId) => {
  setLoadingInvoice(invoiceId, 'email', true)
  try {
    await subscriptionsStore.sendInvoiceEmail(invoiceId)
    
    // Show success message
    if (window.Swal && window.Swal.fire) {
      window.Swal.fire({
        icon: 'success',
        title: 'Email Sent',
        text: 'Invoice has been sent to the customer',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } catch (error) {
    console.error('Error sending invoice email:', error)
    
    // Show error message
    if (window.Swal && window.Swal.fire) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to send invoice email',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    } else {
      alert(`Error: ${error.response?.data?.message || 'Failed to send invoice email'}`)
    }
  } finally {
    setLoadingInvoice(invoiceId, 'email', false)
  }
}

// Format currency
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Format activity date
const formatActivityDate = (dateString) => {
  if (!dateString) return 'Unknown date'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get activity icon background class
const getActivityIconClass = (eventType) => {
  const classes = {
    'customer.subscription.created': 'bg-blue-100',
    'invoice.payment_succeeded': 'bg-green-100',
    'payment_intent.succeeded': 'bg-green-100',
    'checkout.session.completed': 'bg-purple-100',
    'customer.subscription.updated': 'bg-orange-100',
    'invoice.finalized': 'bg-indigo-100',
    'payment_intent.failed': 'bg-red-100',
    'invoice.payment_failed': 'bg-red-100'
  }
  return classes[eventType] || 'bg-gray-100'
}

// Get activity icon color class
const getActivityIconColor = (eventType) => {
  const colors = {
    'customer.subscription.created': 'text-blue-600',
    'invoice.payment_succeeded': 'text-green-600',
    'payment_intent.succeeded': 'text-green-600',
    'checkout.session.completed': 'text-purple-600',
    'customer.subscription.updated': 'text-orange-600',
    'invoice.finalized': 'text-indigo-600',
    'payment_intent.failed': 'text-red-600',
    'invoice.payment_failed': 'text-red-600'
  }
  return colors[eventType] || 'text-gray-600'
}

// Get status badge class
const getStatusBadgeClass = (status) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'paid': 'bg-green-100 text-green-800',
    'open': 'bg-blue-100 text-blue-800',
    'trialing': 'bg-yellow-100 text-yellow-800',
    'past_due': 'bg-orange-100 text-orange-800',
    'cancelled': 'bg-gray-100 text-gray-800',
    'failed': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Watch for tab changes and fetch activity when Activity tab is clicked
watch(activeTab, async (newTab) => {
  if (newTab === 'activity' && props.subscription?.id) {
    await subscriptionsStore.fetchActivity(props.subscription.id)
  }
})

const handlePlanChanged = () => {
  // Refresh subscription data
  if (props.subscription?.id) {
    subscriptionsStore.fetchSubscriptions()
  }
}

const closeModal = () => {
  emit('close')
}
</script>
