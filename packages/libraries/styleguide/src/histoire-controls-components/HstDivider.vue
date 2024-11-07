<template>
  <el-divider borderStyle="dotted" contentPosition="left">
    <span>{{ props.content }}</span>
  </el-divider>
</template>

<script lang="ts">
export default {
  name: 'HstColor',
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
const props = defineProps<{
  content?: string
}>()
</script>
