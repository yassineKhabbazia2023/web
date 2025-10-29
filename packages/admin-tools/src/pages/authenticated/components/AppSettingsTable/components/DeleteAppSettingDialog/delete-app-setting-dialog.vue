<template>
  <PDialog
    v-model="isDialogOpen"
    data-testid="delete-app-setting-dialog"
    pTitle="Supprimer la variable d'environnement"
    pWidth="700px"
    pAlignCenter
    :pBeforeClose="handleBeforeClose"
  >
    <PAlert
      data-testid="delete-app-setting-alert"
      pType="danger"
      class="margin-bottom--6"
    >
      <div>
        <p class="font-bold margin--0 margin-bottom--2">
          Action irréversible
        </p>
        <p class="font-small text-color--neutral-gray-700 margin--0">
          Cette action ne peut pas être annulée. La variable sera définitivement supprimée de tous les environnements.
        </p>
      </div>
    </PAlert>

    <div class="delete-app-setting-dialog__key-section padding--4 margin-bottom--2">
      <p class="font-small text-color--neutral-gray-600 margin--0 margin-bottom--2">
        Variable à supprimer :
      </p>
      <div
        data-testid="delete-app-setting-key-display"
        class="delete-app-setting-dialog__key-badge padding-y--3 padding-x--4 font-monospace"
      >
        {{ props.appSettingKey }}
      </div>
    </div>

    <div>
      <p class="font-bold margin--0 margin-bottom--3">
        Confirmation requise
      </p>
      <p class="font-small text-color--neutral-gray-600 margin--0 margin-bottom--3">
        Pour confirmer la suppression, veuillez saisir le nom exact de la variable ci-dessous :
      </p>
      <PInput
        id="confirmation-input"
        v-model="confirmationInput"
        data-testid="delete-app-setting-confirmation-input"
        pPlaceholder="Saisissez le nom de la variable"
        :disabled="isDeleting"
      />
      <p
        v-if="showValidationError"
        data-testid="delete-app-setting-validation-error"
        class="font-small text-color--red-500 margin--0 margin-top--2"
      >
        Le nom saisi ne correspond pas
      </p>
    </div>

    <template #footer>
      <div class="p-dialog__footer">
        <PButton
          data-testid="delete-app-setting-cancel-button"
          pType="secondary"
          pSize="small"
          :pDisabled="isDeleting"
          @click="handleCancel"
        >
          Annuler
        </PButton>
        <PButton
          data-testid="delete-app-setting-delete-button"
          pType="danger"
          pSize="small"
          :pDisabled="!isConfirmationValid || isDeleting"
          :pLoading="isDeleting"
          @click="handleDelete"
        >
          <PIcon
            pName="trash"
            class="el-button__icon--left"
          />
          Supprimer définitivement
        </PButton>
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PButton, PDialog, PAlert, PInput, PIcon } from '@pulse/styleguide/components'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { AppSettingsListService } from '@admin-tools/services/app-settings-list/app-settings-list.service'
import type { DeleteAppSettingDialogProps } from './delete-app-setting-dialog.type'

const props = defineProps<DeleteAppSettingDialogProps>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'app-setting-deleted': []
}>()

const confirmationInput = ref('')
const isDeleting = ref(false)
const isDialogOpen = defineModel<boolean>({ default: false })

const isConfirmationValid = computed(() => confirmationInput.value === props.appSettingKey)

const showValidationError = computed(() => confirmationInput.value.length > 0 && isConfirmationValid.value === false)

const resetDialog = () => {
  confirmationInput.value = ''
}

const handleBeforeClose = (done: () => void) => {
  if (isDeleting.value === true) {
    return
  }
  resetDialog()
  done()
}

const handleCancel = () => {
  isDialogOpen.value = false
}

const closeDialogWithSuccess = () => {
  emit('app-setting-deleted')
  isDialogOpen.value = false
}

const handleDeletionError = (error: any) => {
  const errorMessage = error?.response?.data?.message
    || error?.message
    || 'Une erreur est survenue lors de la suppression de la variable d\'environnement'

  const deletedCount = error?.response?.data?.deleted ?? 0
  const hasPartialSuccess = deletedCount > 0

  if (hasPartialSuccess === true) {
    // Partial success: some environments deleted, some failed
    displayNotification('warning', errorMessage, 'bottom-right', 4000)
    logger.warn(`Partial deletion for env var "${props.appSettingKey}":`, {
      deleted: deletedCount,
      error: error?.response?.data,
    })
    closeDialogWithSuccess()
  } else {
    // Complete failure: no environment deleted
    displayNotification('error', errorMessage)
    logger.error(`Failed to delete env var "${props.appSettingKey}":`, error)
  }
}

const handleDelete = async () => {
  if (isConfirmationValid.value === false || isDeleting.value === true) {
    return
  }

  isDeleting.value = true

  try {
    await AppSettingsListService.deleteAppSetting(props.appSettingKey)

    displayNotification('success', `La variable "${props.appSettingKey}" a été supprimée avec succès`)
    logger.info(`Environment variable deleted: ${props.appSettingKey}`)

    closeDialogWithSuccess()
  } catch (error: any) {
    handleDeletionError(error)
  } finally {
    isDeleting.value = false
  }
}

watch(isDialogOpen, (newValue) => {
  if (newValue === true) {
    resetDialog()
  }
})
</script>

<style scoped lang="scss">
.delete-app-setting-dialog {
  &__key-section {
    background-color: var(--p-neutral-gray-50);
    border-radius: 8px;
    border: 1px solid var(--p-neutral-gray-200);
  }

  &__key-badge {
    word-break: break-all;
    line-height: 1.5;
  }
}
</style>
