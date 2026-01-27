<template>
  <PDialog
    :modelValue="isOpened"
    :pWidth="isMobile === true ? '80%' : '40%'"
    pCenter
    pCloseIconName="x"
    @close="onClickClose"
  >
    <div
      class="
        flex
        flex--direction-column
        flex--align-items-center
        flex-gap--4
      "
    >
      <PIcon
        pName="fileText"
        pSize="24"
      />
      <div class="h2">
        {{ title }}
      </div>
      <div>{{ subtitle }}</div>
    </div>

    <template #footer>
      <div
        class="
          flex
          flex--justify-content-flex-end
          width--100
        "
      >
        <PButton
          pType="primary"
          pSize="small"
          @click="onClickClose"
        >
          {{ closeButtonLabel }}
        </PButton>
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { PIcon, PButton, PDialog } from '@pulse/styleguide/components'
import { useResponsive } from '@pulse/styleguide'
import type { PennylaneDialogProps } from './pennylane-dialog.type'

const { isMobile } = useResponsive()
defineProps<PennylaneDialogProps>()
const emit = defineEmits<{
  close: []
}>()

function onClickClose() {
  emit('close')
}
</script>
