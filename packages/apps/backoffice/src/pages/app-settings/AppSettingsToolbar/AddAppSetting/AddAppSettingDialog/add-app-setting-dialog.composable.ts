import { ref, computed } from 'vue'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { AppSettingsListService } from '@backoffice/services/app-settings-list/app-settings-list.service'
import type { CreateAppSettingApiPayload } from '@backoffice/services/app-settings-list/app-settings-list.service.type'
import type { EnvironmentOption } from '@backoffice/types/environment-option.type'
import type { CreateAppSettingFormData, UseAddAppSettingDialogOptions, ValidationErrors } from './add-app-setting-dialog.type'
import { AddAppSettingDialogManager } from './add-app-setting-dialog.manager'
import { buildTargetsFromValues } from '@backoffice/helpers/app-settings-targets.helper'

export function useAddAppSettingDialog(options: UseAddAppSettingDialogOptions) {
  const form = ref<CreateAppSettingFormData>(AddAppSettingDialogManager.createInitialFormState())
  const availableEnvironments = ref<EnvironmentOption[]>([])
  const isLoadingEnvironments = ref(false)
  const hasEnvironmentLoadError = ref(false)
  const isCreating = ref(false)
  const errors = ref<ValidationErrors>({})

 const isFormValid = computed(() => {
    const hasName = form.value.name.trim().length > 0

    const values = Object.values(form.value.valuesByTarget ?? {})
    const hasAtLeastOneTargetValue = values.some(
      (value) => value.trim().length > 0,
    )

    return hasName && hasAtLeastOneTargetValue
  })

  function validateForm(): boolean {
    errors.value = {}

    if (form.value.name.trim().length === 0) {
      errors.value.name = 'Le nom est requis'
    } else if (!/^Domain_\w+_\w+_\w+/.test(form.value.name)) {
      errors.value.name = 'Le nom de la clé doit respecter le format : Domain_xxx_nomdomain_nomcle'
    }

    const valuesByTarget = form.value.valuesByTarget ?? {}
    const hasAny = Object.values(valuesByTarget).some((v) => v.trim().length > 0)
    if (hasAny === false) {
      errors.value.valuesByTarget = 'Renseignez au moins une valeur pour un environnement ou un label'
    }

    return Object.keys(errors.value).length === 0
  }

  function buildApiPayload(): CreateAppSettingApiPayload {
    return {
      name: form.value.name,
      type: form.value.isSecret ? 'secret' : 'string',
      targets: buildTargetsFromValues(form.value.valuesByTarget),
    }
  }


  function resetForm(): void {
    form.value = AddAppSettingDialogManager.createInitialFormState()
    errors.value = {}
  }

  function handleClose(): void {
    if (isCreating.value === true) {
      return
    }

    options.onClose()
    resetForm()
  }

  async function handleCreate(): Promise<void> {
    if (validateForm() === false) {
        return
    }

    const payload = buildApiPayload()

    logger.info('Creating environment variable:', payload)

    isCreating.value = true

    try {
      await AppSettingsListService.createAppSetting(payload)

      displayNotification('success', 'Variable d\'environnement créée avec succès')

      options.onSuccess()
      options.onClose()
      resetForm()
    } catch (error) {
      logger.error('Failed to create environment variable:', error)
      displayNotification('error', 'Impossible de créer la variable d\'environnement')
    } finally {
      isCreating.value = false
    }
  }

  async function loadAvailableEnvironments(): Promise<void> {
    isLoadingEnvironments.value = true
    hasEnvironmentLoadError.value = false

    try {
      const envs = await AppSettingsListService.getAvailableEnvironments()
      availableEnvironments.value = envs
    } catch (error) {
      logger.error('Failed to load environments:', error)
      hasEnvironmentLoadError.value = true
      availableEnvironments.value = []
    } finally {
      isLoadingEnvironments.value = false
    }
  }

  return {
    form,
    availableEnvironments,
    isLoadingEnvironments,
    hasEnvironmentLoadError,
    isCreating,
    errors,
    isFormValid,
    handleClose,
    handleCreate,
    loadAvailableEnvironments,
  }
}
