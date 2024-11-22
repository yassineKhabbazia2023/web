<template>
  <div>
    <PDialog
      v-model="internalValue"
      :pTitle="title"
      pWidth="480px"
      destroyOnClose
    >
      <template #footer>
        <div class="p-dialog__footer">
          <PButton
            pType="primary"
            pSize="small"
            pPlain
            @click="handleCancel"
            data-testid="cancel-button"
          >
            {{ cancelButtonLabel }}
          </PButton>
          <PButton
            pType="primary"
            pSize="small"
            :pDisabled="isConfirmButtonDisabled"
            :pLoading="isConfirmButtonLoading"
            @click="emit('confirm')"
            data-testid="confirm-button"
          >
            {{ confirmButtonLabel }}
          </PButton>
        </div>
      </template>
      <p class="p-dialog__text">
        {{ content }}
      </p>
      <slot />
    </PDialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PDialog, PButton } from '@pulse/styleguide/components'
import type { ConfirmationModalProps } from './ConfirmationModalTypes'

const props = defineProps<ConfirmationModalProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  confirm: []
}>()

const internalValue = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})

const handleCancel = () => {
  internalValue.value = false
}
</script>
