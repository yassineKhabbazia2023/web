import { computed } from 'vue'
import type { SortChangeEventData } from '@pulse/common/types'
import type { RegularWalletData } from '../../../types/wallet-data.types'
import { SortDirection } from '@pulse/common/enums'
import { TrackingCenter } from '@pulse/common/services/amplitude'
import { EntitiesManagementListManager } from './entities-management.list.manager'
import type { EntitiesManagementListEmit } from './entities-management.list.types'
import { EntitiesManagementAction } from './entities-management.list.enums'

export function useEntitiesManagementList(emit: EntitiesManagementListEmit) {

  const menuElements = computed(() =>
    EntitiesManagementListManager.getMenuElements(),
  )

  const isToolboxDisabled = computed(() => menuElements.value.length === 0)

  const handleSort = (data: SortChangeEventData) => {
    emit('sort-account', {
      field: data.prop,
      descending: data.order === SortDirection.DESCENDING,
    })
  }

  // Bound to both `click` and `auxclick.middle` on the link so that left click, ctrl+click and middle click are tracked.
  // This list has no dedicated localisation
  const trackDirectFolderAccess = () => {
    TrackingCenter.trackHomepageConsulted()
  }

  const onToolboxItemClicked = (action: EntitiesManagementAction, row: RegularWalletData) => {
    if (action === EntitiesManagementAction.MANAGE_ACCOUNT_RIGHTS) {
      emit('displayAccountRightsDrawer', row)
    } else if (action === EntitiesManagementAction.RETRY_MASS_ACTIVATION_EMAIL) {
      emit('displayResendActivationEmailDrawer', row)
    }
  }

  return {
    menuElements,
    isToolboxDisabled,
    handleSort,
    trackDirectFolderAccess,
    onToolboxItemClicked,
  }
}
