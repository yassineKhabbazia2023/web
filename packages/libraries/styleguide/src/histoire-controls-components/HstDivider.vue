<template>
  <ElDivider borderStyle="dotted" contentPosition="left">
    <span>{{ props.content }}</span>
  </ElDivider>
</template>

<script lang="ts">
import { ElDivider } from 'element-plus'

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
