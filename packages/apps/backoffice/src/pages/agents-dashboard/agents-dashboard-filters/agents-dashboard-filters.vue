<template>
  <div
    class="
      agents-dashboard-filters
      flex
      flex--align-items-end
      flex-gap--4
    "
  >
    <div class="agents-dashboard-filters__field">
      <label
        class="
          agents-dashboard-filters__label
          font-small
          font-semibold
          text-color--neutral-gray-500
          margin-bottom--2
        "
      >
        Date de création
      </label>
      <PDatePicker
        v-model="dateRangeModel"
        pTestId="agents-dashboard-filters-date"
        pType="daterange"
        pRangeSeparator="-"
        pStartPlaceholder="Date de début"
        pEndPlaceholder="Date de fin"
        :pFormat="DATE_FORMAT.FR"
        pClearable
        :pDisabled="isLoading"
        @change="handleFilterChange"
      />
    </div>

    <div class="agents-dashboard-filters__field">
      <label
        class="
          agents-dashboard-filters__label
          font-small
          font-semibold
          text-color--neutral-gray-500
          margin-bottom--2
        "
      >
        Environnement
      </label>
      <PDropdown
        v-model="environmentModel"
        pTestId="agents-dashboard-filters-environment"
        :pOptions="environmentOptions"
        pPlaceholder="Sélectionner"
        pClearable
        :pDisabled="isLoading === true || isLoadingFilters === true"
        :pLoading="isLoadingFilters"
        @change="handleFilterChange"
      />
    </div>

    <div class="agents-dashboard-filters__field">
      <label
        class="
          agents-dashboard-filters__label
          font-small
          font-semibold
          text-color--neutral-gray-500
          margin-bottom--2
        "
      >
        Utilisateur
      </label>
      <PInput
        v-model="lockedByModel"
        pTestId="agents-dashboard-filters-locked-by"
        pPlaceholder="Identifiant utilisateur"
        pClearable
        :pDisabled="isLoading"
        @change="handleFilterChange"
      />
    </div>

    <PButton
      pTestId="agents-dashboard-filters-reset"
      pType="primary"
      pPlain
      :pDisabled="isLoading === true || hasActiveFilters === false"
      @click="handleReset"
    >
      Réinitialiser
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PButton, PDatePicker, PDropdown, PInput } from '@pulse/styleguide/components'
import { DATE_FORMAT } from '@pulse/toolbox'
import type { AgentLocksFiltersState } from '@backoffice/types/agents-dashboard.type'
import type { AgentsDashboardFiltersProps } from './agents-dashboard-filters.type'
import { mapAgentLockEnvironmentsToDropdownOptions } from '../agents-dashboard.helpers'

type DateRangeValue = [Date, Date] | ''

const {
  filters,
  environments,
  isLoading,
  isLoadingFilters,
} = defineProps<AgentsDashboardFiltersProps>()

const emit = defineEmits<{
  'update:filters': [filters: AgentLocksFiltersState]
  'filter-change': []
  'reset-filters': []
}>()

const dateRangeModel = computed<DateRangeValue>({
  get: () => filters.dateRange ?? '',
  set: (value: DateRangeValue) => {
    emit('update:filters', {
      ...filters,
      dateRange: value === '' ? null : value,
    })
  },
})

const environmentModel = computed<number | null>({
  get: () => filters.environmentId,
  set: (value: number | null) => {
    emit('update:filters', {
      ...filters,
      environmentId: value,
    })
  },
})

const lockedByModel = computed<string | null>({
  get: () => filters.lockedBy,
  set: (value: string | null) => {
    emit('update:filters', {
      ...filters,
      lockedBy: value === '' ? null : value,
    })
  },
})

const environmentOptions = computed(() => mapAgentLockEnvironmentsToDropdownOptions(environments))

const hasActiveFilters = computed<boolean>(() =>
  filters.dateRange !== null ||
  filters.environmentId !== null ||
  filters.lockedBy !== null,
)

const handleFilterChange = (): void => {
  emit('filter-change')
}

const handleReset = (): void => {
  emit('reset-filters')
}
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.agents-dashboard-filters {
  @include breakpoints.media(sm) {
    flex-direction: column;
    align-items: stretch;
  }

  &__field {
    flex: 1;
    min-width: 220px;

    :deep(.el-date-editor) {
      width: 100%;
    }
  }

  &__label {
    display: block;
  }
}
</style>
