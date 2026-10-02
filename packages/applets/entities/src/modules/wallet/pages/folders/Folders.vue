<template>
  <div>
    <PStickyBar
      v-if="isCollab"
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
            :searchValue="searchCriteria.search"
            :searchPlaceholder="searchPlaceholder"
            :accountFiltersCount="accountFiltersCount"
            :hasFilterButton="false"
            @search-value-submitted="handleSearchValueSubmitted"
          />
        </template>
        <template #actions>
          <ManageWalletButton
            :selectedFoldersCount="selectedFolders.length"
            :selected-folders="selectedFolders"
            @action-selected="onWalletAction"
          />
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
    <AccountSearchBar
      v-if="isCollab === false"
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
      <PSamePagePagination
        v-if="hasMoreResults"
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import {
  PLoader,
  PButton,
  PPastille,
  PSamePagePagination,
  PSkeleton,
  PSkeletonItem,
  PStickyBar,
  PListToolbar,
  PActiveFiltersBar,
} from '@pulse/styleguide/components'
import { useUserStore } from '@pulse/common/stores'
import { AccountType } from '@pulse/common/enums'
import NoResult from '@entities/components/NoResult'
import OffersDrawer from '@entities/components/OffersDrawer'
import ResendActivationEmailDrawer from '@entities/components/ResendActivationEmailDrawer'
import ManageAccessDrawerGlobal from '@entities/components/ManageAccessDrawer/ManageAccessDrawerGlobal'
import { TrackingLocalisation } from '@entities/enums'
import type { AccountRow } from '@entities/types'
import { DelegationTab } from '@entities/modules/wallet/enums'
import RegularEntityList from '../../components/entities-list/regular-entity/regular-entity.list.vue'
import { getEntityRedirectRoute } from '../../components/entities-list/entities-list.utils'
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
  hasMoreResults,
  totalAccounts,
  fetchAccountList,
  fetchTableDataAndFavorites,
  handleAddFavorite,
  loadMoreResults,
  handleSearchValueSubmitted,
  handleSortAccount,
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
  onWalletAction,
  isDelegationDrawerOpened,
  delegationInitialTab,
  foldersToDelegate,
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
  router.push(getEntityRedirectRoute(entityId))
}
// #endregion

defineExpose({
  handleAddFavorite,
  searchCriteria,
  isResendActivationEmailDrawerVisible,
  selectedAccount,
})
</script>
