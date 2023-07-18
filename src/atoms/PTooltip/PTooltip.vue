<template>
  <el-tooltip
    popperClass="shadow--4"
    :content="content"
    :placement="placement"
    :disabled="disabled"
  >
    <slot />
  </el-tooltip>
</template>

<script setup lang="ts">
import type { PlacementOptions } from '@/constants/placementOptions'
import { ElTooltip } from 'element-plus'
interface PTooltipProps {
  placement?: PlacementOptions
  content: string,
  disabled?: boolean
}

withDefaults(defineProps<PTooltipProps>(), {
  placement: 'top',
  disabled: false
})
</script>
