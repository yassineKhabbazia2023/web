<template>
  <ElCollapse
    :accordion="pAccordion"
    :data-testid="pTestId"
  >
    <slot />
  </ElCollapse>
</template>

<script setup lang="ts">
import { ElCollapse } from 'element-plus'
import type { PCollapseProps } from './PCollapseTypes'

withDefaults(defineProps<PCollapseProps>(), {
  pAccordion: false,
  pTestId: undefined,
})
</script>
