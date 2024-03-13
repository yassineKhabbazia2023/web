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
      <slot v-bind="slotProps"></slot>
    </template>
  </ElTree>
</template>

<script setup lang="ts">
import { ElTree } from 'element-plus'
import type { PTreeProps } from './PTreeTypes'
import { iconResolver } from '@/utils/iconResolver'

const treeLineIcon = iconResolver('PICaretRightFill')

withDefaults(defineProps<PTreeProps>(), {
  pCurrentNodeKey: undefined,
  pHasCustomNodes: false,
  pDefaultExpandedKeys: () => [],
})
const emit = defineEmits(['p-tree-node-clicked'])

const handleNodeClicked = (node: any) => {
  emit('p-tree-node-clicked', node)
}

</script>
