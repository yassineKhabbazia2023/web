<template>
  <div>
    <div class="margin-bottom--3">
      <FormSearch
        ref="searchBar"
        class="max-width-500"
        :placeholder="t('search')"
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
        data-testid="accounts-table"
        :data="searchResult.items"
        isAccountManagement
        @access="handleOpenFolder"
        @display-account-rights-drawer="handleDisplayAccountRightsDrawer"
        @display-resend-activation-email-drawer="handleDisplayResendActivationEmailDrawer"
      />
      <AccountRightsDrawer
        v-if="isAccountRightsDrawerOpened && selectedAccount"
        v-model="isAccountRightsDrawerOpened"
        :selectedAccount="selectedAccount"
      />
      <ResendActivationEmailDrawer
        v-if="isResendActivationEmailDrawerVisible && selectedAccount"
        v-model="isResendActivationEmailDrawerVisible"
        :selectedAccount="selectedAccount"
      />
      <PPagination
        v-model:p-page-size="searchCriteria.limit"
        class="margin-top--6"
        :pCurrentPage="searchResult.currentPage"
        :pTotal="searchResult.totalItems"
        :pPageSizes="PAGE_SIZES"
        pPageSizeSelectorSuffix=""
        pShowTotalPageCounter
        @on-page-range-changed="handlePageRangeChange"
        @update:p-current-page="handlePageChange"
      >
        <p>{{ paginationLabel }}</p>
      </PPagination>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { logger } from '@pulse/core'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import {
  PIArrowRepeat,
  PICheckCircle,
  PIArrowUpCircle,
  PLoader,
  PPagination,
} from '@pulse/styleguide/components'
import NoResult from '@entities/common/components/NoResult'
import FormSearch from '@entities/common/components/FormSearch'
import TableData from '../../components/TableData'
import AccountRightsDrawer from './components/AccountRightsDrawer'
import ResendActivationEmailDrawer from '@entities/common/components/ResendActivationEmailDrawer'
import { fetchWalletData } from '../folders/DeployUtils'
import { getPaginationLabel } from '@entities/helper'
import { ENTITY_STATUS_COLOR, PAGE_SIZES } from '@entities/constants'
import type { AccountRow } from '@entities/common/types'
import type {
  SearchCriteria,
  SearchResult,
  DeploymentStatus,
} from '../../types'
import { EntityStatus } from '@entities/pages/wallet/components/Filters/FiltersTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const router = useRouter()

const isLoading = ref(true)
const selectedAccount = ref<AccountRow>()
const isAccountRightsDrawerOpened = ref(false)
const isResendActivationEmailDrawerVisible = ref(false)

const DEPLOYMENT_STATUSES: DeploymentStatus[] = [
  {
    text: t('toDeploy'),
    color: ENTITY_STATUS_COLOR[EntityStatus.TO_DEPLOY],
  },
  {
    text: t('inProgress'),
    color: ENTITY_STATUS_COLOR[EntityStatus.IN_PROGRESS],
  },
  {
    text: t('connected'),
    color: ENTITY_STATUS_COLOR[EntityStatus.CONNECTED],
  },
]
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

const paginationLabel = computed(() => getPaginationLabel(t('on'), {
  currentPage: searchCriteria.value.currentPage,
  limit: searchCriteria.value.limit,
  data: searchResult.value.items,
  totalItems: searchResult.value.totalItems,
}))

const handleDisplayAccountRightsDrawer = (account: AccountRow) => {
  selectedAccount.value = account
  isAccountRightsDrawerOpened.value = true
}
const handleDisplayResendActivationEmailDrawer = (account: AccountRow) => {
  selectedAccount.value = account
  isResendActivationEmailDrawerVisible.value = true
}
const handleSearchValueSubmitted = (accountNumber: string) => {
  searchCriteria.value.currentPage = 1
  searchCriteria.value.accountNumber = accountNumber
}
const handlePageRangeChange = (pageRange: number) => {
  searchCriteria.value.currentPage = 1
  searchCriteria.value.limit = pageRange
}
const fetchAccountList = async () => {
  isLoading.value = true
  try {
    const queryResult = await fetchWalletData(DEPLOYMENT_STATUSES, searchCriteria.value, true)
    searchResult.value.items = queryResult.items
    searchResult.value.currentPage = queryResult.currentPage
    searchResult.value.totalPage = queryResult.totalPage
    searchResult.value.totalItems = queryResult.totalItems
  } catch (e) {
    logger.error('Error while fetching data', e)
  }
  isLoading.value = false
}
const handlePageChange = (currentPage: number) => {
  searchCriteria.value.currentPage = currentPage
}
const handleOpenFolder = (id: string) => {
  router.push({ name: 'folder', params: { id } })
}

onMounted(async () => {
  await fetchAccountList()
})

watch(searchCriteria, async () => {
  await fetchAccountList()
}, { deep: true })

</script>

<i18n lang="yaml">
  en-US:
    search: "Search by client code or email"
    toDeploy: 'To Deploy'
    inProgress: 'In progress'
    connected: 'Connected'
    on: 'on'
  fr-FR:
    search: "Rechercher par code client ou email"
    toDeploy: 'A déployer'
    inProgress: 'En cours'
    connected: 'Connecté'
    on: 'sur'
</i18n>
