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
        data-testid="filters"
        @filter-by-status="handleFilterByDeploymentStatus"
        @remove-filter="handleRemoveFilter"
      />
      <div>
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
          class="margin-left--2"
          pType="primary"
          pSize="small"
          @click="isDelegationDrawerOpened = true"
        >
          {{ t('delegation', selectedFolders.length) }}
        </PButton>
        <PButton
          v-if="hasManageAccessButton"
          :pDisabled="isManageAccessButtonDisabled"
          class="margin-left--2"
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
        :selectedFolders="selectedFolders"
        :numberOfFoldersInPortfolio="numberOfFoldersInPortfolio"
      />
    </div>
    <div class="margin-bottom--3">
      <FormSearch
        ref="searchBar"
        :forcedValue="searchCriteria.search"
        :placeholder="t('search')"
        class="max-width-500"
        @search-value-submitted="handleSearchValueSubmitted"
      />
    </div>
    <div
      v-if="isLoading"
      class="loader flex flex--justify-content-center flex--align-items-center"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <div v-else>
      <NoResult v-if="searchResult.items.length === 0" />
      <TableData
        v-if="searchResult.items.length > 0"
        data-testid="folders-table"
        :data="searchResult.items"
        :handleAddFavorite="handleAddFavorite"
        @click-deploy="onClickDeploy"
        @access="onClickFolder"
        @selected-folder="onSelectedFolder"
        @display-resend-activation-email-drawer="handleDisplayResendActivationEmailDrawer"
      />
      <PPagination
        v-model:p-page-size="searchCriteria.limit"
        class="margin-top--6"
        :pCurrentPage="searchResult.currentPage"
        :pTotal="searchResult.totalItems"
        :pPageSizes="PAGE_SIZES"
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
      />
      <OffersDrawer
        v-if="openOffersDrawer && selectedAccountId && user"
        v-model="openOffersDrawer"
        :selectedCompanyName="selectedCompanyName"
        :accountNumber="selectedAccountNumber"
        :accountId="selectedAccountId"
        :currentUser="user"
        data-testid="offers-drawer"
      />
    </div>
    <ManageAccessDrawerGlobal
      v-model="isManageAccessDrawerOpened"
      :trackingLocalisation="TrackingLocalisation.WALLET"
      @update:model-value="onUpdateManageAccessDrawerOpened"
    />
  </div>
</template>

<script lang='ts' setup>
import { logger, FeatureFlagManager } from '@pulse/core'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref, watch } from 'vue'
import {
  PLoader,
  PButton,
  PPastille,
  PPagination,
  PIcon,
} from '@pulse/styleguide/components'
import { fetchFavoriteEntities, manageFavoriteEntities } from '@entities/services/wallet'
import { amplitudeService } from '@pulse/common'
import { CurrentUserManager } from '@pulse/common/managers'
import type { Entity } from '@pulse/common/types'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { storeToRefs } from 'pinia'
import NoResult from '@entities/common/components/NoResult'
import FormSearch from '@entities/common/components/FormSearch'
import OffersDrawer from '@entities/pages/entities/components/OffersDrawer'
import { getPaginationLabel } from '@entities/helper'
import { ENTITY_STATUS_COLOR, PAGE_SIZES, PERMISSION_CODES } from '@entities/constants'
import { EntityStatus } from '@entities/pages/wallet/components/Filters/FiltersTypes'
import { fetchWalletData } from './DeployUtils'
import type {
  SearchCriteria,
  SearchResult,
  DeploymentStatus,
  WalletData,
} from '../../types'
import Filters from '../../components/Filters'
import TableData from '../../components/TableData'
import DelegationDrawer from './components/DelegationDrawer'
import EntityCreatorDrawer from './components/EntityCreatorDrawer'
import ResendActivationEmailDrawer from '@entities/common/components/ResendActivationEmailDrawer'
import type { SelectedFolder } from './components/DelegationDrawer/DelegationDrawerTypes'
import type { AccountRow } from '@entities/common/types'
import ManageAccessDrawerGlobal from '@entities/common/components/ManageAccessDrawer/ManageAccessDrawerGlobal'
import { TrackingLocalisation } from '@entities/pages/folder/enums/tracking.enums'
import { useUserStore } from '@pulse/common/stores'
import { RouteName } from '@pulse/common/enums'
import { fetchAccountOperations } from '@entities/services/contact'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { isCollab, user } = storeToRefs(userStore)

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

// delegation part
const isDelegationDrawerOpened = ref(false)
const numberOfFoldersInPortfolio = computed(() => searchResult.value.totalItems)

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

// #region entity creator drawer
const isEntityCreatorDrawerOpen = ref(false)
const hasEntityCreatorPermission = computed(() => CurrentUserManager.hasPermission(PERMISSION_CODES.ENTITY_CREATOR))

const hasManageAccessButton = computed(() =>
  FeatureFlagManager.isAccessManagementGlobalActivated()
  && CurrentUserManager.hasPermission(PERMISSION_CODES.MANAGE_ACCESS),
)
const isManageAccessButtonDisabled = computed(() => (manageAccessCount.value ?? 0) < 1)

const onEntityCreatorDrawerOpen = () => isEntityCreatorDrawerOpen.value = true
// #endregion

const searchCriteria = ref<SearchCriteria>({
  currentPage: 0,
  limit: PAGE_SIZES[0],
  search: '',
  filterByDeploymentStatus: '',
})

const searchResult = ref<SearchResult<WalletData>>({
  currentPage: 0,
  items: [],
  totalPage: 0,
  totalItems: 0,
})

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
  if (route.name === 'folders') {
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
  if (hasManageAccessButton.value && (manageAccessCount.value ?? 0) > 0) {
    amplitudeService.track('Registry Validation Initiated', {
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
  searchCriteria.value.currentPage = currentPage
}

const manageAccessCount = ref<number>()
async function refreshPageCount() {
  // we just want the totalItems from the api
  const { totalItems } = await fetchAccountOperations(1, 1)

  manageAccessCount.value = totalItems
}

async function loadManageAccessCount() {
  if (!hasManageAccessButton.value) {
    return
  }
  await refreshPageCount()
}

async function onUpdateManageAccessDrawerOpened(isOpened: boolean) {
  if (!isOpened) {
    await loadManageAccessCount()
  }
}

onMounted(async () => {
  loadManageAccessCount()
  await fetchTableDataAndFavorites()
})

watch(searchCriteria, async () => {
  await fetchAccountList()
}, { deep: true })

const openOffersDrawer = ref(false)
const selectedAccountNumber = ref<string>('')
const selectedAccountId = ref<number | undefined>()

const onClickDeploy = (accountId: number, accountNumber: string, companyName: string) => {
  openOffersDrawer.value = true
  selectedAccountNumber.value = accountNumber
  selectedAccountId.value = accountId
  selectedCompanyName.value = companyName
}
const onClickFolder = (id: string) => {
  router.push({ name: RouteName.FOLDER, params: { id } })
}
const handleFilterByDeploymentStatus = (filterValue: EntityStatus) => {
  searchCriteria.value = {
    currentPage: 0,
    limit: PAGE_SIZES[0],
    filterByDeploymentStatus: filterValue.toString(),
  }
  searchBar.value.clearSearch()
}
const handleRemoveFilter = () => {
  searchCriteria.value = {
    currentPage: 0,
    limit: PAGE_SIZES[0],
  }
  searchBar.value.clearSearch()
}

const selectedFolders = ref<SelectedFolder[]>([])
const onSelectedFolder = (newSelectedFolder: SelectedFolder) => {
  const hasAlreadySelectedSameFolder = () =>
    selectedFolders.value.some((selectedFolder: SelectedFolder) => selectedFolder.id === newSelectedFolder.id)

  selectedFolders.value =
    hasAlreadySelectedSameFolder()
      ? selectedFolders.value.filter((selectedFolder: SelectedFolder) => selectedFolder.id !== newSelectedFolder.id)
      : [...selectedFolders.value, newSelectedFolder]
}

defineExpose({ handleAddFavorite, searchCriteria, isResendActivationEmailDrawerVisible, selectedAccount })
</script>

<i18n lang="yaml">
  en-US:
    search: "Search by company name, folder ID, first name, last name, and email of the executive"
    toDeploy: 'To Deploy'
    inProgress: 'In progress'
    connected: 'Connected'
    on: 'on'
    delegation: 'Delegate my wallet | Delegate my folder | Delegate my folders'
    createTestAccount: 'Create a test account'
    manageAccess: 'Manage access'
  fr-FR:
    search: 'Rechercher par raison sociale, code client, prénom, nom et e-mail du dirigeant'
    toDeploy: 'A déployer'
    inProgress: 'En cours'
    connected: 'Connecté'
    on: 'sur'
    delegation: 'Déléguer mon portefeuille | Déléguer le dossier | Déléguer les dossiers'
    createTestAccount: 'Créer un compte de test'
    manageAccess: 'Gérer les accès'
</i18n>
