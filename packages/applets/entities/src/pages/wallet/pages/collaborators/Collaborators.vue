<template>
  <div class="flex flex--direction-column sticky-wrapper">
    <div class="flex--grow-1 padding--2">
      <div class="margin-bottom--6">
        <FormSearch @search-value-submitted="handleSearchValueSubmitted" />
      </div>

      <div
        v-if="state.isLoading"
        class="loader flex flex--justify-content-center flex--align-items-center"
      >
        <PLoader pType="primary" pSize="50" />
      </div>

      <!--
        The v-show is used just below (instead of a v-if) due to the sorting on the table
        that is done on the back end side. In this case, the table should not be destroyed
        & re render else there is a bug with the caret.
      -->
      <div v-show="!state.isLoading">
        <TableData
          v-if="state.data.length"
          :data="state.data"
          @update-collaborator-details="handleUpdateCollaborateurDetails"
          @update-collaborator-role="handleUpdateCollaborateurRole"
          @on-sort-change="handleSortChange"
        />

        <NoResult v-if="!state.data.length" />
      </div>
    </div>

    <PPagination
      v-if="shouldShowPagination && !!state.totalItems"
      v-model:p-current-page="state.currentPage"
      v-model:p-page-size="state.limit"
      :pTotal="state.totalItems"
      :pPageSizes="PAGE_SIZES"
      :pPageSizeSelectorGroupLabel="t('numberOfCollaboratorsPerPage')"
      pPageSizeSelectorSuffix=""
      pShowTotalPageCounter
      pBackground
      class="flex--grow-0 flex--shrink-0 margin-negative-x--2"
      @on-page-range-changed="handlePageRangeChanged"
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
  PPagination,
} from '@pulse/styleguide/components'
import { getInitials, removeFalsyValues, getPaginationLabel } from '@entities/helper'
import { PAGE_SIZES } from '@entities/constants'
import NoResult from '@entities/common/components/NoResult'
import FormSearch from '@entities/common/components/FormSearch'
import type { ExtendedCollab, State } from './types'
import TableData from './components/TableData'
import { getCollaborators } from '@entities/services/wallet'
import type { Contact } from '@entities/services/contact/contactTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const state: State = reactive({
  data: [],
  currentPage: 1,
  limit: 15,
  totalPages: undefined,
  totalItems: undefined,
  search: undefined,
  isLoading: undefined,
  sort: undefined,
})

const handleSearchValueSubmitted = (searchValue: string) => {
  state.currentPage = 1
  state.search = searchValue
}

const handlePageRangeChanged = (newValue: number) => {
  state.currentPage = 1
  state.limit = newValue
}

const paginationLabel = computed(() => getPaginationLabel<ExtendedCollab>(t('on'), state))

const shouldShowPagination = computed(() =>
  !state.isLoading && !!state.totalItems,
)

const getQueryParams = () => ({
  page: state.currentPage,
  limit: state.limit,
  search: state.search,
  sort: state.sort,
})

const fetch = async () => {
  const queryParamsWithoutUndefined = removeFalsyValues(getQueryParams())
  const searchParams = new URLSearchParams(queryParamsWithoutUndefined)

  state.isLoading = searchParams && true
  try {
    const response = await getCollaborators(
      state.currentPage,
      state.limit,
      null,
      state.search,
      state.sort,
    )
    if (response) {
      state.data = response?.items.map<ExtendedCollab>(({
        firstName,
        lastName,
        office,
        persona,
        id,
        ...rest
      }) => ({
        ...rest,
        initials: getInitials(
          firstName,
          lastName,
        ),
        firstName,
        lastName,
        id,
        fullName: `${firstName} ${lastName}`,
        ibsStatus: '',
        role: persona?.name ?? '',
        office: office ?? '',
      }))
      state.currentPage = response.currentPage
      state.totalPages = response.totalPages
      state.totalItems = response.totalItems
    }
  } catch (err) {
    state.data = []
    console.error(err)
  }
  state.isLoading = false
}
const handleUpdateCollaborateurDetails = (contact: Contact) => {
  const index = state.data.findIndex(c => c.id === contact.id)
  state.data[index].mobilePhone = contact.mobilePhone
  state.data[index].landPhone = contact.landPhone
}

const handleUpdateCollaborateurRole = (contact: Contact) => {
  const index = state.data.findIndex(c => c.id === contact.id)
  state.data[index].role = contact.persona?.name ?? ''
}

const handleSortChange = (sortQueryField: string) => {
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
  numberOfCollaboratorsPerPage: 'Number of collaborators per page'
  on: 'on'
fr-FR:
  numberOfCollaboratorsPerPage: 'Nombre de collaborateurs par page'
  on: 'sur'
</i18n>
