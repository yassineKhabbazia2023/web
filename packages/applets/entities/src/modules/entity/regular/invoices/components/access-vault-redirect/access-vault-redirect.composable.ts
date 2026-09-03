import { useRouter } from 'vue-router'
import { RouteName, RouteParam } from '@pulse/common/enums'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { InvoicesTracking } from '../../services/invoices.tracking.service'

export function useAccessVaultRedirect() {
  const router = useRouter()
  const currentEntityStore = useCurrentEntityStore()

  function handleAccessInvoicesClick() {
    InvoicesTracking.trackAccessNewInvoicesExperienceClick()
    router.push({
      name: RouteName.SERES_INVOICES,
      params: { [RouteParam.ENTITY_ID]: currentEntityStore.currentEntityId },
    })
  }

  return {
    handleAccessInvoicesClick,
  }
}
