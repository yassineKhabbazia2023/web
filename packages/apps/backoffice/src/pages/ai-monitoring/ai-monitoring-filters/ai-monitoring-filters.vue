<template>
  <div
    class="
      ai-monitoring-filters
      flex
      flex--align-items-end
      flex-gap--4
    "
  >
    <div class="ai-monitoring-filters__field">
      <label
        class="
          ai-monitoring-filters__label
          font-small
          font-semibold
          text-color--neutral-gray-500
          margin-bottom--2
        "
      >
        Date
      </label>
      <PDatePicker
        v-model="dateRangeModel"
        data-testid="ai-monitoring-filters-date"
        pType="daterange"
        pRangeSeparator="-"
        pStartPlaceholder="Date de début"
        pEndPlaceholder="Date de fin"
        :pFormat="DATE_FORMAT.FR"
        pClearable
        :pDisabled="props.isLoading"
        @change="handleFilterChange"
      />
    </div>

    <div class="ai-monitoring-filters__field">
      <label
        class="
          ai-monitoring-filters__label
          font-small
          font-semibold
          text-color--neutral-gray-500
          margin-bottom--2
        "
      >
        Fonctionnalité
      </label>
      <PDropdown
        v-model="featureModel"
        data-testid="ai-monitoring-filters-feature"
        :pOptions="featureOptions"
        pPlaceholder="Sélectionner"
        pClearable
        :pDisabled="props.isLoading"
        @change="handleFilterChange"
      />
    </div>

    <div class="ai-monitoring-filters__field">
      <label
        class="
          ai-monitoring-filters__label
          font-small
          font-semibold
          text-color--neutral-gray-500
          margin-bottom--2
        "
      >
        Sous-fonctionnalité
      </label>
      <PDropdown
        v-model="subFeatureModel"
        data-testid="ai-monitoring-filters-sub-feature"
        :pOptions="subFeatureOptions"
        pPlaceholder="Sélectionner"
        pClearable
        :pDisabled="isSubFeatureDisabled"
        @change="handleFilterChange"
      />
    </div>

    <div class="ai-monitoring-filters__field">
      <label
        class="
          ai-monitoring-filters__label
          font-small
          font-semibold
          text-color--neutral-gray-500
          margin-bottom--2
        "
      >
        Utilisateur
      </label>
      <PDropdown
        v-model="userModel"
        data-testid="ai-monitoring-filters-user"
        :pOptions="userOptions"
        pPlaceholder="Sélectionner"
        pClearable
        pFilterable
        :pDisabled="props.isLoading"
        @change="handleFilterChange"
      />
    </div>

    <PButton
      data-testid="ai-monitoring-filters-reset"
      pType="primary"
      pPlain
      :pDisabled="props.isLoading === true || hasActiveFilters === false"
      @click="handleReset"
    >
      Réinitialiser
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { PDatePicker, PDropdown, PButton } from '@pulse/styleguide/components'
import { DATE_FORMAT } from '@pulse/toolbox'
import type { AiMonitoringFiltersProps } from './ai-monitoring-filters.type'
import type { AiMonitoringFiltersState } from '@backoffice/types/ai-monitoring.type'
import { useAiMonitoringFilters } from './use-ai-monitoring-filters.composable'

const props = defineProps<AiMonitoringFiltersProps>()

const emit = defineEmits<{
  'update:filters': [filters: AiMonitoringFiltersState]
  'filter-change': []
  'reset-filters': []
}>()

const {
  dateRangeModel,
  featureModel,
  subFeatureModel,
  userModel,
  featureOptions,
  subFeatureOptions,
  userOptions,
  isSubFeatureDisabled,
  hasActiveFilters,
  handleFilterChange,
  handleReset,
} = useAiMonitoringFilters(props, emit)
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.ai-monitoring-filters {
  @include breakpoints.media(sm) {
    flex-direction: column;
    align-items: stretch;
  }

  &__field {
    flex: 1;
    min-width: 200px;

    :deep(.el-date-editor) {
      width: 100%;
    }
  }

  &__label {
    display: block;
  }
}
</style>
