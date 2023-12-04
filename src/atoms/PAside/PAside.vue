<template>
  <el-aside :width="pWidth">
    <slot />
  </el-aside>
</template>

<script lang="ts" setup>
  import { ElAside } from 'element-plus'
  import type { PAsideProps } from './PAsideTypes'

  const props = withDefaults(defineProps<PAsideProps>(), {
    pWidth: '300px'
  })
</script>