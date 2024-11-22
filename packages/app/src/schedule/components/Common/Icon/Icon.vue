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
} from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'

const props = defineProps({
  status: { type: String, required: true },
})
const statusMap = new Map([
  ['Todo', { color: AppColors.PRIMARY, icon: PILoader }],
  ['Done', { color: AppColors.GREEN, icon: PICheckCircle }],
  ['Draft', { color: AppColors.GRAY_500, icon: PISticky }],
])

const iconProperties: any = computed(() => statusMap.get(props.status))
</script>
