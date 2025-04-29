import { defineStore, getActivePinia } from 'pinia'

export const resetAllStores = () => {
  const pinia = getActivePinia()
  if (pinia) {
    Object.entries(pinia.state.value).forEach(([storeName, state]) => {
      const storeDefinition = defineStore(storeName, state)
      const store = storeDefinition(pinia)
      if (store && 'reset' in store) {
        (store as any).reset()
      }
    })
  }
}