<template>
  <div class="p-4">
    <h2 class="text-lg font-semibold mb-3">👥 Contact Visibility Example</h2>

    <div v-if="record">
      <p><strong>Contact Name:</strong> {{ record.name }}</p>
      <p><strong>Owner:</strong> {{ record.owner?.name || '—' }}</p>
      <p v-if="record.team"><strong>Team:</strong> {{ record.team.name }}</p>
      <p><strong>Tenant:</strong> {{ record.tenant_id }}</p>
    </div>

    <hr class="my-3" />

    <p>
      <strong>Who Can See This Contact?</strong>
    </p>
    <ul>
      <li>✅ The owner of this record (owner_id = current user)</li>
      <li>✅ Any user in the same team (team_id = current user.team_id)</li>
      <li>✅ Any admin user within the same tenant</li>
      <li>❌ Users in other teams (different team_id)</li>
      <li>❌ Users in other tenants (different tenant_id)</li>
    </ul>

    <div class="mt-3">
      <BaseButton v-if="canEdit(record)" @click="editRecord">Edit</BaseButton>
      <BaseButton v-if="canDelete(record)" @click="deleteRecord">Delete</BaseButton>
      <BaseButton v-else disabled>View Only</BaseButton>
    </div>

    <hr class="my-3" />

    <h3 class="text-md font-semibold">Team-aware User Dropdown</h3>
    <select v-model="selectedUser" class="border rounded p-2">
      <option disabled value="">Select user</option>
      <option v-for="user in filteredUsers" :key="user.id" :value="user.id">
        {{ user.name }}
      </option>
    </select>

    <p class="mt-2 text-sm text-gray-500">
      (Dropdown shows users only from same tenant & team)
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useContext } from '@/composables/useContext'
import { usePermission } from '@/composables/usePermission'
import api from '@/services/api'

// Dummy record to simulate a contact loaded from API
const record = ref({
  id: 1,
  name: 'John Doe',
  owner_id: 2,
  tenant_id: 1,
  team_id: 3,
  owner: { id: 2, name: 'Alice Smith' },
  team: { id: 3, name: 'Sales Team' },
})

const { canEdit, canDelete } = usePermission()
const { tenantId, teamId, isAdmin } = useContext()

const users = ref([])
const selectedUser = ref('')

// Example of dynamic dropdown filtered by tenant/team
onMounted(async () => {
  try {
    const params = isAdmin.value
      ? { tenant_id: tenantId.value }
      : { tenant_id: tenantId.value, team_id: teamId.value }

    const { data } = await api.get('/users', { params })
    users.value = data || []
  } catch (err) {
    console.error('Dropdown load error:', err)
  }
})

const filteredUsers = computed(() => users.value)
const editRecord = () => alert('Edit record logic triggered')
const deleteRecord = () => alert('Delete record logic triggered')
</script>

<style scoped>
ul {
  list-style-type: disc;
  margin-left: 1.5rem;
}
</style>
