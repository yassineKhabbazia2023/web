import { defineStore } from 'pinia'
import { commonApi } from '@kpmg/common'
import { computed, ref } from 'vue'

const tableEntitiesStore = defineStore('counter', () => {
  const portalEntitiesResponse = ref<{
    '@odata.context': string
    value: any
  }>({
    '@odata.context': '',
    value: []
  })

  const entities = computed(() => portalEntitiesResponse.value.value || [])

  async function getEntities() {
    try {
      const response = await commonApi().portal.get(
        'GetAccountFromContact?$filter=TypeIbs%20eq%200%20or%20TypeIbs%20eq%201&top=-1'
      )
      portalEntitiesResponse.value = response.data
    } catch (error) {
      console.log('error fetching entities from portal', error)
      return error
    }
  }

  return { entities, getEntities, portalEntitiesResponse }
})

export default tableEntitiesStore
