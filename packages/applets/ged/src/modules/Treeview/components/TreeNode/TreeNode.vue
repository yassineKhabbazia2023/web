<template>
  <TreeNodeActionsToolbox
    triggerType="contextmenu"
    :permissions="data.permissions"
    :isVisible="!data.isRootFolder"
    @p-toolbox-item-clicked = "handleItemclicked"
    @p-toolbox-dropdown-visibility-change = "handleTreeNodeToolboxVisibilityChange"
    class="tree-node_action-toolbox"
    showSlotIfDataEmpty
    @dragover="handleDragOver"
    @drop="handleDrop"
    @dragleave="handleDragLeave"
  >
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
          :pContent="data.name"
          :showAfter="500"
          :hideAfter="0"
        >
          <span class="tree-node__label">{{ data.name }}</span>
        </PTooltip>
        <TreeNodeActions
          v-if="!data.isRootFolder"
          ref="buttonToolboxRef"
          :permissions="data.permissions"
          :selectedOrHovered="isOpen || isHovered"
          @p-toolbox-item-clicked="handleItemclicked"
          @p-toolbox-dropdown-visibility-change="handleButtonToolboxVisibilityChange"
        />

        <PIcon
          v-show="isDragovered"
          :color="isErrorDragover ? '#FF0000' : '#5546FF'"
          size="18"
        >
          <PIArrowLeftRight v-if="!isErrorDragover" />
          <PIXCircle v-else />
        </PIcon>
      </div>
    </div>
  </TreeNodeActionsToolbox>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  PIArrowLeftRight,
  PICalculatorEuro,
  PIDot,
  PIFolder,
  PIInbox,
  PIKpmg,
  PIPersonVcard,
  PITrash,
  PTooltip,
  PIcon,
  PIXCircle,
} from '@kpmg/styleguide'

import TreeNodeActions from '@/modules/Treeview/components/TreeNodeActions'
import { type TreeNodeProps }
  from '@/modules/Treeview/components/TreeNode/TreeNodeTypes'
import TreeNodeActionsToolbox from
  '@/modules/Treeview/components/TreeNodeActions/TreeNodeActionsToolbox'
import type { Document } from '@/models/Document'

const emit = defineEmits(
  ['p-toolbox-item-clicked', 'update-folder-name', 'documents-dropped-on-tree-node', 'expand-or-collapse-node'])
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

const buttonToolboxRef = ref<InstanceType<any> | null>(null)
function closeButtonToolbox() {
  if (!buttonToolboxRef.value) return
  buttonToolboxRef.value.closeActionToolbox()
}
const handleItemclicked = (action: string) => {
  emit('p-toolbox-item-clicked', action, props.data)
}

function handleButtonToolboxVisibilityChange(state: boolean) {
  setToolboxVisibility(state)
}

function handleTreeNodeToolboxVisibilityChange(state: boolean) {
  closeButtonToolbox()
  setToolboxVisibility(state)
}

function setToolboxVisibility(state: boolean) {
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
    isOpen.value = false
  }
}

// Drag & Drop scope

const isNodeHoveredWithDraggedItem = ref(false)

let dragOverTimer: ReturnType<typeof setTimeout> | null
let lastTarget: EventTarget | null = null

function setNodeAsTreeCurrentKey() {
  emit('expand-or-collapse-node', props.data.id)
}

function hasSameServiceId(event: DragEvent) {
  const stringifiedServiceId = String(props.data.serviceId)
  return event.dataTransfer?.types.includes(stringifiedServiceId)
}

function handleDragOver(event: DragEvent) {
  if (!props.serviceId) return

  // Parse items and check if the first item has a diffrent serviceId than this one
  // and another funtion to check permissions on folder (can move into)
  if (!isNodeHoveredWithDraggedItem.value) isNodeHoveredWithDraggedItem.value = true

  if (
    !hasSameServiceId(event) ||
    props.data.isRootFolder ||
    !props.data.permissions.includes('CAN_MOVE_INTO_FOLDER')
  ) {
    addDragoverClass(true)
  } else {
    addDragoverClass()
  }

  if (lastTarget !== event.target) {
    if (dragOverTimer) clearTimeout(dragOverTimer)

    if (!hasSameServiceId(event)) return
    dragOverTimer = setTimeout(setNodeAsTreeCurrentKey, 1000)
    lastTarget = event.target
  }
}

function handleDragLeave(_event: DragEvent) {
  if (dragOverTimer) clearTimeout(dragOverTimer)
  if (isNodeHoveredWithDraggedItem.value) isNodeHoveredWithDraggedItem.value = false
  dragOverTimer = null
  lastTarget = null
  removeDragoverClass()
}

function handleDrop(event: DragEvent) {
  if (isErrorDragover.value) {
    removeDragoverClass()
    clearNodeExpandTimeout()
  } else {
    removeDragoverClass()
    clearNodeExpandTimeout()

    const documentsToMove: Document[] = JSON.parse(event.dataTransfer?.getData('application/json+document') ?? '')
    if (!documentsToMove) return
    emit('documents-dropped-on-tree-node', documentsToMove, props.data)
  }
}

function clearNodeExpandTimeout() {
  if (dragOverTimer) clearTimeout(dragOverTimer)
  dragOverTimer = null
  lastTarget = null
}

// Element Plus does not allow us to bind class to the tree node wrapper
// We don't have any other choice than adding classes that way
const nodeWrapper = () => document.querySelector(`[data-key="${props.data.id}"] .el-tree-node__content`)
const isDragovered = ref(false)
const isErrorDragover = ref(false)

function addDragoverClass(isError: boolean = false) {
  const wrapper = nodeWrapper()
  if (!wrapper) return

  isDragovered.value = true
  wrapper.classList.add('hovered-with-dragged-item', 'cursor-pointer')

  if (!isError) return
  isErrorDragover.value = true
  wrapper.classList.add('hovered-with-dragged-item--error', 'cursor-not-allowed')
}

function removeDragoverClass() {
  const wrapper = nodeWrapper()
  if (!wrapper) return

  isDragovered.value = false
  isErrorDragover.value = false
  wrapper.classList.remove(
    'hovered-with-dragged-item',
    'hovered-with-dragged-item--error',
    'cursor-pointer',
    'cursor-not-allowed',
  )
}
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
/* We don't have the choice to override it that way
This component (the node) is not inside the design system which is why we override it here */
.el-tree-node__content {
  border: 1px dashed transparent;
  transition: all 150ms ease;

  &.hovered-with-dragged-item {
  border: 1px dashed var(--el-color-primary);
  background: var(--el-color-persian-100);

    &--error {
      border: 1px dashed transparent;
      background: var(--el-color-functionnal-red-bg);
    }
  }
}
</style>

<style lang="scss" scoped>
.tree-node {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;

  &--no-children {
    /* We can't access the icon as it is internally managed by the tree
    That's why i'm using a negative margin here as it's not breaking anything at all
    Tree base arrow size - half its paddings (as we still want the left padding) */
    margin-left: calc(0px - 12px - 8px);
    // As the negative margin breaks the sizing, i'm increasing the width of the container
    width: calc(100% + 12px + 8px)
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
    max-width: 24ch;
    overflow: hidden;
    text-overflow: ellipsis;

    line-height: 120%;
  }

  &_action-toolbox {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    > div {
      height: 100%;
      flex-grow: 1;
    }

    // This is really specific for the treeview node that does not belong the the design system
    // which is why i'm overriding it
    :deep(.el-dropdown) {
      flex-grow: 1;
      height: 100%;
    }
  }
}
</style>
