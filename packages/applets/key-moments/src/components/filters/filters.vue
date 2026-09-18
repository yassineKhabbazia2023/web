<template>
  <div
    class="
      key-moments-filters
      flex
      flex--wrap
      flex--align-items-flex-end
      flex-gap--8
      padding-y--4
    "
    data-testid="key-moments-filters"
  >
    <!-- A model alone: it is always laid out on its most recent version -->
    <FilterField
      :label="t('keyMoments.filters.template')"
      testId="key-moments-filter-model"
    >
      <template #default>
        <PDropdown
          class="key-moments-filters__model-select"
          :modelValue="selectedModelCode"
          :pOptions="templateModels"
          :pAriaLabel="t('keyMoments.filters.template')"
          :pDisabled="disabled === true"
          pFilterable
          pSize="small"
          pTestId="key-moments-filter-model"
          @update:model-value="code => emit('select-model', code as string)"
        />
      </template>
    </FilterField>

    <!-- A single comparison stays displayed, locked and explained, rather than vanishing -->
    <FilterSegment
      v-if="comparisonOptions.length > 0"
      :label="t('keyMoments.filters.comparison')"
      :options="comparisonOptions"
      :selectedValue="selectedReferenceKey ?? ''"
      :hint="comparisonHint"
      :disabled="isComparisonLocked || disabled === true"
      testId="key-moments-filter-comparison"
      @select="value => emit('select-comparison', String(value))"
    />

    <FilterSegment
      :label="t('keyMoments.filters.unit')"
      :options="unitOptions"
      :selectedValue="isInThousands"
      :disabled="disabled === true"
      testId="key-moments-filter-unit"
      @select="value => emit('toggle-thousands', value === true)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDropdown } from '@pulse/styleguide/components'
import type { PDropdownOption } from '@pulse/styleguide/types'
import FilterField from './filter-field.vue'
import FilterSegment from './filter-segment.vue'
import type { FilterOption } from '../../types/key-moments.types'

const props = defineProps<{
  templateModels: PDropdownOption[]
  selectedModelCode: string | undefined
  comparisonOptions: FilterOption[]
  selectedReferenceKey: string | undefined
  isInThousands: boolean
  /** While the figures load: a choice made then would settle on a report not yet on screen */
  disabled?: boolean
}>()

const emit = defineEmits<{
  'select-model': [string]
  'select-comparison': [string]
  'toggle-thousands': [boolean]
}>()

const { t } = useI18n()

const unitOptions = computed<FilterOption[]>(() => [
  { value: false, label: t('keyMoments.filters.units.euro') },
  { value: true, label: t('keyMoments.filters.units.thousands') },
])

const isComparisonLocked = computed(() => props.comparisonOptions.length === 1)

const comparisonHint = computed(() => isComparisonLocked.value === false
  ? undefined
  : t('keyMoments.filters.comparisonLocked', { exercise: props.comparisonOptions[0].label }))
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.key-moments-filters {
  border-top: 1px solid var(--key-moments-line);
  border-bottom: 1px solid var(--key-moments-line);

  &__model-select {
    width: 260px;
  }

  // On a phone each field takes the whole line, the only width a full model label fits in
  @include breakpoints.media(xs) {
    gap: 12px;

    > * {
      width: 100%;
    }

    &__model-select {
      width: 100%;
    }
  }
}
</style>
