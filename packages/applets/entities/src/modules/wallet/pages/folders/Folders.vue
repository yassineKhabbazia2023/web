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
        <span class="padding-left--2">{{ t(`${I18N_KEY}.filter`) }}</span>
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
            {{ t(`${I18N_KEY}.clearAll`) }}
          </span>
        </PButton>
      </Transition>
    </div>
    <Transition name="fade">
      <PStickyBar
        v-if="isWalletV2Activated && selectedFolders.length > 0"
        :top="SELECTED_FOLDERS_STICKY_BAR_TOP"
        class="
          bg--jungle-75
          flex
          flex--align-items-center
          flex--justify-content-space-between
          flex-gap--6
          height--10
          margin-bottom--3
          padding-x--6
          shadow--2
          text-color--black-rock-900
        "
        data-testid="selected-folders-sticky-bar"
      >
        <p
          class="font-semibold"
          data-testid="selected-folders-total-count"
        >
          {{ t(`${I18N_KEY}.totalFoldersCount`, searchResult.totalItems) }}
        </p>
        <div class="flex flex--align-items-center flex-gap--6">
          <p
            class="font-semibold"
            data-testid="selected-folders-sticky-count"
          >
            {{ t(`${I18N_KEY}.selectedFoldersCount`, selectedFolders.length) }}
          </p>
          <PButton
            class="
              font-semibold
              padding--0
              text-color--jungle-500
            "
            pType="default"
            pSize="small"
            data-testid="selected-folders-clear-button"
            @click="clearSelectedFolders"
          >
            <span>{{ t(`${I18N_KEY}.deselectSelectedFolders`) }}</span>
            <span class="font-bold margin-left--3">X</span>
          </PButton>
        </div>
      </PStickyBar>
    </Transition>
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
  PStickyBar,
} from '@pulse/styleguide/components'
import { useResponsive } from '@pulse/styleguide'
import { useUserStore } from '@pulse/common/stores'
import { RouteName, RouteParam, AccountType } from '@pulse/common/enums'
import NoResult from '@entities/components/NoResult'
import FormSearch from '@entities/components/FormSearch'
import OffersDrawer from '@entities/components/OffersDrawer'
import ResendActivationEmailDrawer from '@entities/components/ResendActivationEmailDrawer'
import ManageAccessDrawerGlobal from '@entities/components/ManageAccessDrawer/ManageAccessDrawerGlobal'
import { TrackingLocalisation } from '@entities/enums'
import type { AccountRow } from '@entities/types'
import { useWalletFeatureFlags } from '@entities/composables/wallet-feature-flags.composable'
import type { EntityStatus } from '@entities/modules/wallet/enums'
import Filters from '../../components/Filters'
import RegularEntityList from '../../components/entities-list/regular-entity/regular-entity.list.vue'
import DelegationDrawer from './components/DelegationDrawer'
import ManageWalletButton from './components/ManageWalletButton/ManageWalletButton.vue'
import RemoveFromFoldersConfirmationModal from './components/RemoveFromFoldersConfirmationModal/remove-from-folders-confirmation-modal.vue'
import BulkCustomerRelationDrawer from './components/BulkCustomerRelationDrawer'
import EntityCreatorDrawer from './components/EntityCreatorDrawer'
import AccountFiltersDrawer from './components/AccountFiltersDrawer/AccountFiltersDrawer.vue'
import { useFolders } from './folders.composable'
import { useFoldersAccountFilters } from './folders-account-filters.composable'
import { useFoldersManageAccess } from './folders-manage-access.composable'
import { useFoldersOffersDrawer } from './folders-offers-drawer.composable'
import { useFoldersWalletActions } from './folders-wallet-actions.composable'
import {
  I18N_KEY,
  SELECTED_FOLDERS_STICKY_BAR_TOP,
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
  selectedFolderCustomerRelationStatus,
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
  openFiltersDrawer,
  applyAccountFilters,
  clearAllAccountFilters,
} = useFoldersAccountFilters(searchCriteria)

const {
  isEntityCreatorDrawerOpen,
  hasEntityCreatorPermission,
  onEntityCreatorDrawerOpen,
  onWalletAction,
  isDelegationDrawerOpened,
  delegationInitialTab,
  foldersToDelegate,
  openSelectedFoldersDelegationDrawer,
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
const searchBar = useTemplateRef<InstanceType<typeof FormSearch>>('searchBar')

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
.account-deploy__filters {
  // Prevents layout shift when dynamic UI elements like the "Clear" button are shown.
  min-height: 44px;
}
</style>
