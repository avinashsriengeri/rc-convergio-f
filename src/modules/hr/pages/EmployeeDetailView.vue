<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading employee details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-red-800">Error loading employee</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
        </div>
        <button
          @click="loadEmployee"
          class="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Employee Details -->
    <div v-else-if="employee" class="space-y-6">
      <!-- Hero Header Card -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="bg-gradient-to-r from-primary-purple/10 via-primary-pink/5 to-transparent p-6">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-6">
              <!-- Profile Picture -->
              <div class="relative">
                <img 
                  v-if="employee.profile_picture"
                  :src="employee.profile_picture.url"
                  :alt="employee.full_name"
                  class="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div v-else class="h-32 w-32 rounded-full bg-gradient-to-br from-primary-purple to-primary-pink flex items-center justify-center border-4 border-white shadow-lg">
                  <span class="text-white text-4xl font-bold">
                    {{ employee.first_name?.[0] }}{{ employee.last_name?.[0] }}
                  </span>
                </div>
              </div>
              
              <!-- Employee Info -->
              <div class="flex-1">
                <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ employee.full_name }}</h1>
                <div class="flex items-center space-x-4 mb-3">
                  <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {{ employee.employee_id }}
                  </span>
                  <StatusBadge :status="employee.employment_status" />
                </div>
                <div class="flex items-center space-x-6 text-sm text-gray-600">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="font-medium">Date Joined:</span>
                    <span class="ml-1">{{ formatDate(employee.start_date) }}</span>
                  </div>
                  <div v-if="employee.office_address" class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{{ employee.office_address }}</span>
                  </div>
                </div>
                <div v-if="employee.department_detail || employee.designation_detail" class="mt-3 flex items-center text-sm">
                  <span class="text-gray-500">Role:</span>
                  <span class="ml-2 font-semibold text-primary-purple">
                    {{ employee.designation_detail?.name || employee.job_title }}
                  </span>
                  <span class="mx-2 text-gray-300">•</span>
                  <span class="text-gray-700">{{ employee.department_detail?.name || employee.department }}</span>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex space-x-3">
              <button
                @click="showEditModal = true"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                v-if="employee.employment_status === 'onboarding'"
                @click="handleActivate"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Activate
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px overflow-x-auto">
            <button
              @click="activeTab = 'overview'"
              :class="activeTab === 'overview' ? 'border-primary-purple text-primary-purple' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Overview
            </button>
            <button
              @click="activeTab = 'personal'"
              :class="activeTab === 'personal' ? 'border-primary-purple text-primary-purple' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Info
            </button>
            <button
              @click="activeTab = 'job'"
              :class="activeTab === 'job' ? 'border-primary-purple text-primary-purple' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Job Details
            </button>
            <button
              @click="activeTab = 'documents'"
              :class="activeTab === 'documents' ? 'border-primary-purple text-primary-purple' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documents
            </button>
            <button
              @click="activeTab = 'leave'"
              :class="activeTab === 'leave' ? 'border-primary-purple text-primary-purple' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Time Off
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Personal Information Card -->
              <InfoCard
                v-if="employee.preferred_name || employee.date_of_birth || employee.gender || employee.nationality || employee.marital_status || employee.id_number"
                title="Personal Information"
                icon="user"
                icon-color="text-primary-purple"
              >
                <InfoField label="Preferred Name" :value="employee.preferred_name" />
                <InfoField label="Gender" :value="employee.gender" format="capitalize" />
                <InfoField label="Date of Birth" :value="formatDate(employee.date_of_birth)" />
                <InfoField label="Nationality" :value="employee.nationality" />
                <InfoField label="Marital Status" :value="employee.marital_status" format="capitalize" />
                <InfoField label="ID Number" :value="employee.id_number" />
                <InfoField label="Passport Number" :value="employee.passport_number" />
              </InfoCard>

              <!-- Contact Details Card -->
              <InfoCard
                title="Contact Details"
                icon="mail"
                icon-color="text-blue-600"
              >
                <InfoField label="Work Email" :value="employee.work_email" type="email" />
                <InfoField label="Personal Email" :value="employee.personal_email" type="email" />
                <InfoField label="Phone" :value="employee.phone_number" type="phone" />
                <InfoField label="Work Phone" :value="employee.work_phone" type="phone" />
                <InfoField label="Office Address" :value="employee.office_address" />
              </InfoCard>

              <!-- Job Information Card -->
              <InfoCard
                title="Job Information"
                icon="briefcase"
                icon-color="text-primary-purple"
              >
                <InfoField label="Department" :value="employee.department_detail?.name || employee.department" />
                <InfoField label="Designation" :value="employee.designation_detail?.name || employee.job_title" />
                <InfoField label="Employment Type" :value="employee.employment_type" format="capitalize" />
                <InfoField label="Status">
                  <StatusBadge :status="employee.employment_status" />
                </InfoField>
                <InfoField label="Start Date" :value="formatDate(employee.start_date)" />
                <InfoField label="End Date" :value="formatDate(employee.end_date)" />
                <InfoField label="Work Schedule" :value="employee.work_schedule" />
                <InfoField label="Probation End" :value="formatDate(employee.probation_end_date)" />
                <InfoField label="Contract End" :value="formatDate(employee.contract_end_date)" />
              </InfoCard>

              <!-- Reporting To Card -->
              <InfoCard
                title="Reporting To"
                icon="users"
                icon-color="text-blue-600"
              >
                <div v-if="employee.manager" class="flex items-center space-x-3">
                  <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary-purple to-primary-pink flex items-center justify-center">
                    <span class="text-white text-sm font-medium">
                      {{ employee.manager.full_name?.split(' ').map(n => n[0]).join('') || 'M' }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ employee.manager.full_name }}</p>
                    <p class="text-sm text-gray-500">Manager</p>
                  </div>
                </div>
                <p v-else class="text-gray-500">No Manager Assigned</p>
                <div v-if="employee.team" class="mt-3 pt-3 border-t border-gray-200">
                  <p class="text-sm font-medium text-gray-700 mb-1">Team</p>
                  <p class="text-gray-900">{{ employee.team.name }}</p>
                </div>
                <div v-if="employee.user" class="mt-3 pt-3 border-t border-gray-200">
                  <p class="text-sm font-medium text-gray-700 mb-1">User Account</p>
                  <p class="text-sm text-gray-900">
                    <span class="font-medium">{{ employee.user.name }}</span>
                    <span class="text-gray-500"> ({{ employee.user.email }})</span>
                  </p>
                </div>
              </InfoCard>

              <!-- Home Address Card -->
              <InfoCard
                v-if="employee.address && (employee.address.street || employee.address.city || employee.address.state || employee.address.zip || employee.address.country)"
                title="Home Address"
                icon="map-pin"
                icon-color="text-green-600"
              >
                <div class="text-sm text-gray-900 space-y-1">
                  <p v-if="employee.address.street">{{ employee.address.street }}</p>
                  <p>
                    <span v-if="employee.address.city">{{ employee.address.city }}</span>
                    <span v-if="employee.address.city && employee.address.state">, </span>
                    <span v-if="employee.address.state">{{ employee.address.state }}</span>
                    <span v-if="employee.address.zip"> {{ employee.address.zip }}</span>
                  </p>
                  <p v-if="employee.address.country" class="font-medium">{{ employee.address.country }}</p>
                </div>
              </InfoCard>

              <!-- Emergency Contact Card -->
              <InfoCard
                v-if="employee.emergency_contact && (employee.emergency_contact.name || employee.emergency_contact.relationship || employee.emergency_contact.phone)"
                title="Emergency Contact"
                icon="phone"
                icon-color="text-primary-pink"
              >
                <InfoField label="Name" :value="employee.emergency_contact.name" />
                <InfoField label="Relationship" :value="employee.emergency_contact.relationship" />
                <InfoField label="Phone" :value="employee.emergency_contact.phone" type="phone" />
                <InfoField label="Email" :value="employee.emergency_contact.email" type="email" />
              </InfoCard>
            </div>
          </div>

          <!-- Personal Info Tab -->
          <div v-if="activeTab === 'personal'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                title="Personal Details"
                icon="user"
                icon-color="text-primary-purple"
              >
                <InfoField label="Preferred Name" :value="employee.preferred_name" />
                <InfoField label="Gender" :value="employee.gender" format="capitalize" />
                <InfoField label="Date of Birth" :value="formatDate(employee.date_of_birth)" />
                <InfoField label="Nationality" :value="employee.nationality" />
                <InfoField label="Marital Status" :value="employee.marital_status" format="capitalize" />
                <InfoField label="ID Number" :value="employee.id_number" />
                <InfoField label="Passport Number" :value="employee.passport_number" />
              </InfoCard>

              <InfoCard
                v-if="employee.address"
                title="Home Address"
                icon="map-pin"
                icon-color="text-green-600"
              >
                <div class="text-sm text-gray-900 space-y-1">
                  <p v-if="employee.address.street">{{ employee.address.street }}</p>
                  <p>
                    <span v-if="employee.address.city">{{ employee.address.city }}</span>
                    <span v-if="employee.address.city && employee.address.state">, </span>
                    <span v-if="employee.address.state">{{ employee.address.state }}</span>
                    <span v-if="employee.address.zip"> {{ employee.address.zip }}</span>
                  </p>
                  <p v-if="employee.address.country" class="font-medium">{{ employee.address.country }}</p>
                </div>
              </InfoCard>

              <InfoCard
                v-if="employee.emergency_contact"
                title="Emergency Contact"
                icon="phone"
                icon-color="text-primary-pink"
              >
                <InfoField label="Name" :value="employee.emergency_contact.name" />
                <InfoField label="Relationship" :value="employee.emergency_contact.relationship" />
                <InfoField label="Phone" :value="employee.emergency_contact.phone" type="phone" />
                <InfoField label="Email" :value="employee.emergency_contact.email" type="email" />
              </InfoCard>
            </div>
          </div>

          <!-- Job Details Tab -->
          <div v-if="activeTab === 'job'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                title="Employment Details"
                icon="briefcase"
                icon-color="text-primary-purple"
              >
                <InfoField label="Department" :value="employee.department_detail?.name || employee.department" />
                <InfoField label="Designation" :value="employee.designation_detail?.name || employee.job_title" />
                <InfoField label="Employment Type" :value="employee.employment_type" format="capitalize" />
                <InfoField label="Status">
                  <StatusBadge :status="employee.employment_status" />
                </InfoField>
                <InfoField label="Start Date" :value="formatDate(employee.start_date)" />
                <InfoField label="End Date" :value="formatDate(employee.end_date)" />
                <InfoField label="Work Schedule" :value="employee.work_schedule" />
                <InfoField label="Probation End Date" :value="formatDate(employee.probation_end_date)" />
                <InfoField label="Contract End Date" :value="formatDate(employee.contract_end_date)" />
              </InfoCard>

              <InfoCard
                title="Reporting Structure"
                icon="users"
                icon-color="text-blue-600"
              >
                <div v-if="employee.manager" class="mb-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Manager</p>
                  <div class="flex items-center space-x-3">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary-purple to-primary-pink flex items-center justify-center">
                      <span class="text-white text-sm font-medium">
                        {{ employee.manager.full_name?.split(' ').map(n => n[0]).join('') || 'M' }}
                      </span>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ employee.manager.full_name }}</p>
                    </div>
                  </div>
                </div>
                <p v-else class="text-gray-500 mb-4">No Manager Assigned</p>
                <div v-if="employee.team" class="pt-4 border-t border-gray-200">
                  <p class="text-sm font-medium text-gray-700 mb-2">Team</p>
                  <p class="text-gray-900">{{ employee.team.name }}</p>
                </div>
                <div v-if="employee.user" class="pt-4 border-t border-gray-200">
                  <p class="text-sm font-medium text-gray-700 mb-2">User Account</p>
                  <p class="text-sm text-gray-900">
                    <span class="font-medium">{{ employee.user.name }}</span>
                    <span class="text-gray-500"> ({{ employee.user.email }})</span>
                  </p>
                </div>
              </InfoCard>
            </div>
          </div>

          <!-- Documents Tab -->
          <div v-if="activeTab === 'documents'">
            <router-link :to="`/hr/documents?employee_id=${employee.id}`" class="inline-flex items-center text-primary-purple hover:text-primary-pink transition-colors">
              <span>View Documents</span>
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>

          <!-- Leave Tab -->
          <div v-if="activeTab === 'leave'">
            <router-link :to="`/hr/leave?employee_id=${employee.id}`" class="inline-flex items-center text-primary-purple hover:text-primary-pink transition-colors">
              <span>View Leave Details</span>
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Employee Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeEditModal"
    >
      <div
        class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Edit Employee</h3>
            <button
              @click="closeEditModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleUpdateEmployee">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    v-model="editFormData.first_name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    v-model="editFormData.last_name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Work Email *</label>
                <input
                  v-model="editFormData.work_email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  v-model="editFormData.phone_number"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Personal Information Section -->
              <div class="border-t border-gray-200 pt-4 mt-4">
                <h3 class="text-sm font-semibold text-gray-700 mb-4">Personal Information</h3>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Name</label>
                    <input
                      v-model="editFormData.preferred_name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      v-model="editFormData.date_of_birth"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      v-model="editFormData.gender"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                    <input
                      v-model="editFormData.nationality"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                    <select
                      v-model="editFormData.marital_status"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                    <input
                      v-model="editFormData.id_number"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                  <input
                    v-model="editFormData.passport_number"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <!-- Contact Details Section -->
              <div class="border-t border-gray-200 pt-4 mt-4">
                <h3 class="text-sm font-semibold text-gray-700 mb-4">Contact Details</h3>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Personal Email</label>
                    <input
                      v-model="editFormData.personal_email"
                      type="email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Work Phone</label>
                    <input
                      v-model="editFormData.work_phone"
                      type="tel"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Office Address</label>
                  <textarea
                    v-model="editFormData.office_address"
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>

                <!-- Address Fields -->
                <div class="border-t border-gray-200 pt-4 mt-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-3">Home Address</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Street</label>
                      <input
                        v-model="editFormData.address.street"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          v-model="editFormData.address.city"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          v-model="editFormData.address.state"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                        <input
                          v-model="editFormData.address.zip"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          v-model="editFormData.address.country"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Emergency Contact Fields -->
                <div class="border-t border-gray-200 pt-4 mt-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-3">Emergency Contact</h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        v-model="editFormData.emergency_contact.name"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                      <input
                        v-model="editFormData.emergency_contact.relationship"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        v-model="editFormData.emergency_contact.phone"
                        type="tel"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        v-model="editFormData.emergency_contact.email"
                        type="email"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <select
                    v-model="editFormData.department_id"
                    required
                    @change="handleEditDepartmentChange"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                      {{ dept.name }} ({{ dept.code }})
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
                  <select
                    v-model="editFormData.designation_id"
                    required
                    :disabled="!editFormData.department_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {{ editFormData.department_id ? 'Select Designation' : 'Select Department first' }}
                    </option>
                    <option v-for="des in filteredEditDesignations" :key="des.id" :value="des.id">
                      {{ des.name }} ({{ des.code }})
                      <span v-if="!des.department_id" class="text-gray-400"> - Shared</span>
                    </option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                  <select
                    v-model="editFormData.employment_type"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Intern</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
                  <select
                    v-model="editFormData.employment_status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="onboarding">Onboarding</option>
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <!-- Job Information Section -->
              <div class="border-t border-gray-200 pt-4 mt-4">
                <h3 class="text-sm font-semibold text-gray-700 mb-4">Job Information</h3>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                      v-model="editFormData.start_date"
                      type="date"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      v-model="editFormData.end_date"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Work Schedule</label>
                    <input
                      v-model="editFormData.work_schedule"
                      type="text"
                      placeholder="e.g., Standard (Mon-Fri)"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Team</label>
                    <select
                      v-model="editFormData.team_id"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option :value="null">No Team</option>
                      <option v-for="team in teams" :key="team.id" :value="team.id">
                        {{ team.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Probation End Date</label>
                    <input
                      v-model="editFormData.probation_end_date"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Contract End Date</label>
                    <input
                      v-model="editFormData.contract_end_date"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Manager *</label>
                  <select
                    v-model="editFormData.manager_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option :value="null">(None) - No Manager</option>
                    <option v-for="manager in managers" :key="manager.id" :value="manager.id">
                      {{ manager.display || `${manager.full_name} - ${manager.job_title || manager.designation_detail?.name || ''} - ${manager.department || manager.department_detail?.name || ''}` }}
                    </option>
                  </select>
                  <p class="mt-1 text-xs text-gray-500">
                    Only employees with manager designations appear here
                  </p>
                </div>
              </div>

              <!-- Profile Picture Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <div class="mt-1 flex items-center space-x-5">
                  <div v-if="editProfilePicturePreview" class="flex-shrink-0">
                    <img
                      :src="editProfilePicturePreview"
                      alt="Profile preview"
                      class="h-20 w-20 rounded-full object-cover border-2 border-gray-300"
                    />
                  </div>
                  <div v-else-if="employee?.profile_picture" class="flex-shrink-0">
                    <img
                      :src="employee.profile_picture.url"
                      alt="Current profile"
                      class="h-20 w-20 rounded-full object-cover border-2 border-gray-300"
                    />
                  </div>
                  <div v-else class="flex-shrink-0">
                    <div class="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                      <svg class="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <input
                      ref="editProfilePictureInput"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/gif"
                      @change="handleEditProfilePictureSelect"
                      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p class="mt-1 text-xs text-gray-500">JPG, PNG or GIF. Max size 5MB. Leave empty to keep current picture.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="closeEditModal"
                class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="updating"
                class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {{ updating ? 'Updating...' : 'Update Employee' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHrEmployeesStore } from '../store/hrEmployees'
import { useHrDepartmentsStore } from '../store/hrDepartments'
import { useHrDesignationsStore } from '../store/hrDesignations'
import { teamsAPI } from '@/services/teams'
import { hrAPI } from '../api/hrAPI'
import { success as showSuccess, error as showError } from '@/utils/notifications'
import InfoCard from '../components/InfoCard.vue'
import InfoField from '../components/InfoField.vue'
import StatusBadge from '../components/StatusBadge.vue'

const route = useRoute()
const router = useRouter()
const employeesStore = useHrEmployeesStore()
const departmentsStore = useHrDepartmentsStore()
const designationsStore = useHrDesignationsStore()

const loading = ref(true)
const error = ref(null)
const employee = ref(null)
const activeTab = ref('overview')
const showEditModal = ref(false)
const updating = ref(false)
const departments = ref([])
const designations = ref([])
const teams = ref([])
const managers = ref([])
const editProfilePictureInput = ref(null)
const editProfilePicturePreview = ref(null)

const editFormData = ref({
  first_name: '',
  last_name: '',
  work_email: '',
  phone_number: '',
  department_id: null,
  designation_id: null,
  employment_type: 'full_time',
  employment_status: 'onboarding',
  start_date: '',
  end_date: '',
  profile_picture: null,
  preferred_name: '',
  date_of_birth: '',
  gender: '',
  nationality: '',
  marital_status: '',
  id_number: '',
  passport_number: '',
  personal_email: '',
  work_phone: '',
  office_address: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  },
  emergency_contact: {
    name: '',
    relationship: '',
    phone: '',
    email: ''
  },
  work_schedule: '',
  probation_end_date: '',
  contract_end_date: '',
  manager_id: null,
  team_id: null
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const loadEmployee = async () => {
  loading.value = true
  error.value = null

  try {
    const employeeId = route.params.id
    if (!employeeId) {
      throw new Error('Employee ID is required')
    }
    console.log('Loading employee with ID:', employeeId)
    const employeeData = await employeesStore.fetchEmployee(employeeId)
    employee.value = employeeData
  } catch (err) {
    console.error('Error loading employee:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load employee'
  } finally {
    loading.value = false
  }
}

const handleActivate = async () => {
  try {
    await employeesStore.activateEmployee(route.params.id)
    showSuccess('Employee activated successfully')
    await loadEmployee()
  } catch (err) {
    showError(err.message || 'Failed to activate employee')
  }
}

const loadDropdowns = async () => {
  try {
    await Promise.all([
      departmentsStore.fetchDepartments({ per_page: 100, is_active: true }),
      designationsStore.fetchDesignations({ per_page: 100, is_active: true })
    ])
    departments.value = departmentsStore.activeDepartments
    designations.value = designationsStore.activeDesignations
    
    // Load teams
    try {
      const teamsResponse = await teamsAPI.getTeams({ per_page: 100 })
      const teamsData = teamsResponse.data.data || teamsResponse.data
      teams.value = Array.isArray(teamsData?.data) ? teamsData.data : (Array.isArray(teamsData) ? teamsData : [])
    } catch (err) {
      console.error('Failed to load teams:', err)
      teams.value = []
    }
  } catch (err) {
    console.error('Failed to load dropdowns:', err)
  }
}

const loadManagers = async (excludeId = null) => {
  try {
    const params = excludeId ? { exclude_id: excludeId } : {}
    const response = await hrAPI.getManagers(params)
    if (response.data?.success && response.data?.data) {
      managers.value = response.data.data
    } else if (Array.isArray(response.data)) {
      managers.value = response.data
    } else {
      managers.value = []
    }
  } catch (err) {
    console.error('Error loading managers:', err)
    managers.value = []
  }
}

const filteredEditDesignations = computed(() => {
  if (!editFormData.value.department_id) {
    return designations.value.filter(des => des.is_active)
  }
  return designations.value.filter(des => 
    des.is_active && (
      des.department_id === editFormData.value.department_id || 
      des.department_id === null
    )
  )
})

const handleEditDepartmentChange = async () => {
  editFormData.value.designation_id = null
  if (editFormData.value.department_id) {
    try {
      const deptDesignations = await designationsStore.fetchDesignationsByDepartment(editFormData.value.department_id)
      const sharedDesignations = designations.value.filter(des => des.is_active && des.department_id === null)
      designations.value = [...deptDesignations, ...sharedDesignations]
    } catch (err) {
      console.error('Failed to load designations for department:', err)
    }
  } else {
    await designationsStore.fetchDesignations({ per_page: 100, is_active: true })
    designations.value = designationsStore.activeDesignations
  }
}

const initializeEditForm = () => {
  if (!employee.value) return
  
  const emp = employee.value
  editFormData.value = {
    first_name: emp.first_name || '',
    last_name: emp.last_name || '',
    work_email: emp.work_email || '',
    phone_number: emp.phone_number || '',
    department_id: emp.department_id || emp.department_detail?.id || null,
    designation_id: emp.designation_id || emp.designation_detail?.id || null,
    employment_type: emp.employment_type || 'full_time',
    employment_status: emp.employment_status || 'onboarding',
    start_date: emp.start_date ? emp.start_date.split('T')[0] : '',
    end_date: emp.end_date ? emp.end_date.split('T')[0] : '',
    profile_picture: null,
    preferred_name: emp.preferred_name || '',
    date_of_birth: emp.date_of_birth ? emp.date_of_birth.split('T')[0] : '',
    gender: emp.gender || '',
    nationality: emp.nationality || '',
    marital_status: emp.marital_status || '',
    id_number: emp.id_number || '',
    passport_number: emp.passport_number || '',
    personal_email: emp.personal_email || '',
    work_phone: emp.work_phone || '',
    office_address: emp.office_address || '',
    address: {
      street: emp.address?.street || '',
      city: emp.address?.city || '',
      state: emp.address?.state || '',
      zip: emp.address?.zip || '',
      country: emp.address?.country || ''
    },
    emergency_contact: {
      name: emp.emergency_contact?.name || '',
      relationship: emp.emergency_contact?.relationship || '',
      phone: emp.emergency_contact?.phone || '',
      email: emp.emergency_contact?.email || ''
    },
    work_schedule: emp.work_schedule || '',
    probation_end_date: emp.probation_end_date ? emp.probation_end_date.split('T')[0] : '',
    contract_end_date: emp.contract_end_date ? emp.contract_end_date.split('T')[0] : '',
    manager_id: emp.manager_id || null,
    team_id: emp.team_id || null
  }
  
  editProfilePicturePreview.value = null
  if (editProfilePictureInput.value) {
    editProfilePictureInput.value.value = ''
  }
}

const handleEditProfilePictureSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      showError('Profile picture must be less than 5MB')
      event.target.value = ''
      return
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
    if (!validTypes.includes(file.type)) {
      showError('Profile picture must be JPG, PNG, or GIF')
      event.target.value = ''
      return
    }
    
    editFormData.value.profile_picture = file
    
    const reader = new FileReader()
    reader.onload = (e) => {
      editProfilePicturePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleUpdateEmployee = async () => {
  updating.value = true
  
  try {
    const formData = new FormData()
    
    // Basic fields
    formData.append('first_name', editFormData.value.first_name)
    formData.append('last_name', editFormData.value.last_name)
    formData.append('work_email', editFormData.value.work_email)
    if (editFormData.value.phone_number) {
      formData.append('phone_number', editFormData.value.phone_number)
    }
    formData.append('department_id', editFormData.value.department_id)
    formData.append('designation_id', editFormData.value.designation_id)
    formData.append('employment_type', editFormData.value.employment_type)
    formData.append('employment_status', editFormData.value.employment_status)
    formData.append('start_date', editFormData.value.start_date)
    
    // Personal Information
    if (editFormData.value.preferred_name) {
      formData.append('preferred_name', editFormData.value.preferred_name)
    }
    if (editFormData.value.date_of_birth) {
      formData.append('date_of_birth', editFormData.value.date_of_birth)
    }
    if (editFormData.value.gender) {
      formData.append('gender', editFormData.value.gender)
    }
    if (editFormData.value.nationality) {
      formData.append('nationality', editFormData.value.nationality)
    }
    if (editFormData.value.marital_status) {
      formData.append('marital_status', editFormData.value.marital_status)
    }
    if (editFormData.value.id_number) {
      formData.append('id_number', editFormData.value.id_number)
    }
    if (editFormData.value.passport_number) {
      formData.append('passport_number', editFormData.value.passport_number)
    }
    
    // Contact Details
    if (editFormData.value.personal_email) {
      formData.append('personal_email', editFormData.value.personal_email)
    }
    if (editFormData.value.work_phone) {
      formData.append('work_phone', editFormData.value.work_phone)
    }
    if (editFormData.value.office_address) {
      formData.append('office_address', editFormData.value.office_address)
    }
    
    // Address (nested FormData fields)
    if (editFormData.value.address) {
      if (editFormData.value.address.street) {
        formData.append('address[street]', editFormData.value.address.street)
      }
      if (editFormData.value.address.city) {
        formData.append('address[city]', editFormData.value.address.city)
      }
      if (editFormData.value.address.state) {
        formData.append('address[state]', editFormData.value.address.state)
      }
      if (editFormData.value.address.zip) {
        formData.append('address[zip]', editFormData.value.address.zip)
      }
      if (editFormData.value.address.country) {
        formData.append('address[country]', editFormData.value.address.country)
      }
    }
    
    // Emergency Contact (nested FormData fields)
    if (editFormData.value.emergency_contact) {
      if (editFormData.value.emergency_contact.name) {
        formData.append('emergency_contact[name]', editFormData.value.emergency_contact.name)
      }
      if (editFormData.value.emergency_contact.relationship) {
        formData.append('emergency_contact[relationship]', editFormData.value.emergency_contact.relationship)
      }
      if (editFormData.value.emergency_contact.phone) {
        formData.append('emergency_contact[phone]', editFormData.value.emergency_contact.phone)
      }
      if (editFormData.value.emergency_contact.email) {
        formData.append('emergency_contact[email]', editFormData.value.emergency_contact.email)
      }
    }
    
    // Job Information
    if (editFormData.value.end_date) {
      formData.append('end_date', editFormData.value.end_date)
    }
    if (editFormData.value.work_schedule) {
      formData.append('work_schedule', editFormData.value.work_schedule)
    }
    if (editFormData.value.probation_end_date) {
      formData.append('probation_end_date', editFormData.value.probation_end_date)
    }
    if (editFormData.value.contract_end_date) {
      formData.append('contract_end_date', editFormData.value.contract_end_date)
    }
    // Always send manager_id - send as number string if exists, empty string if null (backend will handle)
    if (editFormData.value.manager_id !== null && editFormData.value.manager_id !== undefined) {
      formData.append('manager_id', String(editFormData.value.manager_id))
    } else {
      formData.append('manager_id', '')
    }
    if (editFormData.value.team_id) {
      formData.append('team_id', editFormData.value.team_id)
    }
    
    // Profile picture (only if changed)
    if (editFormData.value.profile_picture) {
      formData.append('profile_picture', editFormData.value.profile_picture)
    }
    
    await employeesStore.updateEmployee(route.params.id, formData)
    
    showSuccess('Employee updated successfully')
    closeEditModal()
    await loadEmployee()
  } catch (err) {
    showError(err.response?.data?.message || err.message || 'Failed to update employee')
  } finally {
    updating.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editProfilePicturePreview.value = null
  if (editProfilePictureInput.value) {
    editProfilePictureInput.value.value = ''
  }
}

watch(showEditModal, (newVal) => {
  if (newVal && employee.value) {
    initializeEditForm()
    loadManagers(employee.value.id)
    loadDropdowns()
  }
})

onMounted(async () => {
  await loadEmployee()
  await loadDropdowns()
})
</script>

