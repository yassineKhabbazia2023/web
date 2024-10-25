<template>
  <div>
    <div
      v-if="isCollab"
      class="flex flex--align-items-center flex--justify-content-space-between"
    >
      <Filters
        @filter-by-status="handleFilterByDeploymentStatus"
        @remove-filter="handleRemoveFilter"
        data-testid="filters"
      />
      <PButton
        pType="primary"
        @click="isDelegationDrawerOpened = true"
      >
        {{ t('delegation', selectedFolders.length) }}
      </PButton>
      <DelegationDrawer
        v-if="isDelegationDrawerOpened"
        v-model="isDelegationDrawerOpened"
        :selectedFolders="selectedFolders"
        :numberOfFoldersInPortfolio="numberOfFoldersInPortfolio"
      />
    </div>
    <div class="margin-bottom--3">
      <FormSearch
        :forcedValue="searchCriteria.search"
        ref="searchBar"
        @search-value-submitted="handleSearchValueSubmitted"
        :placeholder="t('search')"
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
        class="margin-top--6"
        @on-page-range-changed="handlePageRangeChanged"
        :pCurrentPage="searchResult.currentPage"
        @update:p-current-page="onUpdateCurrentPage"
        v-model:p-page-size="searchCriteria.limit"
        :pTotal="searchResult.totalItems"
        :pPageSizes="PAGE_SIZES"
        :pPageSizeSelectorGroupLabel="t('numberOfFoldersPerPage')"
        pPageSizeSelectorSuffix=""
        pShowTotalPageCounter
        pBackground
      >
        <p>{{ paginationLabel }}</p>
      </PPagination>
      <ResendActivationEmailDrawer
        v-if="isResendActivationEmailDrawerVisible && selectedAccount"
        v-model="isResendActivationEmailDrawerVisible"
        :selectedAccount="selectedAccount"
      />
      <OffersDrawer
        v-if="openOffersDrawer && selectedAccountId"
        :selectedCompanyName="selectedCompanyName"
        :accountNumber="selectedAccountNumber"
        :accountId="selectedAccountId"
        :currentUser="user"
        v-model="openOffersDrawer"
        data-testid="offers-drawer"
      />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useI18n } from 'vue-i18n'
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import {
  PIArrowRepeat,
  PICheckCircle,
  PIArrowUpCircle,
  PLoader,
  PButton,
  PPagination,
} from '@pulse/styleguide'
import { fetchFavoriteEntities, manageFavoriteEntities } from '@entities/services/wallet'
import { type Entity, commonStore } from '@pulse/common'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { storeToRefs } from 'pinia'
import NoResult from '@entities/common/components/NoResult'
import FormSearch from '@entities/common/components/FormSearch'
import OffersDrawer from '@entities/pages/entities/components/OffersDrawer'
import { getPaginationLabel } from '@entities/helper'
import { PAGE_SIZES } from '@entities/constants'
import type { EntityStatus } from '../../components/Filters/FiltersTypes'
import { fetchWalletData } from './DeployUtils'
import type {
  SearchCriteria,
  SearchResult,
  DeploymentStatus,
} from '../../types'
import Filters from '../../components/Filters'
import TableData from '../../components/TableData'
import DelegationDrawer from './components/DelegationDrawer'
import ResendActivationEmailDrawer from '@entities/common/components/ResendActivationEmailDrawer'
import type { SelectedFolder } from './components/DelegationDrawer/DelegationDrawerTypes'
import type { AccountRow } from '@entities/common/types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const router = useRouter()
const route = useRoute()
const userStore = commonStore()
const { isCollab, user } = storeToRefs(userStore)

const searchBar = ref()
const isLoading = ref(true)
const selectedCompanyName = ref('')

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
    icon: PIArrowUpCircle,
    color: 'warning',
  },
  {
    text: t('inProgress'),
    icon: PIArrowRepeat,
    color: 'persian',
  },
  {
    text: t('connected'),
    icon: PICheckCircle,
    color: 'success',
  },
] as const

const searchCriteria = ref<SearchCriteria>({
  currentPage: 0,
  limit: PAGE_SIZES[0],
  search: '',
  filterByDeploymentStatus: '',
})

const searchResult = ref<SearchResult>({
  currentPage: 0,
  items: [],
  totalPage: 0,
  totalItems: 0,
})

function retrieveAndBindAccountsQuery() {
  const { accountNumbers } = route.query
  if (Array.isArray(accountNumbers)) {
    searchCriteria.value.search = accountNumbers.at(0) ?? undefined
  } else {
    searchCriteria.value.search = `${accountNumbers ?? ''}`
  }
}

onBeforeMount(() => {
  retrieveAndBindAccountsQuery()
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
  const entitiesInFavorite = data?.map((item: Entity) => ({
    ...item,
    color: 'persian',
  })) as Entity[]

  userStore.$patch({
    user: {
      entities: {
        favorites: entitiesInFavorite,
      },
    },
  })
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
    console.error('Error while fetching data', e)
  }
  isLoading.value = false
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

onMounted(async () => {
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
  router.push({ name: 'folder', params: { id } })
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
    numberOfFoldersPerPage: 'number of folder per page'
    on: 'on'
    delegation: 'Delegate my wallet | Delegate my folder | Delegate my folders'
  fr-FR:
    search: 'Rechercher par nom de société, ID de dossier, prénom, nom et e-mail du dirigeant'
    toDeploy: 'A déployer'
    inProgress: 'En cours'
    connected: 'Connecté'
    numberOfFoldersPerPage: 'nombre de dossier par page'
    on: 'sur'
    delegation: 'Déléguer mon portefeuille | Déléguer le dossier | Déléguer les dossiers'
</i18n>
