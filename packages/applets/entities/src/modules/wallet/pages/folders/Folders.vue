<template>
  <div>
    <div
      v-if="isCollab"
      class="
        flex
        flex--wrap
        flex--align-items-end
        flex--justify-content-space-between
        flex-gap--3
        margin-bottom--6
        flex-row-gap--3
      "
    >
      <Filters
        v-if="isMobile === false"
        data-testid="filters"
        @filter-by-status="handleFilterByDeploymentStatus"
        @remove-filter="handleRemoveFilter"
      />
      <div
        class="
          flex
          flex--wrap
          flex-gap--2
        "
      >
        <ManageWalletButton
          v-if="isManageWalletMenuActivated"
          :selectedFoldersCount="selectedFolders.length"
          :is-selected-folder-customer-relation="selectedFolderCustomerRelationStatus"
          @action-selected="onWalletAction"
        />
        <template v-else>
          <PButton
            v-if="hasEntityCreatorPermission"
            pType="secondary"
            pSize="small"
            @click="onEntityCreatorDrawerOpen"
          >
            <PIcon class="el-button__icon--left" pName="plusLg" />
            {{ t('createTestAccount') }}
          </PButton>
          <PButton
            pType="secondary"
            pSize="small"
            @click="openSelectedFoldersDelegationDrawer"
          >
            {{ t('delegation', selectedFolders.length) }}
          </PButton>
        </template>
        <PButton
          v-if="hasManageAccess"
          :pDisabled="isManageAccessButtonDisabled"
          pType="primary"
          pSize="small"
          data-testid="manage-access-button"
          @click="onManageAccessButtonClick"
        >
          <span>
            {{ t('manageAccess') }}
          </span>
          <PPastille
            v-if="manageAccessCount !== undefined"
            pType="white"
            pSize="small"
            class="margin-left--3 text-color--base-blue-pulse"
            data-testid="manage-access-count"
          >
            {{ manageAccessCount }}
          </PPastille>
        </PButton>
      </div>
      <EntityCreatorDrawer
        v-if="isEntityCreatorDrawerOpen && user"
        v-model="isEntityCreatorDrawerOpen"
        :currentUser="user"
      />
      <DelegationDrawer
        v-if="isDelegationDrawerOpened"
        v-model="isDelegationDrawerOpened"
        :selectedFolders="foldersToDelegate"
        :numberOfFoldersInPortfolio="totalAccounts"
        :initialTab="delegationInitialTab"
      />
      <RemoveFromFoldersConfirmationModal
        v-if="isRemoveFromFoldersModalOpened"
        v-model="isRemoveFromFoldersModalOpened"
        :selectedFoldersCount="foldersToRemoveIds.length"
        :has-remaining-collaborator-folder="hasRemainingCollaboratorFolder"
        :isConfirmButtonLoading="isRemoveFromFoldersLoading"
        @confirm="confirmRemoveFromFolders"
      />
      <BulkCustomerRelationDrawer
        v-if="isBulkCustomerRelationDrawerOpened"
        v-model="isBulkCustomerRelationDrawerOpened"
        :selectedFolders="customerRelationDrawerFolders"
        :targetCustomerRelationStatus="targetCustomerRelationStatus"
        @updated="handleBulkCustomerRelationUpdated"
        @update:model-value="handleBulkCustomerRelationDrawerVisibilityUpdate"
      />
    </div>
    <div class="account-deploy__filters flex flex--align-items-center margin-bottom--3">
      <FormSearch
        ref="searchBar"
        :forcedValue="searchCriteria.search"
        :placeholder="searchPlaceholder"
        class="width--100 max-width-500"
        @search-value-submitted="handleSearchValueSubmitted"
      />
      <PButton
        pType="default"
        pSize="small"
        data-testid="account-deploy__filter-button"
        @click="openFiltersDrawer"
      >
        <PIcon pName="sliders" />
        <span class="padding-left--2">{{ t('filter') }}</span>
        <Transition name="fade">
          <PPastille
            v-if="accountFiltersCount > 0"
            pType="dark-green"
            pSize="small"
            class="margin-left--2"
            data-testid="account-deploy__filter-count"
          >
            {{ accountFiltersCount }}
          </PPastille>
        </Transition>
      </PButton>
      <Transition name="fade">
        <PButton
          v-if="accountFiltersCount > 0"
          pType="default"
          data-testid="account-deploy__clear-filters-button"
          @click="clearAllAccountFilters"
        >
          <span
            class="font-medium text-underline"
            data-testid="account-deploy__clear-filters-text"
          >
            {{ t('clearAll') }}
          </span>
        </PButton>
      </Transition>
    </div>
    <div
      v-if="isLoading"
      class="loader flex flex--justify-content-center flex--align-items-center"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <div v-show="isLoading === false">
      <NoResult v-if="searchResult.items.length === 0" />
      <RegularEntityList
        v-if="searchResult.items.length > 0"
        v-model:selected-folder-ids="selectedFolderIds"
        data-testid="folders-table"
        :data="searchResult.items"
        :searchValue="searchCriteria.search"
        @add-favorite="handleAddFavorite"
        @click-deploy="onClickDeploy"
        @access="onClickFolder"
        @display-resend-activation-email-drawer="handleDisplayResendActivationEmailDrawer"
        @display-customer-relation-drawer="handleDisplayCustomerRelationDrawer"
        @display-delegation-drawer="handleDisplayDelegationDrawer"
        @display-remove-current-user-from-folder-modal="handleDisplayRemoveCurrentUserFromFolderModal"
        @sort-account="handleSortAccount"
      />
      <PPagination
        v-model:p-page-size="searchCriteria.limit"
        class="margin-top--6"
        :pCurrentPage="searchResult.currentPage"
        :pTotal="searchResult.totalItems"
        :pPageSizes="pageSizes"
        pPageSizeSelectorSuffix=""
        pShowTotalPageCounter
        @on-page-range-changed="handlePageRangeChanged"
        @update:p-current-page="onUpdateCurrentPage"
      >
        <p>{{ paginationLabel }}</p>
      </PPagination>
      <ResendActivationEmailDrawer
        v-if="isResendActivationEmailDrawerVisible && selectedAccount"
        v-model="isResendActivationEmailDrawerVisible"
        :selectedAccount="selectedAccount"
        :accountType="AccountType.REGULAR"
      />
      <OffersDrawer
        v-if="hasOffersDrawer === true && selectedAccountId && user"
        ref="offersDrawer"
        v-model="openOffersDrawer"
        :selectedCompanyName="selectedCompanyName"
        :accountNumber="selectedAccountNumber"
        :accountId="selectedAccountId"
        :currentUser="user"
        data-testid="offers-drawer"
        @offer-saved="onOfferSaved"
      />
      <AccountFiltersDrawer
        v-model="isFiltersDrawerOpen"
        v-model:hasActiveFilters="hasActiveFilters"
        :accountFilters
        data-testid="account-filters-drawer"
        @apply-filters="applyAccountFilters"
        @reset-filters="clearAllAccountFilters"
      />
    </div>
    <ManageAccessDrawerGlobal
      v-if="hasManageAccess"
      v-model="isManageAccessDrawerOpened"
      :trackingLocalisation="TrackingLocalisation.WALLET"
      data-testid="manage-access-drawer-global"
      @update:model-value="onUpdateManageAccessDrawerOpened"
    />
  </div>
</template>

<script lang='ts' setup>
import { logger } from '@pulse/toolbox'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref, watch, useTemplateRef, nextTick } from 'vue'
import {
  PLoader,
  PButton,
  PPastille,
  PPagination,
  PIcon,
} from '@pulse/styleguide/components'
import { displayNotification, useResponsive } from '@pulse/styleguide'
import { fetchFavoriteEntities, manageFavoriteEntities } from '@entities/services/wallet'
import { checkLastCollaboratorOnAccounts, removeCurrentUserFromAccounts } from '@entities/services/account'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { CurrentUserManager, FeatureFlagManager } from '@pulse/common/managers'
import type { Entity, SortingCriteria } from '@pulse/common/types'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { storeToRefs } from 'pinia'
import NoResult from '@entities/components/NoResult'
import FormSearch from '@entities/components/FormSearch'
import OffersDrawer from '@entities/components/OffersDrawer'
import { getPaginationLabel } from '@pulse/common/utils'
import { ENTITY_STATUS_COLOR } from '@entities/constants'
import { PAGE_SIZES, LARGE_PAGE_SIZES, MOBILE_PAGE_SIZES, ACTION_PERMISSIONS, GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import { EntityStatus, DelegationTab, ManageWalletAction } from '@entities/modules/wallet/enums'
import { fetchWalletData } from './FoldersUtils'
import type {
  SearchCriteria,
  SearchResult,
  DeploymentStatus,
  RegularWalletData,
} from '@entities/modules/wallet/types'
import { useFolderSelection, getSelectedFolderFromRow } from './folder-selection.composable'
import type { SelectedFolder } from './components/DelegationDrawer/DelegationDrawerTypes'
import Filters from '../../components/Filters'
import RegularEntityList from '../../components/entities-list/regular-entity/regular-entity.list.vue'
import DelegationDrawer from './components/DelegationDrawer'
import ManageWalletButton from './components/ManageWalletButton/ManageWalletButton.vue'
import RemoveFromFoldersConfirmationModal from './components/RemoveFromFoldersConfirmationModal/remove-from-folders-confirmation-modal.vue'
import { RemoveFromFoldersManager } from './components/RemoveFromFoldersConfirmationModal/remove-from-folders.manager'
import BulkCustomerRelationDrawer from './components/BulkCustomerRelationDrawer'
import EntityCreatorDrawer from './components/EntityCreatorDrawer'
import AccountFiltersDrawer from './components/AccountFiltersDrawer/AccountFiltersDrawer.vue'
import { getDefaultAccountFilters } from './components/AccountFiltersDrawer/account-filters-drawer.utils'
import ResendActivationEmailDrawer from '@entities/components/ResendActivationEmailDrawer'
import type { AccountFilters, AccountRow } from '@entities/types'
import ManageAccessDrawerGlobal from '@entities/components/ManageAccessDrawer/ManageAccessDrawerGlobal'
import { TrackingLocalisation } from '@entities/enums'
import { useUserStore } from '@pulse/common/stores'
import { RouteName, RouteParam, AccountType } from '@pulse/common/enums'
import { fetchAccountOperations } from '@entities/services/registry'
import { useSort } from '@pulse/common/composables/sort'
import { WalletTrackingManager } from '@entities/managers/wallet-tracking/wallet-tracking.manager'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      search: 'Search by company name, folder ID, first name, last name, and email of the executive',
      searchShort: 'Search...',
      toDeploy: 'To Deploy',
      inProgress: 'In progress',
      connected: 'Connected',
      clearAll: 'Clear all',
      filter: 'Filter',
      on: 'on',
      delegation: 'My delegations | Delegate my folder | Delegate my folders',
      createTestAccount: 'Create a test account',
      manageAccess: 'Manage access',
      removeFromFoldersCheckError: 'The withdrawal action could not be prepared. Please try again in a few moments.',
      removeFromFoldersSuccessSingle: 'You removed yourself from the selected folder.',
      removeFromFoldersSuccessMultiple: 'You removed yourself from the {count} selected folders.',
      removeFromFoldersPartialSuccess: 'You removed yourself from {succeededCount} {succeededFolderLabel} out of {selectedCount}. {remainingFoldersFailureMessage}',
      removeFromFoldersSucceededFolderLabel: 'folder | folders',
      removeFromFoldersRemainingFailureSingle: 'The remaining folder could not be processed, please try again.',
      removeFromFoldersRemainingFailureMultiple: 'The remaining folders could not be processed, please try again.',
      removeFromFoldersFailure: 'Your withdrawal could not be completed. Please try again in a few moments.',
    },
    'fr-FR': {
      search: 'Rechercher par raison sociale, code client, prénom, nom et e-mail du dirigeant',
      searchShort: 'Rechercher...',
      toDeploy: 'A déployer',
      inProgress: 'En cours',
      connected: 'Connecté',
      clearAll: 'Tout effacer',
      filter: 'Filtrer',
      on: 'sur',
      delegation: 'Mes délégations | Déléguer le dossier | Déléguer les dossiers',
      createTestAccount: 'Créer un compte de test',
      manageAccess: 'Gérer les accès',
      removeFromFoldersCheckError: 'L’action de retrait n’a pas pu être préparée. Réessayez dans quelques instants.',
      removeFromFoldersSuccessSingle: 'Vous vous êtes retiré du dossier sélectionné.',
      removeFromFoldersSuccessMultiple: 'Vous vous êtes retiré des {count} dossiers sélectionnés.',
      removeFromFoldersPartialSuccess: 'Vous vous êtes retiré de {succeededCount} {succeededFolderLabel} sur {selectedCount}. {remainingFoldersFailureMessage}',
      removeFromFoldersSucceededFolderLabel: 'dossier | dossiers',
      removeFromFoldersRemainingFailureSingle: 'Le dossier restant n’a pas pu être traité, réessayez.',
      removeFromFoldersRemainingFailureMultiple: 'Les dossiers restant n’ont pas pu être traités, réessayez.',
      removeFromFoldersFailure: 'Votre retrait n’a pas pu aboutir. Réessayez dans quelques instants.',
    },
  },
})

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { isCollab, user } = storeToRefs(userStore)
const { isMobile } = useResponsive()

const searchPlaceholder = computed(() =>
  isMobile.value ? t('searchShort') : t('search'),
)

const pageSizes = computed(() =>
  isMobile.value ? [5, ...MOBILE_PAGE_SIZES, ...PAGE_SIZES] : LARGE_PAGE_SIZES,
)
const currentPageSize = computed((): number => isMobile.value === true ? pageSizes.value[0] : pageSizes.value[2])

const searchBar = ref()
const isLoading = ref(true)
const selectedCompanyName = ref('')

const isManageAccessDrawerOpened = ref(false)

// #region ResendActivationEmail
const selectedAccount = ref<AccountRow>()
const isResendActivationEmailDrawerVisible = ref(false)

const handleDisplayResendActivationEmailDrawer = (account: AccountRow) => {
  selectedAccount.value = account
  isResendActivationEmailDrawerVisible.value = true
}
// #endregion

// #region Account Filter Drawer State and Logic
const hasActiveFilters = ref(false)
const isFiltersDrawerOpen = ref(false)
const accountFilters = ref<AccountFilters>(getDefaultAccountFilters())

const openFiltersDrawer = () => {
  isFiltersDrawerOpen.value = true
}

const closeFiltersDrawer = () => {
  isFiltersDrawerOpen.value = false
}

const accountFiltersCount = computed(() => {
  const {
    isFavoriteFilter,
    isCustomerRelationFilter,
    missionTypeFilter,
    deploymentStatusFilter,
  } = accountFilters.value

  return (isFavoriteFilter ? 1 : 0) +
    (isCustomerRelationFilter ? 1 : 0) +
    (missionTypeFilter !== undefined && missionTypeFilter.length > 0 ? 1 : 0) +
    (deploymentStatusFilter !== undefined && deploymentStatusFilter.length > 0 ? 1 : 0)
})

const applyAccountFilters = (appliedFilters: AccountFilters) => {
  accountFilters.value = appliedFilters
  searchCriteria.value = {
    ...searchCriteria.value,
    isFavoriteFilter: appliedFilters.isFavoriteFilter,
    isCustomerRelationFilter: appliedFilters.isCustomerRelationFilter,
    filterByMissionType: appliedFilters.missionTypeFilter,
    filterByDeploymentStatus: appliedFilters.deploymentStatusFilter,
  }
  closeFiltersDrawer()
}

const clearAllAccountFilters = () => {
  accountFilters.value = getDefaultAccountFilters()
  searchCriteria.value = {
    ...searchCriteria.value,
    isFavoriteFilter: false,
    isCustomerRelationFilter: false,
    filterByMissionType: undefined,
    filterByDeploymentStatus: undefined,
  }
  hasActiveFilters.value = false
  closeFiltersDrawer()
}
// #endregion

// delegation part
const isDelegationDrawerOpened = ref(false)
const delegationInitialTab = ref<DelegationTab>()
const rowDelegationFolder = ref<SelectedFolder>()

const foldersToDelegate = computed<SelectedFolder[]>(() =>
  rowDelegationFolder.value !== undefined ? [rowDelegationFolder.value] : selectedFolders.value,
)

const openDelegationDrawerOnTab = (tab: DelegationTab) => {
  rowDelegationFolder.value = undefined
  delegationInitialTab.value = tab
  isDelegationDrawerOpened.value = true
}

const openSelectedFoldersDelegationDrawer = () => {
  rowDelegationFolder.value = undefined
  delegationInitialTab.value = undefined
  isDelegationDrawerOpened.value = true
}

const isBulkCustomerRelationDrawerOpened = ref(false)
const targetCustomerRelationStatus = ref(false)
const rowCustomerRelationFolder = ref<SelectedFolder>()
const customerRelationDrawerFolders = computed<SelectedFolder[]>(() =>
  rowCustomerRelationFolder.value !== undefined ? [rowCustomerRelationFolder.value] : selectedFolders.value,
)

function openBulkCustomerRelationDrawer(targetStatus: boolean) {
  targetCustomerRelationStatus.value = targetStatus
  isBulkCustomerRelationDrawerOpened.value = true
}

async function handleBulkCustomerRelationUpdated(succeededAccountIds: number[]) {
  const succeededAccountIdSet = new Set(succeededAccountIds)
  selectedFolders.value = selectedFolders.value.map(folder => ({
    ...folder,
    isCustomerRelation: succeededAccountIdSet.has(folder.id)
      ? targetCustomerRelationStatus.value
      : folder.isCustomerRelation,
  }))
  isBulkCustomerRelationDrawerOpened.value = false
  rowCustomerRelationFolder.value = undefined
  await fetchTableDataAndFavorites()
}

function handleBulkCustomerRelationDrawerVisibilityUpdate(isOpened: boolean) {
  if (isOpened === false) {
    rowCustomerRelationFolder.value = undefined
  }
}

const handleDisplayCustomerRelationDrawer = (
  row: RegularWalletData,
  targetStatus: boolean,
) => {
  rowCustomerRelationFolder.value = getSelectedFolderFromRow(row)
  openBulkCustomerRelationDrawer(targetStatus)
}

const handleDisplayDelegationDrawer = (row: RegularWalletData) => {
  rowDelegationFolder.value = getSelectedFolderFromRow(row)
  delegationInitialTab.value = undefined
  isDelegationDrawerOpened.value = true
}

const isRemoveFromFoldersModalOpened = ref(false)
const isRemoveFromFoldersLoading = ref(false)
const hasRemainingCollaboratorFolder = ref(false)
const rowRemoveCurrentUserFolderId = ref<number>()

const foldersToRemoveIds = computed<number[]>(() =>
  rowRemoveCurrentUserFolderId.value !== undefined ? [rowRemoveCurrentUserFolderId.value] : selectedFolderIds.value,
)

async function checkLastCollaboratorAndOpenRemovalModal() {
  if (foldersToRemoveIds.value.length === 0) {
    return
  }

  try {
    const remainingCollaboratorCheck = await checkLastCollaboratorOnAccounts(foldersToRemoveIds.value)

    hasRemainingCollaboratorFolder.value = remainingCollaboratorCheck.isLastCollaboratorOnAny
    isRemoveFromFoldersModalOpened.value = true
  } catch (error) {
    logger.error('Unable to check remaining collaborator accounts', error)
    displayNotification('error', t('removeFromFoldersCheckError'))
  }
}

async function openRemoveFromFoldersConfirmationModal() {
  rowRemoveCurrentUserFolderId.value = undefined
  await checkLastCollaboratorAndOpenRemovalModal()
}

const handleDisplayRemoveCurrentUserFromFolderModal = async (row: RegularWalletData) => {
  rowRemoveCurrentUserFolderId.value = row.accountId
  await checkLastCollaboratorAndOpenRemovalModal()
}

async function confirmRemoveFromFolders() {
  if (foldersToRemoveIds.value.length === 0) {
    return
  }

  isRemoveFromFoldersLoading.value = true
  try {
    const response = await removeCurrentUserFromAccounts({ accountIds: foldersToRemoveIds.value })
    const succeededCount = response.succeeded.length
    const selectedCount = response.succeeded.length + response.failed.length
    const failedCount = selectedCount - succeededCount
    const successMessageKey = selectedCount === 1
      ? 'removeFromFoldersSuccessSingle'
      : 'removeFromFoldersSuccessMultiple'
    const remainingFoldersFailureMessageKey = failedCount === 1
      ? 'removeFromFoldersRemainingFailureSingle'
      : 'removeFromFoldersRemainingFailureMultiple'
    const notification = RemoveFromFoldersManager.getNotification(response, selectedCount, {
      success: t(successMessageKey, { count: selectedCount }),
      partialSuccess: t('removeFromFoldersPartialSuccess', {
        succeededCount,
        selectedCount,
        succeededFolderLabel: t('removeFromFoldersSucceededFolderLabel', succeededCount),
        remainingFoldersFailureMessage: t(remainingFoldersFailureMessageKey),
      }),
      failure: t('removeFromFoldersFailure'),
    })

    displayNotification(notification.type, notification.message)
    isRemoveFromFoldersModalOpened.value = false

    if (succeededCount > 0) {
      const succeededAccountIds = new Set(response.succeeded.map(({ accountId }) => accountId))
      selectedFolderIds.value = selectedFolderIds.value
        .filter(accountId => succeededAccountIds.has(accountId) === false)
      await fetchTableDataAndFavorites()
    }
  } catch (error) {
    logger.error('Unable to remove current user from selected folders', error)
    displayNotification('error', t('removeFromFoldersFailure'))
  } finally {
    isRemoveFromFoldersLoading.value = false
  }
}

const WALLET_ACTION_HANDLERS: Record<ManageWalletAction, () => void | Promise<void>> = {
  [ManageWalletAction.DELEGATE_WALLET]: () => openDelegationDrawerOnTab(DelegationTab.DELEGATE_WALLET),
  [ManageWalletAction.DELEGATE_FOLDERS]: () => openSelectedFoldersDelegationDrawer(),
  [ManageWalletAction.DECLARE_CUSTOMER_RELATION]: () => openBulkCustomerRelationDrawer(true),
  [ManageWalletAction.REMOVE_CUSTOMER_RELATION]: () => openBulkCustomerRelationDrawer(false),
  [ManageWalletAction.REMOVE_FROM_FOLDERS]: () => openRemoveFromFoldersConfirmationModal(),
  [ManageWalletAction.VIEW_PERMANENT_DELEGATIONS]: () => openDelegationDrawerOnTab(DelegationTab.PERMANENT_DELEGATIONS),
  [ManageWalletAction.REQUEST_DELEGATION]: () => openDelegationDrawerOnTab(DelegationTab.REQUEST_DELEGATION),
  [ManageWalletAction.PENDING_DELEGATIONS]: () => openDelegationDrawerOnTab(DelegationTab.PENDING_REQUESTS),
  [ManageWalletAction.CREATE_TEST_ACCOUNT]: () => {
    onEntityCreatorDrawerOpen()
  },
}

const onWalletAction = (action: ManageWalletAction) => WALLET_ACTION_HANDLERS[action]()

// table part
const DEPLOYMENT_STATUSES: DeploymentStatus[] = [
  {
    text: t('toDeploy'),
    color: ENTITY_STATUS_COLOR[EntityStatus.TO_DEPLOY],
    iconName: 'arrowUpCircle',
  },
  {
    text: t('inProgress'),
    color: ENTITY_STATUS_COLOR[EntityStatus.IN_PROGRESS],
    iconName: 'arrowRepeat',
  },
  {
    text: t('connected'),
    color: ENTITY_STATUS_COLOR[EntityStatus.CONNECTED],
    iconName: 'checkCircle',
  },
] as const

const isManageWalletMenuActivated = computed(() => FeatureFlagManager.isManageWalletMenuActivated())

// #region entity creator drawer
const isEntityCreatorDrawerOpen = ref(false)
const hasEntityCreatorPermission = computed(() => CurrentUserManager.hasPermission(GLOBAL_PERMISSIONS.ENTITY_CREATOR))

const hasManageAccess = computed(() =>
  CurrentUserManager.hasPermission(ACTION_PERMISSIONS.MANAGE_ACCESS),
)

const isManageAccessButtonDisabled = computed(() => (manageAccessCount.value ?? 0) < 1)

const onEntityCreatorDrawerOpen = () => isEntityCreatorDrawerOpen.value = true
// #endregion

const searchCriteria = ref<SearchCriteria>({
  currentPage: 0,
  limit: currentPageSize.value,
  search: '',
  sorting: {
    field: '',
    descending: false,
  },
  filterByDeploymentStatus: undefined,
  filterByMissionType: undefined,
  isFavoriteFilter: false,
  isCustomerRelationFilter: false,
})

const searchResult = ref<SearchResult<RegularWalletData>>({
  currentPage: 0,
  items: [],
  totalPage: 0,
  totalItems: 0,
})
const { selectedFolders, selectedFolderIds } = useFolderSelection(searchResult)

const selectedFolderCustomerRelationStatus = computed(() =>
  selectedFolders.value.length === 1
    ? selectedFolders.value[0].isCustomerRelation
    : undefined,
)

function retrieveAndBindAccountsQuery() {
  const { accountNumbers } = route.query
  if (!accountNumbers) {
    return
  }

  if (Array.isArray(accountNumbers)) {
    searchCriteria.value.search = accountNumbers.at(0) ?? undefined
  } else {
    searchCriteria.value.search = `${accountNumbers ?? ''}`
  }
}

const routeQuery = computed(() => route.query)
watch(routeQuery, () => {
  if (route.name === RouteName.FOLDERS) {
    retrieveAndBindAccountsQuery()
    router.replace({
      query: {},
    })
  }
}, {
  immediate: true,
})

onBeforeRouteUpdate((to, from) => {
  if (to.name === from.name && to.query !== from.query) {
    retrieveAndBindAccountsQuery()
  }
})

const handleSearchValueSubmitted = (searchValue: string) => {
  searchCriteria.value.currentPage = 1
  searchCriteria.value.search = searchValue
}

const handlePageRangeChanged = (pageRange: number) => {
  WalletTrackingManager.trackPaginationSizeChanged(pageRange)
  searchCriteria.value.currentPage = 1
  searchCriteria.value.limit = pageRange
}

const paginationLabel = computed(() => getPaginationLabel(t('on'), {
  currentPage: searchCriteria.value.currentPage,
  limit: searchCriteria.value.limit,
  data: searchResult.value.items,
  totalItems: searchResult.value.totalItems,
}))

const putEntitiesInCommonFavorite = (data: Entity[] | undefined) => {
  // map from updated store
  const entitiesInFavorite = data?.map((item: Entity) => ({
    ...item,
    color: 'persian',
  })) as Entity[]

  userStore.setFavoriteEntities(entitiesInFavorite)
}

async function fetchAccountList() {
  isLoading.value = true
  try {
    const queryResult = await fetchWalletData(DEPLOYMENT_STATUSES, searchCriteria.value)

    searchResult.value.items = queryResult.items
    searchResult.value.currentPage = queryResult.currentPage
    searchResult.value.totalPage = queryResult.totalPage
    searchResult.value.totalItems = queryResult.totalItems
  } catch (e) {
    logger.error('Error while fetching data', e)
  }
  isLoading.value = false
}

async function onManageAccessButtonClick() {
  if (hasManageAccess.value && (manageAccessCount.value ?? 0) > 0) {
    AmplitudeService.track('Registry Validation Initiated', {
      registry_validation_initialisation_localisation: 'portefeuille',
    })
    isManageAccessDrawerOpened.value = true
  }
}

const fetchTableDataAndFavorites = async () => {
  const [, data] = await Promise.all([
    fetchAccountList(),
    fetchFavoriteEntities(),
  ])
  putEntitiesInCommonFavorite(data)
}

const handleAddFavorite = async (accountId: number, isFavorite: boolean) => {
  await manageFavoriteEntities(accountId, isFavorite)
  await fetchTableDataAndFavorites()
}

function onUpdateCurrentPage(currentPage: number) {
  WalletTrackingManager.trackPaginationPageClicked(currentPage)
  searchCriteria.value.currentPage = currentPage
}

const manageAccessCount = ref<number>()
async function refreshPageCount() {
  // we just want the totalItems from the api
  const { totalItems } = await fetchAccountOperations(1, 1)

  manageAccessCount.value = totalItems
}

async function loadManageAccessCount() {
  if (!hasManageAccess.value) {
    return
  }
  await refreshPageCount()
}

async function onUpdateManageAccessDrawerOpened(isOpened: boolean) {
  if (!isOpened) {
    await loadManageAccessCount()
  }
}

async function onOfferSaved() {
  await fetchAccountList()
  openOffersDrawer.value = false
}

const totalAccounts = ref(0)

onMounted(async () => {
  loadManageAccessCount()
  await fetchTableDataAndFavorites()
  totalAccounts.value = searchResult.value.totalItems // Store the nb of total account for later use
})

watch(searchCriteria, async () => {
  await fetchAccountList()
}, { deep: true })

const openOffersDrawer = ref(false)
const hasOffersDrawer = ref(false)
const selectedAccountNumber = ref<string>('')
const selectedAccountId = ref<number | undefined>()
const offersDrawerRef = useTemplateRef<InstanceType<typeof OffersDrawer>>('offersDrawer')

const onClickDeploy = async (accountId: number, accountNumber: string, companyName: string) => {
  hasOffersDrawer.value = true
  selectedAccountNumber.value = accountNumber
  selectedAccountId.value = accountId
  selectedCompanyName.value = companyName
  await nextTick() // needed otherwise offersDrawerRef.value is not defined yet
  offersDrawerRef.value?.initDrawerForCurrentAccount()
  openOffersDrawer.value = true
}
const onClickFolder = (entityId: number) => {
  router.push({ name: RouteName.ENTITY_REDIRECT, params: { [RouteParam.ENTITY_ID]: entityId } })
}
const handleFilterByDeploymentStatus = (filterValue: EntityStatus) => {
  searchCriteria.value = {
    currentPage: 0,
    limit: pageSizes.value[0],
    filterByDeploymentStatus: [filterValue.toString()],
    sorting: {
      field: '',
      descending: false,
    },
  }
  searchBar.value.clearSearch()
}
const handleRemoveFilter = () => {
  searchCriteria.value = {
    currentPage: 0,
    limit: pageSizes.value[0],
    sorting: {
      field: '',
      descending: false,
    },
  }
  searchBar.value.clearSearch()
}

const { handleSortCriteria } = useSort()

const handleSortAccount = (param: SortingCriteria) => {
  handleSortCriteria(param, searchCriteria.value)
}

defineExpose({ handleAddFavorite, searchCriteria, isResendActivationEmailDrawerVisible, selectedAccount })
</script>

<style lang="scss" scoped>
.account-deploy__filters {
  // Prevents layout shift when dynamic UI elements like the "Clear" button are shown.
  min-height: 44px;
}
// Ensures a smooth transition when the filter count disappears
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
