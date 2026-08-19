import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '../user/user.store'
import { InvoicesTabState } from '../../services/invoices-access/invoices-access.service.types'
import type { InvoicesAccessResponse } from '../../services/invoices-access/invoices-access.service.types'
import { useResponsive } from '@pulse/styleguide'

const CONNECTION_READY_STATES = new Set<InvoicesTabState>([
  InvoicesTabState.CONNECTION_READY_LOCKED,
  InvoicesTabState.CONNECTION_READY_UNLOCKED,
])

export const useInvoicesAccessStore = defineStore('invoices-access', () => {
  const { isMobile } = useResponsive()
  const tabState = ref<InvoicesTabState | null>(null)
  const contactWithAccess = ref<string | null>(null)
  const externalDematMail = ref<string | null>(null)

  const isTabVisible = computed(() => {
    if (tabState.value === null) {
      return false
    }

    if (CONNECTION_READY_STATES.has(tabState.value) === false) {
      return false
    }

    if (isMobile.value === true) {
      return false
    }

    const userStore = useUserStore()

    const isCollab = userStore.isCollab === true
    const userEmail = userStore.getUserEmail() ?? ''
    const isClientWithAccess = contactWithAccess.value === userEmail

    return isCollab || isClientWithAccess
  })

  function setAccessData(response: InvoicesAccessResponse | null) {
    if (response === null) {
      reset()
      return
    }

    tabState.value = response.tabState
    contactWithAccess.value = response.contactWithAccess
    externalDematMail.value = response.externalDematMail
  }

  function reset() {
    tabState.value = null
    contactWithAccess.value = null
    externalDematMail.value = null
  }

  return {
    isTabVisible,
    tabState,
    contactWithAccess,
    externalDematMail,
    setAccessData,
    reset,
  }
})
