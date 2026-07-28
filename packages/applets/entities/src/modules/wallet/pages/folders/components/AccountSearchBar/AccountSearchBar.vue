<template>
  <div
    class="
      account-search-bar__filters
      flex
      flex--align-items-center
    "
  >
    <FormSearch
      ref="searchBarRef"
      :forcedValue="searchValue"
      :placeholder="searchPlaceholder"
      class="width--100 max-width-500"
      @search-value-submitted="emit('searchValueSubmitted', $event)"
    />
    <PButton
      v-if="hasFilterButton"
      pType="default"
      pSize="small"
      data-testid="account-search-bar__filter-button"
      @click="emit('openFiltersDrawer')"
    >
      <PIcon pName="sliders" />
      <span class="padding-left--2">{{ t(`${I18N_KEY}.filter`) }}</span>
      <Transition name="fade">
        <PPastille
          v-if="accountFiltersCount > 0"
          pType="dark-green"
          pSize="small"
          class="margin-left--2"
          data-testid="account-search-bar__filter-count"
        >
          {{ accountFiltersCount }}
        </PPastille>
      </Transition>
    </PButton>
    <Transition name="fade">
      <PButton
        v-if="hasFilterButton && accountFiltersCount > 0"
        pType="default"
        data-testid="account-search-bar__clear-filters-button"
        @click="emit('clearAllFilters')"
      >
        <span
          class="font-medium text-underline"
          data-testid="account-search-bar__clear-filters-text"
        >
          {{ t(`${I18N_KEY}.clearAll`) }}
        </span>
      </PButton>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PIcon, PPastille } from '@pulse/styleguide/components'
import FormSearch from '@entities/components/FormSearch'
import { I18N_KEY } from '../../folders.consts'
import type { AccountSearchBarProps } from './account-search-bar.types'

const { t } = useI18n()

withDefaults(defineProps<AccountSearchBarProps>(), {
  searchValue: '',
  hasFilterButton: true,
})

const emit = defineEmits<{
  searchValueSubmitted: [string]
  openFiltersDrawer: []
  clearAllFilters: []
}>()

const searchBarRef = useTemplateRef<InstanceType<typeof FormSearch>>('searchBarRef')

function clearSearch() {
  searchBarRef.value?.clearSearch()
}

defineExpose({
  clearSearch,
})
</script>

<style lang="scss" scoped>
.account-search-bar__filters {
  // Prevents layout shift when dynamic UI elements like the "Clear" button are shown.
  min-height: 44px;
}
</style>
