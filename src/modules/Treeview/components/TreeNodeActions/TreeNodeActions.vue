<template>
  <PToolbox
    trigger="click"
    v-if="isToolBoxVisible"
    :elements="toolboxBasicData"
    @visible-change="handleToolboxDropdownSateChange"
    @p-toolbox-item-clicked="handleItemclicked"
  >
    <PButton
    class="tree-node__action"
    circle
    @click.stop>
      <PIcon>
        <PIThreeDots />
      </PIcon>
    </PButton>
  </PToolbox>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { PIThreeDots, PToolbox, PButton, PIcon } from '@kpmg/styleguide'
import { generateToolboxBasicData } from '@/modules/common/helpers/toolboxHelper'
import { type TreeNodeActionsProps }
  from '@/modules/Treeview/components/TreeNodeActions/TreeNodeActionsTypes'

const emit = defineEmits([
  'on-toolbox-item-clicked',
  'on-toolbox-dropdown-close'
])
const props = defineProps<TreeNodeActionsProps>()
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
  hasActionButton.value && hasToolboxline.value && props.selectedOrHovered)
const handleItemclicked = (action: string) => {
  emit('on-toolbox-item-clicked', action)
}
const handleToolboxDropdownSateChange = (state: boolean) => {
  emit('on-toolbox-dropdown-close', state)
}
</script>
<style lang="scss" scoped>
.tree-node__action {
  width: 24px;
  height: 24px;
}
</style>
