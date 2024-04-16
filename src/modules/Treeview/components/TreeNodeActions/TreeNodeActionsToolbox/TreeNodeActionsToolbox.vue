<template>
  <div v-if="isToolBoxVisible || !showSlotIfDataEmpty">
    <PToolbox
      :trigger="triggerType"
      v-if="isToolBoxVisible"
      :pElements="toolboxBasicData"
      pElementsTestId="ged-tree-node-actions-toolbox"
      @visible-change="handleToolboxDropdownSateChange"
      @p-toolbox-item-clicked="handleItemclicked">
      <slot />
    </PToolbox>
  </div>
  <div v-else>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { PToolbox } from '@kpmg/styleguide'
import { generateToolboxBasicData } from '@/modules/common/helpers/toolboxHelper'
import type { TreeNodeActionsToolboxProps } from './TreeNodeActionsToolboxTypes'

const emit = defineEmits([
  'p-toolbox-item-clicked',
  'p-toolbox-dropdown-close',
])

const props = withDefaults(
  defineProps<TreeNodeActionsToolboxProps>(),
  {
    selectedOrHovered: true,
    isVisible: true,
  },
)
const hasActionButton = computed(() => {
  return props.permissions && props.permissions.length > 0
})
const toolboxBasicData = computed(() => {
  if (hasActionButton.value) {
    return generateToolboxBasicData('folders', props.permissions)
  } else {
    return []
  }
})
const hasToolboxline = computed(() => toolboxBasicData.value?.length)

const isToolBoxVisible = computed(() =>
  hasActionButton.value && hasToolboxline.value && props.selectedOrHovered && props.isVisible)
const handleItemclicked = (action: string) => {
  emit('p-toolbox-item-clicked', action)
}
const handleToolboxDropdownSateChange = (state: boolean) => {
  emit('p-toolbox-dropdown-close', state)
}
</script>
