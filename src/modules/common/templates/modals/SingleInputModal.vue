<template>
  <div class="single-input-modal">
    <PDialog
      v-model="isDialogVisible"
      @close="handleCloseModal"
      :title="modalTitle"
    >
      <p class="single-input-modal__input-label">
        {{ inputLabel }}
      </p>
      <div class="single-input-modal__input">
        <PInput
          type="text"
          v-model="inputContent"
          :placeholder="inputPlaceHolder"
          :maxLength="maxInputLength"
          :class="!isValidInput ? 'unValid' : ''"
        />
      </div>

      <div v-if="showErrorMsg" class="single-input-modal__input-error">
        <PIcon :size="12">
          <PIXCircle class="icon" />
        </PIcon>
        <p class="message" v-html="errorMsg" />
      </div>
      <template #footer>
        <div class="p-dialog__footer">
          <PButton
type="secondary"
size="small"
    class="cancel-action-button"
          @click="handleCancelClick">
            {{ cancelBtnLabel }}
          </PButton>
          <PButton
          class="confirm-action-button"
            type="primary"
            size="small"
            :disabled="isConfirmButtonDisabled"
            :loading="isConfirmButtonLoading"
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
import { computed, ref, watch } from 'vue'
import { type SingleInputModalProps } from '@/modules/common/templates/modals/SingleInputModalTypes'

import { PIXCircle, PDialog, PButton, PInput, PIcon } from '@kpmg/styleguide'

const maxInputLength = 256

const emit = defineEmits([
  'on-close-modal',
  'on-confirm-action-click',
  'input-content-changed',
  'on-cancel-action-click',
  'update:isDialogVisible',
  'update:defaultInputContentValue'
])

const props = withDefaults(defineProps<SingleInputModalProps>(), {
  isDialogVisible: false
})
const localInputContent = ref('')
const inputContent = computed({
  get() {
    if (localInputContent.value !== '') {
      return localInputContent.value
    } else {
      return props.defaultInputContentValue

    }
  },
  set(value) {

    localInputContent.value = value ?? ''
    const toSend = props.defaultInputContentValue !== localInputContent.value
      ? localInputContent.value
      : value
    emit('update:defaultInputContentValue', toSend)
  }
})

const isDialogVisible = computed({
  get() {
    return props.isDialogVisible
  },
  set(value) {
    emit('update:isDialogVisible', value)
  }
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

// eslint-disable-next-line vitest/require-hook
watch(inputContent, (newVal: string | undefined) => {
  emit('input-content-changed', newVal)
})
</script>

<style lang="scss">
.single-input-modal {
  .el-input.unValid {
    --el-input-hover-border: red;
    --el-input-focus-border-color: red;
    --el-input-hover-border-color: red;
  }

  .el-dialog {
    max-width: 503px;

    &__title {
      color: var(--el-color-neutral-gray-900);
      font-size: 24px;
      font-weight: 400;
      line-height: 120%;
    }

    &__body {
      display: grid;
      grid-row-gap: 8px;
    }
  }

  &__input {
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

<i18n>
  fr-FR:
    error-msg-alpha-num:
</i18n>
