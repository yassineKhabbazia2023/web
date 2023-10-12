<template>
  <PToolbox
    class="document-toolbox"
    trigger="click"
    :elements="toolboxBasicData"
    @visible-change="handleToolboxDropdownSateChange"
    @p-toolbox-item-clicked="handleItemclicked"
  >
    <PButton
    type="generic"
    class="on-document-action-clicked"
    circle
    @click.stop>
      <PIcon size="14" color="#A4A4A4">
        <PIThreeDots />
      </PIcon>
    </PButton>
  </PToolbox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PIThreeDots, PToolbox, PButton, PIcon } from '@kpmg/styleguide'
import { generateToolboxBasicData } from '@/modules/common/helpers/toolboxHelper'
import { type DocumentActionsProps } from './DocumentActionsTypes'

const emit = defineEmits([
  'on-document-action-clicked',
  'on-document-actions-dropdown-close'
])

const props = defineProps<DocumentActionsProps>()

const toolboxBasicData = computed(() =>
  generateToolboxBasicData('Documents', props.permissions)
)

const handleItemclicked = (action: string) => {
  emit('on-document-action-clicked', action)
}
const handleToolboxDropdownSateChange = (state: boolean) => {
  emit('on-document-actions-dropdown-close', state)
}
</script>
