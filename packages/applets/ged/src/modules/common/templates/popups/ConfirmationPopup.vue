<template>
  <div class="confirmation-popup">
    <PDialog
      v-model="isPopupVisible"
      :title="title"
      @close="handleClosePopup"
      :pShowClose="showClose"
      :pAlignCenter="alignCenter"
    >
      <div class="confirmation-popup__message">
        {{ message }}
      </div>
      <template #footer>
        <div class="p-dialog__footer margin-y--2">
          <PButton
            v-if="cancelButtonContent"
            class="confirmation-popup__cancel-button"
            pSize="small"
            @click="handleCancelButtonClick"
          >
            {{ cancelButtonContent }}
          </PButton>
          <PButton
            class="confirmation-popup__confirm-button"
            type="primary"
            size="small"
            :loading="isConfirmButtonLoading"
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
}

</style>
