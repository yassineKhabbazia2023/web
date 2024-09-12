<template>
  <div v-if="isToolBoxVisible || !showSlotIfDataEmpty">
    <PToolbox
      v-if="isToolBoxVisible"
      ref="pToolboxRef"
      :trigger="triggerType"
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
import { ref, computed } from 'vue'
import { PToolbox } from '@kpmg/styleguide'
import { generateToolboxBasicData } from '@ged/modules/common/helpers/toolboxHelper'
import type { TreeNodeActionsToolboxProps } from './TreeNodeActionsToolboxTypes'

const emit = defineEmits([
  'p-toolbox-item-clicked',
  'p-toolbox-dropdown-visibility-change',
])

const props = withDefaults(
  defineProps<TreeNodeActionsToolboxProps>(),
  {
    selectedOrHovered: true,
    isVisible: true,
  },
)

const pToolboxRef = ref<InstanceType<any> | null>(null)
function closePToolbox() {
  if (!pToolboxRef.value) return
  pToolboxRef.value.$refs.dropdownRef.handleClose()
}
defineExpose({ closePToolbox })

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
  emit('p-toolbox-dropdown-visibility-change', state)
}

</script>
