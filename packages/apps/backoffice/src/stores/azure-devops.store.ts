import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAzureDevOpsStore = defineStore('azure-devops', () => {
  const pat = ref<string>('')

  const hasPat = computed(() => pat.value.length > 0)

  const setPat = (value: string) => {
    pat.value = value
  }

  return {
    pat,
    hasPat,
    setPat,
  }
})
