<template>
  <div class="reporting-structure-chart">
    <!-- Hierarchy Chain (Top to Bottom) -->
    <div class="flex flex-col items-center space-y-4 py-4">
      <!-- Manager's Manager (if exists) -->
      <div v-if="managerChain.length > 1" class="flex flex-col items-center">
        <div class="employee-card">
          <div class="relative">
            <img
              v-if="managerChain[1]?.profile_picture?.url"
              :src="managerChain[1].profile_picture.url"
              :alt="managerChain[1].full_name"
              class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div v-else class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-purple to-primary-pink flex items-center justify-center border-4 border-white shadow-lg">
              <span class="text-white text-xl font-bold">
                {{ getInitials(managerChain[1]?.full_name) }}
              </span>
            </div>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div class="mt-3 text-center">
            <p class="font-semibold text-gray-900 text-sm">{{ managerChain[1]?.full_name || 'N/A' }}</p>
            <p class="text-xs text-gray-600 mt-1">{{ managerChain[1]?.job_title || managerChain[1]?.designation_detail?.name || 'Manager' }}</p>
            <span v-if="managerChain[1]?.department_detail || managerChain[1]?.department" class="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {{ managerChain[1]?.department_detail?.name || managerChain[1]?.department }}
            </span>
          </div>
        </div>
        <!-- Connecting Line -->
        <div class="w-0.5 h-8 bg-gradient-to-b from-primary-purple to-primary-purple opacity-30"></div>
      </div>

      <!-- Direct Manager -->
      <div v-if="managerChain.length > 0" class="flex flex-col items-center">
        <div class="employee-card">
          <div class="relative">
            <img
              v-if="managerChain[0]?.profile_picture?.url"
              :src="managerChain[0].profile_picture.url"
              :alt="managerChain[0].full_name"
              class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div v-else class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-purple to-primary-pink flex items-center justify-center border-4 border-white shadow-lg">
              <span class="text-white text-xl font-bold">
                {{ getInitials(managerChain[0]?.full_name) }}
              </span>
            </div>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div class="mt-3 text-center">
            <p class="font-semibold text-gray-900 text-sm">{{ managerChain[0]?.full_name || 'N/A' }}</p>
            <p class="text-xs text-gray-600 mt-1">{{ managerChain[0]?.job_title || managerChain[0]?.designation_detail?.name || 'Manager' }}</p>
            <span v-if="managerChain[0]?.department_detail || managerChain[0]?.department" class="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {{ managerChain[0]?.department_detail?.name || managerChain[0]?.department }}
            </span>
          </div>
        </div>
        <!-- Connecting Line -->
        <div class="w-0.5 h-8 bg-gradient-to-b from-primary-purple to-primary-purple opacity-30"></div>
      </div>

      <!-- Current Employee (Highlighted) -->
      <div class="flex flex-col items-center">
        <div class="employee-card current-employee">
          <div class="relative">
            <img
              v-if="employee.profile_picture?.url"
              :src="employee.profile_picture.url"
              :alt="employee.full_name"
              class="w-24 h-24 rounded-full object-cover border-4 border-primary-purple shadow-xl"
            />
            <div v-else class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-purple to-primary-pink flex items-center justify-center border-4 border-primary-purple shadow-xl">
              <span class="text-white text-2xl font-bold">
                {{ getInitials(employee.full_name) }}
              </span>
            </div>
            <div class="absolute -top-1 -right-1 w-5 h-5 bg-primary-purple rounded-full border-2 border-white flex items-center justify-center">
              <span class="text-white text-xs font-bold">YOU</span>
            </div>
          </div>
          <div class="mt-3 text-center">
            <p class="font-bold text-gray-900">{{ employee.full_name }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ employee.designation_detail?.name || employee.job_title || 'Employee' }}</p>
            <span v-if="employee.department_detail || employee.department" class="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-primary-purple text-white">
              {{ employee.department_detail?.name || employee.department }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Info (if no manager, show message) -->
    <div v-if="managerChain.length === 0" class="mt-6 pt-6 border-t border-gray-200 text-center">
      <div class="flex flex-col items-center">
        <div class="employee-card current-employee">
          <div class="relative">
            <img
              v-if="employee.profile_picture?.url"
              :src="employee.profile_picture.url"
              :alt="employee.full_name"
              class="w-24 h-24 rounded-full object-cover border-4 border-primary-purple shadow-xl"
            />
            <div v-else class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-purple to-primary-pink flex items-center justify-center border-4 border-primary-purple shadow-xl">
              <span class="text-white text-2xl font-bold">
                {{ getInitials(employee.full_name) }}
              </span>
            </div>
            <div class="absolute -top-1 -right-1 w-5 h-5 bg-primary-purple rounded-full border-2 border-white flex items-center justify-center">
              <span class="text-white text-xs font-bold">YOU</span>
            </div>
          </div>
          <div class="mt-3 text-center">
            <p class="font-bold text-gray-900">{{ employee.full_name }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ employee.designation_detail?.name || employee.job_title || 'Employee' }}</p>
            <span v-if="employee.department_detail || employee.department" class="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-primary-purple text-white">
              {{ employee.department_detail?.name || employee.department }}
            </span>
          </div>
        </div>
        <p class="mt-4 text-sm text-gray-500">No manager assigned</p>
      </div>
    </div>

    <!-- Team and User Account Info -->
    <div v-if="employee.team || employee.user" class="mt-6 pt-6 border-t border-gray-200 space-y-3">
      <div v-if="employee.team" class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-700">Team:</span>
        <span class="text-sm text-gray-900">{{ employee.team.name }}</span>
      </div>
      <div v-if="employee.user" class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-700">User Account:</span>
        <span class="text-sm text-gray-900">
          {{ employee.user.name }}
          <span class="text-gray-500">({{ employee.user.email }})</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  employee: {
    type: Object,
    required: true
  }
})

const getInitials = (name) => {
  if (!name) return 'N/A'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Build manager chain (up to 2 levels: direct manager and manager's manager)
const managerChain = computed(() => {
  const chain = []
  
  // Direct manager
  if (props.employee.manager) {
    // Manager's manager (if available in the response) - goes first (top level)
    if (props.employee.manager.manager) {
      chain.push(props.employee.manager.manager)
    }
    // Direct manager - goes second (middle level)
    chain.push(props.employee.manager)
  }
  
  return chain // Already in correct order: top to bottom
})
</script>

<style scoped>
.reporting-structure-chart {
  @apply w-full;
}

.employee-card {
  @apply bg-white rounded-xl shadow-md border-2 border-gray-200 p-4 min-w-[180px] max-w-[220px] transition-all duration-300 hover:shadow-lg hover:scale-105;
}

.current-employee {
  @apply border-primary-purple bg-gradient-to-br from-primary-purple/5 to-primary-pink/5;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .employee-card {
    @apply min-w-full max-w-full;
  }
}
</style>

