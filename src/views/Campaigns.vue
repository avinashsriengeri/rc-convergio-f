
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ $t('campaigns.title') }}</h1>
            <p class="text-sm text-gray-600 mt-1">{{ $t('campaigns.subtitle') }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="secondary"
              @click="refreshCampaigns"
              :loading="loading"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ $t('campaigns.refresh') }}
            </BaseButton>
            <BaseButton
              variant="outline"
              @click="showTemplatesModal = true"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {{ $t('campaigns.templates') }}
            </BaseButton>
            <BaseButton
              variant="outline"
              @click="exportCampaigns"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </BaseButton>
            <BaseButton
              variant="outline"
              @click="showImportModal = true"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Import
            </BaseButton>
            <BaseButton
              v-if="selectedCampaignIds.length > 0"
              variant="warning"
              @click="showBulkActionsModal = true"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Bulk Actions ({{ selectedCampaignIds.length }})
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="showCreateModal = true"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {{ $t('campaigns.new_campaign') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form @submit.prevent="applyFilters" class="space-y-4">
          <!-- Search and Quick Filters -->
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <BaseInput
                v-model="filters.search"
                :placeholder="$t('campaigns.search_placeholder')"
                @input="debouncedSearch"
                class="w-full"
              >
                <template #prefix>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </template>
              </BaseInput>
            </div>
            
            <div class="flex flex-wrap gap-2">
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setStatusFilter('all')"
                :class="{ 'bg-blue-50 border-blue-200 text-blue-700': filters.status === 'all' }"
              >
                {{ $t('campaigns.all') }}
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setStatusFilter('draft')"
                :class="{ 'bg-gray-50 border-gray-200 text-gray-700': filters.status === 'draft' }"
              >
                {{ $t('campaigns.draft') }}
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setStatusFilter('scheduled')"
                :class="{ 'bg-blue-50 border-blue-200 text-blue-700': filters.status === 'scheduled' }"
              >
                {{ $t('campaigns.scheduled') }}
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="setStatusFilter('sent')"
                :class="{ 'bg-green-50 border-green-200 text-green-700': filters.status === 'sent' }"
              >
                {{ $t('campaigns.sent') }}
              </BaseButton>
            </div>
          </div>

          <!-- Advanced Filters -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Type Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('campaigns.type') }}</label>
              <select
                v-model="filters.type"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{{ $t('campaigns.all_types') }}</option>
                <option value="email">{{ $t('campaigns.email') }}</option>
                <option value="sms">{{ $t('campaigns.sms') }}</option>
                <option value="newsletter">{{ $t('campaigns.newsletter') }}</option>
                <option value="promotional">{{ $t('campaigns.promotional') }}</option>
              </select>
            </div>

            <!-- Owner Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('campaigns.owner') }}</label>
              <select
                v-model="filters.owner_id"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{{ $t('campaigns.all_owners') }}</option>
                <option
                  v-for="user in refsStore.users"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }}
                </option>
              </select>
            </div>

            <!-- Date Range Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('campaigns.date_range') }}</label>
              <select
                v-model="filters.date_range"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{{ $t('campaigns.all_dates') }}</option>
                <option value="today">{{ $t('campaigns.today') }}</option>
                <option value="yesterday">{{ $t('campaigns.yesterday') }}</option>
                <option value="this_week">{{ $t('campaigns.this_week') }}</option>
                <option value="last_week">{{ $t('campaigns.last_week') }}</option>
                <option value="this_month">{{ $t('campaigns.this_month') }}</option>
                <option value="last_month">{{ $t('campaigns.last_month') }}</option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('campaigns.sort') }}</label>
              <select
                v-model="filters.sort"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="-created_at">{{ $t('campaigns.created_newest') }}</option>
                <option value="created_at">{{ $t('campaigns.created_oldest') }}</option>
                <option value="name">{{ $t('campaigns.name_az') }}</option>
                <option value="-name">{{ $t('campaigns.name_za') }}</option>
                <option value="scheduled_at">{{ $t('campaigns.scheduled_date') }}</option>
                <option value="-scheduled_at">{{ $t('campaigns.scheduled_date_latest') }}</option>
              </select>
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <BaseButton
                type="submit"
                variant="primary"
                size="sm"
                :loading="loading"
              >
                {{ $t('campaigns.apply_filters') }}
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                @click="clearFilters"
              >
                {{ $t('campaigns.clear') }}
              </BaseButton>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading && !campaigns.length" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('campaigns.error_loading') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="refreshCampaigns">
            {{ $t('campaigns.try_again') }}
          </BaseButton>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && !campaigns.length" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('campaigns.no_campaigns_found') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ $t('campaigns.get_started_message') }}</p>
        <div class="mt-6">
          <BaseButton variant="primary" @click="showCreateModal = true">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {{ $t('campaigns.new_campaign') }}
          </BaseButton>
        </div>
      </div>

      <!-- Campaigns Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="campaign in campaigns"
          :key="campaign.id"
          class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
          :class="{ 'ring-2 ring-blue-500': selectedCampaignIds.includes(campaign.id) }"
        >
          <!-- Campaign Header -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-3 flex-1">
                <BaseCheckbox
                  :model-value="selectedCampaignIds.includes(campaign.id)"
                  @update:model-value="toggleCampaignSelection(campaign.id)"
                  label=""
                  class="mt-1"
                />
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ campaign.name }}</h3>
                <p class="text-sm text-gray-600 line-clamp-2">{{ campaign.description }}</p>
                <div v-if="campaign.owner" class="text-xs text-gray-500 mt-1">
                  <strong>Owner:</strong> {{ campaign.owner.name || '—' }}
                </div>
                <div v-if="campaign.team" class="text-xs text-gray-500">
                  <strong>Team:</strong> {{ campaign.team.name || '—' }}
                </div>
                </div>
              </div>
              <div class="flex items-center space-x-2 ml-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusBadgeClass(campaign.status)"
                >
                  {{ campaign.status }}
                </span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ campaign.type }}
                </span>
              </div>
            </div>
          </div>

          <!-- Campaign Details -->
          <div class="p-6">
            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-500">{{ $t('campaigns.owner') }}:</span>
                <span class="font-medium">{{ campaign.owner?.name || $t('campaigns.unassigned') }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">{{ $t('campaigns.recipients') }}:</span>
                <span class="font-medium">{{ campaign.recipient_count || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">{{ $t('campaigns.sent') }}:</span>
                <span class="font-medium">{{ campaign.sent_count || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">{{ $t('campaigns.opened') }}:</span>
                <span class="font-medium">{{ campaign.opened_count || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">{{ $t('campaigns.clicked') }}:</span>
                <span class="font-medium">{{ campaign.clicked_count || 0 }}</span>
              </div>
              <div v-if="campaign.scheduled_at" class="flex items-center justify-between">
                <span class="text-gray-500">{{ $t('campaigns.scheduled') }}:</span>
                <span class="font-medium">{{ formatDate(campaign.scheduled_at) }}</span>
              </div>
              <div v-if="campaign.sent_at" class="flex items-center justify-between">
                <span class="text-gray-500">Sent:</span>
                <span class="font-medium">{{ formatDate(campaign.sent_at) }}</span>
              </div>
            </div>

            <!-- Campaign Actions -->
            <div class="mt-6">
              <div class="flex flex-wrap items-center gap-2">
                <BaseButton
                  variant="outline"
                  size="sm"
                  @click="viewCampaign(campaign)"
                >
                  View
                </BaseButton>
                <BaseButton
                  v-if="campaign.status === 'draft' && canEdit(campaign)"
                  variant="outline"
                  size="sm"
                  @click="editCampaign(campaign)"
                >
                  Edit
                </BaseButton>
                <BaseButton
                  v-if="campaign.status === 'draft'"
                  variant="secondary"
                  size="sm"
                  @click="testCampaign(campaign)"
                >
                  Test
                </BaseButton>
                <BaseButton
                  v-if="campaign.status === 'draft'"
                  variant="secondary"
                  size="sm"
                  @click="previewCampaign(campaign)"
                >
                  Preview
                </BaseButton>
                <BaseButton
                  v-if="campaign.status === 'draft'"
                  variant="primary"
                  size="sm"
                  @click="scheduleCampaign(campaign)"
                >
                  Schedule
                </BaseButton>
                <BaseButton
                  v-if="campaign.status === 'scheduled'"
                  variant="primary"
                  size="sm"
                  @click="sendCampaign(campaign)"
                >
                  Send Now
                </BaseButton>
                <BaseButton
                  v-if="campaign.status === 'scheduled'"
                  variant="warning"
                  size="sm"
                  @click="unscheduleCampaign(campaign)"
                >
                  Unschedule
                </BaseButton>
                <BaseButton
                  v-if="campaign.status === 'active'"
                  variant="warning"
                  size="sm"
                  @click="pauseCampaign(campaign)"
                >
                  Pause
                </BaseButton>
                <BaseButton
                  v-if="campaign.status === 'paused'"
                  variant="success"
                  size="sm"
                  @click="resumeCampaign(campaign)"
                >
                  Resume
                </BaseButton>
                <BaseButton
                  v-if="campaign.status === 'archived'"
                  variant="secondary"
                  size="sm"
                  @click="restoreCampaign(campaign)"
                >
                  Restore
                </BaseButton>
                <BaseButton
                  v-if="campaign.status !== 'archived' && campaign.status !== 'sent'"
                  variant="outline"
                  size="sm"
                  @click="archiveCampaign(campaign)"
                >
                  Archive
                </BaseButton>
                <BaseButton
                  variant="outline"
                  size="sm"
                  @click="duplicateCampaign(campaign)"
                >
                  Duplicate
                </BaseButton>
                <div class="flex-grow"></div>
                <button
                  @click="viewMetrics(campaign)"
                  class="text-gray-500 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  title="View metrics"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>
                <button
                  v-if="campaign.status !== 'sent' && canDelete(campaign)"
                  @click="deleteCampaign(campaign)"
                  class="text-gray-500 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
                  title="Delete campaign"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="mt-8 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ meta.from }} to {{ meta.to }} of {{ meta.total }} results
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-700">Per page:</label>
            <select
              v-model="filters.per_page"
              @change="onPerPageChange"
              class="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option
                v-for="option in PER_PAGE_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <BaseButton
              variant="secondary"
              :disabled="meta.current_page === 1"
              @click="changePage(meta.current_page - 1)"
              class="px-3 py-2"
            >
              Previous
            </BaseButton>
            <span class="text-sm text-gray-700">
              Page {{ meta.current_page }} of {{ meta.last_page }}
            </span>
            <BaseButton
              variant="secondary"
              :disabled="meta.current_page === meta.last_page"
              @click="changePage(meta.current_page + 1)"
              class="px-3 py-2"
            >
              Next
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Campaign Form Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    
    <!-- Templates Modal -->
    <div v-if="showTemplatesModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Email Templates</h3>
            <button
              @click="showTemplatesModal = false"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Templates List -->
          <div>
            <div v-if="loadingTemplates" class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <div v-else-if="!templates || templates.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M4.93 4.93a10 10 0 1114.14 14.14A10 10 0 014.93 4.93z" />
              </svg>
              <h4 class="mt-2 text-sm font-medium text-gray-900">No templates yet</h4>
              <p class="mt-1 text-sm text-gray-500">Save any campaign as a template to reuse content quickly.</p>
              <div class="mt-6">
                <BaseButton variant="outline" @click="showTemplatesModal = false">Close</BaseButton>
              </div>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="template in templates" :key="template.id" class="border border-gray-200 rounded-lg p-4">
                <div class="mb-3">
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-medium text-gray-900 truncate" :title="template.name">{{ template.name }}</h4>
                    <span class="text-xs text-gray-500" :title="template.updated_at">{{ formatDate(template.updated_at) }}</span>
                  </div>
                  <p class="text-xs text-gray-600 truncate" :title="template.subject">{{ template.subject }}</p>
                </div>
                <div class="flex items-center justify-end space-x-2">
                  <BaseButton
                    variant="primary"
                    size="sm"
                    aria-label="Use template"
                    @click.stop="useTemplate(template)"
                  >Use</BaseButton>
                  <BaseButton
                    v-if="template.is_template"
                    variant="outline"
                    size="sm"
                    aria-label="Delete template"
                    @click.stop="confirmDeleteTemplate(template)"
                  >Delete</BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Edit Campaign' : 'New Campaign' }}
          </h3>
          <form @submit.prevent="saveCampaign">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Basic Information -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Name <span class="text-red-500">*</span>
                  </label>
                  <BaseInput
                    v-model="campaignForm.name"
                    placeholder="Enter campaign name"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    v-model="campaignForm.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter campaign description"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Type <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="campaignForm.type"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="promotional">Promotional</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Owner
                  </label>
                  <select
                    v-model="campaignForm.owner_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Owner</option>
                    <option
                      v-for="user in refsStore.users"
                      :key="user.id"
                      :value="user.id"
                    >
                      {{ user.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Subject Line
                  </label>
                  <BaseInput
                    v-model="campaignForm.subject"
                    placeholder="Enter email subject line"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Date
                  </label>
                  <BaseInput
                    v-model="campaignForm.scheduled_at"
                    type="datetime-local"
                  />
                </div>

                <!-- Recipients -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                  <div class="space-y-4">
                    <div class="flex items-center space-x-4">
                      <label class="inline-flex items-center space-x-2">
                        <input type="radio" class="text-blue-600" value="contacts" v-model="campaignForm.recipient_mode" />
                        <span class="text-sm text-gray-700">Static Contacts</span>
                      </label>
                      <label class="inline-flex items-center space-x-2">
                        <input type="radio" class="text-blue-600" value="segment" v-model="campaignForm.recipient_mode" />
                        <span class="text-sm text-gray-700">Dynamic List (Segment)</span>
                      </label>
                      <label class="inline-flex items-center space-x-2">
                        <input type="radio" class="text-blue-600" value="csv" v-model="campaignForm.recipient_mode" />
                        <span class="text-sm text-gray-700">CSV Upload</span>
                      </label>
                    </div>

                    <div v-if="campaignForm.recipient_mode === 'segment'">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Select Segment</label>
                      <select
                        v-model="campaignForm.segment_id"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Choose a segment</option>
                        <option v-for="seg in segmentOptions" :key="seg.value" :value="seg.value">{{ seg.label }}</option>
                      </select>
                    </div>

                    <div v-if="campaignForm.recipient_mode === 'contacts'">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Select Contacts</label>
                      <BaseInput
                        v-model="contactSearch"
                        placeholder="Search contacts by name or email..."
                      />
                      <div class="bg-gray-50 border border-gray-200 rounded-md p-2 max-h-80 overflow-y-auto mt-2">
                        <div
                          v-for="opt in filteredContactOptions"
                          :key="opt.value"
                          class="flex items-center space-x-2 py-1"
                        >
                          <input type="checkbox" class="rounded" :value="opt.value" v-model="campaignForm.recipient_contact_ids" />
                          <span class="text-sm text-gray-700">{{ opt.label }}</span>
                        </div>
                        <div v-if="filteredContactOptions.length === 0" class="text-xs text-gray-500 p-2">No contacts found.</div>
                      </div>
                    </div>

                    <div v-if="campaignForm.recipient_mode === 'csv'">
                      <label class="block text-sm font-medium text-gray-700 mb-1">CSV File</label>
                      <div class="space-y-2">
                        <div class="flex items-center space-x-2 mb-2">
                          <a
                            href="#"
                            @click.prevent="downloadCSVTemplate"
                            class="text-sm text-blue-600 hover:text-blue-800 underline flex items-center"
                          >
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Template
                          </a>
                        </div>
                        <input
                          type="file"
                          accept=".csv,.txt"
                          @change="handleCSVFileSelect"
                          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p v-if="csvFileName" class="text-sm text-gray-600 mt-1">
                          Selected: {{ csvFileName }}
                        </p>
                        <p v-if="csvFileError" class="text-sm text-red-600 mt-1">
                          {{ csvFileError }}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                          Accepted formats: .csv, .txt (Max size: 10MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Content <span class="text-red-500">*</span>
                  </label>
                  <div class="border border-gray-300 rounded-md">
                    <div class="bg-gray-50 px-3 py-2 border-b border-gray-300">
                      <div class="flex items-center space-x-2">
                        <button
                          type="button"
                          @click="insertText('**bold**')"
                          class="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          @click="insertText('*italic*')"
                          class="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          @click="insertText('[Link Text](url)')"
                          class="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Link
                        </button>
                        <button
                          type="button"
                          @click="insertText('{{first_name}}')"
                          class="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Name
                        </button>
                        <button
                          type="button"
                          @click="insertText('{{company_name}}')"
                          class="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Company
                        </button>
                      </div>
                    </div>
                    <textarea
                      v-model="campaignForm.content"
                      rows="12"
                      class="w-full px-3 py-2 border-0 focus:outline-none focus:ring-0 resize-none"
                      placeholder="Enter campaign content (supports Markdown)"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-end space-x-3 mt-6">
              <BaseButton
                type="button"
                variant="outline"
                @click="closeModal"
              >
                Cancel
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                @click="saveAsTemplateInline"
                :loading="savingTemplate"
              >
                Save as Template
              </BaseButton>
              <BaseButton
                type="submit"
                variant="primary"
                :loading="saving"
              >
                {{ showEditModal ? 'Update' : 'Create' }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Campaign Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Campaign Details</h3>
            <button
              @click="showDetailModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div v-if="selectedCampaign" class="space-y-6">
            <!-- Tab Navigation -->
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8">
                <button
                  @click="activeDetailTab = 'overview'"
                  :class="[
                    'py-2 px-1 border-b-2 font-medium text-sm',
                    activeDetailTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  Overview
                </button>
                <button
                  @click="activeDetailTab = 'recipients'"
                  :class="[
                    'py-2 px-1 border-b-2 font-medium text-sm',
                    activeDetailTab === 'recipients'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  Recipients
                </button>
                <button
                  @click="activeDetailTab = 'audit-logs'"
                  :class="[
                    'py-2 px-1 border-b-2 font-medium text-sm',
                    activeDetailTab === 'audit-logs'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  Audit Logs
                </button>
              </nav>
            </div>

            <!-- Tab Content -->
            <div v-if="activeDetailTab === 'overview'">
              <!-- Campaign Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="text-lg font-medium text-gray-900">{{ selectedCampaign.name }}</h4>
                  <p class="text-sm text-gray-600 mt-1">{{ selectedCampaign.description }}</p>
                </div>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Status:</span>
                    <span :class="getStatusTextClass(selectedCampaign.status)">
                      {{ selectedCampaign.status }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Type:</span>
                    <span>{{ selectedCampaign.type }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Owner:</span>
                    <span>{{ selectedCampaign.owner?.name || 'Unassigned' }}</span>
                  </div>
                  <div v-if="selectedCampaign.scheduled_at" class="flex justify-between">
                    <span class="text-gray-500">Scheduled:</span>
                    <span>{{ formatDate(selectedCampaign.scheduled_at) }}</span>
                  </div>
                  <div v-if="selectedCampaign.sent_at" class="flex justify-between">
                    <span class="text-gray-500">Sent:</span>
                    <span>{{ formatDate(selectedCampaign.sent_at) }}</span>
                  </div>
                </div>
              </div>

              <!-- Campaign Content -->
              <div>
                <h5 class="text-sm font-medium text-gray-900 mb-2">Content</h5>
                <div class="bg-gray-50 p-4 rounded-md">
                  <div class="prose prose-sm max-w-none">
                    <div v-html="renderMarkdown(selectedCampaign.content)"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recipients Tab -->
            <div v-else-if="activeDetailTab === 'recipients'">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h5 class="text-sm font-medium text-gray-900">Campaign Recipients</h5>
                  <button
                    @click="fetchCampaignRecipients(selectedCampaign.id)"
                    :disabled="loadingRecipients"
                    class="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    {{ loadingRecipients ? 'Loading...' : 'Refresh' }}
                  </button>
                </div>

                <!-- Loading State -->
                <div v-if="loadingRecipients" class="flex justify-center items-center py-8">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>

                <!-- Recipients Table -->
                <div v-else-if="campaignRecipients && campaignRecipients.length > 0" class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sent At
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Opened At
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Clicked At
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="recipient in campaignRecipients" :key="recipient.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ recipient.name || 'N/A' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ recipient.email }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="getRecipientStatusClass(recipient.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                            {{ recipient.status || 'pending' }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ recipient.sent_at ? formatDate(recipient.sent_at) : '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ recipient.opened_at ? formatDate(recipient.opened_at) : '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ recipient.clicked_at ? formatDate(recipient.clicked_at) : '-' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-8">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h4 class="mt-2 text-sm font-medium text-gray-900">No recipients found</h4>
                  <p class="mt-1 text-sm text-gray-500">This campaign has no recipients configured yet.</p>
                </div>

                <!-- Error State -->
                <div v-if="recipientsError" class="text-center py-8">
                  <div class="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                    {{ recipientsError }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Audit Logs Tab -->
            <div v-else-if="activeDetailTab === 'audit-logs'">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h5 class="text-sm font-medium text-gray-900">Campaign Audit Logs</h5>
                  <button
                    @click="fetchCampaignAuditLogs(selectedCampaign.id)"
                    :disabled="loadingAuditLogs"
                    class="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    {{ loadingAuditLogs ? 'Loading...' : 'Refresh' }}
                  </button>
                </div>

                <!-- Loading State -->
                <div v-if="loadingAuditLogs" class="flex justify-center items-center py-8">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>

                <!-- Audit Logs Table -->
                <div v-else-if="campaignAuditLogs && campaignAuditLogs.length > 0" class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Metadata
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IP Address
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Agent
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="log in campaignAuditLogs" :key="log.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="getAuditLogActionClass(log.action)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                            {{ formatAuditLogAction(log.action) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ log.user?.name || 'System' }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">
                          <button
                            v-if="log.metadata"
                            @click="toggleMetadata(log.id)"
                            class="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            {{ expandedMetadata[log.id] ? 'Hide' : 'Show' }} Details
                          </button>
                          <div v-if="expandedMetadata[log.id] && log.metadata" class="mt-2 p-2 bg-gray-50 rounded text-xs font-mono">
                            {{ JSON.stringify(log.metadata, null, 2) }}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ log.ip_address || '-' }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" :title="log.user_agent">
                          {{ log.user_agent || '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ formatDate(log.created_at) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-8">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h4 class="mt-2 text-sm font-medium text-gray-900">No audit logs yet</h4>
                  <p class="mt-1 text-sm text-gray-500">Audit logs will appear when actions are performed on this campaign.</p>
                </div>

                <!-- Error State -->
                <div v-if="auditLogsError" class="text-center py-8">
                  <div class="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                    {{ auditLogsError }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Campaign Actions -->
            <div class="flex items-center justify-end space-x-3 pt-4 border-t">
              <BaseButton
                variant="outline"
                @click="showDetailModal = false"
              >
                Close
              </BaseButton>
              <BaseButton
                v-if="selectedCampaign.status === 'draft' && canEdit(selectedCampaign)"
                variant="primary"
                @click="editCampaign(selectedCampaign)"
              >
                Edit Campaign
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Campaign Metrics Modal -->
    <div v-if="showMetricsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Campaign Metrics</h3>
            <div class="flex items-center space-x-3">
              <BaseButton
                variant="outline"
                size="sm"
                @click="viewMetrics(selectedCampaign)"
                :loading="loading"
              >
                Refresh
              </BaseButton>
              <button
                @click="showMetricsModal = false"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!campaignMetrics || Object.keys(campaignMetrics).length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h4 class="mt-2 text-sm font-medium text-gray-900">No metrics available</h4>
            <p class="mt-1 text-sm text-gray-500">Campaign metrics will appear once the campaign is sent and recipients start engaging.</p>
          </div>

          <!-- Metrics Content -->
          <div v-else-if="selectedCampaign && campaignMetrics" class="space-y-6">
            <!-- Metrics Summary -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-blue-50 p-4 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ campaignMetrics.sent_count || 0 }}</div>
                <div class="text-sm text-blue-800">Recipients</div>
              </div>
              <div class="bg-green-50 p-4 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ campaignMetrics.sent_count || 0 }}</div>
                <div class="text-sm text-green-800">Sent</div>
              </div>
              <div class="bg-yellow-50 p-4 rounded-lg">
                <div class="text-2xl font-bold text-yellow-600">{{ campaignMetrics.opened_count || 0 }}</div>
                <div class="text-sm text-yellow-800">Opened</div>
              </div>
              <div class="bg-purple-50 p-4 rounded-lg">
                <div class="text-2xl font-bold text-purple-600">{{ campaignMetrics.clicked_count || 0 }}</div>
                <div class="text-sm text-purple-800">Clicked</div>
              </div>
            </div>

            <!-- Engagement Rates -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-white p-4 rounded-lg border">
                <div class="text-lg font-medium text-gray-900">Open Rate</div>
                <div class="text-3xl font-bold text-blue-600">
                  {{ campaignMetrics.open_percentage || 0 }}%
                </div>
              </div>
              <div class="bg-white p-4 rounded-lg border">
                <div class="text-lg font-medium text-gray-900">Click Rate</div>
                <div class="text-3xl font-bold text-green-600">
                  {{ campaignMetrics.click_percentage || 0 }}%
                </div>
              </div>
              <div class="bg-white p-4 rounded-lg border">
                <div class="text-lg font-medium text-gray-900">Bounce Rate</div>
                <div class="text-3xl font-bold text-red-600">
                  {{ campaignMetrics.bounce_percentage || 0 }}%
                </div>
              </div>
            </div>

            <!-- Timeline Chart -->
            <div class="bg-white p-4 rounded-lg border">
              <h5 class="text-lg font-medium text-gray-900 mb-4">Engagement Timeline</h5>
              <div class="h-64 bg-gray-50 rounded flex items-center justify-center">
                <div class="text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h4 class="mt-2 text-sm font-medium text-gray-900">Timeline Chart</h4>
                  <p class="mt-1 text-sm text-gray-500">Engagement timeline will show when recipients start opening and clicking emails</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Templates Modal -->
    <div v-if="showTemplatesModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Campaign Templates</h3>
            <button
              @click="showTemplatesModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Loading State -->
          <div v-if="loadingTemplates" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <!-- Templates List (cards with Use/Delete) -->
          <div v-else-if="templates && templates.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="template in templates" :key="template.id" class="border border-gray-200 rounded-lg p-4">
              <div class="mb-3">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-medium text-gray-900 truncate" :title="template.name">{{ template.name }}</h4>
                  <span class="text-xs text-gray-500" :title="template.updated_at">{{ formatDate(template.updated_at) }}</span>
                </div>
                <p class="text-xs text-gray-600 truncate" :title="template.subject">{{ template.subject }}</p>
              </div>
              <div class="flex items-center justify-end space-x-2">
                <BaseButton
                  variant="primary"
                  size="sm"
                  aria-label="Use template"
                  :disabled="deletingMap[template.id] === true"
                  @click.stop="useTemplate(template)"
                >Use</BaseButton>
                <BaseButton
                  variant="outline"
                  size="sm"
                  aria-label="Delete template"
                  :loading="deletingMap[template.id] === true"
                  :disabled="deletingMap[template.id] === true"
                  @click.stop="confirmDeleteTemplate(template)"
                >Delete</BaseButton>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M4.93 4.93a10 10 0 1114.14 14.14A10 10 0 014.93 4.93z" />
            </svg>
            <h4 class="mt-2 text-sm font-medium text-gray-900">No templates yet</h4>
            <p class="mt-1 text-sm text-gray-500">Save any campaign as a template to reuse content quickly.</p>
            <div class="mt-6">
              <BaseButton variant="outline" @click="showTemplatesModal = false">Close</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete Campaign"
      :message="`Are you sure you want to delete the campaign '${campaignToDelete?.name}'? This action cannot be undone.`"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Import Campaigns</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Select CSV File</label>
              <input
                type="file"
                accept=".csv"
                @change="handleFileUpload"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="text-sm text-gray-600">
              <p>CSV format should include columns: name, description, type, subject, content, status</p>
            </div>
          </div>
          <div class="flex items-center justify-end space-x-3 mt-6">
            <BaseButton variant="outline" @click="showImportModal = false">
              Cancel
            </BaseButton>
            <BaseButton variant="primary" @click="importCampaigns" :disabled="!importFile">
              Import
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Actions Modal -->
    <div v-if="showBulkActionsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Bulk Actions ({{ selectedCampaignIds.length }} campaigns)
          </h3>
          <div class="space-y-3">
            <BaseButton
              variant="primary"
              @click="bulkSendCampaigns"
              class="w-full"
            >
              Send Selected Campaigns
            </BaseButton>
            <BaseButton
              variant="warning"
              @click="bulkPauseCampaigns"
              class="w-full"
            >
              Pause Selected Campaigns
            </BaseButton>
            <BaseButton
              variant="success"
              @click="bulkResumeCampaigns"
              class="w-full"
            >
              Resume Selected Campaigns
            </BaseButton>
            <BaseButton
              variant="outline"
              @click="bulkArchiveCampaigns"
              class="w-full"
            >
              Archive Selected Campaigns
            </BaseButton>
          </div>
          <div class="flex items-center justify-end space-x-3 mt-6">
            <BaseButton variant="outline" @click="showBulkActionsModal = false">
              Cancel
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreviewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Campaign Preview</h3>
            <button
              @click="showPreviewModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div v-html="campaignPreview"></div>
          </div>
          <div class="flex items-center justify-end space-x-3 mt-6">
            <BaseButton variant="outline" @click="showPreviewModal = false">
              Close
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Modal -->
    <div v-if="showTestModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Test Campaign</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Test Email Address</label>
              <BaseInput
                v-model="testEmail"
                type="email"
                placeholder="Enter test email address"
                required
              />
            </div>
            <div class="text-sm text-gray-600">
              <p>Send a test email to verify the campaign content and formatting.</p>
            </div>
          </div>
          <div class="flex items-center justify-end space-x-3 mt-6">
            <BaseButton variant="outline" @click="showTestModal = false">
              Cancel
            </BaseButton>
            <BaseButton variant="primary" @click="sendTestEmail" :disabled="!testEmail">
              Send Test
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useCampaignsStore } from '@/stores/campaigns'
import { useRefsStore } from '@/stores/refs'
import { useContext } from '@/composables/useContext'
import { usePermission } from '@/composables/usePermission'
import { success, error as showError } from '@/utils/notifications'
import { formatDate } from '@/utils/formatters'
import { PER_PAGE_OPTIONS } from '@/utils/constants'
import type { Campaign, CampaignFormData, CampaignMetrics } from '@/types'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
// @ts-expect-error - listsAPI and campaignsAPI are exported from api.js
import { listsAPI, campaignsAPI } from '@/services/api'

// Props
const props = defineProps<{
  openCreateModal?: boolean
}>()

// Context and permissions
const { tenantId, teamId, isAdmin } = useContext()
const { canEdit, canDelete, canView } = usePermission()

// Types for watcher tuple
type ModalBools = [boolean, boolean]

// Store
const campaignsStore = useCampaignsStore()
const refsStore = useRefsStore()

// Reactive data
const saving = ref(false)
const errors = reactive<Record<string, string>>({})
const loading = computed(() => campaignsStore.loading)
const error = computed(() => campaignsStore.error)
const campaigns = computed(() => campaignsStore.campaigns)
const meta = computed(() => campaignsStore.meta)

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const showMetricsModal = ref(false)
const showDeleteModal = ref(false)
const showTemplatesModal = ref(false)
const showRecipientsModal = ref(false)
const showImportModal = ref(false)
const showBulkActionsModal = ref(false)
const showPreviewModal = ref(false)
const showTestModal = ref(false)
const campaignToDelete = ref<Campaign | null>(null)
const selectedCampaign = ref<Campaign | null>(null)
const campaignMetrics = ref<CampaignMetrics | null>(null)
const campaignPreview = ref<string>('')
const selectedCampaignIds = ref<number[]>([])
const importFile = ref<File | null>(null)
const testEmail = ref<string>('')

// Detail modal tab state
const activeDetailTab = ref('overview')

// Templates and recipients data
const templates = ref<any[]>([])
const campaignRecipients = ref<any[]>([])
const loadingRecipients = ref(false)
const recipientsError = ref('')
const recipients = ref<any[]>([])
const loadingTemplates = ref(false)
const savingTemplate = ref(false)
const segments = ref<any[]>([])

// Audit logs data
const campaignAuditLogs = ref<any[]>([])
const loadingAuditLogs = ref(false)
const auditLogsError = ref('')
const expandedMetadata = ref<Record<number, boolean>>({})
const deletingMap = reactive<Record<number, boolean>>({})

// CSV file handling
const csvFile = ref<File | null>(null)
const csvFileName = ref('')
const csvFileError = ref('')

// Options for pickers
const contactSearch = ref('')
const contactOptions = computed(() =>
  (refsStore.contacts || [])
    .filter((c: any) => !!c.email)
    .map((c: any) => {
      const name = c.name || c.first_name || c.last_name ? `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim() : ''
      const label = name ? `${name} (${c.email})` : (c.email || 'Unknown')
      return { value: c.id, label }
    })
)
const filteredContactOptions = computed(() => {
  const q = contactSearch.value.trim().toLowerCase()
  if (!q) return contactOptions.value
  return contactOptions.value.filter((o: { label: string }) => o.label.toLowerCase().includes(q))
})

const segmentOptions = computed(() =>
  (segments.value || []).map((s: any) => {
    const typeLabel = s.type === 'static' ? ' (Static)' : s.type === 'dynamic' ? ' (Dynamic)' : ''
    return { value: s.id, label: `${s.name}${typeLabel}` }
  })
)

const loadSegments = async () => {
  try {
    const res = await listsAPI.getLists({ per_page: 50 })
    segments.value = res.data?.data || []
  } catch (err: any) {
    segments.value = []
  }
}

// Filters
const filters = reactive({
  search: '',
  status: 'all',
  type: 'all',
  owner_id: '',
  date_range: 'all',
  sort: '-created_at',
  page: 1,
  per_page: 15
})

// Campaign form
const campaignForm = reactive<CampaignFormData>({
  name: '',
  description: '',
  type: '',
  owner_id: undefined,
  subject: '',
  content: '',
  scheduled_at: '',
  recipient_mode: '',
  recipient_contact_ids: [],
  segment_id: ''
})

// Computed
const isFormValid = computed(() => {
  return campaignForm.name && 
         campaignForm.type && 
         campaignForm.content
})

// Methods
const refreshCampaigns = () => {
  fetchCampaigns()
}

const fetchCampaigns = async () => {
  const params = { ...filters }
  if (params.status === 'all') delete params.status
  if (params.type === 'all') delete params.type
  if (!params.owner_id) delete params.owner_id
  if (params.date_range === 'all') delete params.date_range

  await campaignsStore.fetchCampaigns(params)
}

const applyFilters = () => {
  filters.page = 1
  fetchCampaigns()
}

const clearFilters = () => {
  Object.assign(filters, {
    search: '',
    status: 'all',
    type: 'all',
    owner_id: '',
    date_range: 'all',
    sort: '-created_at',
    page: 1,
    per_page: 15
  })
  applyFilters()
}

const setStatusFilter = (status: string) => {
  filters.status = status
  filters.page = 1
  applyFilters()
}

const onPerPageChange = () => {
  filters.page = 1
  applyFilters()
}

const changePage = (page: number) => {
  filters.page = page
  fetchCampaigns()
}

const debouncedSearch = debounce(() => {
  filters.page = 1
  applyFilters()
}, 300)

// CSV file handling functions
const handleCSVFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  csvFileError.value = ''
  csvFileName.value = ''
  csvFile.value = null
  
  if (!file) {
    return
  }
  
  // Validate file type
  const fileName = file.name.toLowerCase()
  const isValidType = fileName.endsWith('.csv') || fileName.endsWith('.txt')
  
  if (!isValidType) {
    csvFileError.value = 'Please select a .csv or .txt file'
    target.value = ''
    return
  }
  
  // Validate file size (10MB = 10 * 1024 * 1024 bytes)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    csvFileError.value = 'File size must be less than 10MB'
    target.value = ''
    return
  }
  
  csvFile.value = file
  csvFileName.value = file.name
}

const downloadCSVTemplate = () => {
  const csvContent = 'email\nuser1@example.com\nuser2@example.com\nuser3@example.com'
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'campaign_recipients_template.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

const saveCampaign = async () => {
  if (!isFormValid.value) {
    showError('Please fill in all required fields')
    return
  }

  // Validate CSV file if CSV mode is selected
  if (campaignForm.recipient_mode === 'csv') {
    if (!csvFile.value) {
      showError('Please select a CSV file')
      csvFileError.value = 'CSV file is required'
      return
    }
  }

  // Handle CSV mode with FormData
  if (campaignForm.recipient_mode === 'csv' && csvFile.value) {
    const formData = new FormData()
    formData.append('name', campaignForm.name?.trim() || '')
    formData.append('description', campaignForm.description || '')
    formData.append('type', campaignForm.type)
    if (campaignForm.owner_id !== undefined) {
      formData.append('owner_id', String(campaignForm.owner_id))
    }
    formData.append('subject', campaignForm.subject?.trim() || '')
    formData.append('content', campaignForm.content?.trim() || '')
    formData.append('recipient_mode', 'csv')
    formData.append('csv_file', csvFile.value)

    // scheduled_at: convert back to ISO UTC if user set a value
    if (campaignForm.scheduled_at) {
      const iso = toIsoUtcFromLocalInput(campaignForm.scheduled_at)
      if (iso) formData.append('scheduled_at', iso)
    }

    saving.value = true
    try {
      if (showEditModal.value && campaignToDelete.value) {
        // For updates, we still use JSON (CSV upload is only for creation)
        showError('CSV upload is only available for new campaigns')
        return
      } else {
        // Use direct API call with FormData for CSV mode
        await campaignsAPI.createCampaign(formData)
        success('Campaign created successfully')
      }

      closeModal()
      fetchCampaigns()
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to save campaign')
    } finally {
      saving.value = false
    }
    return
  }

  // Existing JSON payload flow for manual and segment modes (unchanged)
  const payload: any = {
    name: campaignForm.name?.trim(),
    description: campaignForm.description || '',
    type: campaignForm.type,
    owner_id: campaignForm.owner_id,
    subject: campaignForm.subject?.trim() || '',
    content: campaignForm.content?.trim()
  }
  // Recipient fields at root
  if (campaignForm.recipient_mode === 'contacts') {
    payload.recipient_mode = 'manual'
    payload.recipient_contact_ids = (campaignForm.recipient_contact_ids || [])
      .map((id: any) => Number(id))
      .filter((n: any) => Number.isFinite(n))
  } else if (campaignForm.recipient_mode === 'segment') {
    payload.recipient_mode = 'segment'
    if (campaignForm.segment_id !== '' && campaignForm.segment_id !== undefined && campaignForm.segment_id !== null) {
      const segId = Number(campaignForm.segment_id)
      payload.segment_id = Number.isFinite(segId) ? segId : campaignForm.segment_id
    }
  }

  // scheduled_at: convert back to ISO UTC if user set a value
  if (campaignForm.scheduled_at) {
    const iso = toIsoUtcFromLocalInput(campaignForm.scheduled_at)
    if (iso) payload.scheduled_at = iso
  }

  saving.value = true
  try {
    if (showEditModal.value && campaignToDelete.value) {
      await campaignsStore.updateCampaign(campaignToDelete.value.id, payload)
      success('Campaign updated successfully')
    } else {
      await campaignsStore.createCampaign(payload)
      success('Campaign created successfully')
    }

    closeModal()
    fetchCampaigns()
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to save campaign')
  } finally {
    saving.value = false
  }
}

const scheduleCampaign = async (campaign: Campaign) => {
  try {
    // Ensure ISO format for schedule_at; if UI date lacks timezone, append 'Z'
    const iso = campaign.scheduled_at ? (campaign.scheduled_at.endsWith('Z') ? campaign.scheduled_at : `${campaign.scheduled_at}Z`) : ''
    await campaignsStore.scheduleCampaign(campaign.id, iso)
    success('Campaign scheduled successfully')
    fetchCampaigns()
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to schedule campaign')
  }
}

const sendCampaign = async (campaign: Campaign) => {
  try {
    await campaignsStore.sendCampaign(campaign.id)
    success('Campaign sent successfully')
    fetchCampaigns()
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to send campaign')
  }
}

const viewCampaign = (campaign: Campaign) => {
  selectedCampaign.value = campaign
  activeDetailTab.value = 'overview' // Reset to overview tab
  showDetailModal.value = true
}

const editCampaign = (campaign: Campaign) => {
  campaignToDelete.value = campaign
  Object.assign(campaignForm, {
    name: campaign.name,
    description: campaign.description || '',
    type: campaign.type,
    owner_id: campaign.owner_id,
    subject: campaign.subject || '',
    content: campaign.content,
    scheduled_at: campaign.scheduled_at ? toLocalInputFromIsoUtc(campaign.scheduled_at as unknown as string) : ''
  })
  // Prefill recipients from settings if provided (backend returns under settings)
  const settings: any = (campaign as any).settings || {}
  if (settings.recipient_mode === 'manual' || settings.recipient_mode === 'static') {
    campaignForm.recipient_mode = 'contacts'
    campaignForm.recipient_contact_ids = Array.isArray(settings.recipient_contact_ids) ? settings.recipient_contact_ids : []
    campaignForm.segment_id = ''
  } else if (settings.recipient_mode === 'segment') {
    campaignForm.recipient_mode = 'segment'
    campaignForm.segment_id = settings.segment_id || ''
    campaignForm.recipient_contact_ids = []
  } else {
    campaignForm.recipient_mode = ''
    campaignForm.recipient_contact_ids = []
    campaignForm.segment_id = ''
  }
  showEditModal.value = true
  showDetailModal.value = false
  showMetricsModal.value = false
}

const viewMetrics = async (campaign: Campaign) => {
  selectedCampaign.value = campaign
  showMetricsModal.value = true
  
  try {
    const metrics = await campaignsStore.getCampaignMetrics(campaign.id)
    campaignMetrics.value = metrics
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to load campaign metrics')
  }
}

// Pause campaign
const pauseCampaign = async (campaign: Campaign) => {
  try {
    await campaignsStore.pauseCampaign(campaign.id)
    success('Campaign paused successfully')
    fetchCampaigns()
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to pause campaign')
  }
}

// Resume campaign
const resumeCampaign = async (campaign: Campaign) => {
  try {
    await campaignsStore.resumeCampaign(campaign.id)
    success('Campaign resumed successfully')
    fetchCampaigns()
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to resume campaign')
  }
}

// Duplicate campaign
const duplicateCampaign = async (campaign: Campaign) => {
  try {
    await campaignsStore.duplicateCampaign(campaign.id)
    success('Campaign duplicated successfully')
    fetchCampaigns()
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to duplicate campaign')
  }
}

// Load templates
const loadTemplates = async () => {
  loadingTemplates.value = true
  try {
    const response = await campaignsStore.getTemplates()
    templates.value = response.data || []
  } catch (err: any) {
    showError('Failed to load templates')
  } finally {
    loadingTemplates.value = false
  }
}

// Load recipients for a campaign
const loadRecipients = async (campaignId: number) => {
  loadingRecipients.value = true
  try {
    const response = await campaignsStore.getRecipients(campaignId)
    recipients.value = response.data || []
  } catch (err: any) {
    showError('Failed to load recipients')
  } finally {
    loadingRecipients.value = false
  }
}

// Add recipient to campaign
const addRecipient = async (campaignId: number, recipientData: any) => {
  try {
    await campaignsStore.addRecipient(campaignId, recipientData)
    success('Recipient added successfully')
    await loadRecipients(campaignId)
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to add recipient')
  }
}

// Remove recipient from campaign
const removeRecipient = async (campaignId: number, recipientId: number) => {
  try {
    await campaignsStore.removeRecipient(campaignId, recipientId)
    success('Recipient removed successfully')
    await loadRecipients(campaignId)
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to remove recipient')
  }
}

// Check if campaign can be deleted
const canDeleteCampaign = (campaign: Campaign): boolean => {
  // Allow deletion for draft, scheduled, paused, and archived campaigns
  // Prevent deletion for sent campaigns (they should be archived instead)
  const deletableStatuses = ['draft', 'scheduled', 'paused', 'archived']
  return deletableStatuses.includes(campaign.status)
}

const deleteCampaign = (campaign: Campaign) => {
  campaignToDelete.value = campaign
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!campaignToDelete.value) return

  try {
    await campaignsStore.deleteCampaign(campaignToDelete.value.id)
    showDeleteModal.value = false
    campaignToDelete.value = null
    success('Campaign deleted successfully')
    fetchCampaigns()
  } catch (err) {
    showError('Failed to delete campaign')
  }
}

// Recipients methods
const fetchCampaignRecipients = async (campaignId: number) => {
  loadingRecipients.value = true
  recipientsError.value = ''
  
  try {
    const response = await campaignsStore.getRecipients(campaignId)
    campaignRecipients.value = response.data || []
  } catch (err: any) {
    recipientsError.value = err.response?.data?.message || 'Failed to fetch recipients'
    campaignRecipients.value = []
  } finally {
    loadingRecipients.value = false
  }
}

const getRecipientStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'sent':
      return 'bg-green-100 text-green-800'
    case 'delivered':
      return 'bg-blue-100 text-blue-800'
    case 'opened':
      return 'bg-purple-100 text-purple-800'
    case 'clicked':
      return 'bg-yellow-100 text-yellow-800'
    case 'bounced':
      return 'bg-red-100 text-red-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const fetchCampaignAuditLogs = async (campaignId: number) => {
  loadingAuditLogs.value = true
  auditLogsError.value = ''
  
  try {
    const response = await campaignsStore.getCampaignAuditLogs(campaignId)
    campaignAuditLogs.value = response.data || []
  } catch (err: any) {
    auditLogsError.value = err.response?.data?.message || 'Unable to load logs'
    campaignAuditLogs.value = []
  } finally {
    loadingAuditLogs.value = false
  }
}

const getAuditLogActionClass = (action: string) => {
  switch (action?.toLowerCase()) {
    case 'audience_frozen': return 'bg-blue-100 text-blue-800'
    case 'campaign_sent': return 'bg-green-100 text-green-800'
    case 'recipient_opened': return 'bg-yellow-100 text-yellow-800'
    case 'recipient_clicked': return 'bg-purple-100 text-purple-800'
    case 'recipient_unsubscribed': return 'bg-red-100 text-red-800'
    case 'campaign_created': return 'bg-indigo-100 text-indigo-800'
    case 'campaign_updated': return 'bg-orange-100 text-orange-800'
    case 'campaign_deleted': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatAuditLogAction = (action: string) => {
  return action?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || action
}

const toggleMetadata = (logId: number) => {
  expandedMetadata.value[logId] = !expandedMetadata.value[logId]
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showDetailModal.value = false
  showMetricsModal.value = false
  showTemplatesModal.value = false
  showRecipientsModal.value = false
  showImportModal.value = false
  showBulkActionsModal.value = false
  showPreviewModal.value = false
  showTestModal.value = false
  campaignToDelete.value = null
  selectedCampaign.value = null
  campaignMetrics.value = null
  campaignPreview.value = ''
  testEmail.value = ''
  importFile.value = null
  // Reset recipients data
  campaignRecipients.value = []
  recipientsError.value = ''
  // Reset audit logs data
  campaignAuditLogs.value = []
  auditLogsError.value = ''
  expandedMetadata.value = {}
  activeDetailTab.value = 'overview'
  Object.assign(campaignForm, {
    name: '',
    description: '',
    type: '',
    owner_id: undefined,
    subject: '',
    content: '',
    scheduled_at: '',
    recipient_mode: '',
    recipient_contact_ids: [],
    segment_id: ''
  })
  // Reset CSV file
  csvFile.value = null
  csvFileName.value = ''
  csvFileError.value = ''
}

// Use template function - Simple approach (like before)
const useTemplate = async (template: any) => {
  try {
    console.log('[UseTemplate] Using template:', template.id)
    
    // Use template data directly - no API call needed
    Object.assign(campaignForm, {
      name: template.name,
      description: template.description || '',
      type: template.type,
      owner_id: template.owner_id,
      subject: template.subject || '',
      content: template.content || '',
      scheduled_at: ''
    })
    
    // Reset recipient settings for new campaign
    campaignForm.recipient_mode = ''
    campaignForm.recipient_contact_ids = []
    campaignForm.segment_id = ''
    // Reset CSV file
    csvFile.value = null
    csvFileName.value = ''
    csvFileError.value = ''
    
    // Close templates modal and open create modal
    showTemplatesModal.value = false
    showCreateModal.value = true
    
    success('Template loaded successfully')
    
  } catch (err: any) {
    console.error('[UseTemplate] Error:', err)
    showError('Failed to load template')
  }
}

const deleteTemplateItem = async (template: any) => {
  const id = template?.id
  if (id === undefined || id === null) {
    console.debug('[Templates][Delete][UI] invalid id', { id, typeofId: typeof id, template })
    throw new Error('Invalid template id')
  }
  console.debug('[Templates][Delete][UI] calling store with', { id, typeofId: typeof id })
  try {
    await campaignsStore.deleteTemplate(id)
    console.debug('[Templates][Delete][UI] store resolved', { id })
    success('Template deleted')
    // Optimistically remove; then refetch in confirm handler
    templates.value = templates.value.filter((t: any) => t.id !== id)
  } catch (err: any) {
    console.debug('[Templates][Delete][UI] store error', {
      id,
      status: err?.response?.status,
      message: err?.response?.data?.message
    })
    const status = err?.response?.status
    const message = err?.response?.data?.message
    let friendly = message || 'Failed to delete template'
    if (status === 422) friendly = message || 'Only templates can be deleted via this view.'
    else if (status === 403) friendly = "You don't have permission to delete this template."
    else if (status === 404) friendly = 'Template not found or belongs to another workspace.'
    else if (status >= 500) friendly = 'Server error. Try again.'
    showError(friendly)
    throw err
  }
}

const confirmDeleteTemplate = async (template: any) => {
  console.debug('[Templates][Delete][UI] click', { template })
  const ok = window.confirm(`Delete template '${template?.name}'? This cannot be undone.`)
  if (!ok) return
  deletingMap[template.id] = true
  try {
    await deleteTemplateItem(template)
    await loadTemplates() // only after successful DELETE
  } finally {
    deletingMap[template.id] = false
  }
}

const insertText = (text: string) => {
  const textarea = document.querySelector('textarea[v-model="campaignForm.content"]') as HTMLTextAreaElement
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentText = campaignForm.content
    campaignForm.content = currentText.substring(0, start) + text + currentText.substring(end)
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }
}

const renderMarkdown = (content: string) => {
  // Simple markdown rendering - in production, use a proper markdown library
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800">$1</a>')
    .replace(/\n/g, '<br>')
}

const calculateRate = (numerator: number, denominator: number) => {
  if (!denominator) return 0
  return Math.round((numerator / denominator) * 100)
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    scheduled: 'bg-blue-100 text-blue-800',
    sent: 'bg-green-100 text-green-800',
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusTextClass = (status: string) => {
  const classes = {
    draft: 'text-gray-600',
    scheduled: 'text-blue-600',
    sent: 'text-green-600',
    active: 'text-green-600',
    paused: 'text-yellow-600',
    archived: 'text-gray-600',
    cancelled: 'text-red-600'
  }
  return classes[status as keyof typeof classes] || 'text-gray-600'
}

// Date helpers: ISO (UTC) <-> input[type=datetime-local] (local, no seconds)
const toLocalInputFromIsoUtc = (isoUtc: string): string => {
  try {
    const d = new Date(isoUtc)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mi = String(d.getMinutes()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
  } catch {
    return ''
  }
}

const toIsoUtcFromLocalInput = (localStr: string): string => {
  try {
    // Ensure seconds; Date will treat as local time
    const withSeconds = localStr.length === 16 ? `${localStr}:00` : localStr
    const d = new Date(withSeconds)
    return d.toISOString()
  } catch {
    return ''
  }
}

const saveAsTemplateInline = async () => {
  console.log('[SaveTemplate] clicked')
  if (savingTemplate.value) return
  savingTemplate.value = true
  try {
    // Determine mode via current editing object or presence of id in form
    const editingId = showEditModal.value && campaignToDelete.value?.id ? campaignToDelete.value.id : (campaignForm as any).id
    if (editingId) {
      console.log('[SaveTemplate] mode=edit, id=', editingId)
      const resp = await campaignsStore.saveAsTemplate(editingId as number)
      console.log('[SaveTemplate] response(edit):', resp)
    } else {
      // Create a clean template (no scheduled_at, no recipient settings)
      const payload: any = {
        name: (campaignForm.name || '').trim(),
        type: campaignForm.type,
        subject: (campaignForm.subject || '').trim(),
        content: (campaignForm.content || '').trim(),
        description: (campaignForm.description || '').trim() // Add description for templates
      }
      // owner_id optional; include only if present
      if (campaignForm.owner_id) payload.owner_id = campaignForm.owner_id
      console.log('[SaveTemplate] mode=create, payload=', payload)
      const created = await campaignsStore.createTemplate(payload)
      console.log('[SaveTemplate] response(create):', created)
    }
    success('Template saved')
    showCreateModal.value = false
    showEditModal.value = false
    await loadTemplates()
  } catch (err: any) {
    const status = err?.response?.status
    const data = err?.response?.data
    console.error('[SaveTemplate] error:', status, data)
    if (status === 422 && data?.errors) {
      // Map validation errors to the form for visibility
      try {
        Object.keys(data.errors).forEach((k) => ((errors as any)[k] = data.errors[k][0]))
      } catch {}
      showError(data?.message || 'Validation failed')
    } else {
      showError(err.response?.data?.message || 'Failed to save template')
    }
  } finally {
    savingTemplate.value = false
  }
}

// ============= NEW MISSING METHODS =============

// Campaign Enhancements
const testCampaign = async (campaign: Campaign) => {
  selectedCampaign.value = campaign
  showTestModal.value = true
}

const previewCampaign = async (campaign: Campaign) => {
  try {
    const preview = await campaignsStore.previewCampaign(campaign.id)
    campaignPreview.value = preview.data?.html || preview.data?.content || 'No preview available'
    selectedCampaign.value = campaign
    showPreviewModal.value = true
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to load campaign preview')
  }
}

const validateCampaign = async (campaign: Campaign) => {
  try {
    const validation = await campaignsStore.validateCampaign(campaign.id)
    if (validation.data?.valid) {
      success('Campaign validation passed')
    } else {
      showError(validation.data?.errors?.join(', ') || 'Campaign validation failed')
    }
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to validate campaign')
  }
}

const unscheduleCampaign = async (campaign: Campaign) => {
  try {
    await campaignsStore.unscheduleCampaign(campaign.id)
    success('Campaign unscheduled successfully')
    fetchCampaigns()
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to unschedule campaign')
  }
}

const archiveCampaign = async (campaign: Campaign) => {
  try {
    await campaignsStore.archiveCampaign(campaign.id)
    success('Campaign archived successfully')
    fetchCampaigns()
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to archive campaign')
  }
}

const restoreCampaign = async (campaign: Campaign) => {
  try {
    await campaignsStore.restoreCampaign(campaign.id)
    success('Campaign restored successfully')
    fetchCampaigns()
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to restore campaign')
  }
}

// Bulk Operations
const toggleCampaignSelection = (campaignId: number) => {
  const index = selectedCampaignIds.value.indexOf(campaignId)
  if (index > -1) {
    selectedCampaignIds.value.splice(index, 1)
  } else {
    selectedCampaignIds.value.push(campaignId)
  }
}

const bulkSendCampaigns = async () => {
  try {
    await campaignsStore.bulkSendCampaigns(selectedCampaignIds.value)
    success(`Successfully sent ${selectedCampaignIds.value.length} campaigns`)
    selectedCampaignIds.value = []
    showBulkActionsModal.value = false
    fetchCampaigns()
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to send campaigns')
  }
}

const bulkPauseCampaigns = async () => {
  try {
    await campaignsStore.bulkPauseCampaigns(selectedCampaignIds.value)
    success(`Successfully paused ${selectedCampaignIds.value.length} campaigns`)
    selectedCampaignIds.value = []
    showBulkActionsModal.value = false
    fetchCampaigns()
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to pause campaigns')
  }
}

const bulkResumeCampaigns = async () => {
  try {
    await campaignsStore.bulkResumeCampaigns(selectedCampaignIds.value)
    success(`Successfully resumed ${selectedCampaignIds.value.length} campaigns`)
    selectedCampaignIds.value = []
    showBulkActionsModal.value = false
    fetchCampaigns()
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to resume campaigns')
  }
}

const bulkArchiveCampaigns = async () => {
  try {
    await campaignsStore.bulkArchiveCampaigns(selectedCampaignIds.value)
    success(`Successfully archived ${selectedCampaignIds.value.length} campaigns`)
    selectedCampaignIds.value = []
    showBulkActionsModal.value = false
    fetchCampaigns()
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to archive campaigns')
  }
}

// Import/Export
const exportCampaigns = async () => {
  try {
    // Clean up filters before export (same logic as fetchCampaigns)
    const params = { ...filters }
    if (params.status === 'all') delete params.status
    if (params.type === 'all') delete params.type
    if (!params.owner_id) delete params.owner_id
    if (params.date_range === 'all') delete params.date_range
    
    const blob = await campaignsStore.exportCampaigns(params)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `campaigns-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    success('Campaigns exported successfully')
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to export campaigns')
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    importFile.value = target.files[0]
  }
}

const importCampaigns = async () => {
  if (!importFile.value) {
    showError('Please select a file to import')
    return
  }
  
  try {
    await campaignsStore.importCampaigns(importFile.value)
    success('Campaigns imported successfully')
    showImportModal.value = false
    importFile.value = null
    fetchCampaigns()
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to import campaigns')
  }
}

const sendTestEmail = async () => {
  if (!selectedCampaign.value || !testEmail.value) return
  
  try {
    await campaignsStore.testCampaign(selectedCampaign.value.id, { test_emails: [testEmail.value] })
    success('Test email sent successfully')
    showTestModal.value = false
    testEmail.value = ''
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to send test email')
  }
}

// Lifecycle
onMounted(() => {
  fetchCampaigns()
  refsStore.fetchUsers()
  loadSegments() // Load segments on mount
  
  // Auto-open create modal if prop is set
  if (props.openCreateModal) {
    showCreateModal.value = true
    
    // Pre-select email type if specified in query
    const urlParams = new URLSearchParams(window.location.search)
    const type = urlParams.get('type')
    if (type === 'email') {
      campaignForm.type = 'email'
    }
  }
})

// Watch for templates modal opening
watch(showTemplatesModal, (newValue: boolean) => {
  if (newValue && templates.value.length === 0) {
    loadTemplates()
  }
})

watch([showCreateModal, showEditModal], async ([createOpen, editOpen]: ModalBools) => {
  if (createOpen || editOpen) {
    if (!refsStore.users.length) refsStore.fetchUsers()
    if (!refsStore.contacts.length) refsStore.fetchContacts({ per_page: 50 })
    if (!segments.value.length) await loadSegments()
    // Preselect current user as owner if empty
    if (!campaignForm.owner_id) {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const u = JSON.parse(userStr)
          if (u?.id) campaignForm.owner_id = u.id
        }
      } catch (_) {}
    }
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
