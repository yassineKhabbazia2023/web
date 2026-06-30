import { computed, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { SortChangeEventData } from '@pulse/common/types'
import type { RegularWalletData } from '@entities/modules/wallet/types/wallet-data.types'
import { useUserStore } from '@pulse/common/stores'
import { SortDirection, AmplitudeFeatureLocalisation } from '@pulse/common/enums'
import { useResponsive } from '@pulse/styleguide'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { containsIgnoreCase } from '@pulse/toolbox/utils/string'
import { RegularEntitiesListManager } from './regular-entity.list.manager'
import { SORT_COLUMN_TRACKING_MAP, MENU_ACTION_TRACKING_MAP } from './regular-entity.list.consts'
import { WalletTrackingManager } from '@entities/managers/wallet-tracking/wallet-tracking.manager'
import { WalletMenuActionValue } from '@entities/managers/wallet-tracking/wallet-tracking.enum'
import { TrackingCenter } from '@pulse/common/services/amplitude'
import { useI18n } from 'vue-i18n'
import type {
  EntitiesListRegularProps,
  EntitiesListRegularEmit,
  MenuTranslations,
} from './regular-entity.list.types'
import { RegularEntityAction } from './regular-entity.list.enums'

const I18N_REGULAR_KEY = 'entities.wallet.entitiesListRegular'

export function useRegularEntitiesList(
  props: EntitiesListRegularProps,
  emit: EntitiesListRegularEmit,
  selectedFolderIds: Ref<number[]>,
) {
  const { t } = useI18n()
  const { isMobile } = useResponsive()

  const menuTranslations = computed<MenuTranslations>(() => ({
    accessThisFolder: t(`${I18N_REGULAR_KEY}.accessThisFolder`),
    deployThisFolder: t(`${I18N_REGULAR_KEY}.deployThisFolder`),
    delegateThisFolder: t(`${I18N_REGULAR_KEY}.delegateThisFolder`),
    resendActivationEmail: t(`${I18N_REGULAR_KEY}.resendActivationEmail`),
    declareCustomerRelation: t(`${I18N_REGULAR_KEY}.declareCustomerRelation`),
    toDeploy: t(`${I18N_REGULAR_KEY}.toDeploy`),
  }))

  const userStore = useUserStore()
  const { isCollab } = storeToRefs(userStore)

  const callHandleAddFavorite = (accountId: number, isFavorite: boolean) => {
    WalletTrackingManager.trackFavoriteRequest(isFavorite)
    emit('add-favorite', accountId, isFavorite)
  }

  const menuElementsCollaborator = (status: string) => {
    return RegularEntitiesListManager.getMenuElementsForRow(
      status,
      t(`${I18N_REGULAR_KEY}.toDeploy`),
      menuTranslations.value,
    )
  }

  const handleSort = (data: SortChangeEventData) => {
    const trackingColumn = SORT_COLUMN_TRACKING_MAP[data.prop]
    if (trackingColumn !== undefined) {
      WalletTrackingManager.trackColumnSortRequested(trackingColumn)
    }

    emit('sort-account', {
      field: data.prop,
      descending: data.order === SortDirection.DESCENDING,
    })
  }

  const onDirectFolderAccess = (accountId: number) => {
    TrackingCenter.trackHomepageConsulted(AmplitudeFeatureLocalisation.PORTEFEUILLE)
    emit('access', accountId)
  }

  const onToolboxVisibleChange = (isVisible: boolean) => {
    if (isVisible) {
      WalletTrackingManager.trackFolderMenuAction(WalletMenuActionValue.MENU_OPENED)
    }
  }

  const onToolboxItemClicked = (action: RegularEntityAction, row: RegularWalletData) => {
    const trackingAction = MENU_ACTION_TRACKING_MAP[action]
    if (trackingAction !== undefined) {
      WalletTrackingManager.trackFolderMenuAction(trackingAction)
    }

    if (action === RegularEntityAction.DEPLOY) {
      emit('click-deploy', row.accountId, row.accountNumber, row.name)
    } else if (action === RegularEntityAction.ACCESS) {
      emit('access', row.accountId)
    } else if (action === RegularEntityAction.DELEGATE_FOLDER) {
      emit('displayDelegationDrawer', row)
    } else if (action === RegularEntityAction.RETRY_MASS_ACTIVATION_EMAIL) {
      emit('displayResendActivationEmailDrawer', row)
    } else if (action === RegularEntityAction.DECLARE_CUSTOMER_RELATION) {
      emit('displayDeclareCustomerRelationDrawer', row)
    }
  }

  const selectedFolderIdSet = computed(() => new Set(selectedFolderIds.value))

  const isFolderSelected = (accountId: number) =>
    selectedFolderIdSet.value.has(accountId)

  const toggleSelectedFolder = (accountId: number) => {
    const nextSelectedFolderIds = new Set(selectedFolderIdSet.value)

    if (nextSelectedFolderIds.has(accountId) === true) {
      nextSelectedFolderIds.delete(accountId)
    } else {
      nextSelectedFolderIds.add(accountId)
    }

    selectedFolderIds.value = [...nextSelectedFolderIds]
  }

  const trackWalletSearch = (row: RegularWalletData) => {
    if (isNotNullNorEmpty(props.searchValue) === false) {
      return
    }

    const search = props.searchValue.trim()
    const matches: string[] = []

    const fieldsToCheck = [
      { value: row.name, label: 'raison sociale' },
      { value: row.accountNumber, label: 'code client' },
      { value: row.owner?.lastName, label: 'nom' },
      { value: row.owner?.firstName, label: 'prenom' },
      { value: row.owner?.email ?? '', label: 'email' },
    ]

    fieldsToCheck.forEach(({ value, label }) => {
      if (containsIgnoreCase(value, search) === true) {
        matches.push(label)
      }
    })

    WalletTrackingManager.trackWalletSearched(props.searchValue, matches)
  }

  const onRowClick = (row: Record<string, any>) => {
    if (isMobile.value === true) {
      emit('access', row.accountId)
    }

    trackWalletSearch(row as RegularWalletData)
  }

  return {
    isCollab,
    callHandleAddFavorite,
    menuElementsCollaborator,
    handleSort,
    onDirectFolderAccess,
    onToolboxVisibleChange,
    onToolboxItemClicked,
    toggleSelectedFolder,
    isFolderSelected,
    onRowClick,
    trackWalletSearch,
  }
}
