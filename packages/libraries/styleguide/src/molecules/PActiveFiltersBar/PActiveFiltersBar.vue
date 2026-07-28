<template>
  <div
    class="
      p-active-filters-bar
      flex
      flex--align-items-center
      flex--wrap
      flex-gap--2
    "
    data-testid="p-active-filters-bar"
  >
    <PFilterOption
      v-for="filter in visibleFilters"
      :key="filter.pCode"
      pSelected
      :pValue="filter.pValue"
      :pContent="filter.pContent"
      :pColor="filter.pColor"
      :pIconName="filter.pIconName"
      data-testid="p-active-filters-bar__item"
      @update:p-selected="onUpdateSelected(filter.pCode, $event)"
    />
    <PTag
      v-if="hasOverflow"
      pSize="large"
      pColor="default"
      :pContent="`+${overflowCount}`"
      data-testid="p-active-filters-bar__overflow"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import PFilterOption from '../../atoms/PFilterOption'
import PTag from '../../atoms/PTag'
import type { PActiveFiltersBarProps } from './PActiveFiltersBarTypes'

const props = withDefaults(defineProps<PActiveFiltersBarProps>(), {
  pMaxVisible: 4,
})

const emit = defineEmits<{
  remove: [string]
}>()

const visibleFilters = computed(() => props.pFilters.slice(0, props.pMaxVisible))
const overflowCount = computed(() => props.pFilters.length - props.pMaxVisible)
const hasOverflow = computed(() => overflowCount.value > 0)

const onUpdateSelected = (code: string, isSelected: boolean) => {
  if (isSelected === false) {
    emit('remove', code)
  }
}
</script>
