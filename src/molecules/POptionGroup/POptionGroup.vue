<template>
  <ElOptionGroup
    :label="pLabel"
    :disabled="pDisabled"
  >
    <slot />
  </ElOptionGroup>
</template>

<script lang="ts" setup>
import { ElOptionGroup } from 'element-plus'
import type { POptionGroupProps } from './POptionGroupTypes'

withDefaults(defineProps<POptionGroupProps>(), {
  pLabel: undefined,
  pDisabled: false
})
</script>
