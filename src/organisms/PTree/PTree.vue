<template>
  <el-tree
    ref="treeElement"
    class="p-tree"
    :data="data"
    :props="dataKeys"
    :icon="treeLineIcon"
    highlightCurrent
    @node-click="handleNodeClicked"
  >
    <template v-if="hasCustomNodes" #default="slotProps">
      <slot v-bind="slotProps"></slot>
    </template>
  </el-tree>
</template>

<script setup lang="ts">
import { ElTree } from 'element-plus'
import type { PTreeProps } from './PTreeTypes'
import { iconResolver } from '@/utils/iconResolver'

const treeLineIcon = iconResolver('PICaretRightFill')

withDefaults(defineProps<PTreeProps>(), {
  hasCustomNodes: false
})
const emit = defineEmits(['p-tree-node-clicked'])

const handleNodeClicked = (node: any) => {
  emit('p-tree-node-clicked', node)
}

</script>
