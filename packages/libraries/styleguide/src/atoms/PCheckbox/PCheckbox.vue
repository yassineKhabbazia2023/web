<template>
  <ElCheckbox
    class="p-checkbox"
    :class="{
      'p-checkbox--rounded': pRounded
    }"
    :label="pLabel"
    :model-value="model"
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
})

const onUpdateModelValue = (value: CheckboxValueType) => {
  if (typeof value !== 'boolean') {
    return
  }

  model.value = value
}
</script>
