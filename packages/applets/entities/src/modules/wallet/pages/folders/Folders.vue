<template>
  <div>
    <PStickyBar
      v-if="isCollab && isWalletV2Activated"
      :top="FOLDERS_STICKY_HEADER_TOP"
      class="padding-y--4 bg--base-white"
      data-testid="folders-sticky-header"
    >
      <PListToolbar
        :pSelectedCount="selectedFolders.length"
        :pFilterLabel="t(`${I18N_KEY}.filter`)"
        :pFilterCount="accountFiltersCount"
        :pResetLabel="t(`${I18N_KEY}.reset`)"
        :pDeselectLabel="t(`${I18N_KEY}.deselectSelectedFolders`)"
        data-testid="selected-folders-sticky-bar"
        @open-filters="openFiltersDrawer"
        @clear-filters="clearAllAccountFilters"
        @clear-selection="clearSelectedFolders"
      >
        <template #search>
          <AccountSearchBar
            ref="searchBar"
            :searchValue="searchCriteria.search"
            :searchPlaceholder="searchPlaceholder"
            :accountFiltersCount="accountFiltersCount"
            :hasFilterButton="false"
            @search-value-submitted="handleSearchValueSubmitted"
          />
        </template>
        <!-- Actions are duplicated with the V1 branch below: they diverge (V1 has its own leading divider,
             V2 gets one from PListToolbar) and the V1 branch is dropped once the wallet V2 flag ships. -->
        <template #actions>
          <ManageWalletButton
            v-if="isManageWalletMenuActivated"
            :selectedFoldersCount="selectedFolders.length"
            :selected-folders="selectedFolders"
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
              {{ t(`${I18N_KEY}.createTestAccount`) }}
            </PButton>
            <PButton
              pType="secondary"
              pSize="small"
              @click="openSelectedFoldersDelegationDrawer"
            >
              {{ t(`${I18N_KEY}.delegation`, selectedFolders.length) }}
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
              {{ t(`${I18N_KEY}.manageAccess`) }}
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
        </template>
        <template #filters>
          <PActiveFiltersBar
            :pFilters="activeFilterItems"
            @remove="removeAccountFilter"
          />
        </template>
        <template #summary>
          <PSkeleton v-if="isLoading">
            <template #template>
              <PSkeletonItem
                pVariant="text"
                pWidth="90px"
              />
            </template>
          </PSkeleton>
          <p
            v-else
            class="font-small"
            data-testid="selected-folders-total-count"
          >
            <span class="font-semibold">{{ searchResult.totalItems }}</span>
            {{ t(`${I18N_KEY}.totalFoldersCount`, searchResult.totalItems) }}
          </p>
        </template>
        <template #selection>
          <p
            class="
              font-semibold
              font-small
              text-color--jungle-700
            "
            data-testid="selected-folders-sticky-count"
          >
            {{ selectedFolders.length }}
            {{ t(`${I18N_KEY}.selectedFoldersCount`, selectedFolders.length) }}
          </p>
        </template>
      </PListToolbar>
    </PStickyBar>
    <div
      v-else-if="isCollab"
      class="
        flex
        flex--wrap
        flex--align-items-end
        flex--justify-content-space-between
        flex-gap--3
        flex-row-gap--3
        margin-bottom--3
      "
    >
      <Filters
        v-if="isMobile === false"
        data-testid="filters"
        @filter-by-status="handleFilterByDeploymentStatus"
        @remove-filter="handleRemoveFilter"
      />
      <AccountSearchBar
        ref="searchBar"
        class="
          flex--grow-1
          account-search-bar__search--own-row
          margin-top--3
        "
        :searchValue="searchCriteria.search"
        :searchPlaceholder="searchPlaceholder"
        :accountFiltersCount="accountFiltersCount"
        @search-value-submitted="handleSearchValueSubmitted"
        @open-filters-drawer="openFiltersDrawer"
        @clear-all-filters="clearAllAccountFilters"
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
          :selected-folders="selectedFolders"
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
            {{ t(`${I18N_KEY}.createTestAccount`) }}
          </PButton>
          <PButton
            pType="secondary"
            pSize="small"
            @click="openSelectedFoldersDelegationDrawer"
          >
            {{ t(`${I18N_KEY}.delegation`, selectedFolders.length) }}
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
            {{ t(`${I18N_KEY}.manageAccess`) }}
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
    </div>
    <AccountSearchBar
      v-if="isCollab === false"
      ref="searchBar"
      class="margin-bottom--3"
      :searchValue="searchCriteria.search"
      :searchPlaceholder="searchPlaceholder"
      :accountFiltersCount="accountFiltersCount"
      @search-value-submitted="handleSearchValueSubmitted"
      @open-filters-drawer="openFiltersDrawer"
      @clear-all-filters="clearAllAccountFilters"
    />
    <template v-if="isCollab">
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
    </template>
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
        :sorting="searchCriteria.sorting"
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
        v-if="isLoadMorePaginationActivated === false"
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
      <PSamePagePagination
        v-else-if="hasMoreResults"
        :pLabel="t(`${I18N_KEY}.showMoreResults`)"
        :pLoading="isLoadingMore"
        class="margin-top--6"
        pTestId="folders"
        @load-more="loadMoreResults"
      />
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
import { ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import {
  PLoader,
  PButton,
  PPastille,
  PPagination,
  PIcon,
  PSamePagePagination,
  PSkeleton,
  PSkeletonItem,
  PStickyBar,
  PListToolbar,
  PActiveFiltersBar,
} from '@pulse/styleguide/components'
import { useResponsive } from '@pulse/styleguide'
import { useUserStore } from '@pulse/common/stores'
import { RouteName, RouteParam, AccountType } from '@pulse/common/enums'
import NoResult from '@entities/components/NoResult'
import OffersDrawer from '@entities/components/OffersDrawer'
import ResendActivationEmailDrawer from '@entities/components/ResendActivationEmailDrawer'
import ManageAccessDrawerGlobal from '@entities/components/ManageAccessDrawer/ManageAccessDrawerGlobal'
import { TrackingLocalisation } from '@entities/enums'
import type { AccountRow } from '@entities/types'
import { useWalletFeatureFlags } from '@entities/composables/wallet-feature-flags.composable'
import { DelegationTab } from '@entities/modules/wallet/enums'
import type { EntityStatus } from '@entities/modules/wallet/enums'
import Filters from '../../components/Filters'
import RegularEntityList from '../../components/entities-list/regular-entity/regular-entity.list.vue'
import DelegationDrawer from './components/DelegationDrawer'
import ManageWalletButton from './components/ManageWalletButton/ManageWalletButton.vue'
import RemoveFromFoldersConfirmationModal from './components/RemoveFromFoldersConfirmationModal/remove-from-folders-confirmation-modal.vue'
import BulkCustomerRelationDrawer from './components/BulkCustomerRelationDrawer'
import EntityCreatorDrawer from './components/EntityCreatorDrawer'
import AccountFiltersDrawer from './components/AccountFiltersDrawer/AccountFiltersDrawer.vue'
import AccountSearchBar from './components/AccountSearchBar/AccountSearchBar.vue'
import { useFolders } from './folders.composable'
import { useFoldersAccountFilters } from './folders-account-filters.composable'
import { useFoldersDelegationQueryParams } from './folders-delegation-query-params.composable'
import { useFoldersManageAccess } from './folders-manage-access.composable'
import { useFoldersOffersDrawer } from './folders-offers-drawer.composable'
import { useFoldersWalletActions } from './folders-wallet-actions.composable'
import {
  I18N_KEY,
  FOLDERS_STICKY_HEADER_TOP,
} from './folders.consts'

// #region Composables
const { t } = useI18n()
const router = useRouter()
const { isCollab, user } = storeToRefs(useUserStore())
const { isMobile } = useResponsive()
const {
  isLoadMorePaginationActivated,
  isManageWalletMenuActivated,
  isWalletV2Activated,
} = useWalletFeatureFlags()

// Registered first so the manage access count is requested before the folders list,
// as it was when both loads lived in a single onMounted hook.
const {
  isManageAccessDrawerOpened,
  manageAccessCount,
  hasManageAccess,
  isManageAccessButtonDisabled,
  onManageAccessButtonClick,
  onUpdateManageAccessDrawerOpened,
} = useFoldersManageAccess()

const {
  isLoading,
  isLoadingMore,
  searchCriteria,
  searchResult,
  selectedFolders,
  selectedFolderIds,
  searchPlaceholder,
  pageSizes,
  paginationLabel,
  hasMoreResults,
  totalAccounts,
  fetchAccountList,
  fetchTableDataAndFavorites,
  handleAddFavorite,
  loadMoreResults,
  handleSearchValueSubmitted,
  handlePageRangeChanged,
  onUpdateCurrentPage,
  handleSortAccount,
  resetSearchCriteria,
} = useFolders()

const {
  hasActiveFilters,
  isFiltersDrawerOpen,
  accountFilters,
  accountFiltersCount,
  activeFilterItems,
  openFiltersDrawer,
  applyAccountFilters,
  removeAccountFilter,
  clearAllAccountFilters,
} = useFoldersAccountFilters(searchCriteria, clearSelectedFolders)

const {
  isEntityCreatorDrawerOpen,
  hasEntityCreatorPermission,
  onEntityCreatorDrawerOpen,
  onWalletAction,
  isDelegationDrawerOpened,
  delegationInitialTab,
  foldersToDelegate,
  openSelectedFoldersDelegationDrawer,
  openDelegationDrawerOnTab,
  handleDisplayDelegationDrawer,
  isBulkCustomerRelationDrawerOpened,
  targetCustomerRelationStatus,
  customerRelationDrawerFolders,
  handleDisplayCustomerRelationDrawer,
  handleBulkCustomerRelationUpdated,
  handleBulkCustomerRelationDrawerVisibilityUpdate,
  isRemoveFromFoldersModalOpened,
  isRemoveFromFoldersLoading,
  hasRemainingCollaboratorFolder,
  foldersToRemoveIds,
  handleDisplayRemoveCurrentUserFromFolderModal,
  confirmRemoveFromFolders,
} = useFoldersWalletActions(selectedFolders, selectedFolderIds, fetchTableDataAndFavorites)

const openDelegationDrawerOnPendingRequests = () => openDelegationDrawerOnTab(DelegationTab.PENDING_REQUESTS)

useFoldersDelegationQueryParams(isDelegationDrawerOpened, openDelegationDrawerOnPendingRequests)

const {
  openOffersDrawer,
  hasOffersDrawer,
  selectedCompanyName,
  selectedAccountNumber,
  selectedAccountId,
  onClickDeploy,
  onOfferSaved,
} = useFoldersOffersDrawer(fetchAccountList)
// #endregion

// #region State
const searchBar = useTemplateRef<InstanceType<typeof AccountSearchBar>>('searchBar')

const selectedAccount = ref<AccountRow>()
const isResendActivationEmailDrawerVisible = ref(false)
// #endregion

// #region Methods
function handleDisplayResendActivationEmailDrawer(account: AccountRow) {
  selectedAccount.value = account
  isResendActivationEmailDrawerVisible.value = true
}

function clearSelectedFolders() {
  selectedFolderIds.value = []
}

function onClickFolder(entityId: number) {
  router.push({ name: RouteName.ENTITY_REDIRECT, params: { [RouteParam.ENTITY_ID]: entityId } })
}

function handleFilterByDeploymentStatus(filterValue: EntityStatus) {
  resetSearchCriteria(filterValue)
  searchBar.value?.clearSearch()
}

function handleRemoveFilter() {
  resetSearchCriteria()
  searchBar.value?.clearSearch()
}
// #endregion

defineExpose({
  handleAddFavorite,
  searchCriteria,
  isResendActivationEmailDrawerVisible,
  selectedAccount,
})
</script>

<style lang="scss" scoped>
// Without the wallet V2, the search bar keeps its own row below the statistics filters.
.account-search-bar__search--own-row {
  order: 1;
  flex-basis: 100%;
}
</style>
