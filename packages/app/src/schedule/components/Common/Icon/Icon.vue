<template>
  <PIcon
    v-if="iconProperties"
    :color="iconProperties.color"
    :pName="iconProperties.iconName"
  />
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import {
  PIcon,
} from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import type { Status } from '@app/schedule/models/Deadline'
import type { StatusIcon, IconProps } from './IconTypes';

const props = defineProps<IconProps>()

const statusMap = new Map<Status, StatusIcon>([
  ['Todo', { color: AppColors.PRIMARY, iconName: 'loader' }],
  ['Done', { color: AppColors.GREEN, iconName: 'checkCircle' }],
  ['Draft', { color: AppColors.GRAY_500, iconName: 'sticky' }],
])

const iconProperties = computed(() => statusMap.get(props.status))
</script>
