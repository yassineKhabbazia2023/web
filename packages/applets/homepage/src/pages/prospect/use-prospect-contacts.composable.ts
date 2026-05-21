import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { EntityContactService } from '@pulse/common/services/contact'
import type { EntityContact } from '@pulse/common/services/contact'

export function useProspectContacts() {
  const { currentEntityId } = storeToRefs(useCurrentEntityStore())

  const contacts = ref<EntityContact[]>([])
  const isContactsLoading = ref(false)

  watch(
    currentEntityId,
    async (accountId) => {
      if (accountId === undefined) {
        contacts.value = []
        return
      }
      isContactsLoading.value = true
      try {
        contacts.value = await EntityContactService.getProspectContacts(accountId)
      } finally {
        isContactsLoading.value = false
      }
    },
    { immediate: true },
  )

  return {
    contacts,
    isContactsLoading,
  }
}
