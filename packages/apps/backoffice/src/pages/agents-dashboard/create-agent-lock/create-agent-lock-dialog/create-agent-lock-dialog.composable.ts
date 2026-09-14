import { computed, ref } from 'vue'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { AgentsDashboardService } from '@backoffice/services/agents-dashboard/agents-dashboard.service'
import type {
  CreateAgentLockFormData,
  CreateAgentLockValidationErrors,
  UseCreateAgentLockDialogOptions,
} from './create-agent-lock-dialog.type'

const createInitialFormState = (): CreateAgentLockFormData => ({
  environmentId: null,
  reason: '',
})

const getValidationErrors = (formData: CreateAgentLockFormData): CreateAgentLockValidationErrors => {
  const validationErrors: CreateAgentLockValidationErrors = {}

  if (formData.environmentId === null) {
    validationErrors.environmentId = 'L\'environnement est requis'
  }

  if (formData.reason.trim().length === 0) {
    validationErrors.reason = 'La raison est requise'
  }

  return validationErrors
}

export function useCreateAgentLockDialog(options: UseCreateAgentLockDialogOptions) {
  const form = ref<CreateAgentLockFormData>(createInitialFormState())
  const isCreating = ref(false)
  const errors = ref<CreateAgentLockValidationErrors>({})

  const isFormValid = computed<boolean>(() =>
    Object.keys(getValidationErrors(form.value)).length === 0,
  )

  function resetForm(): void {
    form.value = createInitialFormState()
    errors.value = {}
  }

  function validateForm(): boolean {
    errors.value = getValidationErrors(form.value)

    return Object.keys(errors.value).length === 0
  }

  function handleClose(): void {
    if (isCreating.value === true) {
      return
    }

    options.onClose()
    resetForm()
  }

  async function handleCreate(): Promise<void> {
    if (validateForm() === false || form.value.environmentId === null) {
      return
    }

    isCreating.value = true

    try {
      const response = await AgentsDashboardService.createLock({
        environmentId: form.value.environmentId,
        reason: form.value.reason.trim(),
      })

      displayNotification('success', 'Lock créé avec succès')
      options.onSuccess(response.message)
      options.onClose()
      resetForm()
    } catch (error) {
      logger.error('Failed to create agent lock:', error)
      displayNotification('error', 'Impossible de créer le lock')
    } finally {
      isCreating.value = false
    }
  }

  return {
    form,
    isCreating,
    errors,
    isFormValid,
    handleClose,
    handleCreate,
  }
}
