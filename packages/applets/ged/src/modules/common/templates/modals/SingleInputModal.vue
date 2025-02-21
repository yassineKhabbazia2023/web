<template>
  <div class="single-input-modal">
    <PDialog
      v-model="isDialogVisible"
      :pTitle="modalTitle"
      :alignCenter="isCentered"
      @close="handleCloseModal"
    >
      <p class="single-input-modal__input-label">
        {{ inputLabel }}
      </p>
      <div class="single-input-modal__input">
        <PInput
          v-model="inputContent"
          pType="text"
          :pPlaceholder="inputPlaceHolder"
          :pMaxLength="maxInputLength"
          :class="!isValidInput ? 'unValid' : ''"
        />
        <span v-if="inputSuffix" class="single-input-modal__suffix">{{ inputSuffix }}</span>
      </div>

      <div v-if="showErrorMsg" class="single-input-modal__input-error">
        <PIcon
          :size="12"
          pName="xCircle"
          class="icon"
        />
        <p class="message">
          {{ errorMsg }}
        </p>
      </div>
      <template #footer>
        <div class="p-dialog__footer">
          <PButton
            class="cancel-action-button"
            pType="secondary"
            pSize="small"
            @click="handleCancelClick"
          >
            {{ cancelBtnLabel }}
          </PButton>
          <PButton
            class="confirm-action-button"
            pType="primary"
            pSize="small"
            :pDisabled="isConfirmButtonDisabled"
            :pLoading="isConfirmButtonLoading"
            @click="handleConfirmClick"
          >
            {{ confirmBtnabel }}
          </PButton>
        </div>
      </template>
    </PDialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type SingleInputModalProps } from '@ged/modules/common/templates/modals/SingleInputModalTypes'

import { PDialog, PButton, PInput, PIcon } from '@pulse/styleguide/components'

const maxInputLength = 256

const emit = defineEmits([
  'on-close-modal',
  'on-confirm-action-click',
  'on-cancel-action-click',
  'update:isDialogVisible',
  'update:defaultInputContentValue',
])

const props = withDefaults(defineProps<SingleInputModalProps>(), {
  isDialogVisible: false,
  isCentered: false,
})

const inputContent = computed({
  get() {
    return props.defaultInputContentValue
  },
  set(value) {
    emit('update:defaultInputContentValue', value)
  },
})

const isDialogVisible = computed({
  get() {
    return props.isDialogVisible
  },
  set(value) {
    emit('update:isDialogVisible', value)
  },
})

// Modal actions
const handleCloseModal = () => {
  emit('on-close-modal')
  clearModalInputValue()
}

const handleConfirmClick = () => {
  emit('on-confirm-action-click', inputContent)
}
const handleCancelClick = () => {
  emit('on-cancel-action-click')
}

const clearModalInputValue = () => {
  inputContent.value = ''
}
</script>

<style lang="scss">
.single-input-modal {
  .el-input.unValid {
    --el-input-hover-border: red;
    --el-input-focus-border-color: red;
    --el-input-border-color: red;
  }

  .el-dialog {
    max-width: 503px;

    &__title {
      color: var(--el-color-neutral-gray-900);
      font-size: 24px;
      font-weight: 400;
    }

    &__body {
      display: grid;
      grid-row-gap: 8px;
    }
  }

  &__input {
    display: flex;
    align-items: center;
    gap: 16px;

    &-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--el-color-neutral-gray-900);
    }

    &-error {
      font-weight: 400;
      line-height: 120%;
      color: var(--el-color-functionnal-red);
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }
}
</style>
