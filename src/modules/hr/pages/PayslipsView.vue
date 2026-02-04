<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Payslips</h1>
        <p class="mt-2 text-lg text-gray-600">
          {{ isEmployee ? 'View your payslips' : 'View and manage employee payslips' }}
        </p>
      </div>
      <button
        v-if="canUpload && selectedEmployeeId"
        @click="showUploadModal = true"
        class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Upload Payslip
      </button>
    </div>

    <!-- HR ADMIN VIEW -->
    <template v-if="!isEmployee">
      <!-- Employee Selector (HR Admin only) -->
      <div v-if="canUpload && !selectedEmployeeId" class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
        <select
          v-model="selectedEmployeeId"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          @change="loadData"
        >
          <option value="">Select an employee (or leave empty to view all)</option>
          <option v-for="emp in employees" :key="emp.id" :value="emp.id">
            {{ emp.full_name }} ({{ emp.employee_id }})
          </option>
        </select>
        <p class="mt-2 text-xs text-gray-500">Leave empty to view all payslips across all employees</p>
      </div>

      <!-- Quick Stats Cards -->
      <div v-if="!payslipsStore.loading && payslipsStore.payslips.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-xl p-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Payslips</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-xl p-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">This Month</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.thisMonth }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-100 rounded-xl p-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">This Year</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.thisYear }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-100 rounded-xl p-4">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Employees</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.uniqueEmployees }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters (if payslips exist) -->
      <div v-if="!payslipsStore.loading && payslipsStore.payslips.length > 0" class="bg-white rounded-xl shadow-md border border-gray-200 p-5">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by payslip number, employee..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              @input="handleSearch"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              v-model="selectedYear"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              @change="handleFilterChange"
            >
              <option value="">All Years</option>
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              v-model="selectedMonth"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              @change="handleFilterChange"
            >
              <option value="">All Months</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
        </div>
      </div>

      <!-- HR Payslips Table -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ selectedEmployeeId ? 'Employee Payslips' : 'Payslip History' }}
          </h2>
        </div>
        <div class="p-6">
          <div v-if="payslipsStore.loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
            <p class="mt-4 text-gray-600">Loading payslips...</p>
          </div>
          <div v-else-if="filteredPayslips.length" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payslip Number</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Period</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="payslip in filteredPayslips" :key="payslip.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-semibold text-gray-900">{{ payslip.payslip_number }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-purple bg-opacity-10 flex items-center justify-center">
                        <span class="text-sm font-medium text-primary-purple">
                          {{ getInitials(payslip.employee?.full_name || 'N/A') }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ payslip.employee?.full_name || 'N/A' }}</div>
                        <div class="text-sm text-gray-500">{{ payslip.employee?.employee_id || '' }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(payslip.pay_period_start) }}</div>
                    <div class="text-sm text-gray-500">to {{ formatDate(payslip.pay_period_end) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(payslip.uploaded_at) }}</div>
                    <div v-if="payslip.uploaded_by" class="text-xs text-gray-500">by {{ payslip.uploaded_by?.name || 'HR' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center gap-3">
                      <button
                        @click="handleDownload(payslip.id)"
                        class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                      <button
                        v-if="canUpload"
                        @click="handleDelete(payslip.id)"
                        class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-6 text-lg font-semibold text-gray-900">No payslips found</h3>
            <p class="mt-2 text-sm text-gray-500">
              {{ searchQuery || selectedYear || selectedMonth ? 'Try adjusting your filters' : 'No payslips have been uploaded yet' }}
            </p>
            <button
              v-if="canUpload && !searchQuery && !selectedYear && !selectedMonth"
              @click="showUploadModal = true"
              class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink transition-colors"
            >
              Upload First Payslip
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- EMPLOYEE VIEW - Grouped by Year and Month -->
    <template v-else>
      <!-- Employee Stats Cards -->
      <div v-if="!payslipsStore.loading && payslipsStore.payslips.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-xl p-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Payslips</p>
              <p class="text-2xl font-bold text-gray-900">{{ payslipsStore.payslips.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-xl p-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">This Month</p>
              <p class="text-2xl font-bold text-gray-900">{{ employeeStats.thisMonth }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-100 rounded-xl p-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">This Year</p>
              <p class="text-2xl font-bold text-gray-900">{{ employeeStats.thisYear }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Year/Month Filters for Employee -->
      <div v-if="!payslipsStore.loading && payslipsStore.payslips.length > 0" class="bg-white rounded-xl shadow-md border border-gray-200 p-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Year</label>
            <select
              v-model="selectedYear"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              @change="handleFilterChange"
            >
              <option value="">All Years</option>
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Month</label>
            <select
              v-model="selectedMonth"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
              @change="handleFilterChange"
            >
              <option value="">All Months</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Employee Payslips Grouped by Year and Month -->
      <div v-if="payslipsStore.loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading your payslips...</p>
      </div>
      <div v-else-if="groupedPayslips.length > 0" class="space-y-6">
        <div
          v-for="group in groupedPayslips"
          :key="`${group.year}-${group.month}`"
          class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
        >
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-purple to-primary-pink bg-opacity-5">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ group.monthName }} {{ group.year }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ group.payslips.length }} {{ group.payslips.length === 1 ? 'payslip' : 'payslips' }}</p>
              </div>
              <div class="flex items-center text-primary-purple">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-sm font-medium">{{ group.monthName }}</span>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="payslip in group.payslips"
                :key="payslip.id"
                class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-300 hover:border-primary-purple"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center mb-2">
                      <div class="flex-shrink-0 bg-primary-purple bg-opacity-10 rounded-lg p-2 mr-3">
                        <svg class="w-5 h-5 text-primary-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 class="text-sm font-semibold text-gray-900">{{ payslip.payslip_number }}</h4>
                        <p class="text-xs text-gray-500 mt-0.5">Pay Period</p>
                      </div>
                    </div>
                    <div class="ml-11 space-y-1">
                      <p class="text-sm text-gray-700">
                        <span class="font-medium">{{ formatDate(payslip.pay_period_start) }}</span>
                        <span class="text-gray-400 mx-2">to</span>
                        <span class="font-medium">{{ formatDate(payslip.pay_period_end) }}</span>
                      </p>
                      <p class="text-xs text-gray-500">Uploaded: {{ formatDate(payslip.uploaded_at) }}</p>
                    </div>
                  </div>
                </div>
                <button
                  @click="handleDownload(payslip.id)"
                  class="w-full mt-4 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink transition-all shadow-sm hover:shadow-md"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Payslip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
        <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-6 text-lg font-semibold text-gray-900">No payslips found</h3>
        <p class="mt-2 text-sm text-gray-500">
          {{ selectedYear || selectedMonth ? 'Try adjusting your filters' : 'You don\'t have any payslips yet' }}
        </p>
      </div>
    </template>

    <!-- Upload Payslip Modal (HR Admin only) -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showUploadModal = false"
    >
      <div
        class="relative top-20 mx-auto p-8 border w-full max-w-2xl shadow-xl rounded-xl bg-white"
        @click.stop
      >
        <div>
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Upload Payslip</h3>
            <button
              @click="showUploadModal = false"
              class="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleUpload">
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Employee *</label>
                <select
                  v-model="newPayslip.employee_id"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                >
                  <option value="">Select employee</option>
                  <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                    {{ emp.full_name }} ({{ emp.employee_id }})
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Pay Period Start *</label>
                  <input
                    v-model="newPayslip.pay_period_start"
                    type="date"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Pay Period End *</label>
                  <input
                    v-model="newPayslip.pay_period_end"
                    type="date"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Payslip File (PDF) *</label>
                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-purple transition-colors">
                  <div class="space-y-1 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4h4m-6-6h.02M6 16h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                      <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-purple hover:text-primary-pink focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-purple">
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          ref="fileInput"
                          type="file"
                          accept=".pdf"
                          required
                          @change="handleFileSelect"
                          class="sr-only"
                        />
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs text-gray-500">PDF up to 10MB</p>
                    <p v-if="newPayslip.file" class="mt-2 text-sm font-medium text-green-600">
                      Selected: {{ newPayslip.file.name }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-8">
              <button
                type="button"
                @click="showUploadModal = false"
                class="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="uploading"
                class="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {{ uploading ? 'Uploading...' : 'Upload Payslip' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHrPayslipsStore } from '../store/hrPayslips'
import { useHrEmployeesStore } from '../store/hrEmployees'
import { useAuth } from '@/composables/useAuth'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const route = useRoute()
const payslipsStore = useHrPayslipsStore()
const employeesStore = useHrEmployeesStore()
const { user } = useAuth()

const showUploadModal = ref(false)
const uploading = ref(false)
const fileInput = ref(null)
const employees = ref([])
const selectedEmployeeId = ref(null)
const searchQuery = ref('')
const selectedYear = ref('')
const selectedMonth = ref('')

const newPayslip = ref({
  employee_id: null,
  pay_period_start: '',
  pay_period_end: '',
  file: null
})

const isEmployee = computed(() => {
  if (!user.value?.roles) return true // Default to employee if no roles
  const roles = Array.isArray(user.value.roles) ? user.value.roles : [user.value.roles]
  return !roles.includes('hr_admin') && !roles.includes('system_admin')
})

const canUpload = computed(() => {
  // Only HR Admin and System Admin can upload
  if (!user.value?.roles) return false
  const roles = Array.isArray(user.value.roles) ? user.value.roles : [user.value.roles]
  return roles.includes('hr_admin') || roles.includes('system_admin')
})

const stats = computed(() => {
  const payslips = payslipsStore.payslips
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  const thisMonth = payslips.filter(p => {
    const date = new Date(p.pay_period_start)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  }).length
  
  const thisYear = payslips.filter(p => {
    const date = new Date(p.pay_period_start)
    return date.getFullYear() === currentYear
  }).length
  
  const uniqueEmployees = new Set(payslips.map(p => p.employee_id)).size
  
  return {
    total: payslips.length,
    thisMonth,
    thisYear,
    uniqueEmployees
  }
})

const employeeStats = computed(() => {
  const payslips = payslipsStore.payslips
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  const thisMonth = payslips.filter(p => {
    const date = new Date(p.pay_period_start)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  }).length
  
  const thisYear = payslips.filter(p => {
    const date = new Date(p.pay_period_start)
    return date.getFullYear() === currentYear
  }).length
  
  return {
    thisMonth,
    thisYear
  }
})

const availableYears = computed(() => {
  const years = new Set()
  payslipsStore.payslips.forEach(p => {
    const year = new Date(p.pay_period_start).getFullYear()
    years.add(year)
  })
  return Array.from(years).sort((a, b) => b - a)
})

const groupedPayslips = computed(() => {
  let payslips = [...payslipsStore.payslips]
  
  // Apply year filter
  if (selectedYear.value) {
    payslips = payslips.filter(p => {
      const year = new Date(p.pay_period_start).getFullYear()
      return year.toString() === selectedYear.value
    })
  }
  
  // Apply month filter
  if (selectedMonth.value) {
    payslips = payslips.filter(p => {
      const month = new Date(p.pay_period_start).getMonth() + 1
      return month.toString().padStart(2, '0') === selectedMonth.value
    })
  }
  
  // Group by year and month
  const grouped = {}
  payslips.forEach(payslip => {
    const date = new Date(payslip.pay_period_start)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const key = `${year}-${month.toString().padStart(2, '0')}`
    
    if (!grouped[key]) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      grouped[key] = {
        year,
        month: month.toString().padStart(2, '0'),
        monthName: monthNames[month - 1],
        payslips: []
      }
    }
    grouped[key].payslips.push(payslip)
  })
  
  // Sort by year and month (newest first)
  return Object.values(grouped).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return parseInt(b.month) - parseInt(a.month)
  })
})

const filteredPayslips = computed(() => {
  let filtered = [...payslipsStore.payslips]
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.payslip_number?.toLowerCase().includes(query) ||
      p.employee?.full_name?.toLowerCase().includes(query) ||
      p.employee?.employee_id?.toLowerCase().includes(query)
    )
  }
  
  // Filter by year
  if (selectedYear.value) {
    filtered = filtered.filter(p => {
      const year = new Date(p.pay_period_start).getFullYear()
      return year.toString() === selectedYear.value
    })
  }
  
  // Filter by month
  if (selectedMonth.value) {
    filtered = filtered.filter(p => {
      const month = new Date(p.pay_period_start).getMonth() + 1
      return month.toString().padStart(2, '0') === selectedMonth.value
    })
  }
  
  return filtered
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getInitials = (name) => {
  if (!name || name === 'N/A') return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    newPayslip.value.file = file
  }
}

const handleSearch = () => {
  // Search is handled by computed property
}

const handleFilterChange = () => {
  // Filtering is handled by computed property
}

const loadData = async () => {
  // For employees, auto-load their payslips
  if (isEmployee.value) {
    // Get employee_id from user or route
    const employeeId = user.value?.employee_id || route.query.employee_id || null
    if (employeeId) {
      await payslipsStore.fetchEmployeePayslips(employeeId)
    } else {
      // If no employee_id, try to fetch all (might be filtered by backend)
      await payslipsStore.fetchPayslips()
    }
  } else {
    // HR Admin view
    const employeeId = route.query.employee_id || selectedEmployeeId.value || null
    
    if (employeeId) {
      await payslipsStore.fetchEmployeePayslips(employeeId)
    } else {
      await payslipsStore.fetchPayslips()
    }

    // Load employees for dropdown (if can upload)
    if (canUpload.value) {
      await employeesStore.fetchEmployees({ per_page: 100 })
      employees.value = employeesStore.employees
    }
  }
}

const handleUpload = async () => {
  uploading.value = true
  
  try {
    await payslipsStore.uploadPayslip({
      employee_id: newPayslip.value.employee_id,
      pay_period_start: newPayslip.value.pay_period_start,
      pay_period_end: newPayslip.value.pay_period_end,
      file: newPayslip.value.file
    })
    
    showSuccess('Payslip uploaded successfully')
    showUploadModal.value = false
    
    // Reset form
    newPayslip.value = {
      employee_id: selectedEmployeeId.value || null,
      pay_period_start: '',
      pay_period_end: '',
      file: null
    }
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
    // Reload data
    await loadData()
  } catch (err) {
    showError(err.message || 'Failed to upload payslip')
  } finally {
    uploading.value = false
  }
}

const handleDownload = async (payslipId) => {
  try {
    await payslipsStore.downloadPayslip(payslipId)
    showSuccess('Payslip downloaded successfully')
  } catch (err) {
    showError(err.message || 'Failed to download payslip')
  }
}

const handleDelete = async (payslipId) => {
  if (!confirm('Are you sure you want to delete this payslip?')) {
    return
  }

  try {
    await payslipsStore.deletePayslip(payslipId)
    showSuccess('Payslip deleted successfully')
    await loadData()
  } catch (err) {
    showError(err.message || 'Failed to delete payslip')
  }
}

onMounted(() => {
  // Check if employee_id is in query params
  if (route.query.employee_id) {
    selectedEmployeeId.value = parseInt(route.query.employee_id)
  }
  loadData()
})
</script>
