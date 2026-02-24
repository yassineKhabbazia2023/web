import { ref, computed } from 'vue'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { AppSettingsListService } from '@backoffice/services/app-settings-list/app-settings-list.service'
import type { EnvironmentOption } from '@backoffice/types/environment-option.type'
import type { AppSettingItem } from '@backoffice/types/app-settings-list.type'
import type { UpdateAppSettingApiPayload } from '@backoffice/services/app-settings-list/app-settings-list.service.type'
import type { ModifyFormData, ModifyValidationErrors, UseModifyAppSettingOptions} from './modify-app-setting.type'

/**
 * Builds the internal key used by the form map:
 * - "ITG" (env-only)
 * - "ITG:itg01" (env + label)
 */
function toTargetKey(environment: string, labelOrEnvLabel?: string): string {
  if (labelOrEnvLabel === undefined || labelOrEnvLabel === null || labelOrEnvLabel === '') {
    return environment
  }
  return labelOrEnvLabel === environment ? environment : `${environment}:${labelOrEnvLabel}`
}

function parseTargetKey(key: string): { environment: string; label: string } {
  if (key.includes(':')) {
    const [environment, label] = key.split(':')
    return { environment, label }
  }
  return { environment: key, label: '' }
}

export function useModifyAppSetting(options: UseModifyAppSettingOptions) {
  const form = ref<ModifyFormData>({ name: '', valuesByTarget: {} })
  const eTagsByTarget = ref<Record<string, string>>({})
  const initialValuesByTarget = ref<Record<string, string>>({})

  const backendLabelByTarget = ref<Record<string, string>>({})

  const availableEnvironments = ref<EnvironmentOption[]>([])
  const isLoadingEnvironments = ref(false)
  const hasEnvironmentLoadError = ref(false)

  const isSaving = ref(false)
  const errors = ref<ModifyValidationErrors>({})

  const isFormValid = computed(() => {
    const name = form.value.name.trim()
    const valuesByTarget = form.value.valuesByTarget ?? {}

    const hasName = name.length > 0
    const values = Object.values(valuesByTarget)
    const hasAtLeastOneValue = values.some((v) => v.trim().length > 0)

    return hasName && hasAtLeastOneValue
  })

  const hasTargetsToSave = computed(() => {
    const current = form.value.valuesByTarget ?? {}
    const initial = initialValuesByTarget.value

    return Object.entries(current).some(([key, rawValue]) => {
      const value = (rawValue ?? '').trim()
      if (value.length === 0) {
        return false
      }

      const initialValue = (initial[key] ?? '').trim()
      return value !== initialValue
    })
  })

  const hasClearedValue = computed(() => {
    const current = form.value.valuesByTarget ?? {}
    const initial = initialValuesByTarget.value

    return Object.keys(initial).some((key) => {
      const initialValue = (initial[key] ?? '').trim()
      if (!initialValue) {
        return false
      }

      const currentValue = (current[key] ?? '').trim()
      return currentValue.length === 0
    })
  })

  function resolveLabelForTarget(
    environment: string,
    backendLabelOrEnvLabel: string,
    availableEnvironments: EnvironmentOption[],
  ): string {
    if (backendLabelOrEnvLabel === environment) {
      return environment
    }

    const env = availableEnvironments.find((e) => e.environment === environment)
    const match = env?.labels.find((l) => l.toUpperCase() === backendLabelOrEnvLabel.toUpperCase())

    return match ?? backendLabelOrEnvLabel
  }


  /**
   * Initializes the form the selected app setting item.
   * Also stores a snapshot to detect changes later (diff).
   */
  function initializeFromItem(item: AppSettingItem): void {
    const valuesByTarget: Record<string, string> = {}
    const etags: Record<string, string> = {}
    const backendLabels: Record<string, string> = {}

    for (const v of item.values) {
      const backendLabel = v.label ?? v.envLabel

      const uiLabel = resolveLabelForTarget(
        v.environment,
        backendLabel,
        availableEnvironments.value,
      )

      const key = toTargetKey(v.environment, uiLabel)

      valuesByTarget[key] = v.value ?? ''
      etags[key] = v.eTag
      backendLabels[key] = backendLabel
    }

    form.value = { name: item.key, valuesByTarget }
    initialValuesByTarget.value = { ...valuesByTarget }
    eTagsByTarget.value = etags
    backendLabelByTarget.value = backendLabels
    errors.value = {}
  }



  /**
   * Basic UI validation:
   * - name required
   * - at least one non-empty value
   */
  function validateForm(): boolean {
    errors.value = {}

    if (form.value.name.trim().length === 0) {
      errors.value.name = 'Le nom est requis'
    }

    const valuesByTarget = form.value.valuesByTarget ?? {}
    const values = Object.values(valuesByTarget)
    const hasAny = values.some((v) => v.trim().length > 0)

    if (hasAny === false) {
      errors.value.valuesByTarget = 'Renseignez au moins une valeur'
    }

    return Object.keys(errors.value).length === 0
  }

  /**
   * Builds the payload sent to the update API.
   *
   * Rules:
   * - only non-empty values are sent
   * - only values that changed compared to the initial snapshot are sent
   * - eTag is kept per target (empty string if missing)
   * - env-only targets are sent with envLabel
   * - env+label targets are sent with label
   */
  function buildApiPayload(): UpdateAppSettingApiPayload {
    const current = form.value.valuesByTarget
    const initial = initialValuesByTarget.value

    const targets = Object.entries(current)
      .map(([key, rawValue]) => {
        // Ignore empty values
        const value = (rawValue ?? '').trim()
        if (value.length === 0) {
          return null
        }

        // Ignore unchanged values (diff against initial snapshot)
        const initialValue = (initial[key] ?? '').trim()
        if (value === initialValue) {
          return null
        }

        // Extract environment / label from the internal target key
        const { environment } = parseTargetKey(key)

        const eTag = eTagsByTarget.value[key] ?? ''
        const backendLabel = backendLabelByTarget.value[key]
        const isEnvOnly = !key.includes(':')

        // Env-only target (no label)
        if (isEnvOnly) {
          return {
            environment,
            label: '',
            envLabel: backendLabel ?? environment,
            value,
            eTag,
          }
        }

        // Env + label target
        const uiLabel = key.split(':')[1]

        return {
          environment,
          label: backendLabel ?? uiLabel,
          value,
          eTag,
        }
      })
      .filter((x) => x !== null)

    return { name: form.value.name, targets }
  }

  function resetForm(): void {
    form.value = { name: '', valuesByTarget: {} }
    eTagsByTarget.value = {}
    initialValuesByTarget.value = {}
    errors.value = {}
  }

  function handleClose(): void {
    if (isSaving.value) {
      return
    }
    options.onClose()
    resetForm()
  }

  async function handleSave(): Promise<void> {
    if (validateForm() === false) {
      return
    }

    if (hasClearedValue.value) {
      return
    }

    const payload = buildApiPayload()
    if (payload.targets.length === 0) {
      return
    }
    logger.info('Updating environment variable:', payload)

    isSaving.value = true
    try {
      await AppSettingsListService.updateAppSetting(payload)

      displayNotification('success', "Variable d'environnement mise à jour avec succès")

      options.onSuccess()
      options.onClose()
      resetForm()
    } catch (error) {
      logger.error('Failed to update environment variable:', error)
      displayNotification('error', "Impossible de modifier la variable d'environnement")
    } finally {
      isSaving.value = false
    }
  }

  async function loadAvailableEnvironments(): Promise<void> {
    isLoadingEnvironments.value = true
    hasEnvironmentLoadError.value = false

    try {
      availableEnvironments.value = await AppSettingsListService.getAvailableEnvironments()
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
    eTagsByTarget,
    availableEnvironments,
    isLoadingEnvironments,
    hasEnvironmentLoadError,
    isSaving,
    errors,
    isFormValid,
    hasTargetsToSave,
    hasClearedValue,
    initializeFromItem,
    handleClose,
    handleSave,
    loadAvailableEnvironments,
  }
}
