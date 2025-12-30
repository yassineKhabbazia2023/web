<template>
  <div class="confirmation-popup">
    <PDialog
      v-model="isPopupVisible"
      :title="title"
      :pShowClose="showClose"
      :pAlignCenter="alignCenter"
      @close="handleClosePopup"
    >
      <div class="confirmation-popup__message">
        {{ message }}
      </div>
      <template #footer>
        <div class="p-dialog__footer margin-y--2">
          <PButton
            v-if="cancelButtonContent"
            pType="secondary"
            class="confirmation-popup__cancel-button"
            pSize="small"
            @click="handleCancelButtonClick"
          >
            {{ cancelButtonContent }}
          </PButton>
          <PButton
            class="confirmation-popup__confirm-button"
            pType="primary"
            size="small"
            :loading="isConfirmButtonLoading"
            data-testid="ged-popup-confirm-button"
            @click="handleConfirmButtonClick"
          >
            {{ confirmButtonContent }}
          </PButton>
        </div>
      </template>
    </PDialog>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { type ConfirmationPopupProps }
  from '@ged/modules/common/templates/popups/ConfirmationPopupTypes'
import { PDialog, PButton } from '@pulse/styleguide/components'

// Popup defintions
const props = withDefaults(defineProps<ConfirmationPopupProps>(), {
  isPopupVisible: false,
  alignCenter: false,
  showClose: true,
})

const emit = defineEmits([
  'update:isPopupVisible',
  'on-confirm-button-click',
  'on-cancel-button-click',
  'on-close-popup',
])

const isPopupVisible = computed({
  get() {
    return props.isPopupVisible
  },
  set(value) {
    emit('update:isPopupVisible', value)
  },
})

// Popup actions
const handleCancelButtonClick = () => {
  emit('on-cancel-button-click')
}

const handleConfirmButtonClick = () => {
  emit('on-confirm-button-click')
}

const handleClosePopup = () => {
  emit('on-close-popup')
}
</script>
<style lang="scss">
.confirmation-popup{

  .el-dialog {
    max-width: 503px;
  }
  &__message {
    word-wrap: break-word;
  }
}
</style>
