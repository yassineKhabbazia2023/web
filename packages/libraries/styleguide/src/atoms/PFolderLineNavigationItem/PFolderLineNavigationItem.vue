<template>
  <button
    class="p-folder-line-navigation-item"
    :class="{ selected: isSelected, disabled: pDisabled }"
    data-testid="file-line-navigation-item"
    @click="handleClickFolderNavigation(pFolderId)"
    @dblclick="handleDoubleClickFolderNavigation(pFolderId)"
  >
    <PTooltip
      :pContent="pTooltipContent"
      :disabled="!pTooltipContent && !pDisabled"
    >
      <div class="p-folder-line-navigation-item__folder">
        <PIcon
          v-if="pIconLeftName"
          :pName="pIconLeftName"
          class="margin-right--2"
          pSize="16"
        />
        <span
          class="
            p-folder-line-navigation-item__folder-name
            no-wrap
            overflow-hidden
            flex--grow-1
            text-overflow--ellipsis
          "
        >
          {{ pFolderName }}
        </span>
      </div>
    </PTooltip>
    <PIcon
      v-if="pHasArrow"
      size="16"
      pName="chevronRight"
    />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PTooltip from '../../atoms/PTooltip'
import PIcon from '../PIcon'
import type { PFolderLineNavigationItemProps } from './PFolderLineNavigationItemTypes'

const props = withDefaults(defineProps<PFolderLineNavigationItemProps>(), {
  pSelected: false,
  pDisabled: false,
  pFolderName: 'Name of folder',
  pHasArrow: true,
  pIconLeftName: 'folder',
  pTooltipContent: '',
})

const emit = defineEmits([
  'on-click-folder-navigation',
  'on-db-click-folder-navigation',
])
const isSelected = ref<boolean>(props.pSelected)

const handleClickFolderNavigation = (pFolderId: number) => {
  isSelected.value = !isSelected.value
  emit('on-click-folder-navigation', pFolderId)
}

const handleDoubleClickFolderNavigation = (pFolderId: number) => {
  isSelected.value = !isSelected.value
  emit('on-db-click-folder-navigation', pFolderId)
}
</script>

<style lang="scss" scoped>
.p-folder-line-navigation-item {
  $self: &;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  width: 100%;
  height: 32px;
  flex-shrink: 0;
  border: none;
  outline: none;
  cursor: pointer;
  background: var(--el-color-white);
  border-left: 2px solid transparent;

  &:hover {
    background: var(--el-color-secondary-cyan-bg);
  }

  &__folder {
    display: flex;
    align-items: center;
    // Ensuring that it never pushes the chevron when the line content is ellipsed
    width: calc(100% - 16px);
  }

  &__folder-name {
    width: 80%;
    text-align: left;
  }

  &.selected {
    overflow: hidden;
    color: var(--el-color-black-rock-900);
    text-overflow: ellipsis;
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 600;
    line-height: 120%;
    background: var(--el-color-secondary-amethyste-bg);
    border-left: 2px solid var(--el-color-black-rock-900);

    #{$self}__folder-name {
      color: var(--el-color-secondary-amethyste);
    }
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;
    color: var(--el-color-neutral-gray-300);
  }
}
</style>
