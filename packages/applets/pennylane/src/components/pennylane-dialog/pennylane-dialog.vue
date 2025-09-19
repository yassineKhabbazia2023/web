<template>
  <PDialog
    v-model="internalIsOpened"
    pWidth="420"
    pCenter
    pCloseIconName="x"
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
import { computed } from 'vue'
import { PIcon, PButton, PDialog } from '@pulse/styleguide/components'
import type { PennylaneDialogProps } from './pennylane-dialog.type'

const props = defineProps<PennylaneDialogProps>()
const emit = defineEmits<{
  close: []
}>()

const internalIsOpened = computed({
  get: () => props.isOpened,
  set: (isOpened: boolean) => {
    if (isOpened === false) {
      emit('close')
    }
  },
})

function onClickClose() {
  internalIsOpened.value = false
}
</script>
