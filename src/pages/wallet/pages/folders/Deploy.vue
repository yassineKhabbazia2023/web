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
      >
        {{ t('delegation', selectedFolders.length) }}
      </PButton>
      </div>
    <div class="margin-bottom--3">
      <PForm
        ref="formRef"
        :pRules="rules"
        :pModel="formValues"
        @submit.prevent="handleSearchSubmit(formRef)"
      >
        <PFormItem prop="search">
          <PInput
            v-model="formValues.search"
            :pPlaceholder="t('search')"
            :pPrefixIcon="PISearch"
            pName="search"
            pSize="small"
            pType="search"
            pAutofocus
            @keyup="handleSearchSubmit(formRef)"
          />
        </PFormItem>
      </PForm>
    </div>

    <PLoader v-if="state.isLoading" />

    <div v-if="!state.isLoading">
      <NoResult v-if="!state.data.length" />

      <TableData
        data-testid="table"
        v-if="!!state.data.length"
        :data="state.data"
        :handleAddFavorite="handleAddFavorite"
        @click-deploy="onClickDeploy"
        @access="onClickFolder"
        @selectedFolder="onSelectedFolder"
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
        v-if="openOffersDrawer"
        :selectedCompanyName="selectedCompanyName"
        :accountNumber="selectedAccountNumber"
        :accountId="selectedAccountId"
        :userEmail="userStore?.user?.email"
        v-model="openOffersDrawer"
        data-testid="offers-drawer"
      />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useI18n } from 'vue-i18n'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  PForm,
  PFormItem,
  PIArrowRepeat,
  PICheckCircle,
  PIArrowUpCircle,
  PInput,
  PISearch,
  PLoader,
  PButton,
  PPagination
} from '@kpmg/styleguide'
import { type Entity, commonApi, commonStore } from '@kpmg/common'
import type { IEntity, IState, ICommonEntitiesInFavorite, IWalletData } from '../../types'
import Filters from '../../components/Filters'
import { EntityStatus } from '../../components/Filters/types'
import NoResult from '../../components/NoResult'
import TableData from '../../components/TableData'
import OffersDrawer from '@/pages/entities/components/OffersDrawer'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const userStore = commonStore()
const router = useRouter()
const selectedCompanyName = ref('')
const { isCollab } = storeToRefs(userStore)

const PAGE_SIZES = [15, 30, 45, 60]

// search part
const formRef = ref<FormInstance>()
const formValues = reactive({
  search: undefined
})
const rules = reactive<FormRules<typeof formValues>>({
  search: [{
    trigger: 'change',
    min: 3,
    message: t('errorSearchInvalid')
  }]
})
const handleSearchSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  if (formEl.validate) {
    try {
      await formEl.validate()
    } catch (error) {
      return false
    }
  }
  state.search = formValues.search
}

// table part
const DEPLOYMENTS = [
  {
    text: t('toDeploy'),
    icon: PIArrowUpCircle,
    color: 'warning'
  },
  {
    text: t('inProgress'),
    icon: PIArrowRepeat,
    color: 'persian'
  },
  {
    text: t('connected'),
    icon: PICheckCircle,
    color: 'success'
  }
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
  filterByDeploymentStatus: undefined
})

const handlePageRangeChanged = (newValue: number) => {
  state.limit = newValue
}

const paginationLabel = computed(() =>
  `${1 + ((state.currentPage - 1) * state.limit)}
   - ${((state.currentPage - 1) * state.limit) +
    state.data.length}
   ${t('on')} ${state.totalItems}`
)

const DEFAULT_ENTITY_VALUES = {
  ibs: 'IBS93781560ZE19',
  color: 'persian'
}

const fetchFavorites = async () =>
  await commonApi().wallet.get('favorites')

const putEntitiesInCommonFavorite = (data: ICommonEntitiesInFavorite[]) => {
  const entitiesInFavorite = data
    .map(({ name, id: idAccount }: ICommonEntitiesInFavorite) => ({
      name,
      idAccount,
      ibs: DEFAULT_ENTITY_VALUES.ibs,
      color: DEFAULT_ENTITY_VALUES.color
    })) as Entity[]

  userStore.$patch({
    user: {
      entities: {
        favorites: entitiesInFavorite
      }
    }
  })
}

const getQueryParams = () => ({
  page: state.currentPage,
  limit: state.limit,
  search: state.search,
  deploymentStatus: state.filterByDeploymentStatus
})

const removeFalsyValues = (obj: object) =>
  Object.entries(obj)
    // eslint-disable-next-line no-return-assign
    .reduce((acc: any, [key, value]) => (value ? (acc[key] = value, acc) : acc), {})

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
        totalItems
      }
    } = await commonApi().wallet.get(`display?${searchParams}`)
    state.data = items.map(({
      owner,
      city,
      deploymentStatus,
      hub,
      ...rest
    }: IEntity): IWalletData =>
      ({
        owner: {
          ...owner,
          firstName: owner.firstName?.toLowerCase() ?? '',
          lastName: owner.lastName?.toLowerCase() ?? '',
          initials: getInitial({
            firstName: owner.firstName,
            lastName: owner.lastName
          }),
          avatarColor: owner.avatarColor ?? getRandomColor()
        },
        hub: hub ?? 'Paris',
        city: city?.toLowerCase() ?? '',
        deploymentStatus: DEPLOYMENTS[deploymentStatus - 1],
        ...rest
      }))
    state.currentPage = currentPage
    state.totalPage = totalPage
    state.totalItems = totalItems
  } catch (err) {
    console.error(err)
  }
  state.isLoading = false
}

/// function generate random color
/// to replace by real data from api when api is done
const getRandomColor = () => {
  const COLOR = [
    'persian', 'orange', 'green', 'teal', 'fuschia'
  ]
  return COLOR[Math.floor(Math.random() * COLOR.length)]
}

const fetchTableDataAndFavorites = async () => {
  const [, { data }] = await Promise.all([
    fetch(),
    fetchFavorites()
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
    state.filterByDeploymentStatus
  ], async () => {
    await fetch()
  })
})

const openOffersDrawer = ref(false)
const selectedAccountNumber = ref<string>('')
const selectedAccountId = ref<string>('')

const onClickDeploy = (accountId: string, accountNumber: string, companyName: string) => {
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

const selectedFolders: string[] = reactive([])
const onSelectedFolder = (id: string) => {
  const index = selectedFolders.indexOf(id)
  index >= 0
    ? selectedFolders.splice(index, 1)
    : selectedFolders.push(id)
}
</script>

<i18n lang="yaml">
  en-US:
    search: 'Find by Company''s name, IBS, Leader, Email, City...'
    errorSearchInvalid: 'Minimum three characters required'
    toDeploy: 'To Deploy'
    inProgress: 'In progress'
    connected: 'Connected'
    numberOfFoldersPerPage: 'number of folder per page'
    on: 'on'
    delegation: 'Delegate my wallet | Delegate my folder | Delegate my folders'
  fr-FR:
    search: 'Rechercher par Raison sociale, IBS, Dirigeant, Mail, Ville...'
    errorSearchInvalid: 'Trois caractères minimum requis'
    toDeploy: 'A déployer'
    inProgress: 'En cours'
    connected: 'Connecté'
    numberOfFoldersPerPage: 'nombre de dossier par page'
    on: 'sur'
    delegation: 'Déléguer mon portefeuille | Déléguer le dossier | Déléguer les dossiers'
</i18n>
