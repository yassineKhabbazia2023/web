import { computed, ref } from 'vue'
import type { SortChangeEventData } from '@pulse/common/types'
import type { ProspectWalletData } from '@entities/modules/wallet/types/wallet-data.types'
import { SortDirection } from '@pulse/common/enums'
import { PROSPECT_COLUMNS_BY_FLOW } from './prospect-entity.list.consts'
import { ProspectAction, ProspectColumn } from './prospect-entity.list.enums'
import { ProspectEntityListManager } from './prospect-entity.list.manager'
import type { EntitiesListProspectsProps, EntitiesListProspectsEmit } from './prospect-entity.list.types'

export function useProspectsEntitiesList(props: EntitiesListProspectsProps, emit: EntitiesListProspectsEmit) {
  const visibleColumns = computed(() => PROSPECT_COLUMNS_BY_FLOW[props.prospectListType])

  const isColumnVisible = (column: ProspectColumn): boolean => visibleColumns.value.includes(column)

  const menuElements = computed(() => ProspectEntityListManager.getMenuElements())

  const isArchiveDialogVisible = ref(false)
  const selectedProspect = ref<ProspectWalletData | null>(null)

  const handleSort = (data: SortChangeEventData) => {
    emit('sort-account', {
      field: data.prop,
      descending: data.order === SortDirection.DESCENDING,
    })
  }

  const onDirectFolderAccess = (accountId: number) => {
    emit('access', accountId)
  }

  const onToolboxItemClicked = (action: ProspectAction, row: ProspectWalletData) => {
    if (action === ProspectAction.ARCHIVE_PROSPECT) {
      selectedProspect.value = row
      isArchiveDialogVisible.value = true
    }
  }

  const onProspectArchived = () => {
    selectedProspect.value = null
    emit('prospect-archived')
  }

  return {
    isColumnVisible,
    menuElements,
    isArchiveDialogVisible,
    selectedProspect,
    handleSort,
    onDirectFolderAccess,
    onToolboxItemClicked,
    onProspectArchived,
  }
}
