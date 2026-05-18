<template>
  <div>
    <div
      class="
        flex
        flex--justify-content-end
      "
    >
      <PButton
        v-if="isCollab"
        class="margin-bottom--4"
        pType="secondary"
        pSize="small"
        @click="openProspectCreationDrawer"
      >
        <PIcon class="el-button__icon--left" pName="plusLg" />
        {{ t('addProspect') }}
      </PButton>
    </div>

    <ProspectCreationDrawer
      v-if="isProspectCreationDrawerOpened"
      v-model="isProspectCreationDrawerOpened"
      @submit="onProspectCreationSubmit"
    />
    <FormSearch
      :placeholder="searchPlaceholder"
      class="
        width--100
        max-width-500
        margin-bottom--3
      "
      @search-value-submitted="handleSearchValueSubmitted"
    />
    <div
      v-if="isLoading"
      class="
        loader
        flex
        flex--justify-content-center
        flex--align-items-center
      "
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <div v-show="isLoading === false">
      <NoResult v-if="searchResult.items.length === 0" />
      <ProspectEntityList
        v-if="searchResult.items.length > 0"
        :prospectListType="prospectListType"
        :data="searchResult.items"
        @sort-account="handleSortAccount"
        @prospect-archived="fetchProspectsList"
        @access="onClickFolder"
      />
      <PPagination
        class="margin-top--6"
        :pPageSize="searchCriteria.limit"
        :pCurrentPage="searchResult.currentPage"
        :pTotal="searchResult.totalItems"
        :pPageSizes="pageSizes"
        pPageSizeSelectorSuffix=""
        pShowTotalPageCounter
        @on-page-range-changed="handlePageRangeChanged"
        @update:p-current-page="onUpdateCurrentPage"
      >
        <p>{{ paginationLabel }}</p>
      </PPagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { PLoader, PPagination, PButton, PIcon } from '@pulse/styleguide/components'
import ProspectEntityList from '../../components/entities-list/prospect-entity/prospect-entity.list.vue'
import FormSearch from '@entities/components/FormSearch'
import NoResult from '@entities/components/NoResult'
import { useProspects } from './prospects.composable'
import { useUserStore } from '@pulse/common/stores'
import { useSort } from '@pulse/common/composables/sort'
import { RouteName, RouteParam } from '@pulse/common/enums'
import type { SortingCriteria } from '@pulse/common/types'
import { logger } from '@pulse/toolbox'
import ProspectCreationDrawer from './components/prospect-creation-drawer'
import type { ProspectFormData } from './components/prospect-creation-drawer/prospect-creation-drawer.types'

const router = useRouter()
const userStore = useUserStore()
const { isCollab } = storeToRefs(userStore)

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      addProspect: 'Add a prospect',
    },
    'fr-FR': {
      addProspect: 'Ajouter un prospect',
    },
  },
})

const isProspectCreationDrawerOpened = ref(false)

function openProspectCreationDrawer() {
  isProspectCreationDrawerOpened.value = true
}

function onProspectCreationSubmit(formData: ProspectFormData) {
  logger.trace('Prospect form data:', formData)
}

const {
  isLoading,
  searchCriteria,
  searchResult,
  prospectListType,
  searchPlaceholder,
  pageSizes,
  paginationLabel,
  fetchProspectsList,
  handleSearchValueSubmitted,
  handlePageRangeChanged,
  onUpdateCurrentPage,
} = useProspects()

const { handleSortCriteria } = useSort()

function handleSortAccount(sortCriteria: SortingCriteria) {
  handleSortCriteria(sortCriteria, searchCriteria.value)
}

function onClickFolder(accountId: number) {
  router.push({ name: RouteName.ENTITY_REDIRECT, params: { [RouteParam.ENTITY_ID]: accountId } })
}
</script>
