<template>
  <ElCheckboxGroup
    class="p-checkbox-group"
    :disabled="pDisabled"
    :min="pMin"
    :max="pMax"
  >
    <slot />
  </ElCheckboxGroup>
</template>

<script lang="ts" setup>
import { ElCheckboxGroup } from 'element-plus'
import type { PCheckboxGroupProps } from './PCheckboxGroupTypes'

withDefaults(defineProps<PCheckboxGroupProps>(), {
  pDisabled: false,
})
</script>
