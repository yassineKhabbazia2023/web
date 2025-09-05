<template>
  <!-- --el-border-color is a native Element Plus variable -->
  <ElDivider
    :direction="pDirection"
    :borderStyle="pBorderStyle"
    :contentPosition="pContentPosition"
    :style="`--el-border-color: var(--p-${pBorderColor})`"
  >
    <slot />
  </ElDivider>
</template>

<script lang="ts" setup>
import { ElDivider } from 'element-plus'
import type { PDividerProps } from './PDividerTypes'

withDefaults(defineProps<PDividerProps>(), {
  pBorderStyle: 'solid',
  pDirection: 'horizontal',
  pContentPosition: 'center',
  pBorderColor: 'gray-100',
})
</script>
