<template>
  <ElAside :width="pWidth">
    <slot />
  </ElAside>
</template>

<script lang="ts" setup>
import { ElAside } from 'element-plus'
import type { PAsideProps } from './PAsideTypes'

withDefaults(defineProps<PAsideProps>(), {
  pWidth: '300px',
})
</script>
