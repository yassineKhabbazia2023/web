<template>
  <ElBreadcrumb :separatorIcon="ArrowRight" :class="breadCrumpSize">
    <ElBreadcrumbItem
      v-for="(item, index) in items"
      :key="index"
      @click="breadcrumbItemClicked(item.pId)"
    >
      <PTooltip
        :pContent="getFullPathBreadcrumItem(item.pId)"
        :pPlacement="placementOptions[0].value"
        :disabled="item.pId === -1"
      >
        <a href="#">
          {{ item.pText }}
        </a>
      </PTooltip>
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import PTooltip from '../../atoms/PTooltip'
import placementOptions from '../../constants/placementOptions'
import type { PBreadcrumbProps } from './PBreadcrumbTypes'

const props = defineProps<PBreadcrumbProps>()
const emit = defineEmits([
  'p-breadcrumb-item-click',
  'folder-creation-initiated',
])

const items = computed(() => {
  if (props.pElements.length > 6) {
    return [
      ...props.pElements.slice(0, 3),
      { pId: -1, pText: '...' },
      ...props.pElements.slice(-3),
    ]
  } else {
    return props.pElements
  }
})

const breadcrumbItemClicked = (id: number) => {
  if (id !== -1) {
    emit('p-breadcrumb-item-click', id)
  }
}

const getFullPathBreadcrumItem = (id: number) => {
  if (id === -1) {
    return ''
  }

  const element = props.pElements.find((item) => item.pId === id)

  if (!element) {
    return ''
  }

  const index = props.pElements.indexOf(element)

  return props.pElements
    .slice(0, index + 1)
    .map((item) => item.pText)
    .join(' > ')
}

const breadCrumpSize = computed(() => {
  switch (props.pSize) {
  case 'S':
    return 'small'
  case 'M':
    return 'medium'

  default:
    return ''
  }
})
</script>
