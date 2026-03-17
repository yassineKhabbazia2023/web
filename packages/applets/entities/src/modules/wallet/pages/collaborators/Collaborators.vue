<template>
  <div class="flex flex--direction-column sticky-wrapper">
    <div class="flex--grow-1 padding--2">
      <div class="margin-bottom--6">
        <FormSearch
          class="max-width-500"
          :placeholder="t('search')"
          @search-value-submitted="handleSearchValueSubmitted"
        />
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
        <CollaboratorsList
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
      pPageSizeSelectorSuffix=""
      pShowTotalPageCounter
      class="flex--grow-0 flex--shrink-0 margin-negative-x--2"
      @on-page-range-changed="handlePageRangeChanged"
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/toolbox'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, reactive, watch } from 'vue'
import {
  PLoader,
  PPagination,
} from '@pulse/styleguide/components'
import { getInitials, returnSortQueryField } from '@entities/helpers'
import { getPaginationLabel } from '@pulse/common/utils'
import { removeFalsyValues } from '@pulse/toolbox/utils/object'
import { PAGE_SIZES } from '@pulse/common/constants'
import NoResult from '@entities/components/NoResult'
import FormSearch from '@entities/components/FormSearch'
import type { ExtendedCollab, CollaboratorsState } from '@entities/modules/wallet/types'
import CollaboratorsList from './components/collaborators-list/collaborators-list.vue'
import { getCollaborators } from '@entities/services/collaborator'
import type { Contact } from '@entities/services/contact/contactTypes'
import { SortingCriteria } from '@pulse/common/types'
import { useSort } from '@pulse/common/composables/sort'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      on: 'on',
      search: 'Search by lastname, firstname, email, phone, role, office',
    },
    'fr-FR': {
      on: 'sur',
      search: 'Rechercher par nom, prénom, e-mail, téléphone, rôle ou bureau',
    },
  },
})

const state: CollaboratorsState = reactive({
  data: [],
  currentPage: 1,
  limit: 15,
  totalPages: undefined,
  totalItems: undefined,
  search: undefined,
  isLoading: undefined,
  sorting: {
    field: undefined,
    descending: false,
  },
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
  sort: returnSortQueryField(state.sorting.field ?? '', state.sorting.descending),
})

const fetch = async () => {
  const params = getQueryParams()
  const queryParamsWithoutUndefined = removeFalsyValues(params)
  const searchParams = new URLSearchParams(queryParamsWithoutUndefined)

  state.isLoading = searchParams && true
  try {
    const response = await getCollaborators(
      state.currentPage,
      state.limit,
      null,
      state.search,
      params.sort,
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
    logger.error(err)
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

const handleSortChange = (sortCriteria: SortingCriteria) => {
  const { handleSortCriteria } = useSort()
  handleSortCriteria(sortCriteria, state)
}

onMounted(async () => {
  await fetch()

  watch(() => [
    state.currentPage,
    state.limit,
    state.search,
    state.sorting.field,
    state.sorting.descending,
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

