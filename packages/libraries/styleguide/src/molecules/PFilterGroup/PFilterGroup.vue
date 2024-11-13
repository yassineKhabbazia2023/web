<template>
  <ul
    class="
      p-filter-group
      list-style-none
      flex
      flex--align-items-center
      flex--justify-content-flex-start
      flex-gap--3
    "
  >
    <li
      v-for="({ pCode, pValue, pContent, pColor, pSelected, pDisabled, pIcon }, index) in internalFilters"
      :key="index"
      class="p-filter-group__item"
      data-testid="p-filter-group-item"
    >
      <PFilterOption
        :pValue="pValue"
        :pContent="pContent"
        :pColor="pColor"
        :pSelected="pSelected"
        :pDisabled="pDisabled"
        :pIcon="pIcon"
        @update:p-selected="onToggleSelected(pCode, $event)"
      />
    </li>
  </ul>
</template>

<script setup lang="ts" generic="T = string">
import { computed } from 'vue'
import PFilterOption from '../../atoms/PFilterOption'
import type { PFilterGroupProps } from './PFilterGroupTypes'

const props = defineProps<PFilterGroupProps<T>>()

const emit = defineEmits<{
  'update:model-value': [T[]]
}>()

function onToggleSelected(pCode: T, isSelected: boolean) {
  const isPresent = props.modelValue.includes(pCode)

  if (isSelected && !isPresent) {
    const selectedCodes = [...props.modelValue, pCode]
    emitUpdateSelectedCodes(selectedCodes)
  }
  if (!isSelected && isPresent) {
    const selectedCodes = props.modelValue.filter(code => code !== pCode)
    emitUpdateSelectedCodes(selectedCodes)
  }
}

function emitUpdateSelectedCodes(selectedCodes: T[]) {
  emit('update:model-value', selectedCodes)
}

const internalFilters = computed(() => props.pFilters
  .map(({ pCode, pValue, pContent, pColor, pDisabled, pIcon }) => ({
    pCode,
    pValue,
    pContent,
    pColor,
    pDisabled,
    pIcon,
    pSelected: props.modelValue?.includes(pCode),
  })))
</script>
