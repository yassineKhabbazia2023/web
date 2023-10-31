<template>
  <div class="action-bar">
    <PActionBar
      class="documents-actions"
      :rightSideButtons="rightSideButtons"
      :leftSideButtons="leftSideButtons"
      @p-action-bar-button-clicked="handleButtonClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  generateActionBarLeftSideButtons,
  generateActionBarRightSideButtons
} from './helpers/DocumentsActionsHelpers'
import { PActionBar } from '@kpmg/styleguide'
import { DocumentActionsBarProps } from './DocumentActionsBarTypes'

const props = defineProps<DocumentActionsBarProps>()
const emit = defineEmits(['p-action-bar-button-clicked'])

const leftSideButtons = computed(() =>
  generateActionBarLeftSideButtons(props.permissions)
)

const rightSideButtons = computed(() =>
  generateActionBarRightSideButtons(props.permissions, props.isAnyDocumentSelected)
)

const handleButtonClick = (name: string) => {
  emit('p-action-bar-button-clicked', name)
}
</script>

<style lang="scss">
  .action-bar {
    padding: 24px 16px;
  }
</style>

