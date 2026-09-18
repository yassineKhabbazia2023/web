<template>
  <PDialog
    v-model="internalIsVisible"
    :pTitle="pTitle"
    :pWidth="pWidth"
    :pShowClose="!pNoCloseButton"
    :pAlignCenter="pAlignCenter"
    :pDestroyOnClose="pDestroyOnClose"
    :data-testid="pTestId"
    @close="onClickClose"
  >
    <slot />
    <template #footer>
      <div class="margin-y--2">
        <PButton
          v-if="pCancelButtonContent"
          pType="secondary"
          pSize="small"
          data-testid="p-confirmation-popup-cancel-button"
          @click="onCancelButtonClick"
        >
          {{ pCancelButtonContent }}
        </PButton>
        <PButton
          pType="primary"
          pSize="small"
          :pLoading="pConfirmButtonIsLoading"
          :pDisabled="pConfirmButtonIsDisabled"
          data-testid="p-confirmation-popup-confirm-button"
          @click="onConfirmButtonClick"
        >
          {{ pConfirmButtonContent }}
        </PButton>
      </div>
    </template>
  </PDialog>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { type PConfirmationPopupProps } from './PConfirmationPopupTypes'
import PDialog from '../../atoms/PDialog'
import PButton from '../../atoms/PButton'

const props = withDefaults(defineProps<PConfirmationPopupProps>(), {
  pIsVisible: false,
  pAlignCenter: false,
  pNoCloseButton: false,
  pConfirmButtonIsLoading: false,
  pConfirmButtonIsDisabled: false,
  pDestroyOnClose: false,
})

const emit = defineEmits<{
  'update:pIsVisible': [boolean]
  'on-confirm-button-click': []
  'on-cancel-button-click': []
  'on-close-popup': []
}>()

const internalIsVisible = computed({
  get() {
    return props.pIsVisible
  },
  set(value) {
    emit('update:pIsVisible', value)
  },
})

const onCancelButtonClick = () => {
  emit('on-cancel-button-click')
}

const onConfirmButtonClick = () => {
  emit('on-confirm-button-click')
}

const onClickClose = () => {
  emit('on-close-popup')
}
</script>
