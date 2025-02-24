<template>
  <ElTree
    ref="treeElement"
    class="p-tree"
    :currentNodeKey="pCurrentNodeKey"
    :defaultExpandedKeys="pDefaultExpandedKeys"
    :data="pData"
    :props="pDataKeys"
    :icon="treeLineIcon"
    highlightCurrent
    :nodeKey="pNodeKey"
    @node-click="handleNodeClicked"
  >
    <template v-if="pHasCustomNodes" #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </ElTree>
</template>

<script setup lang="ts">
import { ElTree } from 'element-plus'
import type { PTreeProps } from './PTreeTypes'
import { getIconComponent } from '../../utils/iconHelper'

const treeLineIcon = getIconComponent('caretRightFill')

const props = withDefaults(defineProps<PTreeProps>(), {
  pCurrentNodeKey: undefined,
  pHasCustomNodes: false,
  pDefaultExpandedKeys: () => [],
})
const emit = defineEmits(['p-tree-node-clicked'])

const handleNodeClicked = (node: any) => {
  emit('p-tree-node-clicked', node)
}

defineExpose({
  props,
})

</script>
