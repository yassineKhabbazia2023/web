<template>
  <PDialog
    v-model="isVisible"
    pWidth="566px"
    pfullscreen
    pAlignCenter
    pDestroyOnClose
    @close="handleCancel"
  >
    <div
      class="
        flex
        flex--direction-column
        flex--align-items-center
        margin-bottom--6
        padding-right--6
      "
    >
      <PIcon
        pName="power"
        pSize="24"
        class="margin-bottom--4 margin-negative-top--2"
      />
      <p class="font-size--20 font-bold text-center">
        {{ title }}
      </p>
    </div>

    <p class="font-size--12 padding-right--6">
      {{ content }}
    </p>
    <p class="font-size--12 margin-top--2 padding-right--6">
      {{ question }}
    </p>

    <template #footer>
      <div class="p-dialog__footer margin-y--2">
        <PButton
          pType="secondary"
          pSize="small"
          data-testid="confirmation-cancel-button"
          @click="handleCancel"
        >
          {{ cancelButtonLabel }}
        </PButton>
        <PButton
          pType="primary"
          pSize="small"
          :pLoading="isConfirmButtonLoading"
          data-testid="confirmation-confirm-button"
          @click="emit('confirm')"
        >
          {{ confirmButtonLabel }}
        </PButton>
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { PDialog, PButton, PIcon } from '@pulse/styleguide/components'
import type { DeleteDelegationModalProps } from './delete-delegation-modal.types'

defineProps<DeleteDelegationModalProps>()

const emit = defineEmits<{
  'confirm': []
}>()

const isVisible = defineModel<boolean>({ required: true })

function handleCancel() {
  isVisible.value = false
}
</script>
