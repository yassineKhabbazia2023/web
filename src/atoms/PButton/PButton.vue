<script setup lang="ts">
import { ElButton } from 'element-plus'
</script>

<template>
  <el-button v-bind="$attrs">
    <slot />
  </el-button>
</template>
