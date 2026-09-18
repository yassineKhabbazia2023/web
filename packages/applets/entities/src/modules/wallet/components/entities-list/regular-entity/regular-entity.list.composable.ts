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
import { FAVORITE_SORT_FIELD } from '@entities/constants'
import { SORT_COLUMN_TRACKING_MAP, MENU_ACTION_TRACKING_MAP } from './regular-entity.list.consts'
import { WalletTrackingManager } from '@entities/managers/wallet-tracking/wallet-tracking.manager'
import { WalletMenuActionValue, WalletMenuActionType } from '@entities/managers/wallet-tracking/wallet-tracking.enum'
import { TrackingCenter } from '@pulse/common/services/amplitude'
import { useI18n } from 'vue-i18n'
import type {
  EntitiesListRegularProps,
  EntitiesListRegularEmit,
  MenuTranslations,
} from './regular-entity.list.types'
import { RegularEntityAction } from './regular-entity.list.enums'
import { useWalletFeatureFlags } from '@entities/composables/wallet-feature-flags.composable'

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
    removeCustomerRelation: t(`${I18N_REGULAR_KEY}.removeCustomerRelation`),
    removeCurrentUserFromThisFolder: t(`${I18N_REGULAR_KEY}.removeCurrentUserFromThisFolder`),
    toDeploy: t(`${I18N_REGULAR_KEY}.toDeploy`),
  }))

  const userStore = useUserStore()
  const { isCollab } = storeToRefs(userStore)

  const callHandleAddFavorite = (accountId: number, isFavorite: boolean) => {
    WalletTrackingManager.trackFavoriteRequest(isFavorite)
    emit('add-favorite', accountId, isFavorite)
  }

  const menuElementsCollaborator = (row: RegularWalletData) => {
    return RegularEntitiesListManager.getMenuElementsForRow(
      row.deploymentStatus.text,
      t(`${I18N_REGULAR_KEY}.toDeploy`),
      menuTranslations.value,
      row.isCustomerRelation === true,
    )
  }

  const { isFavoriteSortActivated, isLastActivityFeatureActivated } = useWalletFeatureFlags()

  const isSortedByFavorite = computed(() =>
    isFavoriteSortActivated.value === true && props.sorting?.field === FAVORITE_SORT_FIELD,
  )

  const favoriteSortable = computed(() => (isFavoriteSortActivated.value === true ? 'custom' : false))

  const favoriteDefaultSort = computed(() => (isSortedByFavorite.value
    ? { prop: FAVORITE_SORT_FIELD, order: SortDirection.DESCENDING }
    : undefined))

  const handleSort = (data: SortChangeEventData) => {
    // A null order means the column went back to its unsorted state.
    const isSortCleared = data.order === null

    const trackingColumn = SORT_COLUMN_TRACKING_MAP[data.prop]
    if (trackingColumn !== undefined && isSortCleared === false) {
      WalletTrackingManager.trackColumnSortRequested(trackingColumn)
    }

    emit('sort-account', {
      field: isSortCleared ? '' : data.prop,
      descending: data.order === SortDirection.DESCENDING,
    })
  }

  // Bound to both `click` and `auxclick.middle` on the link so that left click, ctrl+click and middle click are tracked
  const trackDirectFolderAccess = () => {
    TrackingCenter.trackHomepageConsulted(AmplitudeFeatureLocalisation.PORTEFEUILLE)
  }

  const onToolboxVisibleChange = (isVisible: boolean) => {
    if (isVisible) {
      WalletTrackingManager.trackFolderMenuAction(WalletMenuActionValue.MENU_OPENED, WalletMenuActionType.UNITARY)
    }
  }

  const onToolboxItemClicked = (action: RegularEntityAction, row: RegularWalletData) => {
    const trackingAction = MENU_ACTION_TRACKING_MAP[action]
    if (trackingAction !== undefined) {
      WalletTrackingManager.trackFolderMenuAction(trackingAction, WalletMenuActionType.UNITARY)
    }

    if (action === RegularEntityAction.DEPLOY) {
      emit('click-deploy', row.accountId, row.accountNumber, row.name)
    } else if (action === RegularEntityAction.ACCESS) {
      emit('access', row.accountId)
    } else if (action === RegularEntityAction.DELEGATE_FOLDER) {
      emit('displayDelegationDrawer', row)
    } else if (action === RegularEntityAction.RETRY_MASS_ACTIVATION_EMAIL) {
      emit('displayResendActivationEmailDrawer', row)
    } else if (
      action === RegularEntityAction.DECLARE_CUSTOMER_RELATION ||
      action === RegularEntityAction.REMOVE_CUSTOMER_RELATION
    ) {
      emit(
        'displayCustomerRelationDrawer',
        row,
        action === RegularEntityAction.DECLARE_CUSTOMER_RELATION,
      )
    } else if (action === RegularEntityAction.REMOVE_CURRENT_USER_FROM_FOLDER) {
      emit('displayRemoveCurrentUserFromFolderModal', row)
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

  const areAllFoldersSelected = computed(() =>
    props.data.length > 0 && props.data.every((row) => isFolderSelected(row.accountId)),
  )

  const isFoldersSelectionIndeterminate = computed(() =>
    areAllFoldersSelected.value === false && props.data.some((row) => isFolderSelected(row.accountId)),
  )

  const toggleAllSelectedFolders = () => {
    const currentPageIds = props.data.map((row) => row.accountId)

    if (areAllFoldersSelected.value === true) {
      const currentPageIdSet = new Set(currentPageIds)
      selectedFolderIds.value = selectedFolderIds.value.filter(
        (accountId) => currentPageIdSet.has(accountId) === false,
      )
      return
    }

    selectedFolderIds.value = [...new Set([...selectedFolderIds.value, ...currentPageIds])]
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
    isLastActivityFeatureActivated,
    isFavoriteSortActivated,
    isSortedByFavorite,
    favoriteSortable,
    favoriteDefaultSort,
    callHandleAddFavorite,
    menuElementsCollaborator,
    handleSort,
    trackDirectFolderAccess,
    onToolboxVisibleChange,
    onToolboxItemClicked,
    toggleSelectedFolder,
    isFolderSelected,
    areAllFoldersSelected,
    isFoldersSelectionIndeterminate,
    toggleAllSelectedFolders,
    onRowClick,
    trackWalletSearch,
  }
}
