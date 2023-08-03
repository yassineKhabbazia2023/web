<template>
  <button
    class="file-line-navigation-item"
    :class="{ selected: isSelected, disabled: props.disabled }"
    @click="handleClickFileNavigation(folderId)"
    @dblclick="handleDoubleClickFileNavigation(folderId)"
  >
      <PIcon size="16">
        <PIFolder />
      </PIcon>
      <span class="file-line-navigation-item__name">{{ folderName }}</span>
      <PIcon size="16">
        <PIChevronRight />
      </PIcon>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PIcon from '../PIcon'
import type { FileLineNavigationItemTypes } from './FileLineNavigationItemTypes'

const props = withDefaults(defineProps<FileLineNavigationItemTypes>(), {
  selected: false,
  disabled: false,
  folderName: 'Name of folder'
})

const emit = defineEmits([
  'on-click-file-navigation',
  'on-db-click-file-navigation'
])
const isSelected = ref(props.selected)

const handleClickFileNavigation = (folderId: number) => {
  isSelected.value = !isSelected.value
  emit('on-click-file-navigation', folderId)
}

const handleDoubleClickFileNavigation = (folderId: number) => {
  isSelected.value = !isSelected.value
  emit('on-db-click-file-navigation', folderId)
}
</script>

<style lang="scss" scoped>
.file-line-navigation-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  width: 100%;
  height: 33px;
  column-gap: 8px;
  flex-shrink: 0;
  cursor: pointer;
  background: var(--el-color-white);
  &:hover {
    background: var(--el-color-persian-50);
  }

  &__name {
    width: 80%;
    text-align: left;
  }

  &.selected {
    overflow: hidden;
    color:  var(--el-color-persian-500);
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

  &:last-child {
    padding-right: 0px;
  }
}
</style>
