<template>
  <ElCheckbox
    class="p-checkbox"
    :class="{
      'p-checkbox--rounded': pRounded
    }"
    :label="pLabel"
    :checked="pChecked"
  >
    <template v-if="$slots.default">
      <slot />
    </template>
  </ElCheckbox>
</template>

<script setup lang="ts">
import { ElCheckbox } from 'element-plus'
import type { PCheckboxProps } from './PCheckboxTypes'

withDefaults(defineProps<PCheckboxProps>(), {
  pRounded: false,
  pChecked: false,
})
</script>
