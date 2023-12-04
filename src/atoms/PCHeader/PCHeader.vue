<template>
  <el-header :height="pHeight">
    <slot />
  </el-header>
</template>

<script lang="ts" setup>
  import { ElHeader } from 'element-plus'
  import type { PCHeaderProps } from './PCHeaderTypes'

  const props = withDefaults(defineProps<PCHeaderProps>(), {
    pHeight: '60px'
  })
</script>