<template>
  <PIcon v-if="iconProperties.color" :color="iconProperties.color">
    <component :is="iconProperties.icon" />
  </PIcon>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import {
  PIcon,
  PISticky,
  PILoader,
  PICheckCircle,
} from '@pulse/styleguide'

const props = defineProps({
  status: { type: String, required: true },
})
const statusMap = new Map([
  ['Todo', { color: '#5546FF', icon: PILoader }],
  ['Done', { color: '#00B800', icon: PICheckCircle }],
  ['Draft', { color: '#666666', icon: PISticky }],
])

const iconProperties: any = computed(() => statusMap.get(props.status))
</script>
