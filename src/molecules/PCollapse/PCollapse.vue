<template>
  <ElCollapse :accordion="pAccordion">
    <slot />
  </ElCollapse>
</template>

<script setup lang="ts">
import { ElCollapse } from 'element-plus'
import type { PCollapseProps } from './PCollapseTypes'

withDefaults(defineProps<PCollapseProps>(), {
  pAccordion: false
})
</script>