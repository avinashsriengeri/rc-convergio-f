<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Employees</h1>
        <p class="mt-2 text-lg text-gray-600">Manage your employee database</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Employee
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search employees..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="handleSearch"
          />
        </div>

        <!-- Department Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select
            v-model="filters.department"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">All Departments</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.employment_status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option value="all">All Statuses</option>
            <option value="onboarding">Onboarding</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="suspended">Suspended</option>
            <option value="offboarded">Offboarded</option>
          </select>
        </div>

        <!-- Employment Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            v-model="filters.employment_type"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option value="all">All Types</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="intern">Intern</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="employeesStore.loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading employees...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="employeesStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-red-800">Error loading employees</h3>
          <p class="mt-1 text-sm text-red-700">{{ employeesStore.error }}</p>
        </div>
        <button
          @click="loadEmployees"
          class="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Employees Table -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th v-if="filters.employment_status === 'onboarding'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Onboarding Progress</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="employee in employeesStore.employees"
              :key="employee.id"
              class="hover:bg-gray-50 cursor-pointer transition-colors"
              @click="viewEmployee(employee.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div v-if="employee.profile_picture" class="flex-shrink-0 h-10 w-10">
                    <img
                      :src="employee.profile_picture.url"
                      :alt="employee.full_name"
                      class="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <div v-else class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-gray-500 text-sm font-medium">
                      {{ employee.first_name?.[0] }}{{ employee.last_name?.[0] }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ employee.employee_id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ employee.full_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ employee.work_email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ employee.department_detail?.name || employee.department || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ employee.designation_detail?.name || employee.job_title || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'bg-green-100 text-green-800': employee.employment_status === 'active',
                    'bg-amber-100 text-amber-800': employee.employment_status === 'onboarding',
                    'bg-blue-100 text-blue-800': employee.employment_status === 'on_leave',
                    'bg-red-100 text-red-800': employee.employment_status === 'suspended',
                    'bg-gray-100 text-gray-800': employee.employment_status === 'offboarded'
                  }"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ employee.employment_status }}
                </span>
              </td>
              <td v-if="filters.employment_status === 'onboarding'" class="px-6 py-4 whitespace-nowrap">
                <div v-if="employee.onboarding_progress" class="w-32">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-gray-600">{{ employee.onboarding_progress.percentage || 0 }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      :class="{
                        'bg-green-600': (employee.onboarding_progress.percentage || 0) >= 80,
                        'bg-blue-600': (employee.onboarding_progress.percentage || 0) >= 50 && (employee.onboarding_progress.percentage || 0) < 80,
                        'bg-yellow-500': (employee.onboarding_progress.percentage || 0) >= 25 && (employee.onboarding_progress.percentage || 0) < 50,
                        'bg-red-600': (employee.onboarding_progress.percentage || 0) < 25
                      }"
                      class="h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${employee.onboarding_progress.percentage || 0}%` }"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ employee.onboarding_progress.completed_items || 0 }}/{{ employee.onboarding_progress.total_items || 0 }}
                  </p>
                </div>
                <span v-else class="text-xs text-gray-400">N/A</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" @click.stop>
                <router-link
                  :to="`/hr/employees/${employee.id}`"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  View
                </router-link>
                <router-link
                  v-if="employee.employment_status === 'onboarding'"
                  :to="`/hr/employees/${employee.id}/onboarding`"
                  class="text-green-600 hover:text-green-900"
                >
                  View Onboarding
                </router-link>
              </td>
            </tr>
            <tr v-if="employeesStore.employees.length === 0">
              <td :colspan="filters.employment_status === 'onboarding' ? 8 : 7" class="px-6 py-12 text-center text-sm text-gray-500">
                No employees found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="employeesStore.meta.last_page > 1" class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ employeesStore.meta.current_page }} of {{ employeesStore.meta.last_page }} pages
        </div>
        <div class="flex space-x-2">
          <button
            @click="changePage(employeesStore.meta.current_page - 1)"
            :disabled="employeesStore.meta.current_page === 1"
            class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="changePage(employeesStore.meta.current_page + 1)"
            :disabled="employeesStore.meta.current_page === employeesStore.meta.last_page"
            class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create Employee Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showCreateModal = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Add New Employee</h3>
            <button
              @click="showCreateModal = false"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleCreateEmployee">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    v-model="newEmployee.first_name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    v-model="newEmployee.last_name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Work Email *</label>
                <input
                  v-model="newEmployee.work_email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  v-model="newEmployee.phone_number"
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
                      v-model="newEmployee.preferred_name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      v-model="newEmployee.date_of_birth"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      v-model="newEmployee.gender"
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
                      v-model="newEmployee.nationality"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                    <select
                      v-model="newEmployee.marital_status"
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
                      v-model="newEmployee.id_number"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                  <input
                    v-model="newEmployee.passport_number"
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
                      v-model="newEmployee.personal_email"
                      type="email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Work Phone</label>
                    <input
                      v-model="newEmployee.work_phone"
                      type="tel"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Office Address</label>
                  <textarea
                    v-model="newEmployee.office_address"
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
                        v-model="newEmployee.address.street"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          v-model="newEmployee.address.city"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          v-model="newEmployee.address.state"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                        <input
                          v-model="newEmployee.address.zip"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          v-model="newEmployee.address.country"
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
                        v-model="newEmployee.emergency_contact.name"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                      <input
                        v-model="newEmployee.emergency_contact.relationship"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        v-model="newEmployee.emergency_contact.phone"
                        type="tel"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        v-model="newEmployee.emergency_contact.email"
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
                    v-model="newEmployee.department_id"
                    required
                    @change="handleDepartmentChange"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                      {{ dept.name }} ({{ dept.code }})
                    </option>
                  </select>
                  <p class="mt-1 text-xs text-gray-500">
                    <router-link to="/hr/departments" class="text-blue-600 hover:text-blue-700">
                      Manage Departments →
                    </router-link>
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
                  <select
                    v-model="newEmployee.designation_id"
                    required
                    :disabled="!newEmployee.department_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {{ newEmployee.department_id ? 'Select Designation' : 'Select Department first' }}
                    </option>
                    <option v-for="des in filteredDesignations" :key="des.id" :value="des.id">
                      {{ des.name }} ({{ des.code }})
                      <span v-if="!des.department_id" class="text-gray-400"> - Shared</span>
                    </option>
                  </select>
                  <p class="mt-1 text-xs text-gray-500">
                    <router-link to="/hr/designations" class="text-blue-600 hover:text-blue-700">
                      Manage Designations →
                    </router-link>
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                  <select
                    v-model="newEmployee.employment_type"
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
                    v-model="newEmployee.employment_status"
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
                      v-model="newEmployee.start_date"
                      type="date"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      v-model="newEmployee.end_date"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Work Schedule</label>
                    <input
                      v-model="newEmployee.work_schedule"
                      type="text"
                      placeholder="e.g., Standard (Mon-Fri)"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Team</label>
                    <select
                      v-model="newEmployee.team_id"
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
                      v-model="newEmployee.probation_end_date"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Contract End Date</label>
                    <input
                      v-model="newEmployee.contract_end_date"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Manager *</label>
                  <select
                    v-model="newEmployee.manager_id"
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
                  <div v-if="profilePicturePreview" class="flex-shrink-0">
                    <img
                      :src="profilePicturePreview"
                      alt="Profile preview"
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
                      ref="profilePictureInput"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/gif"
                      @change="handleProfilePictureSelect"
                      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p class="mt-1 text-xs text-gray-500">JPG, PNG or GIF. Max size 5MB.</p>
                  </div>
                </div>
              </div>

              <!-- User Account Creation -->
              <div class="border-t border-gray-200 pt-4">
                <div class="flex items-center mb-4">
                  <input
                    id="create_user_account"
                    v-model="newEmployee.create_user_account"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="create_user_account" class="ml-2 block text-sm font-medium text-gray-700">
                    Create User Account
                  </label>
                </div>

                <div v-if="newEmployee.create_user_account" class="ml-6 space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      v-model="newEmployee.user_account.email"
                      type="email"
                      :placeholder="newEmployee.work_email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p class="mt-1 text-xs text-gray-500">Defaults to work email if not provided</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      v-model="newEmployee.user_account.password"
                      type="password"
                      placeholder="Auto-generated if not provided"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p class="mt-1 text-xs text-gray-500">Leave empty to auto-generate password</p>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select
                        v-model="newEmployee.user_account.role"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Default (employee)</option>
                        <option v-for="role in roles" :key="role.id" :value="role.name">
                          {{ role.display_name || role.name }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Team</label>
                      <select
                        v-model="newEmployee.user_account.team_id"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option :value="null">No team</option>
                        <option v-for="team in teams" :key="team.id" :value="team.id">
                          {{ team.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="showCreateModal = false"
                class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {{ creating ? 'Creating...' : 'Create Employee' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHrEmployeesStore } from '../store/hrEmployees'
import { useHrDepartmentsStore } from '../store/hrDepartments'
import { useHrDesignationsStore } from '../store/hrDesignations'
import { useHrOnboardingStore } from '../store/hrOnboarding'
import { usersAPI } from '@/services/api'
import { teamsAPI } from '@/services/teams'
import { hrAPI } from '../api/hrAPI'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const router = useRouter()
const employeesStore = useHrEmployeesStore()
const departmentsStore = useHrDepartmentsStore()
const designationsStore = useHrDesignationsStore()
const onboardingStore = useHrOnboardingStore()

const searchQuery = ref('')
const showCreateModal = ref(false)
const creating = ref(false)
const departments = ref([])
const designations = ref([])
const roles = ref([])
const teams = ref([])
const managers = ref([])
const profilePictureInput = ref(null)
const profilePicturePreview = ref(null)

const filters = ref({
  department: '',
  employment_status: 'all',
  employment_type: 'all'
})

const newEmployee = ref({
  first_name: '',
  last_name: '',
  work_email: '',
  phone_number: '',
  department_id: null,
  designation_id: null,
  employment_type: 'full_time',
  employment_status: 'onboarding',
  start_date: '',
  profile_picture: null,
  create_user_account: false,
  user_account: {
    email: '',
    password: '',
    role: '',
    team_id: null
  },
  // Personal Information
  preferred_name: '',
  date_of_birth: '',
  gender: '',
  nationality: '',
  marital_status: '',
  id_number: '',
  passport_number: '',
  // Contact Details
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
  // Job Information
  end_date: '',
  work_schedule: '',
  probation_end_date: '',
  contract_end_date: '',
  manager_id: null,
  team_id: null
})

const loadEmployees = async () => {
  await employeesStore.fetchEmployees({
    ...filters.value,
    search: searchQuery.value,
    page: employeesStore.meta.current_page,
    employment_status: filters.value.employment_status === 'onboarding' ? 'onboarding' : undefined
  })
  
  // If filtering by onboarding, fetch progress for each employee
  if (filters.value.employment_status === 'onboarding') {
    for (const employee of employeesStore.employees) {
      try {
        const progress = await onboardingStore.fetchEmployeeOnboardingProgress(employee.id)
        if (progress) {
          employee.onboarding_progress = progress
        }
      } catch (err) {
        console.error(`Failed to fetch progress for employee ${employee.id}:`, err)
      }
    }
  }
}

const handleSearch = () => {
  employeesStore.setFilters({ search: searchQuery.value, page: 1 })
  loadEmployees()
}

const applyFilters = () => {
  employeesStore.setFilters({ ...filters.value, page: 1 })
  loadEmployees()
}

const changePage = (page) => {
  employeesStore.setFilters({ page })
  loadEmployees()
}

const viewEmployee = (employeeId) => {
  if (!employeeId) {
    console.error('Employee ID is missing')
    return
  }
  // Use route name for reliable navigation
  router.push({ 
    name: 'HrEmployeeDetail', 
    params: { id: employeeId.toString() } 
  }).catch(err => {
    // Handle navigation errors (e.g., route not found)
    console.error('Navigation error:', err)
    // Fallback to direct path
    router.push(`/hr/employees/${employeeId}`)
  })
}

const handleProfilePictureSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showError('Profile picture must be less than 5MB')
      event.target.value = ''
      return
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
    if (!validTypes.includes(file.type)) {
      showError('Profile picture must be JPG, PNG, or GIF')
      event.target.value = ''
      return
    }
    
    newEmployee.value.profile_picture = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      profilePicturePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleCreateEmployee = async () => {
  creating.value = true
  
  try {
    // Prepare form data
    const formData = new FormData()
    
    // Basic fields
    formData.append('first_name', newEmployee.value.first_name)
    formData.append('last_name', newEmployee.value.last_name)
    formData.append('work_email', newEmployee.value.work_email)
    formData.append('phone_number', newEmployee.value.phone_number || '')
    formData.append('department_id', newEmployee.value.department_id)
    formData.append('designation_id', newEmployee.value.designation_id)
    formData.append('employment_type', newEmployee.value.employment_type)
    formData.append('employment_status', newEmployee.value.employment_status)
    formData.append('start_date', newEmployee.value.start_date)
    
    // Personal Information
    if (newEmployee.value.preferred_name) {
      formData.append('preferred_name', newEmployee.value.preferred_name)
    }
    if (newEmployee.value.date_of_birth) {
      formData.append('date_of_birth', newEmployee.value.date_of_birth)
    }
    if (newEmployee.value.gender) {
      formData.append('gender', newEmployee.value.gender)
    }
    if (newEmployee.value.nationality) {
      formData.append('nationality', newEmployee.value.nationality)
    }
    if (newEmployee.value.marital_status) {
      formData.append('marital_status', newEmployee.value.marital_status)
    }
    if (newEmployee.value.id_number) {
      formData.append('id_number', newEmployee.value.id_number)
    }
    if (newEmployee.value.passport_number) {
      formData.append('passport_number', newEmployee.value.passport_number)
    }
    
    // Contact Details
    if (newEmployee.value.personal_email) {
      formData.append('personal_email', newEmployee.value.personal_email)
    }
    if (newEmployee.value.work_phone) {
      formData.append('work_phone', newEmployee.value.work_phone)
    }
    if (newEmployee.value.office_address) {
      formData.append('office_address', newEmployee.value.office_address)
    }
    
    // Address (nested FormData fields)
    if (newEmployee.value.address) {
      if (newEmployee.value.address.street) {
        formData.append('address[street]', newEmployee.value.address.street)
      }
      if (newEmployee.value.address.city) {
        formData.append('address[city]', newEmployee.value.address.city)
      }
      if (newEmployee.value.address.state) {
        formData.append('address[state]', newEmployee.value.address.state)
      }
      if (newEmployee.value.address.zip) {
        formData.append('address[zip]', newEmployee.value.address.zip)
      }
      if (newEmployee.value.address.country) {
        formData.append('address[country]', newEmployee.value.address.country)
      }
    }
    
    // Emergency Contact (nested FormData fields)
    if (newEmployee.value.emergency_contact) {
      if (newEmployee.value.emergency_contact.name) {
        formData.append('emergency_contact[name]', newEmployee.value.emergency_contact.name)
      }
      if (newEmployee.value.emergency_contact.relationship) {
        formData.append('emergency_contact[relationship]', newEmployee.value.emergency_contact.relationship)
      }
      if (newEmployee.value.emergency_contact.phone) {
        formData.append('emergency_contact[phone]', newEmployee.value.emergency_contact.phone)
      }
      if (newEmployee.value.emergency_contact.email) {
        formData.append('emergency_contact[email]', newEmployee.value.emergency_contact.email)
      }
    }
    
    // Job Information
    if (newEmployee.value.end_date) {
      formData.append('end_date', newEmployee.value.end_date)
    }
    if (newEmployee.value.work_schedule) {
      formData.append('work_schedule', newEmployee.value.work_schedule)
    }
    if (newEmployee.value.probation_end_date) {
      formData.append('probation_end_date', newEmployee.value.probation_end_date)
    }
    if (newEmployee.value.contract_end_date) {
      formData.append('contract_end_date', newEmployee.value.contract_end_date)
    }
    // Always send manager_id - send as number string if exists, empty string if null
    if (newEmployee.value.manager_id !== null && newEmployee.value.manager_id !== undefined) {
      formData.append('manager_id', String(newEmployee.value.manager_id))
    } else {
      formData.append('manager_id', '')
    }
    if (newEmployee.value.team_id) {
      formData.append('team_id', newEmployee.value.team_id)
    }
    
    // Profile picture
    if (newEmployee.value.profile_picture) {
      formData.append('profile_picture', newEmployee.value.profile_picture)
    }
    
    // User account creation
    if (newEmployee.value.create_user_account) {
      formData.append('create_user_account', '1')
      
      const userAccount = newEmployee.value.user_account
      if (userAccount.email) {
        formData.append('user_account[email]', userAccount.email)
      }
      if (userAccount.password) {
        formData.append('user_account[password]', userAccount.password)
      }
      if (userAccount.role) {
        formData.append('user_account[role]', userAccount.role)
      }
      if (userAccount.team_id) {
        formData.append('user_account[team_id]', userAccount.team_id)
      }
    } else {
      formData.append('create_user_account', '0')
    }
    
    await employeesStore.createEmployee(formData)
    
    showSuccess('Employee created successfully')
    showCreateModal.value = false
    
    // Reset form
    newEmployee.value = {
      first_name: '',
      last_name: '',
      work_email: '',
      phone_number: '',
      department_id: null,
      designation_id: null,
      employment_type: 'full_time',
      employment_status: 'onboarding',
      start_date: '',
      profile_picture: null,
      create_user_account: false,
      user_account: {
        email: '',
        password: '',
        role: '',
        team_id: null
      },
      // Personal Information
      preferred_name: '',
      date_of_birth: '',
      gender: '',
      nationality: '',
      marital_status: '',
      id_number: '',
      passport_number: '',
      // Contact Details
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
      // Job Information
      end_date: '',
      work_schedule: '',
      probation_end_date: '',
      contract_end_date: '',
      manager_id: null,
      team_id: null
    }
    profilePicturePreview.value = null
    if (profilePictureInput.value) {
      profilePictureInput.value.value = ''
    }
    
    // Reload all designations when form closes
    await designationsStore.fetchDesignations({ per_page: 100, is_active: true })
    designations.value = designationsStore.activeDesignations
    
    // Reload employees
    await loadEmployees()
  } catch (err) {
    showError(err.response?.data?.message || err.message || 'Failed to create employee')
  } finally {
    creating.value = false
  }
}

const filteredDesignations = computed(() => {
  if (!newEmployee.value.department_id) {
    // Show all active designations if no department selected
    return designations.value.filter(des => des.is_active)
  }
  
  // Filter designations: show those for selected department OR shared (department_id = null)
  return designations.value.filter(des => 
    des.is_active && (
      des.department_id === newEmployee.value.department_id || 
      des.department_id === null
    )
  )
})

const handleDepartmentChange = async () => {
  // Reset designation when department changes
  newEmployee.value.designation_id = null
  
  // Load designations for the selected department
  if (newEmployee.value.department_id) {
    try {
      const deptDesignations = await designationsStore.fetchDesignationsByDepartment(newEmployee.value.department_id)
      // Also include shared designations (department_id = null)
      const sharedDesignations = designations.value.filter(des => des.is_active && des.department_id === null)
      // Update the designations list with department-specific + shared
      designations.value = [...deptDesignations, ...sharedDesignations]
    } catch (err) {
      console.error('Failed to load designations for department:', err)
      // Fallback: filter from existing designations
    }
  } else {
    // Load all active designations if no department selected
    await designationsStore.fetchDesignations({ per_page: 100, is_active: true })
    designations.value = designationsStore.activeDesignations
  }
}

const loadManagers = async (params = {}) => {
  try {
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

const loadDropdowns = async () => {
  try {
    // Load departments and all designations
    await Promise.all([
      departmentsStore.fetchDepartments({ per_page: 100, is_active: true }),
      designationsStore.fetchDesignations({ per_page: 100, is_active: true })
    ])
    
    departments.value = departmentsStore.activeDepartments
    designations.value = designationsStore.activeDesignations
    
    // Load managers
    await loadManagers()
    
    // Load roles
    try {
      const rolesResponse = await usersAPI.getRoles()
      roles.value = rolesResponse.data.data || rolesResponse.data || []
    } catch (err) {
      console.error('Failed to load roles:', err)
      roles.value = []
    }
    
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

onMounted(async () => {
  await Promise.all([
    loadEmployees(),
    loadDropdowns()
  ])
  
  // Watch work_email to auto-fill user account email
  watch(() => newEmployee.value.work_email, (newEmail) => {
    if (newEmail && !newEmployee.value.user_account.email) {
      newEmployee.value.user_account.email = newEmail
    }
  })
})
</script>

