import { computed, ref } from 'vue'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { sanitizeUrl } from '@pulse/toolbox/utils/url'
import { formatFrenchPhoneNumber } from '@pulse/toolbox/utils/string'
import { INVOICES_ASSISTANCE_FORM_URL } from '../../invoices.constants'
import { InvoicesTracking } from '../../services/invoices.tracking.service'
import { InvoicesAssistanceFormParam } from '../../enums'
import type { InvoicesFormStep } from '../../enums'

export function useInvoicesAssistance(step: InvoicesFormStep) {
  const userStore = useUserStore()
  const currentEntityStore = useCurrentEntityStore()

  const isCollab = computed(() => userStore.isCollab)

  const iframeUrl = computed(() => {
    const user = userStore.getUser()
    const firstName = user?.firstName ?? ''
    const lastName = user?.lastName ?? ''
    const email = user?.email ?? ''
    const phone = formatFrenchPhoneNumber(user?.officeMobile)
    const company = currentEntityStore.currentEntity?.legalName ?? ''
    const customerCode = currentEntityStore.currentEntityAccountNumber

    const params = new URLSearchParams({
      [InvoicesAssistanceFormParam.FIRSTNAME]: firstName,
      [InvoicesAssistanceFormParam.LASTNAME]: lastName,
      [InvoicesAssistanceFormParam.EMAIL]: email,
      [InvoicesAssistanceFormParam.PHONE]: phone,
      [InvoicesAssistanceFormParam.COMPANY]: company,
      [InvoicesAssistanceFormParam.CUSTOMER_CODE]: customerCode,
    })
    const rawUrl = `${INVOICES_ASSISTANCE_FORM_URL}?${params.toString()}`

    return sanitizeUrl(rawUrl)
  })

  const isDialogOpen = ref(false)

  function handleOpenDialog() {
    if (isCollab.value === true) {
      return
    }

    InvoicesTracking.trackAssistanceButtonClick(step)
    isDialogOpen.value = true
  }

  return {
    isCollab,
    iframeUrl,
    isDialogOpen,
    handleOpenDialog,
  }
}
