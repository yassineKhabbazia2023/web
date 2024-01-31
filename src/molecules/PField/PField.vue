<template>
  <PFormItem
    :pProp="pFieldKey"
    :pLabel="pLabel"
    :pRules="pRules"
    :class="pCssClass"
    class="flex"
  >
    <PInput
      v-if="pFieldType === 'input'"
      v-model="internalValue"
      :pType="pType"
      :pReadonly="pReadonly"
      :pDisabled="pDisabled"
      :pPlaceholder="pPlaceholder"
    />
    <PDropdown
      class="flex--grow-1"
      v-if="pFieldType === 'dropdown'"
      v-model="internalValue"
      :pOptions="pDropdownOptions"
      :pReadonly="pReadonly"
      :pDisabled="pDisabled"
      :pPlaceholder="pPlaceholder"
    />
  </PFormItem>
</template>

<script setup lang="ts" generic="T">
import { computed } from 'vue'
import PFormItem from '@/atoms/PFormItem'
import PInput from '@/atoms/PInput'
import PDropdown from '@/molecules/PDropdown'
import type { PFieldProps } from './PFieldTypes'

const props = withDefaults(defineProps<PFieldProps<T>>(), {
  pReadonly: false,
  pDisabled: false,
  pDropdownOptions: () => [],
  pPlaceholder: '',
  pRules: () => []
})

const emit = defineEmits<{
  'update:modelValue': [T]
}>()

const internalValue = computed({
  get() {
    return props.modelValue
  },
  set(value: T) {
    emit('update:modelValue', value)
  }
})
</script>
