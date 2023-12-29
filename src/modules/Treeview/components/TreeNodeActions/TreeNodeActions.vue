<template>
  <TreeNodeActionsToolbox
    triggerType="click"
    :permissions="permissions"
    :selectedOrHovered="selectedOrHovered"
    @p-toolbox-item-clicked="handleItemclicked"
    @p-toolbox-dropdown-close="handleToolboxDropdownSateChange"
    :showSlotIfDataEmpty="false"
  >
    <PButton
      class="tree-node__action"
      pCircle
      @click.stop
    >
      <PIcon>
        <PIThreeDots />
      </PIcon>
    </PButton>
  </TreeNodeActionsToolbox>
</template>
<script setup lang="ts">
import { PIThreeDots, PButton, PIcon } from '@kpmg/styleguide'
import TreeNodeActionsToolbox from
  '@/modules/Treeview/components/TreeNodeActions/TreeNodeActionsToolbox'
import { type TreeNodeActionsProps } from
  '@/modules/Treeview/components/TreeNodeActions/TreeNodeActionsTypes'

const emit = defineEmits([
  'p-toolbox-item-clicked',
  'p-toolbox-dropdown-close'
])
defineProps<TreeNodeActionsProps>()
const handleItemclicked = (action: string) => {
  emit('p-toolbox-item-clicked', action)
}
const handleToolboxDropdownSateChange = (state: boolean) => {
  emit('p-toolbox-dropdown-close', state)
}
</script>
<style lang="scss" scoped>
.tree-node__action {
  width: 24px;
  height: 24px;
}
</style>
