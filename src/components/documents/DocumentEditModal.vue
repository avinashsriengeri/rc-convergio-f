<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Edit Document
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Update document metadata and settings.
                  </p>
                </div>

                <!-- Document Info -->
                <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                        {{ helpers.getFileTypeIcon(document.file_type) }}
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ document.file_name }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ helpers.formatFileSize(document.file_size) }} • {{ document.file_type?.toUpperCase() }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Form Fields -->
                <div class="mt-6 space-y-4">
                  <!-- Title -->
                  <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      v-model="form.title"
                      type="text"
                      id="title"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter document title"
                    />
                  </div>

                  <!-- Description -->
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      v-model="form.description"
                      id="description"
                      rows="3"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter document description (optional)"
                    />
                  </div>

                  <!-- Visibility -->
                  <div>
                    <label for="visibility" class="block text-sm font-medium text-gray-700">
                      Visibility
                    </label>
                    <select
                      v-model="form.visibility"
                      id="visibility"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="private">Private</option>
                      <option value="team">Team</option>
                      <option value="tenant">Tenant</option>
                      <option value="public">Public</option>
                    </select>
                  </div>

                  <!-- Owner (if admin) -->
                  <div v-if="isAdmin">
                    <label for="owner_id" class="block text-sm font-medium text-gray-700">
                      Owner
                    </label>
                    <select
                      v-model="form.owner_id"
                      id="owner_id"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select owner</option>
                      <option v-for="user in users" :key="user.id" :value="user.id">
                        {{ user.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <BaseButton
              type="submit"
              :loading="loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Update
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              @click="$emit('close')"
              :disabled="loading"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useDocuments } from '@/composables/useDocuments'
import { useContext } from '@/composables/useContext'
import { fetchUsersForDropdown } from '@/helpers/fetchUsersForDropdown'
import BaseButton from '@/components/ui/BaseButton.vue'

// Props
const props = defineProps({
  document: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close', 'updated'])

// Composables
const { updateDocument, helpers } = useDocuments()
const { isAdmin } = useContext()

// State
const loading = ref(false)
const users = ref([])

const form = ref({
  title: '',
  description: '',
  visibility: 'private',
  owner_id: ''
})

// Methods
const handleSubmit = async () => {
  try {
    loading.value = true

    const response = await updateDocument(props.document.id, form.value)
    emit('updated', response.data)
  } catch (error) {
    console.error('Update error:', error)
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  if (isAdmin.value) {
    try {
      users.value = await fetchUsersForDropdown()
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }
}

const initializeForm = () => {
  form.value = {
    title: props.document.title || '',
    description: props.document.description || '',
    visibility: props.document.visibility || 'private',
    owner_id: props.document.owner_id || ''
  }
}

// Lifecycle
onMounted(() => {
  loadUsers()
  initializeForm()
})

// Watchers
watch(() => props.document, () => {
  initializeForm()
}, { immediate: true })
</script>

<script>
export default {
  name: 'DocumentEditModal'
}
</script>
