<template>
  <div
    data-testid="app-settings-toolbar-container"
    class="
      app-settings-toolbar
      flex
      flex--align-items-top
      flex--justify-content-space-between
      padding-x--6
      padding-bottom--2
    "
  >
    <div class="flex flex--align-items-top">
      <div data-testid="app-settings-toolbar-search">
        <SearchAppSetting v-model="searchQueryModel" />
      </div>
      <div data-testid="app-settings-toolbar-add-button">
        <AddAppSetting @refresh-list="refreshListHandler" />
      </div>
      <PTooltip pContent="Synchroniser avec Azure App Configuration">
        <PButton
          pSize="small"
          pType="primary"
          class="margin-left--2"
          data-testid="app-settings-toolbar-refresh-button"
          :pLoading="isRefreshing"
          :disabled="isRefreshing"
          @click="emit('refresh')"
        >
          <PIcon pName="arrowCounterclockwise" />
        </PButton>
      </PTooltip>
    </div>
    <PDropdown
      v-model="selectedDomainsModel"
      data-testid="app-settings-toolbar-domain-filter"
      class="app-settings-toolbar__domain-filter"
      pPlaceholder="Filtrer par domaine"
      :pOptions="domainOptions"
      fitInputWidth
      pMultiple
      pClearable
      pSize="small"
      :disabled="isLoadingDomains"
    />
  </div>
</template>

<script setup lang="ts">
import { PDropdown, PButton, PTooltip, PIcon } from '@pulse/styleguide/components'
import SearchAppSetting from './SearchAppSetting/search-app-setting.vue'
import AddAppSetting from './AddAppSetting/add-app-setting.vue'
import type { AppSettingsToolbarProps } from './app-settings-toolbar.type'
import { useAppSettingsToolbar } from './app-settings-toolbar.composable'

defineProps<AppSettingsToolbarProps>()

const emit = defineEmits<{
  refresh: []
  'reload-list': []
}>()

const searchQueryModel = defineModel<string>('searchQuery', { default: '' })
const selectedDomainsModel = defineModel<string[]>('selectedDomains', { default: () => [] })

const refreshListHandler = () => {
  emit('reload-list')
}

const { domainOptions, isLoadingDomains } = useAppSettingsToolbar()
</script>

<style lang="scss" scoped>
.app-settings-toolbar__domain-filter {
  width: 300px;
}
</style>
