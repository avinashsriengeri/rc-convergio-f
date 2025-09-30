<template>
  <div class="flex h-full">
    <!-- Canvas Area -->
    <div
      ref="canvasRef"
      class="relative flex-1 bg-gray-50 overflow-hidden"
      @mousedown="onCanvasMouseDown"
      @mousemove="onCanvasMouseMove"
      @mouseup="onCanvasMouseUp"
      @wheel.prevent="onWheel"
    >
      <div
        class="absolute origin-top-left"
        :style="canvasTransformStyle"
        @mousedown.self="startPan"
      >
        <!-- Edges -->
        <svg class="absolute top-0 left-0 pointer-events-none" :width="canvasSize.width" :height="canvasSize.height">
          <g>
            <path
              v-for="edge in edges"
              :key="edge.id"
              :d="edgePath(edge)"
              class="stroke-blue-400"
              stroke-width="2"
              fill="none"
              marker-end="url(#arrowhead)"
            />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" class="fill-blue-400" />
              </marker>
            </defs>
          </g>
        </svg>

        <!-- Nodes -->
        <div
          v-for="node in nodes"
          :key="node.id"
          class="absolute select-none"
          :style="{ left: node.position.x + 'px', top: node.position.y + 'px' }"
          @mousedown.stop="startDrag(node, $event)"
          @click.stop="selectNode(node)"
        >
          <div :class="['w-64 rounded-lg shadow border', isInvalid(node.id) ? 'border-red-400' : 'border-gray-200', selectedNodeId === node.id ? 'ring-2 ring-blue-400' : '']" class="bg-white">
            <div class="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div class="text-sm font-semibold text-gray-900">{{ node.label || 'Step' }}</div>
              <div class="flex items-center space-x-2">
                <button class="text-xs text-blue-600 hover:underline" @click.stop="beginConnect(node)">Connect</button>
                <button class="text-xs text-red-600 hover:underline" @click.stop="removeNode(node.id)">Remove</button>
              </div>
            </div>
            <div class="p-3 space-y-2">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Event</label>
                <select v-model="node.eventId" class="w-full px-2 py-1 border border-gray-300 rounded">
                  <option value="">Select event</option>
                  <option v-for="evt in eventOptions" :key="evt.id" :value="evt.id">{{ evt.name || evt.title || ('Event #' + evt.id) }}</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Operator</label>
                  <select v-model="node.operator" class="w-full px-2 py-1 border border-gray-300 rounded">
                    <option v-for="op in operators" :key="op" :value="op">{{ op }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Score</label>
                  <input type="number" v-model.number="node.score" class="w-full px-2 py-1 border border-gray-300 rounded" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Value</label>
                <input type="text" v-model="node.value" class="w-full px-2 py-1 border border-gray-300 rounded" />
              </div>
            </div>
          </div>
        </div>

        <!-- Temp connecting preview line -->
        <svg v-if="connecting.fromNodeId && tempMousePos" class="absolute top-0 left-0 pointer-events-none" :width="canvasSize.width" :height="canvasSize.height">
          <path :d="tempConnectPath" class="stroke-blue-300" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />
        </svg>
      </div>
    </div>

    <!-- Sidebar / Tools -->
    <div class="w-80 border-l border-gray-200 bg-white flex flex-col">
      <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div class="font-semibold">Properties</div>
        <div class="text-xs text-gray-500">Zoom: {{ (scale*100).toFixed(0) }}%</div>
      </div>

      <div class="p-4 space-y-3 overflow-auto">
        <div class="flex space-x-2">
          <button class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded" @click="addNodeAtCenter">Add Node</button>
          <button class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded" @click="resetView">Reset View</button>
        </div>

        <div v-if="selectedNode" class="space-y-2">
          <div class="text-sm font-medium text-gray-900">Selected: {{ selectedNode.label || selectedNode.id }}</div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Label</label>
            <input v-model="selectedNode.label" class="w-full px-2 py-1 border border-gray-300 rounded" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">X</label>
              <input type="number" v-model.number="selectedNode.position.x" class="w-full px-2 py-1 border border-gray-300 rounded" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Y</label>
              <input type="number" v-model.number="selectedNode.position.y" class="w-full px-2 py-1 border border-gray-300 rounded" />
            </div>
          </div>
        </div>

        <div class="pt-2 border-t">
          <button :disabled="saving" class="w-full px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded" @click="saveNow">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
          <button :disabled="simulating" class="w-full mt-2 px-3 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 rounded" @click="simulate">
            {{ simulating ? 'Simulating...' : 'Simulate' }}
          </button>
          <div v-if="simulationError" class="mt-2 text-xs text-red-600">{{ simulationError }}</div>
        </div>

        <div v-if="simulationResults" class="mt-4">
          <div class="text-sm font-medium mb-2">Simulation Results</div>
          <!-- Simple chart replacement (bar list) -->
          <div class="space-y-2">
            <div v-for="(v, k) in simulationResults.metrics" :key="k" class="flex items-center space-x-2">
              <div class="w-24 text-xs text-gray-600">{{ k }}</div>
              <div class="flex-1 h-3 bg-gray-100 rounded">
                <div class="h-3 bg-blue-500 rounded" :style="{ width: Math.min(100, v) + '%' }"></div>
              </div>
              <div class="w-10 text-right text-xs">{{ v }}%</div>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500">Note: Using a lightweight chart view. If you prefer a specific chart lib, let me know.</div>
        </div>

        <div v-if="saveError" class="text-xs text-red-600">{{ saveError }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, nextTick } from 'vue'
import { journeysService } from '@/services/journeys'
import { eventsService } from '@/services/events'

interface JourneyNode {
  id: string
  label?: string
  eventId?: number | string
  operator: string
  value: string
  score: number
  position: { x: number; y: number }
}

interface JourneyEdge {
  id: string
  from: string
  to: string
}

export default defineComponent({
  name: 'JourneyBuilder',
  props: {
    journeyId: { type: [String, Number], required: true }
  },
  setup(props) {
    const canvasRef = ref<HTMLElement | null>(null)
    const scale = ref(1)
    const offset = ref({ x: 0, y: 0 })
    const isPanning = ref(false)
    const panStart = ref({ x: 0, y: 0 })

    const nodes = ref<JourneyNode[]>([])
    const edges = ref<JourneyEdge[]>([])

    const selectedNodeId = ref<string | null>(null)
    const invalidNodeIds = ref<Set<string>>(new Set())

    const connecting = ref<{ fromNodeId: string | null }>({ fromNodeId: null })
    const tempMousePos = ref<{ x: number; y: number } | null>(null)

    const saving = ref(false)
    const saveError = ref('')
    const simulating = ref(false)
    const simulationResults = ref<any | null>(null)
    const simulationError = ref('')

    const eventOptions = ref<any[]>([])
    const operators = ['=', '!=', '>', '<', '>=', '<=', 'contains', 'not_contains', 'in', 'not_in']

    const canvasSize = ref({ width: 4000, height: 3000 })

    const canvasTransformStyle = computed(() => ({
      transform: `translate(${offset.value.x}px, ${offset.value.y}px) scale(${scale.value})`,
      width: canvasSize.value.width + 'px',
      height: canvasSize.value.height + 'px'
    }))

    const selectedNode = computed(() => nodes.value.find(n => n.id === selectedNodeId.value))

    const isInvalid = (id: string) => invalidNodeIds.value.has(id)

    function edgePath(edge: JourneyEdge) {
      const from = nodes.value.find(n => n.id === edge.from)
      const to = nodes.value.find(n => n.id === edge.to)
      if (!from || !to) return ''
      const x1 = from.position.x + 256
      const y1 = from.position.y + 40
      const x2 = to.position.x
      const y2 = to.position.y + 40
      const mx = (x1 + x2) / 2
      return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
    }

    const tempConnectPath = computed(() => {
      if (!connecting.value.fromNodeId || !tempMousePos.value) return ''
      const from = nodes.value.find(n => n.id === connecting.value.fromNodeId)
      if (!from) return ''
      const x1 = from.position.x + 256
      const y1 = from.position.y + 40
      const { x: x2, y: y2 } = tempMousePos.value
      const mx = (x1 + x2) / 2
      return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
    })

    function startPan(e: MouseEvent) {
      isPanning.value = true
      panStart.value = { x: e.clientX - offset.value.x, y: e.clientY - offset.value.y }
    }
    function onCanvasMouseDown(e: MouseEvent) {
      if ((e.target as HTMLElement).closest('.w-64')) return
      startPan(e)
    }
    function onCanvasMouseMove(e: MouseEvent) {
      if (isPanning.value) {
        offset.value = { x: e.clientX - panStart.value.x, y: e.clientY - panStart.value.y }
      }
      if (connecting.value.fromNodeId) {
        const rect = canvasRef.value?.getBoundingClientRect()
        const x = (e.clientX - (rect?.left || 0) - offset.value.x) / scale.value
        const y = (e.clientY - (rect?.top || 0) - offset.value.y) / scale.value
        tempMousePos.value = { x, y }
      }
    }
    function onCanvasMouseUp() {
      isPanning.value = false
    }
    function onWheel(e: WheelEvent) {
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      const next = Math.min(2, Math.max(0.2, scale.value + delta))
      scale.value = next
    }

    let dragState: { nodeId: string; dx: number; dy: number } | null = null
    function startDrag(node: JourneyNode, e: MouseEvent) {
      selectNode(node)
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const localX = (e.clientX - rect.left) / scale.value
      const localY = (e.clientY - rect.top) / scale.value
      dragState = { nodeId: node.id, dx: localX, dy: localY }
      window.addEventListener('mousemove', onDragMove)
      window.addEventListener('mouseup', endDrag)
    }
    function onDragMove(e: MouseEvent) {
      if (!dragState) return
      const rect = canvasRef.value?.getBoundingClientRect()
      const x = (e.clientX - (rect?.left || 0) - offset.value.x) / scale.value - dragState.dx
      const y = (e.clientY - (rect?.top || 0) - offset.value.y) / scale.value - dragState.dy
      const node = nodes.value.find(n => n.id === dragState!.nodeId)
      if (node) {
        node.position.x = Math.max(0, Math.min(canvasSize.value.width - 256, x))
        node.position.y = Math.max(0, Math.min(canvasSize.value.height - 80, y))
      }
    }
    function endDrag() {
      dragState = null
      window.removeEventListener('mousemove', onDragMove)
      window.removeEventListener('mouseup', endDrag)
    }

    function selectNode(node: JourneyNode) {
      selectedNodeId.value = node.id
    }

    function beginConnect(node: JourneyNode) {
      if (!connecting.value.fromNodeId) {
        connecting.value.fromNodeId = node.id
      } else if (connecting.value.fromNodeId !== node.id) {
        const id = `e_${connecting.value.fromNodeId}_${node.id}_${Date.now()}`
        edges.value.push({ id, from: connecting.value.fromNodeId, to: node.id })
        connecting.value.fromNodeId = null
        tempMousePos.value = null
      }
    }

    function removeNode(id: string) {
      nodes.value = nodes.value.filter(n => n.id !== id)
      edges.value = edges.value.filter(e => e.from !== id && e.to !== id)
      if (selectedNodeId.value === id) selectedNodeId.value = null
    }

    function addNodeAtCenter() {
      const id = `n_${Date.now()}`
      const host = canvasRef.value
      const rect = host?.getBoundingClientRect()
      const cx = ((rect?.width || 800) / 2 - offset.value.x) / scale.value
      const cy = ((rect?.height || 600) / 2 - offset.value.y) / scale.value
      nodes.value.push({ id, operator: '=', value: '', score: 0, position: { x: cx - 128, y: cy - 40 } })
      nextTick(() => selectNode(nodes.value[nodes.value.length - 1]))
    }

    function resetView() {
      scale.value = 1
      offset.value = { x: 0, y: 0 }
    }

    async function load() {
      // Load events for dropdown
      try {
        const res = await eventsService.getEvents({ limit: 100 })
        eventOptions.value = res?.data || []
      } catch (e) {
        eventOptions.value = []
      }

      // Load journey
      try {
        const data = await journeysService.getJourney(props.journeyId)
        const graph = (data?.data?.graph) || data?.data || {}
        nodes.value = (graph.nodes || []).map((n: any) => ({
          id: String(n.id),
          label: n.label,
          eventId: n.event_id,
          operator: n.operator || '=',
          value: n.value || '',
          score: Number(n.score || 0),
          position: n.position || { x: 100, y: 100 }
        }))
        edges.value = (graph.edges || []).map((e: any) => ({ id: String(e.id || `${e.from}_${e.to}`), from: String(e.from), to: String(e.to) }))
        if (!nodes.value.length) {
          addNodeAtCenter()
        }
      } catch (e) {
        // start with a blank
        nodes.value = []
        edges.value = []
        addNodeAtCenter()
      }
    }

    // Auto-save (debounced)
    let saveTimer: number | null = null
    watch([nodes, edges], () => {
      if (saveTimer) window.clearTimeout(saveTimer)
      saveTimer = window.setTimeout(() => save(), 800)
    }, { deep: true })

    async function save() {
      saving.value = true
      saveError.value = ''
      invalidNodeIds.value = new Set()
      try {
        const payload = {
          graph: {
            nodes: nodes.value.map(n => ({ id: n.id, label: n.label, event_id: n.eventId, operator: n.operator, value: n.value, score: n.score, position: n.position })),
            edges: edges.value.map(e => ({ id: e.id, from: e.from, to: e.to }))
          }
        }
        await journeysService.updateJourney(props.journeyId, payload)
      } catch (err: any) {
        if (err?.response?.status === 422) {
          const details = err.response.data?.errors || err.response.data
          // Expected format: { nodes: [{ id: 'n_...', field: 'value', message: '...' }], ... }
          if (details?.nodes?.length) {
            details.nodes.forEach((n: any) => invalidNodeIds.value.add(String(n.id)))
          }
          saveError.value = 'Validation error. Invalid fields highlighted.'
        } else {
          saveError.value = 'Failed to save changes.'
        }
      } finally {
        saving.value = false
      }
    }

    async function saveNow() {
      if (saving.value) return
      await save()
    }

    async function simulate() {
      simulating.value = true
      simulationError.value = ''
      simulationResults.value = null
      try {
        const res = await (journeysService as any).simulateJourney(props.journeyId)
        simulationResults.value = res?.data || { metrics: { completion: 0 } }
      } catch (err: any) {
        simulationError.value = err?.response?.data?.message || 'Simulation failed.'
      } finally {
        simulating.value = false
      }
    }

    onMounted(load)

    return {
      canvasRef,
      scale,
      offset,
      nodes,
      edges,
      selectedNodeId,
      selectedNode,
      connecting,
      tempMousePos,
      eventOptions,
      operators,
      canvasSize,
      canvasTransformStyle,
      onCanvasMouseDown,
      onCanvasMouseMove,
      onCanvasMouseUp,
      onWheel,
      startPan,
      startDrag,
      selectNode,
      beginConnect,
      removeNode,
      addNodeAtCenter,
      resetView,
      edgePath,
      tempConnectPath,
      isInvalid,
      saving,
      saveNow,
      saveError,
      simulate,
      simulating,
      simulationResults,
      simulationError
    }
  }
})
</script>

<style scoped>
.stroke-blue-400 { stroke: #60a5fa; }
.fill-blue-400 { fill: #60a5fa; }
</style>
