<template>
  <button
    class="p-file-line-navigation-item"
    :class="{ selected: isSelected, disabled: props.pDisabled }"
    @click="handleClickFileNavigation(pFolderId)"
    @dblclick="handleDoubleClickFileNavigation(pFolderId)"
  >
      <PIcon size="16">
        <PIFolder />
      </PIcon>
      <span class="p-file-line-navigation-item__name">{{ pFolderName }}</span>
      <PIcon size="16">
        <PIChevronRight />
      </PIcon>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PFileLineNavigationItemTypes } from './PFileLineNavigationItemTypes'

const props = withDefaults(defineProps<PFileLineNavigationItemTypes>(), {
  pSelected: false,
  pDisabled: false,
  pFolderName: 'Name of folder'
})

const emit = defineEmits([
  'on-click-file-navigation',
  'on-db-click-file-navigation'
])
const isSelected = ref(props.pSelected)

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
.p-file-line-navigation-item {
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
