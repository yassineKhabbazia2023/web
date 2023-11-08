<template>
  <button
    class="p-file-line-navigation-item"
    :class="{ selected: isSelected, disabled: props.disabled }"
    @click="handleClickFileNavigation(folderId)"
    @dblclick="handleDoubleClickFileNavigation(folderId)"
  >
    <PIcon>
      <component :is="resolvedIconsLeft"></component>
    </PIcon>
    <span class="p-file-line-navigation-item__name">{{ folderName }}</span>
    <PIcon v-if="pHasArrow" size="16">
      <PIChevronRight />
    </PIcon>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PIcon from '../PIcon'
import type { PFileLineNavigationItemTypes } from './PFileLineNavigationItemTypes'
import { iconResolver } from '@/utils/iconResolver'

const props = withDefaults(defineProps<PFileLineNavigationItemTypes>(), {
  selected: false,
  disabled: false,
  folderName: 'Name of folder',
  pHasArrow: true,
  pLeftIcon: 'PIFolder'
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

const resolvedIconsLeft = computed(() => {
  return iconResolver(props.pLeftIcon)
})
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

  &:last-child {
    padding-right: 0px;
  }
}
</style>
