<template>
  <div class="space-y-16">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading onboarding details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-red-800">Error loading onboarding details</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
        </div>
        <button
          @click="reloadOnboardingData"
          class="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="onboardingData">
      <!-- Header Card -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 mb-12">
        <div class="flex items-start space-x-5">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div v-if="employee.profile_picture" class="h-20 w-20 rounded-full overflow-hidden ring-2 ring-gray-100">
              <img
                :src="employee.profile_picture.url"
                :alt="employeeFullName"
                class="h-full w-full object-cover"
              />
            </div>
            <div v-else class="h-20 w-20 rounded-full bg-gradient-to-br from-primary-purple to-primary-pink flex items-center justify-center ring-2 ring-gray-100 shadow-md">
              <span class="text-white font-semibold text-2xl">
                {{ employee.first_name?.[0] }}{{ employee.last_name?.[0] }}
              </span>
            </div>
          </div>
          
          <!-- Employee Info -->
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-1">
              <h1 class="text-2xl font-bold text-gray-900">{{ employeeFullName }}</h1>
              <StatusBadge :status="employee.employment_status || 'onboarding'" />
            </div>
            <p class="text-sm text-gray-500 mb-3 font-medium">{{ employee.employee_id }}</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</p>
                <p class="mt-0.5 text-sm font-semibold text-gray-900">{{ departmentName }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Designation</p>
                <p class="mt-0.5 text-sm font-semibold text-gray-900">{{ designationName }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Manager</p>
                <p class="mt-0.5 text-sm font-semibold text-gray-900">{{ employee.manager?.full_name || 'N/A' }}</p>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="mt-3">
              <ProgressBar
                :percentage="progressPercentage"
                :subtitle="progressSubtitle"
                :color="progressColor"
                :show-label="true"
                label="Onboarding Progress"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Checklist Section -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 mb-12">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Onboarding Checklist</h2>
            <p class="mt-0.5 text-sm text-gray-600">Complete all checklist items to finish onboarding</p>
          </div>
        </div>
        
        <div v-if="checklistLoading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-gray-50 rounded-lg p-4 animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        
        <div v-else-if="checklist.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="mt-4 text-sm font-medium text-gray-900">No checklist items</h3>
          <p class="mt-2 text-sm text-gray-500">There are no checklist items for this employee.</p>
        </div>
        
        <div v-else class="space-y-4">
          <ChecklistItem
            v-for="item in checklist"
            :key="item?.id || `checklist-${item?.name || 'unknown'}`"
            :item="item"
            :documents="getDocumentsForItem(item)"
            :can-upload-documents="isEmployee && (item?.status === 'pending' || hasRejectedDocuments(item))"
            :can-verify-documents="isHrAdmin"
            :can-delete-document="isHrAdmin"
            @mark-complete="openCompleteModal(item)"
            @upload-documents="openUploadModal(item)"
            @verify-documents="openVerifyModal(item)"
            @view-document="viewDocument"
            @download-document="downloadDocument"
            @delete-document="deleteDocument"
            @verify-document="verifyDocument"
            @reject-document="openRejectModal"
            @re-upload-document="handleReUpload"
          />
        </div>
      </div>

      <!-- Induction & Training Section -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 mb-12">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Induction & Training Progress</h2>
            <p class="mt-0.5 text-sm text-gray-600">Complete mandatory induction and training content</p>
          </div>
          <router-link
            :to="`/hr/induction/employees/${employee.id}/progress`"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors"
          >
            View All
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
        
        <div v-if="inductionLoading" class="space-y-4">
          <div v-for="i in 2" :key="i" class="bg-gray-50 rounded-lg p-4 animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        
        <div v-else-if="inductionProgress">
          <!-- Progress Overview -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Overall Progress</span>
              <span class="text-sm font-bold text-primary-purple">{{ inductionProgress.progress?.percentage || 0 }}%</span>
            </div>
            <ProgressBar
              :percentage="inductionProgress.progress?.percentage || 0"
              :subtitle="`${inductionProgress.progress?.completed || 0} of ${inductionProgress.progress?.total || 0} items completed`"
              :color="getInductionProgressColor(inductionProgress.progress?.percentage || 0)"
            />
            <div v-if="inductionProgress.progress?.mandatory" class="mt-3 pt-3 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-2" :class="inductionProgress.progress.mandatory.all_completed ? 'text-green-600' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span class="text-sm font-medium" :class="inductionProgress.progress.mandatory.all_completed ? 'text-green-700' : 'text-red-700'">
                    Mandatory: {{ inductionProgress.progress.mandatory.completed }} of {{ inductionProgress.progress.mandatory.total }} completed
                  </span>
                </div>
                <span v-if="!inductionProgress.progress.mandatory.all_completed" class="text-xs text-red-600 font-medium">
                  Must complete all mandatory items
                </span>
              </div>
            </div>
          </div>

          <!-- Induction Items List -->
          <div v-if="inductionProgress.items && inductionProgress.items.length > 0" class="space-y-3">
            <div
              v-for="item in inductionProgress.items.slice(0, 5)"
              :key="item.assignment_id || item.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center space-x-3 flex-1">
                <div :class="getStatusIconClass(item.status)" class="flex-shrink-0">
                  <component :is="getStatusIcon(item.status)" class="w-5 h-5" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.content_title || item.title }}</h4>
                    <span v-if="item.is_mandatory" class="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Mandatory
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    <span :class="getCategoryBadgeClass(item.category)" class="px-2 py-0.5 rounded-full">
                      {{ getCategoryLabel(item.category) }}
                    </span>
                    <span v-if="item.due_date" class="ml-2" :class="isOverdue(item.due_date, item.status) ? 'text-red-600 font-medium' : 'text-gray-500'">
                      Due: {{ formatDate(item.due_date) }}
                    </span>
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-2 ml-4">
                <StatusBadge :status="item.status" />
                <router-link
                  :to="`/hr/induction/employees/${employee.id}/progress`"
                  class="text-primary-purple hover:text-primary-pink text-sm font-medium transition-colors"
                >
                  View
                </router-link>
              </div>
            </div>
            <div v-if="inductionProgress.items.length > 5" class="text-center pt-2">
              <router-link
                :to="`/hr/induction/employees/${employee.id}/progress`"
                class="text-sm text-primary-purple hover:text-primary-pink font-medium"
              >
                View all {{ inductionProgress.items.length }} items →
              </router-link>
            </div>
          </div>
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-4 text-sm font-medium text-gray-900">No induction items</h3>
              <p class="mt-2 text-sm text-gray-500">No induction or training content has been assigned yet.</p>
            </div>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-sm text-gray-500">Unable to load induction progress.</p>
        </div>
      </div>

      <!-- Tasks Section -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 mb-12">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Onboarding Tasks</h2>
            <p class="mt-0.5 text-sm text-gray-600">Track and complete onboarding tasks</p>
          </div>
          <button
            @click="showAddTaskModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>
        
        <div v-if="tasksLoading && tasks.length === 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="i in 4" :key="i" class="bg-gray-50 rounded-lg p-4 animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        
        <div v-else-if="!tasksLoading && tasks.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="mt-4 text-sm font-medium text-gray-900">No tasks</h3>
          <p class="mt-2 text-sm text-gray-500">There are no tasks assigned for this employee.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TaskCard
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @start-task="startTask(task.id)"
            @complete-task="completeTask(task.id)"
          />
        </div>
      </div>

      <!-- Bottom Actions -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center justify-between">
          <button
            @click="$router.push('/hr/onboarding')"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to List
          </button>
          
          <div class="flex items-center space-x-3">
            <button
              v-if="onboardingData.can_complete"
              @click="confirmCompleteOnboarding"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Complete Onboarding
            </button>
            <button
              v-else
              disabled
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Complete Onboarding
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Complete Checklist Item Modal -->
    <div v-if="showCompleteModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeCompleteModal">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeCompleteModal"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Complete Checklist Item</h3>
            
            <form @submit.prevent="submitCompleteItem">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    v-model="completeItemForm.notes"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add any notes about completing this item..."
                  ></textarea>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Upload Document (Optional)</label>
                  <input
                    type="file"
                    @change="handleFileChange"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div class="mt-6 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  @click="closeCompleteModal"
                  class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="completingItem"
                  class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ completingItem ? 'Submitting...' : 'Mark Complete' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Document Upload Modal -->
    <DocumentUploadModal
      :show="showUploadModal"
      :checklist-item="selectedChecklistItem"
      :required-documents="getRequiredDocuments(selectedChecklistItem)"
      @close="closeUploadModal"
      @upload="handleDocumentUpload"
    />

    <!-- Document Preview Modal -->
    <DocumentPreviewModal
      :show="showPreviewModal"
      :document="previewDocument"
      @close="closePreviewModal"
      @download="handlePreviewDownload"
    />

    <!-- Document Verification Modal -->
    <div v-if="showVerifyModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeVerifyModal">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeVerifyModal"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Verify Documents</h3>
            
            <div v-if="selectedChecklistItem" class="space-y-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p class="text-sm font-medium text-blue-900">{{ selectedChecklistItem.name }}</p>
              </div>
              
              <div v-if="getDocumentsForItem(selectedChecklistItem).length > 0">
                <p class="text-sm font-medium text-gray-700 mb-2">Review Documents:</p>
                <div class="space-y-2 max-h-60 overflow-y-auto">
                  <div
                    v-for="doc in getDocumentsForItem(selectedChecklistItem)"
                    :key="doc?.id || doc?.document_id || `doc-${doc?.title || 'unknown'}`"
                    class="flex items-center justify-between bg-gray-50 rounded-lg p-2"
                  >
                    <div class="flex items-center space-x-2 flex-1">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span class="text-sm text-gray-700">{{ doc.name || doc.file_name || 'Document' }}</span>
                    </div>
                    <button
                      @click="viewDocument(doc)"
                      class="text-blue-600 hover:text-blue-700 text-xs font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Verification Notes</label>
                <textarea
                  v-model="verifyForm.notes"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add verification notes..."
                ></textarea>
              </div>
            </div>
            
            <div class="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                @click="closeVerifyModal"
                class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                @click="submitVerification"
                :disabled="verifying"
                class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ verifying ? 'Verifying...' : 'Verify & Complete' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Document Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeRejectModal">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeRejectModal"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Reject Document</h3>
            
            <div v-if="selectedDocument" class="space-y-4">
              <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p class="text-sm font-medium text-red-900">Document: {{ selectedDocument.name || selectedDocument.title || selectedDocument.file_name || 'Document' }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="rejectForm.rejection_reason"
                  rows="4"
                  maxlength="1000"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Please provide a reason for rejecting this document..."
                ></textarea>
                <p class="mt-1 text-xs text-gray-500">{{ rejectForm.rejection_reason.length }}/1000 characters</p>
              </div>
            </div>
            
            <div class="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                @click="closeRejectModal"
                class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                @click="submitRejection"
                :disabled="rejecting || !rejectForm.rejection_reason.trim()"
                class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ rejecting ? 'Rejecting...' : 'Reject Document' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Task Modal -->
    <div v-if="showAddTaskModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeAddTaskModal">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeAddTaskModal"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Add New Task</h3>
            
            <form @submit.prevent="submitAddTask">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                  <input
                    v-model="addTaskForm.title"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Setup Email Account"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    v-model="addTaskForm.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the task..."
                  ></textarea>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Task Type *</label>
                    <select
                      v-model="addTaskForm.task_type"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="hr_task">HR Task</option>
                      <option value="it_task">IT Task</option>
                      <option value="finance_task">Finance Task</option>
                      <option value="manager_task">Manager Task</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                    <select
                      v-model="addTaskForm.priority"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      v-model="addTaskForm.due_date"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Assign To (Optional)</label>
                    <input
                      v-model="addTaskForm.assigned_to"
                      type="number"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="User ID"
                    />
                  </div>
                </div>
              </div>
              
              <div class="mt-6 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  @click="closeAddTaskModal"
                  class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="addingTask"
                  class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ addingTask ? 'Adding...' : 'Add Task' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Complete Onboarding Confirmation Modal -->
    <div v-if="showCompleteOnboardingModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeCompleteOnboardingModal">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeCompleteOnboardingModal"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg font-medium text-gray-900">Complete Onboarding</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to complete the onboarding for {{ employeeFullName }}? This will mark the employee as active.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="submitCompleteOnboarding"
              :disabled="completingOnboarding"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ completingOnboarding ? 'Completing...' : 'Yes, Complete Onboarding' }}
            </button>
            <button
              @click="closeCompleteOnboardingModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHrOnboardingStore } from '../store/hrOnboarding'
import { useHrDocumentsStore } from '../store/hrDocuments'
import { useHrInductionStore } from '../store/hrInduction'
import { useAuth } from '@/composables/useAuth'
import { hrAPI } from '../api/hrAPI'
import StatusBadge from '../components/StatusBadge.vue'
import ProgressBar from '../components/ProgressBar.vue'
import ChecklistItem from '../components/ChecklistItem.vue'
import TaskCard from '../components/TaskCard.vue'
import DocumentUploadModal from '../components/DocumentUploadModal.vue'
import DocumentPreviewModal from '../components/DocumentPreviewModal.vue'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const route = useRoute()
const router = useRouter()
const onboardingStore = useHrOnboardingStore()
const documentsStore = useHrDocumentsStore()
const inductionStore = useHrInductionStore()
const { user } = useAuth()

// Local state
const loading = ref(true)
const error = ref(null)
const checklistLoading = ref(false)
const tasksLoading = ref(false)
const inductionLoading = ref(false)
const inductionProgress = ref(null)
const showCompleteModal = ref(false)
const showUploadModal = ref(false)
const showVerifyModal = ref(false)
const showRejectModal = ref(false)
const showCompleteOnboardingModal = ref(false)
const showAddTaskModal = ref(false)
const showPreviewModal = ref(false)
const selectedChecklistItem = ref(null)
const selectedDocument = ref(null)
const previewDocument = ref(null)
const completingItem = ref(false)
const verifying = ref(false)
const rejecting = ref(false)
const uploadingDocuments = ref(false)
const completingOnboarding = ref(false)
const allDocuments = ref([])

const completeItemForm = ref({
  notes: '',
  document: null
})

const verifyForm = ref({
  notes: ''
})

const rejectForm = ref({
  rejection_reason: ''
})

const addTaskForm = ref({
  title: '',
  description: '',
  task_type: 'hr_task',
  priority: 'medium',
  due_date: '',
  assigned_to: null
})

const addingTask = ref(false)

// Computed
const employeeId = computed(() => parseInt(route.params.id))
const onboardingData = computed(() => onboardingStore.selectedEmployeeOnboarding)
const employee = computed(() => onboardingData.value?.employee || {})
const checklist = computed(() => onboardingStore.checklist)
const tasks = computed(() => onboardingStore.tasks)

const progressPercentage = computed(() => {
  if (!onboardingData.value?.progress) return 0
  const { completed_items, total_items } = onboardingData.value.progress
  return total_items > 0 ? Math.round((completed_items / total_items) * 100) : 0
})

const progressSubtitle = computed(() => {
  if (!onboardingData.value?.progress) return ''
  const { completed_items, total_items } = onboardingData.value.progress
  return `${completed_items} of ${total_items} items completed`
})

const progressColor = computed(() => {
  const percentage = progressPercentage.value
  if (percentage >= 80) return 'green'
  if (percentage >= 50) return 'blue'
  if (percentage >= 25) return 'yellow'
  return 'red'
})

// Role detection
const isHrAdmin = computed(() => {
  if (!user.value?.roles) return false
  const roles = Array.isArray(user.value.roles) ? user.value.roles : [user.value.roles]
  return roles.some(r => {
    const roleName = typeof r === 'object' ? r.name : r
    return roleName === 'hr_admin' || roleName === 'system_admin'
  })
})

const isEmployee = computed(() => {
  if (!user.value?.roles) return true
  const roles = Array.isArray(user.value.roles) ? user.value.roles : [user.value.roles]
  return roles.some(r => {
    const roleName = typeof r === 'object' ? r.name : r
    return roleName === 'employee'
  }) || (!isHrAdmin.value && user.value.id === employee.value.user_id)
})

// Employee name helpers
const employeeFullName = computed(() => {
  if (employee.value.full_name) return employee.value.full_name
  if (employee.value.first_name || employee.value.last_name) {
    return `${employee.value.first_name || ''} ${employee.value.last_name || ''}`.trim()
  }
  return 'N/A'
})

const departmentName = computed(() => {
  if (employee.value.department_detail?.name) return employee.value.department_detail.name
  if (employee.value.department?.name) return employee.value.department.name
  if (typeof employee.value.department === 'string') return employee.value.department
  return 'N/A'
})

const designationName = computed(() => {
  if (employee.value.designation_detail?.name) return employee.value.designation_detail.name
  if (employee.value.designation?.name) return employee.value.designation.name
  if (typeof employee.value.designation === 'string') return employee.value.designation
  if (employee.value.job_title) return employee.value.job_title
  return 'N/A'
})

// Document helpers
const getDocumentsForItem = (item) => {
  const documentsMap = new Map()
  
  // Primary source: item.documents from checklist API (already filtered correctly by backend)
  // The backend filters documents per checklist using metadata['document_ids']
  // and returns them in item.documents array with only the relevant documents
  if (item.documents && Array.isArray(item.documents) && item.documents.length > 0) {
    item.documents.forEach(doc => {
      const docId = doc.document_id || doc.id
      if (docId) {
        documentsMap.set(docId, doc)
      }
    })
  }
  
  // Optional fallback: metadata.document_ids (only if item.documents is empty)
  // This handles edge cases where backend might not include documents in the response
  // but we have the document_ids in metadata
  if (documentsMap.size === 0 && item.metadata?.document_ids && Array.isArray(item.metadata.document_ids)) {
    allDocuments.value.forEach(doc => {
      const docId = doc.document_id || doc.id
      const docIdAlt = doc.id
      
      // Check if this document is linked to this checklist item
      if (item.metadata.document_ids.includes(docId) || 
          item.metadata.document_ids.includes(docIdAlt) ||
          item.metadata.document_ids.includes(doc.document_id)) {
        // Only add if not already in map (avoid duplicates)
        if (docId && !documentsMap.has(docId)) {
          documentsMap.set(docId, doc)
        }
      }
    })
  }
  
  // REMOVED: The problematic step that was adding ALL onboarding documents
  // This was causing documents to show in wrong checklist items
  // The backend already filters documents correctly per checklist in item.documents
  // We should trust the backend data instead of adding all documents as a fallback
  
  // Convert map to array and return
  return Array.from(documentsMap.values())
}

const getRequiredDocuments = (item) => {
  if (!item || !item.metadata?.required_documents) return []
  return Array.isArray(item.metadata.required_documents) 
    ? item.metadata.required_documents 
    : []
}

// Helper functions for induction section
const getCategoryLabel = (category) => {
  const labels = {
    induction: 'Induction',
    policy: 'Policy',
    training: 'Training'
  }
  return labels[category] || category
}

const getCategoryBadgeClass = (category) => {
  const classes = {
    induction: 'bg-blue-100 text-blue-800',
    policy: 'bg-purple-100 text-purple-800',
    training: 'bg-green-100 text-green-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

const getInductionProgressColor = (percentage) => {
  if (percentage >= 80) return 'green'
  if (percentage >= 50) return 'blue'
  if (percentage >= 25) return 'yellow'
  return 'red'
}

const getStatusIconClass = (status) => {
  const classes = {
    completed: 'text-green-600',
    pending: 'text-yellow-600',
    in_progress: 'text-blue-600',
    overdue: 'text-red-600'
  }
  return classes[status] || 'text-gray-400'
}

const getStatusIcon = (status) => {
  if (status === 'completed') {
    return () => h('svg', { class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z', 'clip-rule': 'evenodd' })
    ])
  }
  return () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const isOverdue = (dueDate, status) => {
  if (status === 'completed') return false
  if (!dueDate) return false
  const due = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  return due < today
}

// Methods
const loadInductionProgress = async () => {
  if (!employeeId.value) return
  inductionLoading.value = true
  try {
    inductionProgress.value = await inductionStore.fetchEmployeeProgress(employeeId.value)
  } catch (err) {
    console.error('Error loading induction progress:', err)
    // Don't show error, just log it - induction is optional
  } finally {
    inductionLoading.value = false
  }
}

const loadOnboardingData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Fetch onboarding data (includes checklists and tasks in response)
    const onboardingData = await onboardingStore.fetchEmployeeOnboarding(employeeId.value)
    
    // NOTE: We do NOT call loadChecklist() here anymore because:
    // 1. fetchEmployeeOnboarding() already sets the checklist from onboarding API
    // 2. We want the caller to control when to refresh checklist (usually after this)
    // 3. This prevents race conditions and ensures checklist is loaded with latest data
    // The checklist should be loaded separately after this function completes
    await Promise.all([
      loadTasks(),
      loadDocuments()
    ])
  } catch (err) {
    error.value = err.message || 'Failed to load onboarding data'
  } finally {
    loading.value = false
  }
}

// Helper function to reload all onboarding data including checklist
const reloadOnboardingData = async () => {
  await loadOnboardingData()
  await loadChecklist()
}

const loadDocuments = async () => {
  try {
    await documentsStore.fetchDocuments(employeeId.value, { per_page: 100 })
    allDocuments.value = documentsStore.documents
  } catch (err) {
    console.error('Error loading documents:', err)
    allDocuments.value = []
  }
}

const loadChecklist = async () => {
  checklistLoading.value = true
  try {
    await onboardingStore.fetchEmployeeOnboardingChecklist(employeeId.value)
  } catch (err) {
    showError(err.message || 'Failed to load checklist')
  } finally {
    checklistLoading.value = false
  }
}

const loadTasks = async () => {
  tasksLoading.value = true
  try {
    await onboardingStore.fetchEmployeeOnboardingTasks(employeeId.value)
  } catch (err) {
    // Don't show error if tasks are already loaded from onboarding response
    // The onboarding API response includes tasks, so we can use those
    if (onboardingStore.tasks.length === 0) {
      console.warn('Tasks API endpoint may not exist, using tasks from onboarding response:', err.message)
    }
  } finally {
    tasksLoading.value = false
  }
}

const openCompleteModal = (item) => {
  selectedChecklistItem.value = item
  completeItemForm.value = { notes: '', document: null }
  showCompleteModal.value = true
}

const closeCompleteModal = () => {
  showCompleteModal.value = false
  selectedChecklistItem.value = null
  completeItemForm.value = { notes: '', document: null }
}

const openUploadModal = (item) => {
  selectedChecklistItem.value = item
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedChecklistItem.value = null
}

const openVerifyModal = (item) => {
  selectedChecklistItem.value = item
  verifyForm.value = { notes: '' }
  showVerifyModal.value = true
}

const closeVerifyModal = () => {
  showVerifyModal.value = false
  selectedChecklistItem.value = null
  verifyForm.value = { notes: '' }
}

const openRejectModal = (doc) => {
  selectedDocument.value = doc
  rejectForm.value = { rejection_reason: '' }
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  selectedDocument.value = null
  rejectForm.value = { rejection_reason: '' }
}

const closeAddTaskModal = () => {
  showAddTaskModal.value = false
  addTaskForm.value = {
    title: '',
    description: '',
    task_type: 'hr_task',
    priority: 'medium',
    due_date: '',
    assigned_to: null
  }
}

const submitAddTask = async () => {
  addingTask.value = true
  try {
    // Note: Backend might need a create task endpoint
    // For now, we'll use a workaround or check if endpoint exists
    // If backend doesn't have create endpoint, we'll show an error
    const taskData = {
      title: addTaskForm.value.title,
      description: addTaskForm.value.description,
      task_type: addTaskForm.value.task_type,
      priority: addTaskForm.value.priority,
      due_date: addTaskForm.value.due_date || null,
      assigned_to: addTaskForm.value.assigned_to || null,
      status: 'pending'
    }
    
    // Try to create task - if endpoint doesn't exist, show helpful message
    // For now, we'll show a message that this feature requires backend support
    showError('Task creation endpoint not yet implemented. Please contact backend team to add POST /api/hr/employees/{id}/onboarding/tasks endpoint.')
    closeAddTaskModal()
    
    // Uncomment when backend endpoint is ready:
    // const response = await hrAPI.createOnboardingTask(employeeId.value, taskData)
    // showSuccess('Task created successfully')
    // await loadTasks()
  } catch (err) {
    showError(err.message || 'Failed to create task')
  } finally {
    addingTask.value = false
  }
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    completeItemForm.value.document = file
  }
}

const handleDocumentUpload = async ({ files, notes }) => {
  if (!selectedChecklistItem.value || !files || files.length === 0) return
  
  // Store checklist item ID before any async operations
  const checklistItemId = selectedChecklistItem.value?.id
  if (!checklistItemId) {
    showError('Invalid checklist item. Please refresh the page and try again.')
    return
  }
  
  uploadingDocuments.value = true
  try {
    // Upload all documents
    const uploadedDocumentIds = []
    for (const file of files) {
      try {
        const doc = await documentsStore.uploadDocument(employeeId.value, {
          category: 'onboarding',
          file: file,
          is_hr_only: false,
          checklist_id: checklistItemId  // Pass checklist_id so backend can link document to correct checklist item
        })
        
        // Validate document response
        if (!doc) {
          throw new Error('Document upload failed: No document data returned')
        }
        
        // Use document_id (42) instead of id (8) for proper matching
        // The backend uses document_id to link documents to checklist items
        const docId = doc.document_id || doc.id
        if (!docId) {
          console.error('Document response:', doc)
          throw new Error('Document upload failed: Missing document ID')
        }
        uploadedDocumentIds.push(docId)
      } catch (err) {
        console.error('Error uploading document:', err)
        throw err
      }
    }
    
    // Validate we have document IDs
    if (uploadedDocumentIds.length === 0) {
      throw new Error('No documents were uploaded successfully')
    }
    
    // DO NOT automatically complete the checklist item
    // Documents are uploaded with verification_status: "pending"
    // Checklist item should remain "pending" until HR verifies the documents
    // The backend will link documents to checklist item via metadata when needed
    // Documents will be visible in the checklist item's document list
    
    showSuccess('Documents uploaded successfully. Waiting for HR verification.')
    closeUploadModal()
    
    // Refresh all data to ensure new documents are visible
    // IMPORTANT: Load checklist LAST to ensure it's not overwritten by loadOnboardingData()
    // The loadOnboardingData() calls fetchEmployeeOnboarding() which overwrites the checklist
    // So we need to load checklist after loadOnboardingData() to preserve the latest documents
    await loadDocuments()
    // Small delay to ensure backend has processed the document
    await new Promise(resolve => setTimeout(resolve, 300))
    // Load onboarding data first (this may overwrite checklist, but we'll fix it next)
    await loadOnboardingData()
    // Then reload checklist LAST to ensure it has the latest documents from checklist API
    await loadChecklist()
  } catch (err) {
    console.error('Document upload error:', err)
    const errorMessage = err.response?.data?.message || err.message || 'Failed to upload documents'
    showError(errorMessage)
  } finally {
    uploadingDocuments.value = false
  }
}

const submitVerification = async () => {
  if (!selectedChecklistItem.value) return
  
  // Store checklist item ID before any async operations
  const checklistItemId = selectedChecklistItem.value?.id
  if (!checklistItemId) {
    showError('Invalid checklist item. Please refresh the page and try again.')
    return
  }
  
  verifying.value = true
  try {
    const requestData = {
      notes: verifyForm.value.notes || '',
      metadata: {
        verified: true,
        verified_by: user.value?.id,
        verified_at: new Date().toISOString()
      }
    }
    
    await onboardingStore.completeChecklistItem(
      employeeId.value,
      checklistItemId,
      requestData
    )
    
    showSuccess('Documents verified successfully')
    closeVerifyModal()
    // Load checklist LAST to ensure it's not overwritten by loadOnboardingData()
    await loadOnboardingData() // Refresh progress
    await loadChecklist()
  } catch (err) {
    showError(err.message || 'Failed to verify documents')
  } finally {
    verifying.value = false
  }
}

const submitCompleteItem = async () => {
  if (!selectedChecklistItem.value) return
  
  // Store checklist item ID before any async operations
  const checklistItemId = selectedChecklistItem.value?.id
  if (!checklistItemId) {
    showError('Invalid checklist item. Please refresh the page and try again.')
    return
  }
  
  completingItem.value = true
  try {
    const formData = new FormData()
    if (completeItemForm.value.notes) {
      formData.append('notes', completeItemForm.value.notes)
    }
    if (completeItemForm.value.document) {
      formData.append('document', completeItemForm.value.document)
    }
    
    await onboardingStore.completeChecklistItem(
      employeeId.value,
      checklistItemId,
      formData
    )
    
    showSuccess('Checklist item completed successfully')
    closeCompleteModal()
    // Load checklist LAST to ensure it's not overwritten by loadOnboardingData()
    await loadOnboardingData() // Refresh progress
    await loadChecklist()
  } catch (err) {
    showError(err.message || 'Failed to complete checklist item')
  } finally {
    completingItem.value = false
  }
}

const viewDocument = async (doc) => {
  try {
    if (!doc) {
      showError('Invalid document')
      return
    }
    
    // Use preview_url if available, otherwise construct it
    // Get API base URL from environment (same pattern as API service)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    
    if (doc.preview_url) {
      previewDocument.value = { ...doc, employee_id: employeeId.value }
      showPreviewModal.value = true
    } else {
      // Fallback: construct preview URL using environment-based base URL
      const docId = doc.document_id || doc.id
      if (!docId) {
        showError('Document ID not found')
        return
      }
      previewDocument.value = {
        ...doc,
        employee_id: employeeId.value,
        preview_url: `${apiBaseUrl}/hr/employees/${employeeId.value}/documents/${docId}/preview`
      }
      showPreviewModal.value = true
    }
  } catch (err) {
    showError(err.message || 'Failed to view document')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewDocument.value = null
}

const handlePreviewDownload = async (doc) => {
  try {
    const docId = doc.document_id || doc.id
    await documentsStore.downloadDocument(employeeId.value, docId)
    showSuccess('Document downloaded successfully')
  } catch (err) {
    showError(err.message || 'Failed to download document')
  }
}

const downloadDocument = async (doc) => {
  try {
    // Use document_id if available, otherwise use id
    const docId = doc.document_id || doc.id
    await documentsStore.downloadDocument(employeeId.value, docId)
    showSuccess('Document downloaded successfully')
  } catch (err) {
    showError(err.message || 'Failed to download document')
  }
}

const verifyDocument = async (doc) => {
  if (!doc) return
  
  try {
    const docId = doc.document_id || doc.id
    if (!docId) {
      showError('Invalid document ID')
      return
    }
    
    await hrAPI.verifyDocument(employeeId.value, docId)
    
    showSuccess('Document verified successfully')
    await loadDocuments()
    // Load checklist LAST to ensure it's not overwritten by loadOnboardingData()
    await loadOnboardingData()
    await loadChecklist()
  } catch (err) {
    showError(err.response?.data?.message || err.message || 'Failed to verify document')
  }
}

const submitRejection = async () => {
  if (!selectedDocument.value || !rejectForm.value.rejection_reason.trim()) return
  
  rejecting.value = true
  try {
    const docId = selectedDocument.value.document_id || selectedDocument.value.id
    if (!docId) {
      showError('Invalid document ID')
      return
    }
    
    await hrAPI.rejectDocument(employeeId.value, docId, {
      rejection_reason: rejectForm.value.rejection_reason.trim()
    })
    
    showSuccess('Document rejected successfully')
    closeRejectModal()
    await loadDocuments()
    // Load checklist LAST to ensure it's not overwritten by loadOnboardingData()
    await loadOnboardingData()
    await loadChecklist()
  } catch (err) {
    showError(err.response?.data?.message || err.message || 'Failed to reject document')
  } finally {
    rejecting.value = false
  }
}

// Check if a checklist item has rejected documents
const hasRejectedDocuments = (item) => {
  if (!item) return false
  const itemDocs = getDocumentsForItem(item)
  return itemDocs.some(doc => doc.verification_status === 'rejected')
}

const handleReUpload = (doc) => {
  if (!doc) {
    showError('Invalid document')
    return
  }
  
  // Find the checklist item this document belongs to
  const checklistItem = checklist.value.find(item => {
    const itemDocs = getDocumentsForItem(item)
    return itemDocs.some(d => (d.id || d.document_id) === (doc.id || doc.document_id))
  })
  
  if (checklistItem) {
    selectedChecklistItem.value = checklistItem
    showUploadModal.value = true
  } else {
    showError('Could not find the checklist item for this document')
  }
}

const deleteDocument = async (doc) => {
  if (!confirm('Are you sure you want to delete this document?')) return
  
  try {
    // Use document_id if available, otherwise use id
    const docId = doc.document_id || doc.id
    await documentsStore.deleteDocument(employeeId.value, docId)
    showSuccess('Document deleted successfully')
    await loadDocuments()
    await loadChecklist()
  } catch (err) {
    showError(err.message || 'Failed to delete document')
  }
}

const startTask = async (taskId) => {
  try {
    await onboardingStore.updateOnboardingTask(employeeId.value, taskId, {
      status: 'in_progress'
    })
    showSuccess('Task started successfully')
    await loadTasks()
  } catch (err) {
    showError(err.message || 'Failed to start task')
  }
}

const completeTask = async (taskId) => {
  try {
    await onboardingStore.updateOnboardingTask(employeeId.value, taskId, {
      status: 'completed'
    })
    showSuccess('Task completed successfully')
    await loadTasks()
  } catch (err) {
    showError(err.message || 'Failed to complete task')
  }
}

const confirmCompleteOnboarding = () => {
  showCompleteOnboardingModal.value = true
}

const closeCompleteOnboardingModal = () => {
  showCompleteOnboardingModal.value = false
}

const submitCompleteOnboarding = async () => {
  completingOnboarding.value = true
  try {
    await onboardingStore.completeOnboarding(employeeId.value)
    showSuccess('Onboarding completed successfully')
    closeCompleteOnboardingModal()
    router.push('/hr/onboarding')
  } catch (err) {
    showError(err.message || 'Failed to complete onboarding')
  } finally {
    completingOnboarding.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await loadOnboardingData()
  // Load checklist after onboarding data to ensure we have the latest documents
  await loadChecklist()
  // Load induction progress
  await loadInductionProgress()
})
</script>

