<template>
  <div
    class="tree-node"
    :class="{'tree-node--no-children': !hasChildren}"
    @click="onTreeNodeClick"
    @mouseover="onTreeNodeMouseover"
    @mouseleave="onTreeNodeMouseleave"
  >
    <PIcon
      v-if="!hasChildren"
      class="tree-node__no-child-icon"
      size="12"
    >
      <PIDot />
    </PIcon>

    <PIcon class="tree-node__icon" size="16">
      <component :is="iconsMapping" />
    </PIcon>

    <div class="tree-node__label-with-button">
      <PTooltip
        :disabled="!shouldTooltipBeVisible"
        :content="data.name"
        :showAfter="500"
      >
        <span class="tree-node__label">{{ data.name }}</span>
      </PTooltip>
      <TreeNodeActions
        :permissions="data.permissions"
        :selectedOrHovered="isOpen || isHovered"
        @p-toolbox-item-clicked="handleItemclicked"
        @on-toolbox-dropdown-close="handleToolBoxDropdownStateClose"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  PICalculatorEuro,
  PIDot,
  PIFolder,
  PIInbox,
  PIKpmg,
  PIPersonVcard,
  PITrash,
  PTooltip,
  PIcon
} from '@kpmg/styleguide'

import TreeNodeActions from '@/modules/Treeview/components/TreeNodeActions'
import { type TreeNodeProps }
  from '@/modules/Treeview/components/TreeNode/TreeNodeTypes'

const emit = defineEmits(['on-toolbox-item-clicked', 'update-folder-name'])
const props = defineProps<TreeNodeProps>()
const iconsMapping = computed(() => {
  switch (props.data.iconName) {
    case 'accountingRoot':
      return PICalculatorEuro
    case 'socialRoot':
      return PIPersonVcard
    case 'deposit':
      return PIInbox
    case 'reservedKpmg':
      return PIKpmg
    case 'binIcon':
      return PITrash
    default:
      return PIFolder
  }
})

const hasChildren = computed(() => props.data.children?.length)
const isOpen = ref(false)
const isHovered = ref(false)
const isDropdownOpen = ref(false)
const shouldTooltipBeVisible = computed(() => props.data.name.length > 16)

const handleItemclicked = (action: string) => {
  emit('on-toolbox-item-clicked', action, props.data)
}
const handleToolBoxDropdownStateClose = (state: boolean) => {
  isDropdownOpen.value = state
  if (state === false) {
    isHovered.value = false
    isOpen.value = false
  }
}
const onTreeNodeClick = () => {
  isOpen.value = true
}
const onTreeNodeMouseover = () => {
  isHovered.value = true
}
const onTreeNodeMouseleave = () => {
  if (isDropdownOpen.value === true) {
    isHovered.value = true
  } else {
    isHovered.value = false
  }
}
</script>
<style lang="scss" scoped>
.tree-node {
  display: flex;
  align-items: center;
  width: 100%;

  &--no-children {
    /* We can't access the icon as it is internally managed by the tree
    That's why i'm using a negative margin here as it's not breaking anything at all
    Tree base arrow size - half its paddings (as we still want the left padding) */
    margin-left: calc(0px - 12px - 8px);
  }

  &__no-child-icon {
    color: var(--el-color-neutral-gray-300);
  }

  &__icon,
  &__no-child-icon {
    margin-right: 8px;
  }

  &__label-with-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
  }

  &__label {
    max-width: 16ch;
    overflow: hidden;
    text-overflow: ellipsis;

    line-height: 120%;
  }
}
</style>
