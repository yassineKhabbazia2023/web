<template>
  <PDialog
    v-model="isModalOpen"
    pWidth="500px"
    :pShowClose="false"
    pAlignCenter
    pDestroyOnClose
  >
    <div
      class="
        flex
        flex--direction-column
        flex--align-items-center
        flex-gap--4
        text-center
      "
    >
      <PIcon
        pName="power"
        pSize="24"
      />
      <div class="h2">
        {{ t('booking-edit-confirmation-modal.title') }}
      </div>
      <p>{{ t('booking-edit-confirmation-modal.content') }}</p>
    </div>

    <template #footer>
      <PButton
        pType="secondary"
        @click="handleCancel"
      >
        {{ t('booking-edit-confirmation-modal.exitButton') }}
      </PButton>
      <PButton
        pType="primary"
        :pLoading="isLoading"
        @click="handleConfirm"
      >
        {{ t('booking-edit-confirmation-modal.confirmButton') }}
      </PButton>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PDialog, PIcon } from '@pulse/styleguide/components'

defineProps<{
  isLoading?: boolean
}>()

const isModalOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

function handleCancel() {
  isModalOpen.value = false
  emit('cancel')
}

function handleConfirm() {
  emit('confirm')
}

const { t } = useI18n()
</script>
