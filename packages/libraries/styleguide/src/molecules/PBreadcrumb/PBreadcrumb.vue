<template>
  <ElBreadcrumb :separatorIcon="ArrowRight" :class="['p-breadcrumb', breadCrumpSize]">
    <ElBreadcrumbItem
      v-for="(item, index) in items"
      :key="index"
      data-testid="breadcrumb-item"
      @click="breadcrumbItemClicked(item)"
    >
      <PTooltip
        :pContent="getFullPathBreadcrumItem(item)"
        :pPlacement="placementOptions[0].value"
        :disabled="isTooltipDisabled(item)"
      >
        <span
          v-if="item.isEllipsis !== true"
          data-testid="breadcrumb-item-text"
          class="p-breadcrumb__text"
          :class="{ 'p-breadcrumb__text--current': isCurrentItem(item, index) }"
        >
          {{ item.pText }}
        </span>
        <span
          v-else
          data-testid="breadcrumb-ellipsis-trigger"
          class="p-breadcrumb__trigger"
        >
          <PIcon
            pName="threeDots"
            class="p-breadcrumb__trigger-icon"
          />
        </span>
      </PTooltip>
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import PIcon from '../../atoms/PIcon'
import PTooltip from '../../atoms/PTooltip'
import placementOptions from '../../constants/placementOptions'
import type { DisplayBreadcrumbItem, PBreadcrumbProps } from './PBreadcrumbTypes'

const props = defineProps<PBreadcrumbProps>()
const emit = defineEmits([
  'p-breadcrumb-item-click',
  'folder-creation-initiated',
])

const items = computed<DisplayBreadcrumbItem[]>(() => {
  if (props.pElements.length > 6) {
    return [
      ...props.pElements.slice(0, 3),
      { pId: -1, pText: '...', isEllipsis: true },
      ...props.pElements.slice(-3),
    ]
  } else {
    return props.pElements
  }
})

const breadcrumbItemClicked = (item: DisplayBreadcrumbItem) => {
  if (item.pId !== -1 && item.isEllipsis !== true) {
    emit('p-breadcrumb-item-click', item.pId)
  }
}

const isTooltipDisabled = (item: DisplayBreadcrumbItem) => {
  if (item.isEllipsis === true || item.pId === -1) {
    return true
  }

  return false
}

const getFullPathBreadcrumItem = (item: DisplayBreadcrumbItem) => {
  if (item.isEllipsis === true || item.pId === -1) {
    return ''
  }

  const element = props.pElements.find((breadcrumbItem) => breadcrumbItem.pId === item.pId)

  if (!element) {
    return ''
  }

  const index = props.pElements.indexOf(element)

  return props.pElements
    .slice(0, index + 1)
    .map((breadcrumbItem) => breadcrumbItem.pText)
    .join(' > ')
}

const isCurrentItem = (item: DisplayBreadcrumbItem, index: number) => {
  if (item.isEllipsis === true || item.pId === -1) {
    return false
  }

  return index === items.value.length - 1
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
