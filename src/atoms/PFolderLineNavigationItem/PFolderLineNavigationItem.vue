<template>
  <button
    class="p-folder-line-navigation-item"
    :class="{ selected: isSelected, disabled: props.pDisabled }"
    @click="handleClickFolderNavigation(pFolderId)"
    @dblclick="handleDoubleClickFolderNavigation(pFolderId)"
  >
    <div class="p-folder-line-navigation-item__folder">
      <PIcon class="margin-right--2">
        <component :is="resolvedIconsLeft" />
      </PIcon>
      <span class="p-folder-line-navigation-item__folder-name">{{ pFolderName }}</span>
    </div>
    <PIcon v-if="pHasArrow" size="16">
      <PIChevronRight />
    </PIcon>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PIcon from '../PIcon'
import type { PFolderLineNavigationItemProps } from './PFolderLineNavigationItemTypes'
import { iconResolver } from '@/utils/iconResolver'

const props = withDefaults(defineProps<PFolderLineNavigationItemProps>(), {
  pSelected: false,
  pDisabled: false,
  pFolderName: 'Name of folder',
  pHasArrow: true,
  pLeftIcon: 'PIFolder'
})

const emit = defineEmits([
  'on-click-folder-navigation',
  'on-db-click-folder-navigation'
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

const resolvedIconsLeft = computed(() => {
  return iconResolver(props.pLeftIcon)
})
</script>

<style lang="scss" scoped>
.p-folder-line-navigation-item {
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

  &:hover {
    background: var(--el-color-persian-50);
  }

  &__folder {
    display: flex;
    align-items: center;
    width: 100%;
  }

  &__folder-name {
    width: 80%;
    text-align: left;
  }

  &.selected {
    overflow: hidden;
    color: var(--el-color-persian-500);
    text-overflow: ellipsis;
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 600;
    line-height: 120%;
    background: var(--el-color-persian-50);
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.6;
    color: var(--el-color-neutral-gray-300);
  }
}
</style>
