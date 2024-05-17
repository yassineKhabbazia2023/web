<template>
  <ElCheckbox
    class="p-checkbox"
    :class="{
      'p-checkbox--rounded': pRounded
    }">
    <slot />
  </ElCheckbox>
</template>

<script setup lang="ts">
import { ElCheckbox } from 'element-plus'
import type { PCheckboxProps } from './PCheckboxTypes'

withDefaults(defineProps<PCheckboxProps>(), {
  pRounded: false,
})
</script>
