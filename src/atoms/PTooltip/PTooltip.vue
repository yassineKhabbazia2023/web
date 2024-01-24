<template>
  <ElTooltip
    popperClass="p-tooltip shadow--4"
    :content="pContent"
    :disabled="disabled"
    :placement="pPlacement"
  >
    <slot />
  </ElTooltip>
</template>

<script setup lang="ts">
import { ElTooltip } from 'element-plus'
import type { PTooltipProps } from './PTooltipTypes'

withDefaults(defineProps<PTooltipProps>(), {
  disabled: false,
  pPlacement: 'top'
})
</script>

<style lang="scss">
.el-popper {
  white-space: pre-line; // This update helps to avoid using v-html
}
</style>
