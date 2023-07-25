<template>
  <el-image :src="resolvedImage"></el-image>
</template>

<script setup lang="ts">
import { imageResolver } from '@/utils/imageResolver'

export interface PImageCustomProps {
  type: string
  name: string
}
const props = defineProps<PImageCustomProps>()
const resolvedImage = imageResolver(props.type, props.name)
</script>
