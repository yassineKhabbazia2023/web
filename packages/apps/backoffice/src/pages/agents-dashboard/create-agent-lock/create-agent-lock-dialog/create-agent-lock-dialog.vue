<template>
  <PDialog
    v-model="isDialogOpened"
    pTestId="create-agent-lock-dialog"
    pTitle="Créer un lock"
    pWidth="600px"
    pAlignCenter
  >
    <PAlert
      pType="info"
      class="margin-bottom--5"
    >
      Créez un lock sur un environnement et désactivez l'agent Azure DevOps associé.
    </PAlert>

    <PForm
      :pModel="form"
      pRequireAsteriskPosition="right"
    >
      <PFormItem
        pLabel="Environnement"
        pProp="environmentId"
        pRequired
        :pError="errors.environmentId"
        class="margin-bottom--4"
      >
        <PDropdown
          v-model="form.environmentId"
          pTestId="create-agent-lock-environment-dropdown"
          :pOptions="environmentOptions"
          pPlaceholder="Sélectionner"
          pClearable
          :pDisabled="isCreating === true || environments.length === 0"
        />
      </PFormItem>

      <PAlert
        v-if="environments.length === 0"
        pType="error"
        class="margin-bottom--4"
      >
        Impossible de charger les environnements disponibles
      </PAlert>

      <PFormItem
        pLabel="Raison"
        pProp="reason"
        pRequired
        :pError="errors.reason"
      >
        <PInput
          v-model="form.reason"
          pTestId="create-agent-lock-reason-input"
          pType="textarea"
          pPlaceholder="Raison du lock"
          :pRows="4"
          :pDisabled="isCreating"
        />
      </PFormItem>
    </PForm>

    <template #footer>
      <div class="p-dialog__footer">
        <PButton
          pTestId="create-agent-lock-cancel-button"
          pType="secondary"
          pSize="small"
          :pDisabled="isCreating"
          @click="handleClose"
        >
          Annuler
        </PButton>
        <PButton
          pTestId="create-agent-lock-submit-button"
          pType="primary"
          pSize="small"
          :pDisabled="isFormValid === false"
          :pLoading="isCreating"
          @click="handleCreate"
        >
          <PIcon
            pName="lock"
            pSize="16"
            class="el-button__icon--left"
          />
          Créer le lock
        </PButton>
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  PAlert,
  PButton,
  PDialog,
  PDropdown,
  PForm,
  PFormItem,
  PIcon,
  PInput,
} from '@pulse/styleguide/components'
import type { CreateAgentLockDialogProps } from './create-agent-lock-dialog.type'
import { useCreateAgentLockDialog } from './create-agent-lock-dialog.composable'
import { mapAgentLockEnvironmentsToDropdownOptions } from '../../agents-dashboard.helpers'

const { environments } = defineProps<CreateAgentLockDialogProps>()

const emit = defineEmits<{
  'lock-created': []
}>()

const isDialogOpened = defineModel<boolean>({ default: false })

const {
  form,
  isCreating,
  errors,
  isFormValid,
  handleClose: closeDialog,
  handleCreate: createLock,
} = useCreateAgentLockDialog({
  onSuccess: () => {
    emit('lock-created')
  },
  onClose: () => {
    isDialogOpened.value = false
  },
})

const environmentOptions = computed(() => mapAgentLockEnvironmentsToDropdownOptions(environments))

function handleClose(): void {
  closeDialog()
}

async function handleCreate(): Promise<void> {
  await createLock()
}
</script>
