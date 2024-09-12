<template>
  <PToolbox
    class="document-toolbox"
    trigger="click"
    :pElements="toolboxBasicData"
    @visible-change="handleToolboxDropdownSateChange"
  >
    <PButton
      pType="generic"
      class="on-document-action-clicked"
      pCircle
      @click="handleActionsDropdownOpening">
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
  'on-document-actions-dropdown-close',
  'actions-dropdown-opened',
])

const props = defineProps<DocumentActionsProps>()

const toolboxBasicData = computed(() => {
  if (props.permissions) {
    return generateToolboxBasicData('Documents', props.permissions, props.isInSearchScope)
  } else {
    return []
  }
})

const handleToolboxDropdownSateChange = (state: boolean) => {
  emit('on-document-actions-dropdown-close', state)
}

const handleActionsDropdownOpening = () => {
  emit('actions-dropdown-opened')
}

defineExpose({
  handleActionsDropdownOpening,
})
</script>
