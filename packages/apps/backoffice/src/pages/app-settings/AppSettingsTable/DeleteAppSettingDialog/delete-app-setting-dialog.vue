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
      <div class="flex flex--direction-column flex-gap--2">
        <p class="font-semibold">
          Action irréversible
        </p>
        <p class="font-small text-color--neutral-gray-700">
          Cette action ne peut pas être annulée. La variable sera définitivement supprimée
          des environnements sélectionnés.
        </p>
      </div>
    </PAlert>

    <div class="bg--neutral-gray-50 border-radius--2 padding--4 margin-bottom--6">
      <p class="font-small font-semibold text-color--neutral-gray-700 margin-bottom--2">
        Variable à supprimer
      </p>
      <div
        data-testid="delete-app-setting-key-display"
        class="font-monospace font-medium text-color--black-rock-900"
      >
        {{ props.appSettingKey }}
      </div>
    </div>

    <div class="margin-bottom--6">
      <p class="font-semibold margin-bottom--2">
        Environnements cibles
      </p>
      <p class="font-small text-color--neutral-gray-600 margin-bottom--4">
        Sélectionnez les environnements desquels supprimer cette variable
      </p>

      <div class="bg--neutral-gray-50 border-radius--2 padding-x--4 padding-y--1">
        <EnvironmentHierarchicalSelector
          v-model="selectedEnvironments"
          :availableEnvironments="props.availableEnvironments"
          :disabled="isDeleting === true"
        />
      </div>
    </div>

    <div>
      <p class="font-semibold margin-bottom--2">
        Confirmation requise
      </p>
      <p class="font-small text-color--neutral-gray-600 margin-bottom--3">
        Pour confirmer, saisissez le nom exact de la variable
      </p>
      <PInput
        id="confirmation-input"
        v-model="confirmationInput"
        data-testid="delete-app-setting-confirmation-input"
        pPlaceholder="Saisissez le nom de la variable"
        :disabled="isDeleting === true"
      />
      <p
        v-if="showValidationError === true"
        data-testid="delete-app-setting-validation-error"
        class="font-small text-color--red-500 margin-top--2"
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
          :pDisabled="isDeleting === true"
          @click="handleCancel"
        >
          Annuler
        </PButton>
        <PButton
          data-testid="delete-app-setting-delete-button"
          pType="danger"
          pSize="small"
          :pDisabled="isDeleteEnabled === false"
          :pLoading="isDeleting === true"
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
import type { DeleteAppSettingDialogProps } from './delete-app-setting-dialog.type'
import { useDeleteAppSettingDialog } from './delete-app-setting-dialog.composable'
import EnvironmentHierarchicalSelector from '@backoffice/components/EnvironmentHierarchicalSelector/environment-hierarchical-selector.vue'

const props = defineProps<DeleteAppSettingDialogProps>()

const emit = defineEmits<{
  'app-setting-deleted': []
}>()

const confirmationInput = ref('')
const isDeleting = ref(false)
const isDialogOpen = defineModel<boolean>({ default: false })

const closeDialogWithSuccess = () => {
  emit('app-setting-deleted')
  isDialogOpen.value = false
}

const {
  selectedEnvironments,
  hasSelectedEnvironments,
  resetSelection,
  deleteAppSetting: deleteFromComposable,
} = useDeleteAppSettingDialog(
  props.appSettingKey,
  closeDialogWithSuccess,
)

const isConfirmationValid = computed(() => confirmationInput.value === props.appSettingKey)

const showValidationError = computed(() => confirmationInput.value.length > 0 && isConfirmationValid.value === false)

const isDeleteEnabled = computed(() =>
  isConfirmationValid.value === true &&
  hasSelectedEnvironments.value === true &&
  isDeleting.value === false,
)

const resetDialog = () => {
  confirmationInput.value = ''
  resetSelection()
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

const handleDelete = async () => {
  if (isDeleteEnabled.value === false) {
    return
  }

  isDeleting.value = true

  try {
    await deleteFromComposable()
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
