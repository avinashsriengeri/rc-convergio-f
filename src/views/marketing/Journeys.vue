<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumbs -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex py-4" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <div class="flex items-center">
                <router-link to="/marketing" class="text-gray-400 hover:text-gray-500">
                  <svg class="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span class="sr-only">Home</span>
                </router-link>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-500">{{ $t('common.marketing') }}</span>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-900">{{ $t('marketing.journeys.title') }}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('marketing.journeys.title') }}</h1>
          <p class="mt-2 text-lg text-gray-600">{{ $t('marketing.journeys.subtitle') }}</p>
        </div>
        <button
          @click="openCreateModal"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          {{ $t('marketing.journeys.create_modal.title') }}
        </button>
      </div>

      <!-- Journey Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Active Journeys -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.journeys.stats.active_journeys') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeJourneysCount }}</p>
              <p class="text-sm text-green-600">+3 this month</p>
            </div>
          </div>
        </div>

        <!-- Contacts in Journeys -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.journeys.stats.contacts_in_journeys') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalContactsInJourneys }}</p>
              <p class="text-sm text-green-600">+15% from last month</p>
            </div>
          </div>
        </div>

        <!-- Average Completion Rate -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.journeys.stats.avg_completion_rate') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ averageCompletionRate }}%</p>
              <p class="text-sm text-green-600">+5% from last month</p>
            </div>
          </div>
        </div>

        <!-- Journey Performance -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('marketing.journeys.stats.conversion_rate') }}</p>
              <p class="text-2xl font-bold text-gray-900">23%</p>
              <p class="text-sm text-green-600">+3% from last month</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Journeys Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <!-- Table Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Customer Journeys</h3>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">{{ $t('marketing.journeys.loading') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-12 text-center">
          <div class="text-red-600 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.journeys.error') }}</h3>
          <button
            @click="loadJourneys"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {{ $t('common.marketing_overview.retry_button') }}
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="journeys.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('marketing.journeys.empty_state.title') }}</h3>
          <p class="text-gray-600 mb-6">{{ $t('marketing.journeys.empty_state.message') }}</p>
          <button
            @click="openCreateModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            {{ $t('marketing.journeys.empty_state.create_journey') }}
          </button>
        </div>

        <!-- Journeys Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.journeys.table.name') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.journeys.table.status') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.journeys.table.steps') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.journeys.table.active_executions') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.journeys.table.completed_executions') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.journeys.table.completion_rate') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.journeys.table.updated_at') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('marketing.journeys.table.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="journey in journeys"
                :key="journey.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ journey.name }}</div>
                  <div class="text-sm text-gray-500">{{ journey.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusColor(journey.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ $t(`marketing.journeys.statuses.${journey.status}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ journey.steps_count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatNumber(journey.active_executions) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatNumber(journey.completed_executions) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        :class="getProgressColor(journey.completion_rate)"
                        class="h-2 rounded-full"
                        :style="{ width: `${journey.completion_rate}%` }"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-600">{{ journey.completion_rate }}%</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(journey.updated_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewJourneyDetails(journey)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      {{ $t('marketing.journeys.actions.view_details') }}
                    </button>
                    <button
                      @click="deleteJourney(journey)"
                      class="text-red-600 hover:text-red-900"
                    >
                      {{ $t('marketing.journeys.actions.delete_journey') }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create Journey Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeCreateModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.journeys.create_modal.title') }}</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="createJourney">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.journeys.create_modal.name') }}</label>
                  <input
                    v-model="journeyForm.name"
                    type="text"
                    required
                    :placeholder="$t('marketing.journeys.create_modal.enter_name')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.journeys.create_modal.description') }}</label>
                  <textarea
                    v-model="journeyForm.description"
                    :placeholder="$t('marketing.journeys.create_modal.enter_description')"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.journeys.create_modal.status') }}</label>
                  <select
                    v-model="journeyForm.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">{{ $t('marketing.journeys.statuses.draft') }}</option>
                    <option value="active">{{ $t('marketing.journeys.statuses.active') }}</option>
                    <option value="paused">{{ $t('marketing.journeys.statuses.paused') }}</option>
                  </select>
                </div>
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <label class="block text-sm font-medium text-gray-700">{{ $t('marketing.journeys.create_modal.steps') }}</label>
                    <button
                      type="button"
                      @click="addStep"
                      class="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {{ $t('marketing.journeys.create_modal.add_step') }}
                    </button>
                  </div>
                  <div class="space-y-4">
                    <div
                      v-for="(step, index) in journeyForm.steps"
                      :key="index"
                      class="border border-gray-200 rounded-lg p-4"
                    >
                      <div class="flex justify-between items-center mb-3">
                        <span class="text-sm font-medium text-gray-700">Step {{ index + 1 }}</span>
                        <button
                          type="button"
                          @click="removeStep(index)"
                          class="text-sm text-red-600 hover:text-red-800"
                        >
                          {{ $t('marketing.journeys.create_modal.remove_step') }}
                        </button>
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.journeys.create_modal.step_type') }}</label>
                          <select
                            v-model="step.type"
                            @change="updateStepSchema(index)"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">{{ $t('marketing.journeys.create_modal.select_step_type') }}</option>
                            <option v-for="stepType in stepTypes" :key="stepType.id" :value="stepType.id">
                              {{ stepType.name }}
                            </option>
                          </select>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.journeys.create_modal.step_name') }}</label>
                          <input
                            v-model="step.name"
                            type="text"
                            :placeholder="$t('marketing.journeys.create_modal.enter_step_name')"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div v-if="step.config" class="mt-3">
                        <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('marketing.journeys.create_modal.step_config') }}</label>
                        <textarea
                          v-model="step.config"
                          rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                          placeholder="Enter JSON configuration"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="closeCreateModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {{ $t('marketing.journeys.create_modal.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="creatingJourney"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
                >
                  {{ creatingJourney ? $t('marketing.journeys.create_modal.creating') : $t('marketing.journeys.create_modal.create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Journey Details Drawer -->
    <div
      v-if="showDetailsDrawer"
      class="fixed inset-y-0 right-0 z-50 w-full max-w-4xl bg-white shadow-xl"
    >
      <div class="flex flex-col h-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.journeys.details_drawer.title') }}</h3>
            <button
              @click="closeDetailsDrawer"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div class="p-6">
            <div v-if="selectedJourney" class="space-y-6">
              <!-- Journey Info -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-2">{{ selectedJourney.name }}</h4>
                <p class="text-sm text-gray-600 mb-3">{{ selectedJourney.description }}</p>
                <div class="flex items-center space-x-4">
                  <span :class="getStatusColor(selectedJourney.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ $t(`marketing.journeys.statuses.${selectedJourney.status}`) }}
                  </span>
                  <span class="text-sm text-gray-600">{{ selectedJourney.steps_count }} steps</span>
                  <span class="text-sm text-gray-600">{{ selectedJourney.completion_rate }}% completion rate</span>
                </div>
              </div>

              <!-- Steps -->
              <div>
                <h4 class="font-medium text-gray-900 mb-3">{{ $t('marketing.journeys.details_drawer.steps') }}</h4>
                <div class="space-y-2">
                  <div
                    v-for="step in selectedJourney.steps"
                    :key="step.id"
                    class="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getStepTypeIcon(step.type)" />
                      </svg>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ step.name }}</div>
                        <div class="text-sm text-gray-500">{{ $t(`marketing.journeys.step_types.${step.type}`) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Run Test -->
              <div class="border-t pt-6">
                <h4 class="font-medium text-gray-900 mb-3">{{ $t('marketing.journeys.details_drawer.run_test') }}</h4>
                <div class="flex space-x-3">
                  <input
                    v-model="testContactId"
                    type="text"
                    :placeholder="$t('marketing.journeys.details_drawer.enter_contact_id')"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    @click="runTest"
                    :disabled="runningTest"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
                  >
                    {{ runningTest ? $t('marketing.journeys.details_drawer.running') : $t('marketing.journeys.details_drawer.run') }}
                  </button>
                </div>
              </div>

              <!-- Executions -->
              <div class="border-t pt-6">
                <h4 class="font-medium text-gray-900 mb-3">{{ $t('marketing.journeys.details_drawer.executions') }}</h4>
                <div v-if="executions.length === 0" class="text-center py-8">
                  <p class="text-gray-500">No executions found</p>
                </div>
                <div v-else class="space-y-3">
                  <div
                    v-for="execution in executions"
                    :key="execution.id"
                    class="border border-gray-200 rounded-lg p-4"
                  >
                    <div class="flex justify-between items-start">
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ execution.contact.name }}</div>
                        <div class="text-sm text-gray-500">{{ execution.contact.email }}</div>
                      </div>
                      <span :class="getExecutionStatusColor(execution.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{ $t(`marketing.journeys.execution_statuses.${execution.status}`) }}
                      </span>
                    </div>
                    <div class="mt-3">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-sm text-gray-600">{{ $t('marketing.journeys.details_drawer.execution_progress') }}</span>
                        <span class="text-sm text-gray-900">{{ execution.progress_percentage }}%</span>
                      </div>
                      <div class="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          :class="getProgressColor(execution.progress_percentage)"
                          class="h-2 rounded-full"
                          :style="{ width: `${execution.progress_percentage}%` }"
                        ></div>
                      </div>
                    </div>
                    <div class="mt-2 text-sm text-gray-500">
                      {{ $t('marketing.journeys.details_drawer.execution_started') }}: {{ formatDateTime(execution.started_at) }}
                      <span v-if="execution.next_step_at">
                        | {{ $t('marketing.journeys.details_drawer.execution_next_step') }}: {{ formatDateTime(execution.next_step_at) }}
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

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="closeConfirmModal"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('marketing.journeys.confirmations.delete_title') }}</h3>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-6">{{ $t('marketing.journeys.confirmations.delete_message') }}</p>
            <div class="flex justify-end space-x-3">
              <button
                @click="closeConfirmModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {{ $t('marketing.journeys.confirmations.cancel') }}
              </button>
              <button
                @click="confirmDelete"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                {{ $t('marketing.journeys.confirmations.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { journeysService, journeysHelpers } from '@/services/journeys'
import { error as showError, success as showSuccess } from '@/utils/notifications'

const { t } = useI18n()

// Reactive state
const loading = ref(false)
const error = ref(null)
const journeys = ref([])
const stepTypes = ref([])
const executions = ref([])

// Modal states
const showCreateModal = ref(false)
const showDetailsDrawer = ref(false)
const showConfirmModal = ref(false)
const creatingJourney = ref(false)
const runningTest = ref(false)
const selectedJourney = ref(null)
const journeyToDelete = ref(null)

// Forms
const journeyForm = ref({
  name: '',
  description: '',
  status: 'draft',
  steps: []
})

const testContactId = ref('')

// Computed properties
const activeJourneysCount = computed(() => {
  return journeys.value.filter(j => j.status === 'active').length
})

const totalContactsInJourneys = computed(() => {
  return journeys.value.reduce((total, journey) => total + journey.active_executions, 0)
})

const averageCompletionRate = computed(() => {
  if (journeys.value.length === 0) return 0
  const total = journeys.value.reduce((sum, journey) => sum + journey.completion_rate, 0)
  return Math.round(total / journeys.value.length)
})

// Methods
const loadJourneys = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await journeysService.getJourneys()
    journeys.value = response.data || []
  } catch (err) {
    error.value = err.message || 'Failed to load journeys'
    showError(error.value)
  } finally {
    loading.value = false
  }
}

const loadStepTypes = async () => {
  try {
    const response = await journeysService.getStepTypes()
    stepTypes.value = response.data || []
  } catch (err) {
    console.error('Failed to load step types:', err)
  }
}

const loadExecutions = async (journeyId) => {
  try {
    const response = await journeysService.getJourneyExecutions(journeyId)
    executions.value = response.data || []
  } catch (err) {
    console.error('Failed to load executions:', err)
    executions.value = []
  }
}

const openCreateModal = () => {
  journeyForm.value = {
    name: '',
    description: '',
    status: 'draft',
    steps: []
  }
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  creatingJourney.value = false
}

const addStep = () => {
  journeyForm.value.steps.push({
    type: '',
    name: '',
    config: ''
  })
}

const removeStep = (index) => {
  journeyForm.value.steps.splice(index, 1)
}

const updateStepSchema = async (index) => {
  const step = journeyForm.value.steps[index]
  if (step.type) {
    try {
      const response = await journeysService.getStepSchema(step.type)
      const schema = response.data
      if (schema && schema.fields) {
        // Create a default configuration based on the schema
        const config = {}
        schema.fields.forEach(field => {
          config[field.name] = field.default || ''
        })
        step.config = JSON.stringify(config, null, 2)
      }
    } catch (err) {
      console.error('Failed to load step schema:', err)
    }
  }
}

const createJourney = async () => {
  creatingJourney.value = true
  
  try {
    // Validate steps
    const validSteps = journeyForm.value.steps.filter(step => step.type && step.name)
    
    const data = {
      name: journeyForm.value.name,
      description: journeyForm.value.description,
      status: journeyForm.value.status,
      steps: validSteps.map((step, index) => ({
        type: step.type,
        name: step.name,
        order: index + 1,
        config: step.config ? JSON.parse(step.config) : {}
      }))
    }

    await journeysService.createJourney(data)
    showSuccess('Journey created successfully')
    closeCreateModal()
    loadJourneys()
  } catch (err) {
    showError(err.message || 'Failed to create journey')
  } finally {
    creatingJourney.value = false
  }
}

const viewJourneyDetails = async (journey) => {
  selectedJourney.value = journey
  showDetailsDrawer.value = true
  await loadExecutions(journey.id)
}

const closeDetailsDrawer = () => {
  showDetailsDrawer.value = false
  selectedJourney.value = null
  executions.value = []
}

const runTest = async () => {
  if (!testContactId.value || !selectedJourney.value) return
  
  runningTest.value = true
  
  try {
    await journeysService.runJourneyOnContact(selectedJourney.value.id, testContactId.value)
    showSuccess('Test journey started successfully')
    testContactId.value = ''
    await loadExecutions(selectedJourney.value.id)
  } catch (err) {
    showError(err.message || 'Failed to run test journey')
  } finally {
    runningTest.value = false
  }
}

const deleteJourney = (journey) => {
  journeyToDelete.value = journey
  showConfirmModal.value = true
}

const confirmDelete = async () => {
  if (!journeyToDelete.value) return
  
  try {
    await journeysService.deleteJourney(journeyToDelete.value.id)
    showSuccess('Journey deleted successfully')
    closeConfirmModal()
    loadJourneys()
  } catch (err) {
    showError(err.message || 'Failed to delete journey')
  }
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  journeyToDelete.value = null
}

// Helper methods
const getStatusColor = (status) => journeysHelpers.getStatusColor(status)
const getExecutionStatusColor = (status) => journeysHelpers.getExecutionStatusColor(status)
const getStepTypeIcon = (type) => journeysHelpers.getStepTypeIcon(type)
const getProgressColor = (percentage) => journeysHelpers.getProgressColor(percentage)
const formatDate = (dateString) => journeysHelpers.formatDate(dateString)
const formatDateTime = (dateString) => journeysHelpers.formatDateTime(dateString)
const formatNumber = (num) => journeysHelpers.formatNumber(num)

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadJourneys(),
    loadStepTypes()
  ])
})
</script>
