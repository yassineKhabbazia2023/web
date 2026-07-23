<template>
  <PDialog
    v-model="isModalOpen"
    :pTitle="t('feedCenter.settingsDrawer.unsavedChanges.title')"
    pWidth="420px"
    pDestroyOnClose
    data-testid="feed-center-unsaved-changes-dialog"
  >
    <div class="text-color--neutral-gray-700">
      {{ t('feedCenter.settingsDrawer.unsavedChanges.content') }}
    </div>

    <template #footer>
      <PButton
        pType="secondary"
        @click="handleCancel"
      >
        {{ t('feedCenter.settingsDrawer.unsavedChanges.cancelButton') }}
      </PButton>
      <PButton
        pType="primary"
        @click="handleConfirmLeave"
      >
        {{ t('feedCenter.settingsDrawer.unsavedChanges.leaveButton') }}
      </PButton>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { PButton, PDialog } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

const isModalOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  cancel: []
  confirmLeave: []
}>()

function handleCancel() {
  isModalOpen.value = false
  emit('cancel')
}

function handleConfirmLeave() {
  isModalOpen.value = false
  emit('confirmLeave')
}
</script>
