<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ sequence?.name }}</h1>
          <p class="text-gray-600">{{ sequence?.description || 'No description provided' }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <BaseButton
            variant="outline"
            @click="editSequence"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit Sequence
          </BaseButton>
          <BaseButton
            variant="primary"
            @click="enrollTarget"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Enroll Target
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Sequence Info Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Target Type</p>
            <p class="text-2xl font-semibold text-gray-900 capitalize">{{ sequence?.target_type }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Steps</p>
            <p class="text-2xl font-semibold text-gray-900">{{ sequence?.steps?.length || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Enrollments</p>
            <p class="text-2xl font-semibold text-gray-900">{{ enrollments?.length || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <span :class="getStatusBadgeClass(sequence?.is_active)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              {{ sequence?.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Status</p>
            <p class="text-lg font-semibold" :class="sequence?.is_active ? 'text-green-600' : 'text-gray-600'">
              {{ sequence?.is_active ? 'Active' : 'Inactive' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 px-6">
          <button
            @click="activeTab = 'steps'"
            :class="activeTab === 'steps' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Steps
          </button>
          <button
            @click="activeTab = 'enrollments'"
            :class="activeTab === 'enrollments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Enrollments
          </button>
          <button
            @click="activeTab = 'logs'"
            :class="activeTab === 'logs' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Execution Logs
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Steps Tab -->
        <div v-if="activeTab === 'steps'">
          <div v-if="sequence?.steps && sequence.steps.length > 0" class="space-y-4">
            <div
              v-for="(step, index) in sequence.steps"
              :key="step.id || index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <span class="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {{ index + 1 }}
                  </span>
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">{{ getStepTypeLabel(step.action_type) }}</h4>
                    <p class="text-sm text-gray-500">Delay: {{ formatDelayDisplay(step.delay_hours) }}</p>
                  </div>
                </div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ step.action_type }}
                </span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div v-if="step.action_type === 'email'">
                  <span class="text-gray-500">Email Template:</span>
                  <span class="ml-2 font-medium">{{ getTemplateName(step.email_template_id) }}</span>
                </div>
                <div v-if="step.action_type === 'task'">
                  <span class="text-gray-500">Task Title:</span>
                  <span class="ml-2 font-medium">{{ step.task_title || 'N/A' }}</span>
                </div>
                <div v-if="step.action_type === 'wait'">
                  <span class="text-gray-500">Wait Duration:</span>
                  <span class="ml-2 font-medium">{{ formatDelayDisplay(step.delay_hours) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No steps configured</h3>
            <p class="mt-1 text-sm text-gray-500">This sequence doesn't have any steps yet.</p>
          </div>
        </div>

        <!-- Enrollments Tab -->
        <div v-if="activeTab === 'enrollments'">
          <!-- Header with Refresh Button -->
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Enrollments</h3>
              <p class="text-sm text-gray-500">Manage target enrollments in this sequence</p>
            </div>
            <div class="flex items-center space-x-3">
              <BaseButton
                variant="outline"
                size="sm"
                @click="loadSequence"
                :loading="loading"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </BaseButton>
              <BaseButton
                variant="primary"
                size="sm"
                @click="enrollTarget"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Enroll Target
              </BaseButton>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="animate-pulse">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="space-y-4">
                <div v-for="i in 3" :key="i" class="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          
          <!-- Enrollments Table -->
          <div v-else-if="enrollments && enrollments.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      Target
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Status
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                      </svg>
                      Progress
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      Started
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Completed
                    </div>
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center justify-end">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      </svg>
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="enrollment in enrollments" :key="enrollment.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8">
                        <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ getTargetDisplayName(enrollment) }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ enrollment.target_type }} #{{ enrollment.target_id }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getEnrollmentStatusBadgeClass(enrollment.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ enrollment.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Step {{ enrollment.current_step || 1 }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(enrollment.started_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(enrollment.ended_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-1">
                      <button
                        v-if="enrollment.status === 'active'"
                        @click="pauseEnrollment(enrollment)"
                        class="inline-flex items-center px-2 py-1 border border-yellow-300 rounded-md text-xs font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        title="Pause enrollment"
                      >
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Pause
                      </button>
                      <button
                        v-if="enrollment.status === 'paused'"
                        @click="resumeEnrollment(enrollment)"
                        class="inline-flex items-center px-2 py-1 border border-green-300 rounded-md text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                        title="Resume enrollment"
                      >
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z"></path>
                        </svg>
                        Resume
                      </button>
                      <button
                        @click="cancelEnrollment(enrollment)"
                        class="inline-flex items-center px-2 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Cancel enrollment"
                      >
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-12">
            <div class="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">No enrollments yet</h3>
            <p class="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
              This sequence doesn't have any targets enrolled yet. Click the "Enroll Target" button to add contacts, deals, or companies to this sequence.
            </p>
            <div class="mt-6">
              <BaseButton
                variant="primary"
                @click="enrollTarget"
                class="inline-flex items-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Enroll Target
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Logs Tab -->
        <div v-if="activeTab === 'logs'">
          <div v-if="logs && logs.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Step</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDateTime(log.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ log.step_name || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ log.action || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getLogStatusBadgeClass(log.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ log.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ log.notes || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No execution logs</h3>
            <p class="mt-1 text-sm text-gray-500">No logs have been generated for this sequence yet.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Enroll Modal -->
    <EnrollModal
      v-if="showEnrollModal"
      :sequence="sequence"
      @save="handleEnrollTarget"
      @close="showEnrollModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSequencesStore } from '@/stores/sequencesStore'
import { campaignsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import EnrollModal from './components/EnrollModal.vue'

const router = useRouter()
const route = useRoute()
const sequencesStore = useSequencesStore()

// Reactive data
const activeTab = ref('steps')
const showEnrollModal = ref(false)
const templatesCache = ref([])

// Computed
const sequence = computed(() => sequencesStore.selectedSequence)
const enrollments = computed(() => sequencesStore.enrollments)
const logs = computed(() => sequencesStore.logs)
const loading = computed(() => sequencesStore.loading)

// Methods
const loadSequence = async () => {
  if (!route.params.id) {
    console.error('No sequence ID provided')
    router.push('/sales/sequences')
    return
  }
  
  try {
    await sequencesStore.getSequence(route.params.id)
    // Only fetch logs if sequence was loaded successfully
    if (sequencesStore.selectedSequence) {
      try {
        await sequencesStore.fetchLogs(route.params.id)
      } catch (logError) {
        console.error('Error fetching logs:', logError)
        // Don't redirect on log errors, just show empty logs
      }
    }
  } catch (error) {
    console.error('Error loading sequence:', error)
    // Only redirect if it's a 404 or sequence doesn't exist
    if (error.response?.status === 404) {
      router.push('/sales/sequences')
    }
  }
}

const editSequence = () => {
  router.push(`/sales/sequences/${route.params.id}/edit`)
}

const enrollTarget = () => {
  showEnrollModal.value = true
}

const handleEnrollTarget = async (enrollmentData) => {
  try {
    await sequencesStore.enrollTarget(route.params.id, enrollmentData)
    showEnrollModal.value = false
    // Refresh enrollments
    await loadSequence()
  } catch (error) {
    console.error('Error enrolling target:', error)
  }
}

const pauseEnrollment = async (enrollment) => {
  try {
    await sequencesStore.pauseEnrollment(enrollment.id)
    await loadSequence()
  } catch (error) {
    console.error('Error pausing enrollment:', error)
  }
}

const resumeEnrollment = async (enrollment) => {
  try {
    await sequencesStore.resumeEnrollment(enrollment.id)
    await loadSequence()
  } catch (error) {
    console.error('Error resuming enrollment:', error)
  }
}

const cancelEnrollment = async (enrollment) => {
  try {
    await sequencesStore.cancelEnrollment(enrollment.id)
    await loadSequence()
  } catch (error) {
    console.error('Error cancelling enrollment:', error)
  }
}

const getStepTypeLabel = (actionType) => {
  const labels = {
    email: 'Email',
    task: 'Task',
    wait: 'Wait'
  }
  return labels[actionType] || actionType
}

const getStatusBadgeClass = (isActive) => {
  return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
}

const getTargetDisplayName = (enrollment) => {
  // If target_name is available, use it
  if (enrollment.target_name) {
    return enrollment.target_name
  }
  
  // Otherwise, create a display name based on target type and ID
  const typeLabels = {
    contact: 'Contact',
    deal: 'Deal',
    company: 'Company'
  }
  
  const typeLabel = typeLabels[enrollment.target_type] || enrollment.target_type
  return `${typeLabel} #${enrollment.target_id}`
}

const getEnrollmentStatusBadgeClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getLogStatusBadgeClass = (status) => {
  const classes = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    skipped: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}

const formatDelayDisplay = (delayHours) => {
  if (!delayHours || delayHours === 0) return '0 hours'
  
  const days = Math.floor(delayHours / 24)
  const hours = Math.floor(delayHours % 24)
  const minutes = Math.round((delayHours % 1) * 60)
  
  let result = []
  if (days > 0) result.push(`${days} day${days > 1 ? 's' : ''}`)
  if (hours > 0) result.push(`${hours} hour${hours > 1 ? 's' : ''}`)
  if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
  
  return result.join(', ') || '0 hours'
}

const getTemplateName = (templateId) => {
  if (!templateId) return 'N/A'
  
  const template = templatesCache.value.find(t => t.id === templateId)
  return template?.name || `Template #${templateId}`
}

const loadTemplates = async () => {
  if (templatesCache.value.length > 0) return // Already loaded
  
  try {
    const response = await campaignsAPI.getTemplates()
    templatesCache.value = response.data.data || response.data || []
  } catch (error) {
    console.error('Error loading templates:', error)
    templatesCache.value = []
  }
}

// Watch for tab changes to load appropriate data
watch(activeTab, async (newTab) => {
  if (newTab === 'logs' && logs.value.length === 0 && route.params.id) {
    try {
      await sequencesStore.fetchLogs(route.params.id)
    } catch (error) {
      console.error('Error fetching logs in tab:', error)
      // Don't redirect, just show empty logs
    }
  }
})

// Lifecycle
onMounted(async () => {
  // Load templates first
  await loadTemplates()
  
  loadSequence()
})
</script>
