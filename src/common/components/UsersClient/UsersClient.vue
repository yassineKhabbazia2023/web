<template>
  <div class="flex flex--direction-column sticky-wrapper">
    <div class="flex--grow-1 padding--2">
      <div class="margin-bottom--6">
        <FormSearch @search-value-submitted="handleSearchValueSubmitted" />
      </div>

      <PLoader v-if="state.isLoading" />

      <div v-if="!state.isLoading">
        <TableData
          v-if="state.data.length"
          :data="state.data"
          @click-view-information="handleClickViewInformation"
          @on-sort-change="handleSortChange"
        />

        <NoResult v-if="!state.data.length" />
      </div>
    </div>

    <PPagination
      v-if="shouldShowPagination && state.totalItems"
      @on-page-range-changed="handlePageRangeChanged"
      v-model:p-current-page="state.currentPage"
      v-model:p-page-size="state.limit"
      :pTotal="state.totalItems"
      :pPageSizes="PAGE_SIZES"
      :pPageSizeSelectorGroupLabel="t('numberOfUsersPerPage')"
      pPageSizeSelectorSuffix=""
      pShowTotalPageCounter
      pBackground
      class="flex--grow-0 flex--shrink-0 margin-negative-x--2"
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>
    <DrawerUserDetails
      v-if="state.isDrawerViewDetailsOpened"
      v-model="state.isDrawerViewDetailsOpened"
      :userId="state.selectedUserId"
      :hasDrawerOpened="state.isDrawerViewDetailsOpened"
      :editMode="canEdit"
      @contact-patched= "handlePatch"
      data-testid="viewinfo-drawer"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, onMounted, reactive, watch } from 'vue'
import {
  PLoader,
  PPagination,
} from '@kpmg/styleguide'
import { commonStore, commonApi } from '@kpmg/common'
import { getInitials, removeFalsyValues } from '@/helper'
import {
  PAGE_SIZES,
  DATE_TIME_FORMATS as datetimeFormats,
} from '@/constants'
import NoResult from '@/common/components/NoResult'
import FormSearch from '@/common/components/FormSearch'
import TableData from './components/TableData'
import type { IState, IUserFromApi } from './types'
import DrawerUserDetails from './components/DrawerUserDetails'
import { API_PREFIXES } from '@/common/config/services'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const userStore = commonStore()

const state: IState = reactive({
  data: [],
  currentPage: 1,
  limit: 15,
  totalPages: undefined,
  totalItems: undefined,
  search: undefined,
  isLoading: false,
  sort: undefined,
  isDrawerViewDetailsOpened: false,
  selectedUserId: 0,
})

const handleSearchValueSubmitted = (newSearchValue: string) => {
  state.search = newSearchValue
}

const handlePageRangeChanged = (newItemsPerPage: number) => {
  state.limit = newItemsPerPage
}

const paginationLabel = computed(() =>
  `${1 + ((state.currentPage - 1) * state.limit)}
    - ${((state.currentPage - 1) * state.limit) +
    state.data.length} 
    ${t('on')} ${state.totalItems}`,
)

const shouldShowPagination = computed(() =>
  !state.isLoading && state.totalItems,
)

const canEdit = computed(() => true)

const getQueryParams = () => ({
  pageNumber: state.currentPage,
  pageSize: state.limit,
  search: state.search,
  sort: state.sort,
})

const formatItemsFromApi = (items: IUserFromApi[]) =>
  items.map(({
    firstName,
    lastName,
    personaName,
    contactId,
    creationDate,
    ...rest
  }) => ({
    ...rest,
    initials: getInitials(
      firstName,
      lastName,
    ),
    firstName,
    lastName,
    isOwner: personaName === 'ADMIN/Dirigeant',
    fullName: `${firstName} ${lastName}`,
    isLoggedUser: () => contactId.toString() === userStore.$state.user?.id,
    personaName,
    contactId,
    creationDate: d(new Date(creationDate), 'short'),
  }))

const fetch = async () => {
  const queryParamsWithoutUndefined = removeFalsyValues(getQueryParams())
  const searchParams = new URLSearchParams(queryParamsWithoutUndefined)

  state.isLoading = true

  try {
    const {
      data: {
        items,
        currentPage,
        totalPages,
        totalItems,
      },
    } = await commonApi().gateway
      .get(`${API_PREFIXES.CUSTOMER_WALLET}/customers/${userStore.$state.user?.id}?${searchParams}`)

    state.data = formatItemsFromApi(items)
    state.currentPage = currentPage
    state.totalPages = totalPages
    state.totalItems = totalItems
  } catch (err) {
    console.error(err)
  }
  state.isLoading = false
}
const handlePatch = async () => {
  await fetch()
}
const handleClickViewInformation = (selectedUserId: number) => {
  state.selectedUserId = selectedUserId
  state.isDrawerViewDetailsOpened = true
}

const handleSortChange = (sortQueryField:string) => {
  state.sort = sortQueryField
}

onMounted(async () => {
  await fetch()

  watch(() => [
    state.currentPage,
    state.limit,
    state.search,
    state.sort,
  ], async () => {
    await fetch()
  })
})
</script>

<style lang="scss" scoped>
.sticky-wrapper {
  // due to the bottom bar on small screens
  @media (min-width: 993px) {
    min-height: 100%;
  }
}
</style>

<i18n lang="yaml">
en-US:
  numberOfUsersPerPage: 'Number of users per page'
  on: 'on'
fr-FR:
  numberOfUsersPerPage: "Nombre d'utilisateurs par page"
  on: 'sur'
</i18n>
