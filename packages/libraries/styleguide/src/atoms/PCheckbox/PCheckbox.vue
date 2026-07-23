<template>
  <ElCheckbox
    class="p-checkbox"
    :class="{
      'p-checkbox--rounded': pRounded,
      'p-checkbox--label-left': pLabelLeft
    }"
    :value="pLabel"
    :disabled="pDisabled"
    :model-value="model"
    :data-testid="pTestId"
    @update:model-value="onUpdateModelValue"
  >
    <template v-if="$slots.default">
      <slot />
    </template>
  </ElCheckbox>
</template>

<script setup lang="ts">
import { ElCheckbox, type CheckboxValueType } from 'element-plus'
import type { PCheckboxProps } from './PCheckboxTypes'

const model = defineModel<boolean>({
  default: false,
})
withDefaults(defineProps<PCheckboxProps>(), {
  pRounded: false,
  pLabelLeft: false,
  pDisabled: undefined,
  pTestId: undefined,
})

const onUpdateModelValue = (value: CheckboxValueType) => {
  if (typeof value !== 'boolean') {
    return
  }

  model.value = value
}
</script>
