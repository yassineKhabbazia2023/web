import { ref } from 'vue'
import { defineStore } from 'pinia'

// Controls the single, hoisted DocumentsConsultDrawer instance. The drawer shows the
// same unified document list everywhere, so its open state is shared, not per-card.
export const useDocumentsConsultDrawerStore = defineStore('documents-consult-drawer', () => {
  const isOpen = ref(false)

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  return { isOpen, open, close }
})
