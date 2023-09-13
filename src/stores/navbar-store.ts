import { defineStore, storeToRefs } from 'pinia'
import { commonStore } from '@kpmg/common'
import { computed } from 'vue'

const useNavbarStore = defineStore('navbarStore', () => {
  const userStore = commonStore()
  const { user } = storeToRefs(userStore)

  const defaultEntity = computed(() => user.value?.activeEntity || getDefaultEntity())

  function getDefaultEntity(): any {
    const defaultEntity = localStorage.getItem('defaultEntity')
    if (defaultEntity !== null) {
      return JSON.parse(defaultEntity)
    }
    return [
      {
        name: 'Entity Name',
        idAccount: 'AccountNumber',
        icon: 'PICupHot',
        color: 'orange'
      }
    ]
  }

  return { defaultEntity }
})

export default useNavbarStore
