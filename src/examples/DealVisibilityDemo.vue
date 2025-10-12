<template>
  <div class="p-4">
    <h2 class="text-lg font-semibold mb-3">💼 Deal Visibility Example</h2>

    <div v-if="deal">
      <p><strong>Deal Title:</strong> {{ deal.title }}</p>
      <p><strong>Owner:</strong> {{ deal.owner?.name || '—' }}</p>
      <p v-if="deal.team"><strong>Team:</strong> {{ deal.team.name }}</p>
      <p><strong>Tenant:</strong> {{ deal.tenant_id }}</p>
    </div>

    <hr class="my-3" />
    <p>
      <strong>Who Can See/Edit This Deal?</strong>
    </p>
    <ul>
      <li>✅ Owner of the deal</li>
      <li>✅ Any user in the same team (team_id match)</li>
      <li>✅ Admin in same tenant</li>
      <li>❌ Other teams or tenants cannot view/edit</li>
    </ul>

    <div class="mt-3">
      <BaseButton v-if="canEdit(deal)" @click="editDeal">Edit</BaseButton>
      <BaseButton v-if="canDelete(deal)" @click="deleteDeal">Delete</BaseButton>
    </div>

    <hr class="my-3" />
    <h3 class="text-md font-semibold">Owner Selection (Team Filtered)</h3>
    <select v-model="selectedOwner" class="border rounded p-2">
      <option disabled value="">Select owner</option>
      <option v-for="user in teamUsers" :key="user.id" :value="user.id">
        {{ user.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useContext } from '@/composables/useContext'
import { usePermission } from '@/composables/usePermission'
import api from '@/services/api'

const deal = ref({
  id: 100,
  title: 'Enterprise Deal with ABC Corp',
  owner_id: 5,
  tenant_id: 1,
  team_id: 2,
  owner: { id: 5, name: 'David Jones' },
  team: { id: 2, name: 'Marketing Team' },
})

const { canEdit, canDelete } = usePermission()
const { tenantId, teamId, isAdmin } = useContext()

const teamUsers = ref([])
const selectedOwner = ref('')

onMounted(async () => {
  const params = isAdmin.value
    ? { tenant_id: tenantId.value }
    : { tenant_id: tenantId.value, team_id: teamId.value }

  const { data } = await api.get('/users', { params })
  teamUsers.value = data || []
})

const editDeal = () => alert('Deal edit triggered')
const deleteDeal = () => alert('Deal delete triggered')
</script>

<style scoped>
ul {
  list-style-type: disc;
  margin-left: 1.5rem;
}
</style>
