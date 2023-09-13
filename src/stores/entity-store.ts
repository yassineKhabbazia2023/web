import { defineStore } from 'pinia'
import { commonApi } from '@kpmg/common'
import { ref } from 'vue'

export const useEntityStore = defineStore('entity', () => {
  const entities = ref<any>([])

  async function getEntities() {
    try {
      const response = await commonApi().customers.get(
        'accounts'
      )
      if (response.data !== undefined && response.data.length > 0) {
        entities.value = response.data
          .filter(function(el : any) { return el.accountNumber !== '' })
          .slice(0, 15)
      }
    } catch (error) {
      console.log('error fetching entities from portal', error)
      return error
    }
  }

  return { entities, getEntities }
})
