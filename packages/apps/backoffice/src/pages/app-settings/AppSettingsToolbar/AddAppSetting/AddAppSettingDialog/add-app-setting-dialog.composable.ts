import { ref, computed, watch } from 'vue'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { AppSettingsListService } from '@backoffice/services/app-settings-list/app-settings-list.service'
import type {
  CreateAppSettingApiPayload,
  EnvironmentOption,
} from '@backoffice/services/app-settings-list/app-settings-list.service.type'
import type { CreateAppSettingFormData, UseAddAppSettingDialogOptions, ValidationErrors } from './add-app-setting-dialog.type'
import { AddAppSettingDialogManager } from './add-app-setting-dialog.manager'

export function useAddAppSettingDialog(options: UseAddAppSettingDialogOptions) {
  const form = ref<CreateAppSettingFormData>(AddAppSettingDialogManager.createInitialFormState())
  const availableEnvironments = ref<EnvironmentOption[]>([])
  const isLoadingEnvironments = ref(false)
  const hasEnvironmentLoadError = ref(false)
  const isCreating = ref(false)
  const errors = ref<ValidationErrors>({})

  const isFormValid = computed(() => {
    const hasName = form.value.name.trim().length > 0
    const hasValue = form.value.value.trim().length > 0
    const hasEnvironments =
      form.value.allEnvs === true ||
      form.value.selectedEnvironments.length > 0

    return hasName === true && hasValue === true && hasEnvironments === true
  })

  watch(
    () => form.value.allEnvs,
    (allEnvs) => {
      if (allEnvs === true) {
        form.value.selectedEnvironments = []
      } else {
        form.value.withLabels = false
      }
    },
  )

  function validateForm(): boolean {
    errors.value = {}

    if (form.value.name.trim().length === 0) {
      errors.value.name = 'Le nom est requis'
    } else if (!/^Domain_\w+_\w+_\w+/.test(form.value.name)) {
      errors.value.name = 'Le nom de la clé doit respecter le format : Domain_xxx_nomdomain_nomcle'
    }

    if (form.value.value.trim().length === 0) {
      errors.value.value = 'La valeur est requise'
    }

    if (
      form.value.allEnvs === false &&
      form.value.selectedEnvironments.length === 0
    ) {
      errors.value.selectedEnvironments = 'Au moins un environnement doit être sélectionné'
    }

    return Object.keys(errors.value).length === 0
  }

  function buildApiPayload(): CreateAppSettingApiPayload {
    const type = form.value.isSecret === true ? 'secret' : 'string'
    const targets = AddAppSettingDialogManager.buildTargetsFromSelection(form.value.selectedEnvironments)

    return {
      name: form.value.name,
      type,
      value: form.value.value,
      targets,
      allEnvs: form.value.allEnvs,
      withLabels: form.value.withLabels,
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
