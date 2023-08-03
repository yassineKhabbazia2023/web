<template>
  <el-breadcrumb :separatorIcon="ArrowRight" :class="breadCrumpSize()">
    <el-breadcrumb-item
      v-for="item in items"
      :key="item.id"
      @click="breadcrumbItemClicked(item.id)"
    >
      <PTooltip
        :content="getFullPathBreadcrumItem(item.id)"
        :placement="placementOptions[0].value"
        :disabled="item.id === -1"
      >
        <a href="#">
          {{ item.text }}
        </a>
      </PTooltip>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import PTooltip from '@/atoms/PTooltip'
import placementOptions from '@/constants/placementOptions'
import { type PBreadcrumbProps } from './PBreadcrumbTypes'

const props = defineProps<PBreadcrumbProps>()
const emit = defineEmits([
  'p-breadcrumb-item-click',
  'folder-creation-initiated'
])

const items = computed(() => {
  if (props.elements.length > 6) {
    return [
      ...props.elements.slice(0, 3),
      { id: -1, text: '...' },
      ...props.elements.slice(-3)
    ]
  } else {
    return props.elements
  }
})

const breadcrumbItemClicked = (id: number) => {
  if (id !== -1) {
    emit('p-breadcrumb-item-click', id)
  }
}

const getFullPathBreadcrumItem = (id: number) => {
  if (id === -1) return ''

  const element = props.elements.find((item) => item.id === id)

  if (!element) return ''

  const index = props.elements.indexOf(element)

  return props.elements
    .slice(0, index + 1)
    .map((item) => item.text)
    .join(' > ')
}

const breadCrumpSize = () => {
  switch (props.size) {
    case 'S':
      return 'small'
    case 'M':
      return 'medium'

    default:
      return ''
  }
}
</script>
