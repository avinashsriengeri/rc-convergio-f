    <template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="handleClose">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white mb-10" @click.stop>
      <div class="mt-3">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? 'Edit Post' : 'Create New Post' }}
          </h3>
          <button @click="handleClose" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Platform Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Platform <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                v-for="platform in platforms"
                :key="platform.value"
                type="button"
                @click="formData.platform = platform.value"
                :disabled="!isConnected(platform.value)"
                :class="[
                  'flex items-center justify-center px-4 py-3 border-2 rounded-lg transition-all',
                  formData.platform === platform.value
                    ? 'border-blue-500 bg-blue-50'
                    : isConnected(platform.value)
                    ? 'border-gray-300 hover:border-gray-400 bg-white'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                ]"
              >
                <i :class="[platform.icon, 'text-xl mr-2']"></i>
                <span class="text-sm font-medium">{{ platform.label }}</span>
              </button>
            </div>
            <p v-if="!hasConnectedAccounts" class="mt-2 text-sm text-amber-600">
              ⚠️ Please connect at least one social media account first
            </p>
          </div>

          <!-- Post Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.title"
              type="text"
              required
              maxlength="100"
              placeholder="Enter post title..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="mt-1 text-xs text-gray-500">{{ formData.title.length }}/100 characters</p>
          </div>

          <!-- Post Content -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Content <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.content"
              rows="6"
              required
              :maxlength="getMaxContentLength()"
              placeholder="Write your post content here..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">
              {{ formData.content.length }}/{{ getMaxContentLength() }} characters
              <span v-if="formData.platform" class="ml-2 text-blue-600">
                ({{ getPlatformName() }} limit)
              </span>
            </p>
          </div>

          <!-- Media Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Media (Images/Videos)
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div class="mt-2">
                  <label class="cursor-pointer">
                    <span class="text-blue-600 hover:text-blue-700 font-medium">Upload files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      class="hidden"
                      @change="handleFileUpload"
                    />
                  </label>
                  <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF, MP4 up to 10MB</p>
                </div>
              </div>

              <!-- Preview uploaded media -->
              <div v-if="formData.media_urls && formData.media_urls.length > 0" class="mt-4 grid grid-cols-3 gap-3">
                <div
                  v-for="(url, index) in formData.media_urls"
                  :key="index"
                  class="relative group"
                >
                  <img
                    :src="url"
                    alt="Uploaded media"
                    class="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    @click="removeMedia(index)"
                    class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Hashtags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hashtags
            </label>
            <input
              v-model="hashtagsInput"
              type="text"
              placeholder="marketing, socialmedia, business (comma-separated)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div v-if="parsedHashtags.length > 0" class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="(tag, index) in parsedHashtags"
                :key="index"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
              >
                #{{ tag }}
                <button
                  type="button"
                  @click="removeHashtag(index)"
                  class="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            </div>
          </div>

          <!-- Mentions -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mentions
            </label>
            <input
              v-model="mentionsInput"
              type="text"
              placeholder="@username1, @username2 (comma-separated)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Schedule Options -->
          <div class="border-t border-gray-200 pt-4">
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-medium text-gray-700">
                Publishing Options
              </label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="publishOption"
                    value="now"
                    class="mr-2"
                  />
                  <span class="text-sm text-gray-700">Publish Now</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="publishOption"
                    value="schedule"
                    class="mr-2"
                  />
                  <span class="text-sm text-gray-700">Schedule</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="publishOption"
                    value="draft"
                    class="mr-2"
                  />
                  <span class="text-sm text-gray-700">Save as Draft</span>
                </label>
              </div>
            </div>

            <!-- Schedule DateTime Picker -->
            <div v-if="publishOption === 'schedule'" class="mt-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Schedule Date & Time <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.scheduled_at"
                type="datetime-local"
                :min="minDateTime"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="handleClose"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading || !formData.platform"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ getSubmitButtonText() }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSocialMediaStore } from '@/stores/socialMedia'
import { success as showSuccess, error as showError } from '@/utils/notifications'

interface Props {
  show: boolean
  post?: any
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  post: null
})

const emit = defineEmits(['close', 'saved'])

const socialMediaStore = useSocialMediaStore()

// State
const loading = ref(false)
const publishOption = ref<'now' | 'schedule' | 'draft'>('draft')
const hashtagsInput = ref('')
const mentionsInput = ref('')

const formData = ref({
  title: '',
  content: '',
  platform: '',
  scheduled_at: '',
  media_urls: [] as string[],
  hashtags: [] as string[],
  mentions: [] as string[]
})

const platforms = [
  { value: 'facebook', label: 'Facebook', icon: 'fab fa-facebook text-blue-600', maxLength: 63206 },
  { value: 'twitter', label: 'Twitter', icon: 'fab fa-twitter text-sky-600', maxLength: 280 },
  { value: 'instagram', label: 'Instagram', icon: 'fab fa-instagram text-pink-600', maxLength: 2200 },
  { value: 'linkedin', label: 'LinkedIn', icon: 'fab fa-linkedin text-blue-700', maxLength: 3000 }
]

// Computed
const isEdit = computed(() => !!props.post)

const hasConnectedAccounts = computed(() => {
  // Allow all platforms for now (remove this check if causing issues)
  return true
  // return socialMediaStore.connectedAccounts.length > 0
})

const isConnected = (platform: string) => {
  // Allow all platforms for now (remove this check if causing issues)
  return true
  // return socialMediaStore.isConnected(platform)
}

const parsedHashtags = computed(() => {
  return hashtagsInput.value
    ? hashtagsInput.value.split(',').map(tag => tag.trim().replace(/^#/, '')).filter(tag => tag)
    : []
})

const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 5) // Minimum 5 minutes in the future
  return now.toISOString().slice(0, 16)
})

// Methods
const getMaxContentLength = () => {
  const platform = platforms.find(p => p.value === formData.value.platform)
  return platform?.maxLength || 3000
}

const getPlatformName = () => {
  const platform = platforms.find(p => p.value === formData.value.platform)
  return platform?.label || 'Selected platform'
}

const getSubmitButtonText = () => {
  if (loading.value) return 'Saving...'
  if (isEdit.value) return 'Update Post'
  if (publishOption.value === 'now') return 'Publish Now'
  if (publishOption.value === 'schedule') return 'Schedule Post'
  return 'Save Draft'
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0) return

  // Simulate file upload (in production, upload to server)
  Array.from(files).forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        formData.value.media_urls.push(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  })

  showSuccess(`${files.length} file(s) uploaded successfully`)
}

const removeMedia = (index: number) => {
  formData.value.media_urls.splice(index, 1)
}

const removeHashtag = (index: number) => {
  const tags = hashtagsInput.value.split(',').map(t => t.trim()).filter(t => t)
  tags.splice(index, 1)
  hashtagsInput.value = tags.join(', ')
}

const handleSubmit = async () => {
  if (!formData.value.platform) {
    showError('Please select a platform')
    return
  }

  // Validate schedule date if scheduling
  if (publishOption.value === 'schedule' && !formData.value.scheduled_at) {
    showError('Please select a schedule date and time')
    return
  }

  loading.value = true

  try {
    // Prepare post data
    const postData: any = {
      title: formData.value.title,
      content: formData.value.content,
      platform: formData.value.platform,
      hashtags: parsedHashtags.value,
      mentions: mentionsInput.value
        ? mentionsInput.value.split(',').map(m => m.trim().replace(/^@/, '')).filter(m => m)
        : [],
      media_urls: formData.value.media_urls
    }

    // Add scheduled_at only if scheduling
    if (publishOption.value === 'schedule') {
      postData.scheduled_at = formData.value.scheduled_at
    }

    // Debug: Log the data being sent
    console.log('📤 Sending post data to backend:', postData)

    // Handle different publish options
    if (isEdit.value) {
      // Update existing post
      await socialMediaStore.updatePost(props.post.id, postData)
      showSuccess('Post updated successfully!')
    } else {
      // Create new post
      const response = await socialMediaStore.createPost(postData)
      
      // If publish now, call publish API immediately after creation
      if (publishOption.value === 'now' && response.data?.id) {
        await socialMediaStore.publishPost(response.data.id)
        showSuccess('Post published successfully!')
      } else if (publishOption.value === 'schedule') {
        showSuccess('Post scheduled successfully!')
      } else {
        showSuccess('Post saved as draft!')
      }
    }

    emit('saved')
    handleClose()
  } catch (error: any) {
    console.error('Failed to save post:', error)
    
    // Show detailed validation errors from backend
    if (error.response?.status === 422 && error.response?.data?.errors) {
      const errors = error.response.data.errors
      const errorMessages = Object.keys(errors).map(key => `${key}: ${errors[key].join(', ')}`).join('\n')
      showError(`Validation Error:\n${errorMessages}`)
      console.error('Validation errors:', errors)
    } else if (error.response?.data?.message) {
      showError(error.response.data.message)
    } else {
      showError(error.message || 'Failed to save post')
    }
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  // Reset form
  formData.value = {
    title: '',
    content: '',
    platform: '',
    scheduled_at: '',
    media_urls: [],
    hashtags: [],
    mentions: []
  }
  hashtagsInput.value = ''
  mentionsInput.value = ''
  publishOption.value = 'draft'
  
  emit('close')
}

// Watch for post prop changes (edit mode)
watch(() => props.post, (newPost) => {
  if (newPost) {
    formData.value = {
      title: newPost.title || '',
      content: newPost.content || '',
      platform: newPost.platform || '',
      scheduled_at: newPost.scheduled_at ? newPost.scheduled_at.slice(0, 16) : '',
      media_urls: newPost.media_urls || [],
      hashtags: newPost.hashtags || [],
      mentions: newPost.mentions || []
    }
    hashtagsInput.value = newPost.hashtags ? newPost.hashtags.join(', ') : ''
    mentionsInput.value = newPost.mentions ? newPost.mentions.map((m: string) => '@' + m).join(', ') : ''
    publishOption.value = newPost.scheduled_at ? 'schedule' : 'draft'
  }
}, { immediate: true })
</script>
    