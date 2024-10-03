<template>
  <div class="action-bar">
    <PActionBar
      class="documents-actions"
      :pRightSideButtons="rightSideButtons"
      :pLeftSideButtons="leftSideButtons"
      :pIsSearchShrinkable="isSearchShrinkable"
      :pIsSearchOpen="isSearchOpen"
      @p-action-bar-button-clicked="handleButtonClick"
      @p-upload-files-selected="handleUploadFilesSelected"
      @p-search-input="handleSearch"
      @search-expand-change="handleSearchExpandChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ActionBarLoadingButtonsState } from './helpers/DocumentsActionsHelpers'
import {
  generateActionBarLeftSideButtons,
  generateActionBarRightSideButtons,
} from './helpers/DocumentsActionsHelpers'
import { PActionBar } from '@pulse/styleguide'
import type { DocumentActionsBarProps } from './DocumentActionsBarTypes'
import { debounce } from '@pulse/common'

const props = defineProps<DocumentActionsBarProps>()
const emit = defineEmits(['p-action-bar-button-clicked', 'p-upload-files-selected',
  'p-search-input', 'search-expand-change'])

const leftSideButtons = computed(() =>
  generateActionBarLeftSideButtons(
    props.permissions,
    props.isSearchShrinkable,
    props.isSearchOpen,
    props.hasFiltersEnabled,
  ),
)

const actionBarLoadingButtonsState = computed<ActionBarLoadingButtonsState>(() => ({
  permission: 'CAN_TRANSMIT_DOCUMENT',
  isLoading: props.isTransmitDocumentsLoading,
}),
)

const rightSideButtons = computed(() =>
  generateActionBarRightSideButtons(
    props.permissions,
    props.isAnyDocumentSelected,
    actionBarLoadingButtonsState.value),
)

const handleButtonClick = (name: string) => {
  emit('p-action-bar-button-clicked', name)
}

const handleUploadFilesSelected = (files:File[]) => {
  emit('p-upload-files-selected', files)
}

const debounceFunction = debounce((value: string) => {
  emit('p-search-input', value)
}, 1000)

const handleSearch = (value: string) => {
  debounceFunction(value)
}

const handleSearchExpandChange = (value: boolean) => {
  emit('search-expand-change', value)
}
</script>

<style lang="scss">
  .action-bar {
    padding: 24px 16px;
    box-shadow: 0px 1px 2px 0px rgba(112, 144, 176, 0.20),
    0px 0px 2px 0px rgba(112, 144, 176, 0.10);
  }
</style>

