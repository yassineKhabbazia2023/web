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
        @search-value-submitted="handleSearchValueSubmitted"
        :placeholder="t('search')"
      />
    </div>

    <PLoader v-if="state.isLoading" />

    <div v-if="!state.isLoading">
      <NoResult v-if="!state.data.length" />

      <TableData
        v-if="numberOfFoldersInPortfolio"
        data-testid="table"
        :data="state.data"
        :handleAddFavorite="handleAddFavorite"
        @click-deploy="onClickDeploy"
        @access="onClickFolder"
        @selected-folder="onSelectedFolder"
      />

      <PPagination
        v-if="!!state.totalItems && state.totalItems > state.limit"
        @on-page-range-changed="handlePageRangeChanged"
        v-model:p-current-page="state.currentPage"
        v-model:p-page-size="state.limit"
        :pTotal="state.totalItems"
        :pPageSizes="PAGE_SIZES"
        :pPageSizeSelectorGroupLabel="t('numberOfFoldersPerPage')"
        pPageSizeSelectorSuffix=""
        pShowTotalPageCounter
        pBackground
      >
        <p>{{ paginationLabel }}</p>
      </PPagination>

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
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  PIArrowRepeat,
  PICheckCircle,
  PIArrowUpCircle,
  PLoader,
  PButton,
  PPagination,
} from '@kpmg/styleguide'
import { type Entity, commonApi, commonStore } from '@kpmg/common'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import NoResult from '@/components/NoResult'
import FormSearch from '@/components/FormSearch'
import OffersDrawer from '@/pages/entities/components/OffersDrawer'
import { removeFalsyValues } from '@/helper'
import { PAGE_SIZES } from '@/constants'
import type { IEntity, IState, ICommonEntitiesInFavorite, IWalletData } from '../../types'
import Filters from '../../components/Filters'
import type { EntityStatus } from '../../components/Filters/types'
import TableData from '../../components/TableData'
import DelegationDrawer from './components/DelegationDrawer'
import type { SelectedFolder } from './components/DelegationDrawer/DelegationDrawerTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const userStore = commonStore()
const router = useRouter()
const selectedCompanyName = ref('')
const { isCollab, user } = storeToRefs(userStore)

// delegation part
const isDelegationDrawerOpened = ref(false)
const numberOfFoldersInPortfolio = computed(() => state.data.length)

// table part
const DEPLOYMENTS = [
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
]

const getInitial = ({ firstName, lastName }: { firstName: string, lastName: string }) => {
  if (firstName && lastName) {
    return firstName[0] + lastName[0]
  }
}

const state: IState = reactive({
  data: [],
  currentPage: 1,
  limit: 15,
  totalPage: undefined,
  totalItems: undefined,
  search: undefined,
  isLoading: undefined,
  filterByDeploymentStatus: undefined,
})

const handleSearchValueSubmitted = (searchValue: string) => {
  state.search = searchValue
}

const handlePageRangeChanged = (newValue: number) => {
  state.limit = newValue
}

const paginationLabel = computed(() =>
  `${1 + ((state.currentPage - 1) * state.limit)}
   - ${((state.currentPage - 1) * state.limit) +
    state.data.length}
   ${t('on')} ${state.totalItems}`,
)

const DEFAULT_ENTITY_VALUES = {
  ibs: 'IBS93781560ZE19',
  color: 'persian',
}

const fetchFavorites = async () =>
  await commonApi().wallet.get('favorites')

const putEntitiesInCommonFavorite = (data: ICommonEntitiesInFavorite[]) => {
  const entitiesInFavorite = data
    .map(({ name, id: idAccount }: ICommonEntitiesInFavorite) => ({
      name,
      idAccount,
      ibs: DEFAULT_ENTITY_VALUES.ibs,
      color: DEFAULT_ENTITY_VALUES.color,
    })) as Entity[]

  userStore.$patch({
    user: {
      entities: {
        favorites: entitiesInFavorite,
      },
    },
  })
}

const getQueryParams = () => ({
  page: state.currentPage,
  limit: state.limit,
  search: state.search,
  deploymentStatus: state.filterByDeploymentStatus,
})

const fetch = async () => {
  const queryParamsWithoutUndefined = removeFalsyValues(getQueryParams())
  const searchParams = new URLSearchParams(queryParamsWithoutUndefined)
  state.isLoading = true

  try {
    const {
      data: {
        items,
        currentPage,
        totalPage,
        totalItems,
      },
    } = await commonApi().wallet.get(`display?${searchParams}`)
    state.data = items.map(({
      owner,
      city,
      deploymentStatus,
      hub,
      ...rest
    }: IEntity, index: number): IWalletData =>
      ({
        owner: {
          ...owner,
          firstName: owner.firstName?.toLowerCase() ?? '',
          lastName: owner.lastName?.toLowerCase() ?? '',
          initials: getInitial({
            firstName: owner.firstName,
            lastName: owner.lastName,
          }),
          avatarColor: owner.avatarColor ?? getColor(index),
        },
        hub: hub ?? 'Paris',
        city: city?.toLowerCase() ?? '',
        deploymentStatus: DEPLOYMENTS[deploymentStatus - 1],
        ...rest,
      }))
    state.currentPage = currentPage
    state.totalPage = totalPage
    state.totalItems = totalItems
  } catch (err) {
    console.error(err)
  }
  state.isLoading = false
}

const COLOR = [
  'persian', 'orange', 'green', 'teal', 'fuschia',
]

/// function predictable color
/// to replace by real data from api when api is done
const getColor = (index: number) => {
  const colorIndex = index % COLOR.length
  return COLOR[colorIndex]
}

const fetchTableDataAndFavorites = async () => {
  const [, { data }] = await Promise.all([
    fetch(),
    fetchFavorites(),
  ])
  putEntitiesInCommonFavorite(data)
}

const handleAddFavorite = async (accountId: string, isFavorite: boolean) => {
  await commonApi().wallet.put(`favorites/${accountId}/${isFavorite}`)
  fetchTableDataAndFavorites()
}

onMounted(async () => {
  await fetchTableDataAndFavorites()

  watch(() => [
    state.currentPage,
    state.limit,
    state.search,
    state.filterByDeploymentStatus,
  ], async () => {
    await fetch()
  })
})

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
  state.filterByDeploymentStatus = filterValue.toString()
}
const handleRemoveFilter = () => {
  state.filterByDeploymentStatus = undefined
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
</script>

<i18n lang="yaml">
  en-US:
    search: 'Find by Company''s name, IBS, Leader, Email, City...'
    toDeploy: 'To Deploy'
    inProgress: 'In progress'
    connected: 'Connected'
    numberOfFoldersPerPage: 'number of folder per page'
    on: 'on'
    delegation: 'Delegate my wallet | Delegate my folder | Delegate my folders'
  fr-FR:
    search: 'Rechercher par Raison sociale, IBS, Dirigeant, Mail, Ville...'
    toDeploy: 'A déployer'
    inProgress: 'En cours'
    connected: 'Connecté'
    numberOfFoldersPerPage: 'nombre de dossier par page'
    on: 'sur'
    delegation: 'Déléguer mon portefeuille | Déléguer le dossier | Déléguer les dossiers'
</i18n>
