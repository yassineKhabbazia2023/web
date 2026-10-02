<template>
  <div
    class="
      key-moments-filters
      flex
      flex--wrap
      flex--align-items-center
      flex-gap--6
    "
    data-testid="key-moments-filters"
  >
    <!-- A model alone: it is always laid out on its most recent version -->
    <FilterField
      class="key-moments-filters__model-field"
      :label="t('keyMoments.filters.template')"
      testId="key-moments-filter-model"
      isInline
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
      class="key-moments-filters__compact-field"
      :label="t('keyMoments.filters.comparison')"
      :options="comparisonOptions"
      :selectedValue="selectedReferenceKey ?? ''"
      :hint="comparisonHint"
      :disabled="isComparisonLocked || disabled === true"
      testId="key-moments-filter-comparison"
      isInline
      @select="value => emit('select-comparison', String(value))"
    />

    <FilterSegment
      class="key-moments-filters__compact-field"
      :label="t('keyMoments.filters.unit')"
      :options="unitOptions"
      :selectedValue="isInThousands"
      :disabled="disabled === true"
      testId="key-moments-filter-unit"
      isInline
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
  &__model-select {
    width: 260px;
  }

  // On a narrower screen the segments speak for themselves; the caption still names them to a screen reader
  @include breakpoints.media(md2) {
    &__compact-field :deep(.key-moments-filter-field__label) {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      overflow: hidden;
      white-space: nowrap;
      clip-path: inset(50%);
    }
  }

  // On a phone the model takes the whole line, the only width a full label fits in; the two segments share the next
  @include breakpoints.media(xs) {
    gap: 12px;

    &__model-field {
      width: 100%;
    }

    &__model-select {
      width: 100%;
    }
  }
}
</style>
