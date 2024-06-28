<template>
  <TreeNodeActionsToolbox
    ref="actionToolboxRef"
    triggerType="click"
    :permissions="permissions"
    :selectedOrHovered="selectedOrHovered"
    @p-toolbox-item-clicked="handleItemclicked"
    @p-toolbox-dropdown-visibility-change="handleToolboxDropdownSateChange"
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
import { ref } from 'vue'

const emit = defineEmits([
  'p-toolbox-item-clicked',
  'p-toolbox-dropdown-visibility-change',
])
defineProps<TreeNodeActionsProps>()
const handleItemclicked = (action: string) => {
  emit('p-toolbox-item-clicked', action)
}
const handleToolboxDropdownSateChange = (state: boolean) => {
  emit('p-toolbox-dropdown-visibility-change', state)
}

const actionToolboxRef = ref<InstanceType<any> | null>(null)
function closeActionToolbox() {
  if (!actionToolboxRef.value) return
  actionToolboxRef.value.closePToolbox()
}

defineExpose({
  closeActionToolbox,
})
</script>
<style lang="scss" scoped>
.tree-node__action {
  width: 24px;
  height: 24px;
}
</style>
