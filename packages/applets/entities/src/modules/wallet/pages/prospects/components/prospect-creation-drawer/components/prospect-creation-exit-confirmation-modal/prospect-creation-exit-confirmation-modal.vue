<template>
  <PDialog
    v-model="isModalOpen"
    :pTitle="t('entities.wallet.prospectCreate.exitConfirmation.title')"
    pWidth="500px"
    :pShowClose="false"
    pAlignCenter
    pDestroyOnClose
  >
    <p>{{ t('entities.wallet.prospectCreate.exitConfirmation.text') }}</p>

    <template #footer>
      <PButton
        pType="secondary"
        data-testid="prospect-exit-confirmation-cancel"
        @click="handleCancel"
      >
        {{ t('entities.wallet.prospectCreate.exitConfirmation.cancelButton') }}
      </PButton>
      <PButton
        pType="primary"
        data-testid="prospect-exit-confirmation-exit"
        @click="handleConfirm"
      >
        {{ t('entities.wallet.prospectCreate.exitConfirmation.exitButton') }}
      </PButton>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PDialog } from '@pulse/styleguide/components'

const isModalOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const { t } = useI18n()

function handleCancel() {
  isModalOpen.value = false
  emit('cancel')
}

function handleConfirm() {
  emit('confirm')
}
</script>
