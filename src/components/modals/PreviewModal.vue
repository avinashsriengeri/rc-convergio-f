<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            Template Preview: {{ template.name }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Preview Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <div class="bg-gray-50 rounded-lg p-8">
          <!-- Mock Quote Preview -->
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <!-- Header -->
            <div class="bg-blue-600 text-white px-6 py-4">
              <div class="flex justify-between items-center">
                <div>
                  <h1 class="text-2xl font-bold">Quote #Q-2025-0001</h1>
                  <p class="text-blue-100">{{ template.layout }} Layout Template</p>
                </div>
                <div class="text-right">
                  <p class="text-blue-100">Valid until: Dec 31, 2025</p>
                </div>
              </div>
            </div>

            <!-- Client Info -->
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
              <div class="text-gray-700">
                <p class="font-medium">Acme Corporation</p>
                <p>123 Business St, Suite 100</p>
                <p>New York, NY 10001</p>
                <p>contact@acme.com</p>
              </div>
            </div>

            <!-- Line Items -->
            <div class="px-6 py-4">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Item</th>
                    <th class="px-4 py-2 text-center text-sm font-medium text-gray-700">Qty</th>
                    <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">Unit Price</th>
                    <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr>
                    <td class="px-4 py-2 text-sm text-gray-900">Web Development Service</td>
                    <td class="px-4 py-2 text-center text-sm text-gray-900">1</td>
                    <td class="px-4 py-2 text-right text-sm text-gray-900">$5,000.00</td>
                    <td class="px-4 py-2 text-right text-sm text-gray-900">$5,000.00</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 text-sm text-gray-900">Design Consultation</td>
                    <td class="px-4 py-2 text-center text-sm text-gray-900">2</td>
                    <td class="px-4 py-2 text-right text-sm text-gray-900">$500.00</td>
                    <td class="px-4 py-2 text-right text-sm text-gray-900">$1,000.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Totals -->
            <div class="px-6 py-4 bg-gray-50">
              <div class="flex justify-end">
                <div class="w-64 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Subtotal:</span>
                    <span class="font-medium">$6,000.00</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Tax (10%):</span>
                    <span class="font-medium">$600.00</span>
                  </div>
                  <div class="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                    <span>Total:</span>
                    <span>$6,600.00</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-200">
              <div class="text-center text-sm text-gray-500">
                <p>Thank you for your business!</p>
                <p class="mt-1">Generated with {{ template.layout }} template</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-end space-x-3">
          <BaseButton
            variant="outline"
            @click="$emit('close')"
          >
            Close
          </BaseButton>
          <BaseButton
            variant="primary"
            @click="downloadPreview"
          >
            Download Sample PDF
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  template: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const downloadPreview = () => {
  // TODO: Implement sample PDF download
  console.log('Download sample PDF for template:', props.template.name)
}
</script>





