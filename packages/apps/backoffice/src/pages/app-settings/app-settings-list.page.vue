<template>
  <div class="app-settings-list-page">
    <div class="padding-y--2 padding-x--6 padding-bottom--0">
      <div class="flex flex--align-items-center flex-gap--2 margin-bottom--2">
        <h1 class="font-large font-bold text-color--black-rock-900">
          Variables d'environnement
        </h1>
        <PTag
          v-if="shouldShowCount"
          class="margin-left--2"
          pColor="info"
          :pContent="variablesCountLabel"
        />
      </div>
      <p class="text-color--neutral-gray-500 font-small">
        Gérez et consultez les variables de configuration pour tous vos environnements
      </p>
    </div>

    <AppSettingsToolbar
      v-model:searchQuery="searchQuery"
      v-model:selectedDomains="selectedDomains"
      :isRefreshing
      class="margin-top--6"
      @refresh="handleRefresh"
      @reload-list="initialize"
    />

    <div
      v-if="isLoading === false"
      class="padding-x--6 padding-top--2"
      data-testid="app-settings-filters-container"
    >
      <PFilterGroup
        v-model="selectedFilters"
        :pFilters="filterOptions"
        data-testid="app-settings-filters"
      />
    </div>

    <div
      v-if="isLoading === true"
      class="app-settings-list-page__loader flex flex--direction-column flex--align-items-center
        flex--justify-content-center flex-gap--4"
    >
      <PLoader
        pType="no-color"
        pSize="60"
      />
      <p class="text-color--neutral-gray-500 font-small text-center margin-top--4">
        Veuillez patienter, la récupération des clés depuis Azure App Configuration peut prendre quelques
        instants...
      </p>
    </div>

    <div
      v-if="isLoading === false"
      class="padding--6"
    >
      <AppSettingsTable
        :appSettings
        :totalCount="pagination.totalCount"
        :currentPage="pagination.currentPage"
        :pageSize="pagination.pageSize"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        @app-setting-deleted="initialize"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { PLoader, PTag, PFilterGroup } from '@pulse/styleguide/components'
import type { FilterOption } from '@pulse/styleguide/types'
import { useAppSettingsList } from '@backoffice/composables/use-app-settings-list.composable'
import { FilterCode } from '@backoffice/types/app-settings-list.type'
import AppSettingsTable from './AppSettingsTable/app-settings-table.vue'
import AppSettingsToolbar from './AppSettingsToolbar/app-settings-toolbar.vue'

const {
  appSettings,
  isLoading,
  isRefreshing,
  searchQuery,
  selectedDomains,
  selectedFilters,
  pagination,
  variablesCountLabel,
  handlePageChange,
  handlePageSizeChange,
  handleRefresh,
  initialize,
} = useAppSettingsList()

const shouldShowCount = computed(() => isLoading.value === false && pagination.value.totalCount > 0)

// Define filter options for PFilterGroup
const filterOptions: FilterOption<FilterCode>[] = [
  {
    pCode: FilterCode.MISSING,
    pContent: 'Valeurs manquantes',
    pColor: 'danger',
    pIconName: 'exclamationTriangle',
  },
  {
    pCode: FilterCode.INCOHERENT,
    pContent: 'Valeurs incohérentes',
    pColor: 'warning',
    pIconName: 'exclamationTriangle',
  },
]

onMounted(() => {
  initialize()
})
</script>

<style lang="scss" scoped>
.app-settings-list-page__loader {
  min-height: 400px;
}
</style>
