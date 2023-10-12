<template>
  <ElTooltip
    popperClass="shadow--4"
    :content="content"
    :placement="placement"
    :disabled="disabled"
  >
    <slot />
  </ElTooltip>
</template>

<script setup lang="ts">
import type { PlacementOptions } from '@/constants/placementOptions'
import { ElTooltip } from 'element-plus'
export interface PTooltipProps {
  placement?: PlacementOptions
  content: string
  disabled?: boolean
}

withDefaults(defineProps<PTooltipProps>(), {
  placement: 'top',
  disabled: false
})
</script>

<style lang="scss">
.el-popper {
  white-space: pre-line; // This update helps to avoid using v-html
}
</style>
