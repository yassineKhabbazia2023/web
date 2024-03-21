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
        />

        <NoResult v-if="!state.data.length" />
      </div>
    </div>

    <PPagination
      v-if="shouldShowPagination && !!state.totalItems"
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
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, onMounted, reactive, watch } from 'vue'
import {
  PLoader,
  PPagination
} from '@kpmg/styleguide'
import { commonStore } from '@kpmg/common'
import { getInitials, removeFalsyValues } from '@/helper'
import {
  PAGE_SIZES,
  DATE_TIME_FORMATS as datetimeFormats
} from '@/constants'
import NoResult from '@/components/NoResult'
import FormSearch from '@/components/FormSearch'
import TableData from './components/TableData'
import mock from './mock.json'
import type { IState, IUserFromApi } from './types'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats
})

const userStore = commonStore()

const state: IState = reactive({
  data: [],
  currentPage: 1,
  limit: 15,
  totalPages: undefined,
  totalItems: undefined,
  search: undefined,
  isLoading: false
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
    ${t('on')} ${state.totalItems}`
)

const shouldShowPagination = computed(() =>
  !state.isLoading && !!state.totalItems && state.totalItems > state.limit
)

const getQueryParams = () => ({
  page: state.currentPage,
  limit: state.limit,
  search: state.search
})

const formatItemsFromApi = (items: IUserFromApi[]) =>
  items.map(({
    firstName,
    lastName,
    persona,
    id,
    createdAt,
    ...rest
  }) => ({
    initials: getInitials(
      firstName,
      lastName
    ),
    firstName,
    lastName,
    isOwner: persona === 'Dirigeant',
    fullName: `${firstName} ${lastName}`,
    isLoggedUser: () => id === userStore.$state.user?.id,
    persona,
    id,
    createdAt: d(new Date(createdAt), 'short'),
    ...rest
  }))

const fetch = async () => {
  const queryParamsWithoutUndefined = removeFalsyValues(getQueryParams())
  const searchParams = new URLSearchParams(queryParamsWithoutUndefined)

  state.isLoading = searchParams && true

  try {
    const {
      data: {
        items,
        currentPage,
        totalPages,
        totalItems
      }
    } = await Promise.resolve(mock)
    // TODO: remove mock & searchParams in isLoading (line 128), when endpoint is done
    // await commonApi().gateway.get('account/api/customers?${searchParams}')

    state.data = formatItemsFromApi(items)
    state.currentPage = currentPage
    state.totalPages = totalPages
    state.totalItems = totalItems
  } catch (err) {
    console.error(err)
  }
  state.isLoading = false
}

onMounted(async () => {
  await fetch()

  watch(() => [
    state.currentPage,
    state.limit,
    state.search
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
